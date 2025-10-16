/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import MyButton from '@/components/ui/MyButton/MyButton';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

type TPaymentFormProps = {
  handleNextStep: (paymentMethodId: string) => Promise<void>;
  areSpecificationsWritten?: boolean;
};

const PaymentForm = ({
  handleNextStep,
  areSpecificationsWritten,
}: TPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    if (!areSpecificationsWritten) {
      setError('Please complete the Specifications before confirming payment.');
      setLoading(false);
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe is not initialized.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError('Card details not entered.');
      setLoading(false);
      return;
    }

    // Create a PaymentMethod
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: cardHolderName,
        address: {
          postal_code: postalCode || undefined,
        },
      },
    });

    if (error) {
      setError(error.message as string);
      setLoading(false);
    } else {
      if (paymentMethod && paymentMethod.id) {
        setPaymentMethodId(paymentMethod?.id);
        if (paymentMethod?.id) {
          handleNextStep(paymentMethod.id);
        }
      }
      // Reset form fields after successful payment
      setCardHolderName('');
      cardElement.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();
      setPostalCode('');

      // console.log('PaymentMethod Created:', paymentMethod);
      setLoading(false);
      // Send paymentMethod.id to your backend for further processing
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-8">
      <div className=" flex flex-col gap-3">
        <label className="block font-semibold">Cardholder Name</label>
        <input
          type="text"
          value={cardHolderName}
          // defaultValue={"Mahdi Hasan"}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full border p-[12px] rounded-md"
          placeholder="John Doe"
          autoComplete="cc-name"
          required
        />
      </div>

      <div className=" flex flex-col gap-3">
        <label className="block font-semibold">Card Number</label>
        {/* <div className="flex items-center gap-2">
          <span>Test: 4242 4242 4242 4242</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('4242 4242 4242 4242');
              toast.info('Copied to clipboard');
            }}
            className="text-primary underline"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div> */}
        <div className="border p-4 rounded-md">
          <CardNumberElement className="w-full" />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2 flex flex-col gap-3">
          <label className="block font-semibold">Expiry Date</label>
          <div className="border p-4 rounded-md">
            <CardExpiryElement className="w-full" />
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-3">
          <label className="block font-semibold">CVV</label>
          <div className="border p-4 rounded-md">
            <CardCvcElement className="w-full" />
          </div>
        </div>
      </div>

      <div className=" flex flex-col gap-3">
        <label className="block font-semibold">ZIP / Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full border p-[12px] rounded-md"
          placeholder="12345"
          autoComplete="postal-code"
          required
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:self-start">
        <MyButton
          onClick={() => router.back()}
          label="Cancel"
          variant="outline"
          className="px-6 md:py-[10px] w-full md:w-fit"
        />
        <MyButton
          type="submit"
          label="Confirm Payment"
          className="px-6 py-3 w-full md:w-fit"
        />
      </div>

      {/* {paymentMethodId && (
        <p className="text-green-500 mt-2">
          Payment Method Created: {paymentMethodId}
        </p>
      )} */}
    </form>
  );
};

export default PaymentForm;
