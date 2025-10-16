/* eslint-disable @next/next/no-img-element */
'use client';

import Loading from '@/components/ui/Loading/Loading';
import MyButton from '@/components/ui/MyButton/MyButton';
import MyFormImageUpload from '@/components/ui/MyForm/MyFormImageUpload/MyFormImageUpload';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateUserMutation,
} from '@/redux/features/auth/authApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Zod schema for General Settings form
const updateProfileSchema = z.object({
  profileImage: z.instanceof(File).optional(),
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .optional(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional(),
  number: z
    .string()
    .min(10, {
      message: 'Please enter a valid 10-digit phone number',
    })
    .optional(),
});

type GeneralSettingsFormValues = z.infer<typeof updateProfileSchema>;

// Zod schema for Security Settings form
const securitySettingsSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  });

type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

export default function UserSettingsPageComponent() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const {
    data: getMeResponse,
    isLoading: isMeLoading,
    isFetching: isMeFetching,
  } = useGetMeQuery(undefined);

  const myProfile = getMeResponse?.data || [];
  if (isMeLoading || isMeFetching) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl py-6 px-3">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            className={`pb-2 ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General Settings
          </button>
          <button
            className={`pb-2 ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'general' ? (
          <GeneralSettingsForm myProfile={myProfile} />
        ) : (
          <SecuritySettingsForm />
        )}
      </div>
    </div>
  );
}

function GeneralSettingsForm({ myProfile }: { myProfile: any }) {
  const [updateProfile] = useUpdateUserMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = async (data: any, reset: any) => {
    const formData = new FormData();
    const { profileImage, ...rest } = data;
    formData.append('data', JSON.stringify(rest));
    formData.append('profile', profileImage);
    await handleAsyncWithToast(async () => {
      return updateProfile(formData);
    }, 'Profile Updating...');
  };

  const profileImage = myProfile?.profileImage?.includes(
    'http://localhost:5000',
  )
    ? myProfile.profileImage.replace(
        'http://localhost:5000',
        'http://10.0.10.33:5000',
      )
    : myProfile?.profileImage;

  return (
    <MyFormWrapper
      onSubmit={handleSubmit}
      resolver={zodResolver(updateProfileSchema)}
      className="flex flex-col gap-6 mb-10"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-5 justify-start">
          <MyFormImageUpload
            name="profileImage"
            className="hidden cursor-pointer"
          >
            <div className="w-[121px] h-[121px] cursor-pointer border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50">
              {previewImage || profileImage ? (
                <img
                  src={previewImage || profileImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-center mt-1">
                    <span>Upload your</span>
                    <span className="block">photo</span>
                  </div>
                </>
              )}
            </div>
          </MyFormImageUpload>
          {previewImage ? (
            <button
              onClick={() => setPreviewImage(null)}
              className="flex items-center justify-center gap-2 bg-red-100 py-2 px-[6px] rounded-md"
            >
              <span>Discard</span>
              <Trash2 size={20} className="text-red-400" />
            </button>
          ) : (
            ''
          )}
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MyFormInput
            value={myProfile.name}
            name="name"
            label="Full Name"
            placeHolder="Enter your full name"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <MyFormInput
            type="email"
            name="email"
            label="Your Email"
            value={myProfile.email}
            readOnly={true}
            placeHolder="Enter your email address"
            inputClassName="w-full px-3 py-2 border bg-gray-200 hover:bg-gray-200 border-[#d8e1db] rounded-md font-normal text-text-secondary text-base"
          />
        </div>

        <div>
          <MyFormInput
            value={myProfile.number}
            name="number"
            label="Phone Number"
            placeHolder="Enter your phone number"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-8">
        <MyButton
          type="submit"
          label="Update Profile"
          className="rounded-lg px-6 py-2"
        />
      </div>
    </MyFormWrapper>
  );
}

function SecuritySettingsForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SecuritySettingsFormValues) => {
    const payload = {
      oldPassword: data?.currentPassword,
      newPassword: data?.newPassword,
    };
    const res = await handleAsyncWithToast(async () => {
      return changePassword(payload);
    });
    if (res?.data?.success) {
      setIsChangingPassword(false);
    }
  };

  return (
    <div>
      {!isChangingPassword ? (
        <div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
              {/* <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon className="h-5 w-5 text-gray-400" />
              </button> */}
            </div>
          </div>

          <div className="mt-8">
            <MyButton
              onClick={() => setIsChangingPassword(true)}
              label="Change Password"
              className="rounded-lg px-6 py-2"
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className={`w-full px-3 py-2 border ${
                    errors.currentPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  className={`w-full px-3 py-2 border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <MyButton
              type="submit"
              label="Save New Password"
              className="rounded-lg px-6 py-2"
            />
            <button
              type="button"
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsChangingPassword(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
