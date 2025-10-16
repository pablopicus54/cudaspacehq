 
'use client';
import loginImage from '@/assets/images/authImage.webp';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import {
  useResetPasswordMutation,
} from '@/redux/features/auth/authApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

const validationSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long')
      .max(20, 'Password must be at most 20 characters long'),
    c_password: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.c_password, {
    message: 'Passwords don\'t match',
    path: ['c_password'], // This shows the error on the confirm password field
  });

export default function SetNewPasswordComponent() {
  const [resetPasswordMutation] = useResetPasswordMutation();
  const router = useRouter();
  const token = useSearchParams().get('token');

  const handleSubmit = async (formData: any) => {
    const data = {
      password: formData.password,
      resetPassToken: token,
    };
    const response = await handleAsyncWithToast(async () => {
      return resetPasswordMutation(data); // Replace with your actual login function
    });
    if (response?.data?.success) {
      router.push('/');
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
          <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
          <p className="text-text-secondary mb-8">
            Please enter your new password.
          </p>

          <MyFormWrapper
            onSubmit={handleSubmit}
            resolver={zodResolver(validationSchema)}
            className="space-y-6 flex flex-col items-center w-full"
          >
            <div className="w-full">
              <MyFormInput
                name="password"
                label="Password"
                type="password"
                placeHolder="••••••••"
                inputClassName="w-full px-3 py-2 "
              />
            </div>
            <div className="w-full">
              <MyFormInput
                name="c_password"
                label="Confirm Password"
                type="password"
                placeHolder="••••••••"
                inputClassName="w-full px-3 py-2 "
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-primary text-white py-3 rounded-md hover:bg-blue-900 transition duration-200"
            >
              Set Password
            </button>
          </MyFormWrapper>
          <Link href={'/auth/login'}>
            <div className="mt-6 text-center flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
              >
                <g clipPath="url(#clip0_845_48059)">
                  <path
                    d="M16 8H4"
                    stroke="#727272"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.49992 12.6663L3.83325 7.99967L8.49992 3.33301"
                    stroke="#727272"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_845_48059">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <p className="text-sm text-text-secondary">Back to login</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
