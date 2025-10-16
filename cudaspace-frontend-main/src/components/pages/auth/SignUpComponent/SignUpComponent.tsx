 
'use client';
import loginImage from '@/assets/images/authImage.webp';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import {
  useLoginMutation,
  useRegisterMutation,
} from '@/redux/features/auth/authApi';
import { setUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { verifyToken } from '@/utils/verifyToken';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { z } from 'zod';

const validationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, 'Name must be at least 2 characters long'),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .refine((value) => {
      // Basic validation - react-phone-number-input handles most validation
      return value && value.length > 5;
    }, 'Invalid phone number'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters long'),
});

const CustomPhoneInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  return (
    <div className="w-full relative">
      <MyFormInput
        {...props}
        ref={ref}
        name="phoneNumber"
      />
    </div>
  );
});
CustomPhoneInput.displayName = 'CustomPhoneInput';

export default function SignUpComponent() {
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [phoneValue, setPhoneValue] = useState<string | any>('');

  const handleSubmit = async (formData: any, reset: any) => {
    const dataToSubmit = {
      ...formData,
      number: formData?.phoneNumber,
    };

    const res = await handleAsyncWithToast(async () => {
      return register(dataToSubmit);
    }, 'Signing up...');

    if (res?.data?.success) {
      const response = await handleAsyncWithToast(async () => {
        return login({ email: formData?.email, password: formData?.password });
      }, 'Logging in...');

      if (response?.data?.success) {
        const user = await verifyToken(response?.data?.data?.accessToken);
        console.log(user);
        await dispatch(
          setUser({
            user: user,
            access_token: response?.data?.data?.accessToken,
            refresh_token: response?.data?.data?.refreshToken,
          }),
        );
        router.push('/');
        reset();
      }
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left side - Spa illustration */}
      <div className="hidden md:flex md:w-1/2 bg-green-900 relative">
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={loginImage}
              alt="Spa relaxation illustration"
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 ">
        <div className="w-full  max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Create an Account</h1>

          <MyFormWrapper
            onSubmit={handleSubmit}
            resolver={zodResolver(validationSchema)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <MyFormInput
                name="name"
                label="Name"
                placeHolder="First Name"
                inputClassName="w-full px-3 py-2 "
              />

              {/* Phone Number Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative w-full">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phoneValue}
                    onChange={setPhoneValue}
                    className="phone-input-custom"
                    inputComponent={CustomPhoneInput}
                  />
                  <style jsx global>{`
                    .phone-input-custom {
                      position: relative;
                      width: 100%;
                    }

                    .phone-input-custom .react-phone-number-input__country {
                      position: absolute;
                      left: 12px;
                      top: 50%;
                      transform: translateY(-50%);
                      z-index: 1;
                    }

                    .phone-input-custom
                      .react-phone-number-input__country-select {
                      padding-right: 1.5rem;
                      background: transparent;
                      border: none;
                      font-size: 0.875rem;
                      color: #374151;
                    }

                    .phone-input-custom
                      .react-phone-number-input__country-select-arrow {
                      border-top-color: #6b7280;
                    }

                    .phone-input-custom .react-phone-number-input__icon {
                      border: 1px solid #e5e7eb;
                    }
                  `}</style>
                </div>
              </div>

              <MyFormInput
                name="email"
                label="Email Address"
                type="email"
                placeHolder="demo@gmail.com"
                inputClassName="w-full px-3 py-2 "
              />

              <MyFormInput
                name="password"
                label="Password"
                type="password"
                placeHolder="••••••••"
                inputClassName="w-full px-3 py-2 "
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                type="submit"
                className="w-full bg-blue-primary text-white py-3 rounded-md hover:bg-blue-900 transition duration-200"
              >
                Sign In
              </button>

              <p className="text-sm text-gray-600">
                Already have an account?
                <Link href="/auth/login" className="text-blue-primary  ps-1">
                  Login
                </Link>
              </p>
            </div>
          </MyFormWrapper>
        </div>
      </div>
    </main>
  );
}
