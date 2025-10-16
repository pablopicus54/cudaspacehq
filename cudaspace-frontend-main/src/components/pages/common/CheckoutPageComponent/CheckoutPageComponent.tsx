'use client';

import Loading from '@/components/ui/Loading/Loading';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { billingCycles, operatingSystems } from '@/constant/Specifications';
import {
  useCryptoPaymentMutation,
  usePurchasePackageMutation,
} from '@/redux/features/payment/user.payment.api';
import { useCreateOrderMutation } from '@/redux/features/order/orderApi';
import { useGetSingleServiceQuery } from '@/redux/features/services/servicesApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSingleOrderQuery } from '@/redux/features/user-dashboard/user-dashboard.api';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { CreditCardIcon, CryptoIcon } from './icons';
import PaymentForm from './PaymentForm';

const CheckoutPageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const renewalOrderId = searchParams.get('orderId');
  const isRenewalMode = Boolean(renewalOrderId);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [purchasePackage] = usePurchasePackageMutation();
  const [purchasePackageWithNowPayments] = useCryptoPaymentMutation();
  const [createOrder] = useCreateOrderMutation();

  const [userName, setUserName] = useState('');
  const [billingCycle, setBillingCycle] = useState(billingCycles[0]?.value);
  const [operatingSystem, setOperatingSystem] = useState(
    'Windows 10 Pro Evaluation (No license included)'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [billingCycleDropdownOpen, setBillingCycleDropdownOpen] =
    useState(false);
  const [osDropdownOpen, setOsDropdownOpen] = useState(false);
  const [otherOsDropdownOpen, setOtherOsDropdownOpen] = useState(false);
  const [isOtherOsMode, setIsOtherOsMode] = useState(false);

  // reference for auto closing on outside click
  const billingCycleDropdownRef = useRef<HTMLDivElement>(null);
  const osDropdownRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const target = event.target as Node;

  //     if (osDropdownRef.current && !osDropdownRef.current.contains(target)) {
  //       setOsDropdownOpen(false);
  //     }

  //     if (
  //       billingCycleDropdownRef.current &&
  //       !billingCycleDropdownRef.current.contains(target)
  //     ) {
  //       setBillingCycleDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  if (!packageId) {
    router.back();
  }

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetSingleServiceQuery(packageId);

  const serviceToPurchase = response?.data || {};

  // If this is a renewal flow, fetch the existing order to prefill specs
  const { data: singleOrderResp } = useGetSingleOrderQuery(renewalOrderId as string, {
    skip: !renewalOrderId,
  });

  // Initialize Stripe publishable key at runtime from backend, with env fallback
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [isStripeLoading, setIsStripeLoading] = useState<boolean>(false);

  useEffect(() => {
    const initStripe = async () => {
      setIsStripeLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        let key: string | null = null;

        if (baseUrl) {
          try {
            const res = await fetch(`${baseUrl}package/stripe-client`);
            const json = await res.json();
            key = json?.data?.publishableKey || null;
          } catch (e) {
            console.error('Failed to fetch Stripe client config; falling back to env.', e);
          }
        }

        if (!key) {
          key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;
        }

        if (!key) {
          console.error('Stripe publishable key is missing. Check configuration.');
          setStripePromise(null);
        } else {
          setStripePromise(loadStripe(key));
        }
      } finally {
        setIsStripeLoading(false);
      }
    };

    initStripe();
  }, []);

  // Prefill specs from existing order when renewing
  useEffect(() => {
    const existingOrder = singleOrderResp?.data;
    if (!existingOrder) return;

    if (existingOrder?.userName) setUserName(existingOrder.userName);
    if (existingOrder?.operatingSystem)
      setOperatingSystem(existingOrder.operatingSystem);
    if (existingOrder?.rootPassword) setPassword(existingOrder.rootPassword);
    if (existingOrder?.billingCycle) setBillingCycle(existingOrder.billingCycle);
  }, [singleOrderResp]);

  // Define primary OS options in required order
  const mainOperatingSystems = [
    'Windows 10 Pro Evaluation (No license included)',
    'Windows 11 Pro Evaluation (No license included)',
    'Ubuntu Server 22 LTS 64-bit',
    'Windows Server 2022 Standard Edition x64 ($20.00/month)',
    'Other OS',
  ];
  const mainOsSet = new Set(mainOperatingSystems);
  // Build list of other OS options and add custom ISO option
  const otherOperatingSystems = operatingSystems.filter(
    (os) => !mainOsSet.has(os) && os !== 'Other OS',
  );
  const otherOsOptions = [
    ...otherOperatingSystems,
    'Install own ISO (contact support)',
  ];

  const handleNextStep = async (paymentMethodId: string) => {
    // If `orderId` exists in query, this is a renewal. Skip creating a new order.
    let targetOrderId = renewalOrderId as string | null;

    if (!targetOrderId) {
      // Create order first to obtain orderId for payment correlation
      const rawAmount =
        billingCycle === 'MONTH'
          ? Number(serviceToPurchase?.perMonthPrice)
          : billingCycle === 'QUARTER'
          ? Number(serviceToPurchase?.perQuarterPrice)
          : Number(serviceToPurchase?.perYearPrice);

      if (!Number.isFinite(rawAmount)) {
        Swal.fire({
          title:
            'Selected billing cycle has no price. Please choose another cycle.',
          icon: 'warning',
          draggable: true,
        });
        return;
      }

      const orderPayload = {
        status: 'Pending',
        packageId: packageId as string,
        amount: rawAmount,
        userName,
        operatingSystem,
        rootPassword: password,
      };

      const orderRes = await handleAsyncWithToast(async () => {
        return createOrder(orderPayload);
      });

      const createdOrderId = orderRes?.data?.data?.orderId;
      if (!createdOrderId) {
        const errMsg = orderRes?.error?.data?.message || 'Unable to create order. Please try again.';
        Swal.fire({
          title: errMsg,
          icon: 'error',
          draggable: true,
        });
        return;
      }
      targetOrderId = createdOrderId as string;
    }

    const payload = {
      orderId: targetOrderId,
      packageId: packageId,
      paymentMethodId: paymentMethodId,
      billingCycle,
      operatingSystem,
      userName,
      rootPassword: password,
    };
    const res = await handleAsyncWithToast(async () => {
      return purchasePackage(payload);
    });

    if (res?.data?.success) {
      Swal.fire({
        title: 'Package purchase successful!',
        icon: 'success',
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/user');
        }
      });
    }
  };

  const handleCryptoPayment = async () => {
    // Enforce required specifications differently for renewal vs new purchase
    const isValidSpecs = isRenewalMode
      ? Boolean(billingCycle)
      : Boolean(userName && billingCycle && operatingSystem && password);
    if (!isValidSpecs) {
      Swal.fire({
        title: isRenewalMode
          ? 'Please select a billing cycle to proceed.'
          : 'Please fill hostname, billing cycle, operating system, and password.',
        icon: 'warning',
        draggable: true,
      });
      return;
    }
    // For renewal, skip creating a new order and reuse `orderId` from query
    let targetOrderId = renewalOrderId as string | null;

    if (!targetOrderId) {
      // Create order first to capture orderId for crypto subscription
      const rawAmount =
        billingCycle === 'MONTH'
          ? Number(serviceToPurchase?.perMonthPrice)
          : billingCycle === 'QUARTER'
          ? Number(serviceToPurchase?.perQuarterPrice)
          : Number(serviceToPurchase?.perYearPrice);

      if (!Number.isFinite(rawAmount)) {
        Swal.fire({
          title:
            'Selected billing cycle has no price. Please choose another cycle.',
          icon: 'warning',
          draggable: true,
        });
        return;
      }

      const orderPayload = {
        status: 'Pending',
        packageId: packageId as string,
        amount: rawAmount,
        userName,
        operatingSystem,
        rootPassword: password,
      };

      const orderRes = await handleAsyncWithToast(async () => {
        return createOrder(orderPayload);
      });

      const createdOrderId = orderRes?.data?.data?.orderId;
      if (!createdOrderId) {
        const errMsg = orderRes?.error?.data?.message || 'Unable to create order. Please try again.';
        Swal.fire({
          title: errMsg,
          icon: 'error',
          draggable: true,
        });
        return;
      }
      targetOrderId = createdOrderId as string;
    }

    const payload = {
      orderId: targetOrderId,
      planId:
        billingCycle === 'MONTH'
          ? serviceToPurchase?.monthlyPlanId
          : billingCycle === 'QUARTER'
          ? serviceToPurchase?.quaterlyPlanId
          : billingCycle === 'YEAR'
          ? serviceToPurchase?.yearlyPlanId
          : serviceToPurchase?.monthlyPlanId,
      packageId: packageId,
      billingCycle,
      operatingSystem,
      userName,
      rootPassword: password,
    };
    // console.log(payload);
    // return;
    const res = await handleAsyncWithToast(async () => {
      return purchasePackageWithNowPayments(payload);
    });

    if (res?.data?.success) {
      Swal.fire({
        title:
          'A payment link has been sent to your email. Please complete the payment to activate your package.',
        icon: 'success',
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/user');
        }
      });
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';

    // Ensure at least one character from each category
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+'[Math.floor(Math.random() * 12)];

    // Fill the rest of the password
    for (let i = 4; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  // Do not auto-generate password on mount; user should enter or generate manually

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="bg-white p-6 mt-20">
      <MyContainer>
        <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
          {/* specification */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Package Details
              </h1>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {serviceToPurchase?.serviceName}
                  </h2>
                  <span className="text-lg font-semibold text-gray-800">
                    Price: $
                    {billingCycle === 'MONTH'
                      ? serviceToPurchase?.perMonthPrice
                      : billingCycle === 'QUARTER'
                      ? serviceToPurchase?.perQuarterPrice
                      : serviceToPurchase?.perYearPrice}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {serviceToPurchase?.description}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Specifications
              </h1>
              <form className="shadow-sm bg-white border border-gray-200 rounded-lg p-6">
                {!isRenewalMode && (
                <div className="mb-4">
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Enter your Hostname
                  </label>
                  <div className="relative">
                    <div className="w-full p-3 bg-gray-50 border border-gray-100 rounded-md text-gray-700 cursor-pointer flex justify-between items-center">
                      <input
                        type="text"
                        name="userName"
                        value={userName}
                        placeholder="Enter your hostname"
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-transparent focus:outline-0"
                      />
                    </div>
                  </div>
                </div>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="billingCycle"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Billing Cycle
                  </label>
                  <div className="relative">
                    <div
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-md text-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() =>
                        setBillingCycleDropdownOpen(!billingCycleDropdownOpen)
                      }
                    >
                      <span>
                        {
                          billingCycles?.find(
                            (cycle) => cycle?.value === billingCycle,
                          )?.name
                        }
                      </span>
                      {!billingCycleDropdownOpen ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronUp size={20} />
                      )}
                    </div>

                    {billingCycleDropdownOpen && (
                      <div
                        ref={billingCycleDropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-md shadow-lg"
                      >
                        {billingCycles.map((cycle) => (
                          <div
                            key={cycle?.value}
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${
                              cycle?.value === billingCycle
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setBillingCycle(cycle?.value);
                              setBillingCycleDropdownOpen(false);
                            }}
                          >
                            {cycle?.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {!isRenewalMode && (
                <div className="mb-4">
                  <label
                    htmlFor="operatingSystem"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Operating System
                  </label>
                  <div className="relative">
                    <div
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-md text-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() => setOsDropdownOpen(!osDropdownOpen)}
                    >
                      <span>{operatingSystem}</span>
                      {!osDropdownOpen ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronUp size={20} />
                      )}
                    </div>

                    {osDropdownOpen && (
                      <div
                        ref={osDropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-md shadow-lg"
                      >
                        {mainOperatingSystems?.map((os) => (
                          <div
                            key={os}
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${
                              os === operatingSystem
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700'
                            }`}
                            onClick={() => {
                              if (os === 'Other OS') {
                                setIsOtherOsMode(true);
                                setOsDropdownOpen(false);
                                setOtherOsDropdownOpen(true);
                              } else {
                                setOperatingSystem(os);
                                setIsOtherOsMode(false);
                                setOsDropdownOpen(false);
                              }
                            }}
                          >
                            {os}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {isOtherOsMode && (
                    <div className="relative mt-2">
                      <div
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-md text-gray-700 cursor-pointer flex justify-between items-center"
                        onClick={() => setOtherOsDropdownOpen(!otherOsDropdownOpen)}
                      >
                        <span>Select other OS</span>
                        {!otherOsDropdownOpen ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronUp size={20} />
                        )}
                      </div>

                      {otherOsDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-md shadow-lg">
                          {otherOsOptions.map((os) => (
                            <div
                              key={os}
                              className={`p-3 hover:bg-gray-50 cursor-pointer ${
                                os === operatingSystem
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'text-gray-700'
                              }`}
                              onClick={() => {
                                setOperatingSystem(os);
                                setOtherOsDropdownOpen(false);
                                setIsOtherOsMode(false);
                              }}
                            >
                              {os}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )}
                {!isRenewalMode && (
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full p-3 pr-[5.5rem] bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-700"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const generatedPassword = generatePassword();
                          setPassword(generatedPassword);
                        }}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </form>
            </div>
          </div>

          {/* payment form */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Payment Method
            </h1>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="mb-6 flex gap-5">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    <div className="ml-2 text-white text-xs font-medium rounded-full h-8 w-8 flex items-center justify-center">
                      <CreditCardIcon />
                    </div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    Stripe
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                    />
                    <div className="ml-2 text-white text-xs font-medium rounded-full h-8 w-8 flex items-center justify-center">
                      <CryptoIcon />
                    </div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    Crypto
                  </span>
                </div>
              </div>
              {paymentMethod === 'stripe' ? (
                <div className="max-w-2xl">
                  {stripePromise ? (
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        handleNextStep={handleNextStep}
                        areSpecificationsWritten={
                          isRenewalMode
                            ? Boolean(billingCycle)
                            : Boolean(userName && billingCycle && operatingSystem && password)
                        }
                      />
                    </Elements>
                  ) : (
                    <div className="p-3 text-sm text-gray-600">Initializing payment…</div>
                  )}
                </div>
              ) : (
                ''
              )}
              {paymentMethod === 'crypto' ? (
                <div className="max-w-2xl mt-8">
                  <button
                    onClick={handleCryptoPayment}
                    type="button"
                    disabled={
                      isRenewalMode
                        ? !billingCycle
                        : !(userName && billingCycle && operatingSystem && password)
                    }
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="2"
                        y="6"
                        width="20"
                        height="12"
                        rx="2"
                        fill="#29B6AF"
                      />
                      <rect x="4" y="10" width="16" height="2" fill="#fff" />
                      <circle cx="8" cy="16" r="1" fill="#fff" />
                      <rect
                        x="6"
                        y="14"
                        width="4"
                        height="2"
                        rx="1"
                        fill="#fff"
                      />
                    </svg>
                    Pay with NOWPayments
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default CheckoutPageComponent;
