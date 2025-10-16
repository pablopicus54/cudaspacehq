'use client';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import { useSubscribeNewsLetterMutation } from '@/redux/features/auth/authApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'antd';
import Link from 'next/link';
import { toast } from 'sonner';
import { z } from 'zod';

const newsLetterValidationSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' }) // Required field validation
		.email({ message: 'Please enter a valid email address' }), // Email format validation
});

const Footer = () => {
	const [subscribeNewsLetter] = useSubscribeNewsLetterMutation();
	const handleSubmit = async (data: any, reset: any) => {
		const res = await handleAsyncWithToast(async () => {
			return subscribeNewsLetter(data?.email);
		});
		if (res?.data?.success) {
			toast.success('Subscribed successfullyZ');
			reset();
		}
	};
	return (
		<footer className="bg-gray-100 py-12">
			<MyContainer className="">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{/* DataVault Section */}
					<div className="lg:col-span-1">
						{/* <h3 className="text-primary text-[24px] md:text-[32px] font-bold !leading-[48px] mb-3">
							CudaSpace
						</h3> */}
						<div className="w-40 h-12 mb-3">
							<img src="/Logo.png" alt=" CudaSpace" className="w-full h-full" />
						</div>
						<p className="text-gray-700 mb-6">
							CudaSpace delivers high-performance hosting for developers,
							startups, and enterprises. Get ultra-fast VPS, GPU servers,
							dedicated machines, and custom cloud solutions — all in one
							powerful, flexible, and developer-friendly platform.
						</p>
						<div className="flex flex-col md:flex-row gap-2 md:items-center">
							<p className="font-medium">Follow-up:</p>
							<div className="flex space-x-2">
								<Link
									href="https://www.facebook.com/cudaspace"
									className="bg-gray-200 p-2 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none">
										<path
											d="M12.6005 4.43368H14.1671V1.78368C13.4086 1.70481 12.6464 1.66586 11.8838 1.66702C9.61712 1.66702 8.06712 3.05035 8.06712 5.58368V7.76702H5.50879V10.7337H8.06712V18.3337H11.1338V10.7337H13.6838L14.0671 7.76702H11.1338V5.87535C11.1338 5.00035 11.3671 4.43368 12.6005 4.43368Z"
											fill="#111111"
										/>
									</svg>
								</Link>
								<Link
									href="https://x.com/cudaspacehq"
									className="bg-gray-200 p-2 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="20"
										height="20"
										fill="currentColor">
										<path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path>
									</svg>
								</Link>
								<Link
									href="https://www.linkedin.com/company/cudaspacehq"
									className="bg-gray-200 p-2 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none">
										<path
											d="M4.1696 5.83334H4.14613C3.89061 5.84875 3.63466 5.81132 3.39426 5.72338C3.15386 5.63544 2.93417 5.49887 2.74891 5.32222C2.56366 5.14557 2.41681 4.93262 2.31754 4.69667C2.21827 4.46072 2.16871 4.20684 2.17196 3.95088C2.17521 3.69491 2.2312 3.44237 2.33642 3.20902C2.44165 2.97566 2.59386 2.76651 2.78354 2.59462C2.97322 2.42272 3.19631 2.29178 3.43886 2.20997C3.68142 2.12816 3.93824 2.09724 4.19328 2.11913C4.44959 2.10056 4.70696 2.13523 4.94923 2.22095C5.19149 2.30666 5.41339 2.44158 5.601 2.6172C5.7886 2.79282 5.93783 3.00536 6.03932 3.24145C6.14081 3.47754 6.19236 3.73207 6.19072 3.98905C6.18908 4.24602 6.13429 4.49988 6.0298 4.73465C5.92531 4.96943 5.77337 5.18005 5.58355 5.35326C5.39372 5.52648 5.17011 5.65855 4.92678 5.74117C4.68344 5.82379 4.42565 5.85517 4.1696 5.83334Z"
											fill="#111111"
										/>
										<path
											d="M5.84792 8.33301H2.51459V18.333H5.84792V8.33301Z"
											fill="#111111"
										/>
										<path
											d="M14.5976 8.33301C14.0359 8.33454 13.4818 8.46302 12.9767 8.70883C12.4717 8.95464 12.0287 9.31143 11.6809 9.75253V8.33301H8.3476V18.333H11.6809V13.7497C11.6809 13.3076 11.8565 12.8837 12.1691 12.5712C12.4816 12.2586 12.9056 12.083 13.3476 12.083C13.7896 12.083 14.2135 12.2586 14.5261 12.5712C14.8387 12.8837 15.0143 13.3076 15.0143 13.7497V18.333H18.3476V12.083C18.3476 11.5906 18.2506 11.1029 18.0621 10.6479C17.8737 10.193 17.5975 9.77958 17.2492 9.43136C16.901 9.08314 16.4876 8.80691 16.0327 8.61846C15.5777 8.43 15.0901 8.33301 14.5976 8.33301Z"
											fill="#111111"
										/>
									</svg>
								</Link>
								<Link
									href="https://t.me/cudaspacehq"
									className="bg-gray-200 p-2 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none">
										<g clipPath="url(#clip0_1016_1718)">
											<path
												d="M7.8475 12.651L7.51666 17.3043C7.99 17.3043 8.195 17.101 8.44083 16.8568L10.66 14.736L15.2583 18.1035C16.1017 18.5735 16.6958 18.326 16.9233 17.3277L19.9417 3.18434L19.9425 3.18351C20.21 1.93684 19.4917 1.44934 18.67 1.75518L0.928329 8.54768C-0.282504 9.01768 -0.264171 9.69268 0.722496 9.99851L5.25833 11.4093L15.7942 4.81684C16.29 4.48851 16.7408 4.67018 16.37 4.99851L7.8475 12.651Z"
												fill="#111111"
											/>
										</g>
										<defs>
											<clipPath id="clip0_1016_1718">
												<rect width="20" height="20" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</Link>
							</div>
						</div>
					</div>

					{/* Company Section */}
					<div className="lg:col-span-1">
						<h2 className="text-xl font-semibold mb-4 pb-2 w-fit border-b-2 border-text-primary">
							Company
						</h2>
						<ul className="space-y-3">
							<li>
								<Link
									href="/pricing/gpu-hosting"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									GPU Hosting
								</Link>
							</li>
							<li>
								<Link
									href="/pricing/vps-hosting"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									Vps Hosting
								</Link>
							</li>
							<li>
								<Link
									href="/pricing/dedicated-hosting"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									Dedicated server
								</Link>
							</li>
							<li>
								<Link
									href="/blogs"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									Blogs
								</Link>
							</li>
							<li>
								<Link
									href="/privacy-policy"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-gray-700 hover:text-blue-700 transition-colors">
									Terms & Condition
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Us Section */}
					<div className="lg:col-span-1">
						<h2 className="text-xl font-semibold mb-4 pb-2 w-fit border-b-2 border-text-primary">
							Contact us
						</h2>
						<ul className="space-y-3">
							<li className="text-gray-700">
								Email:{' '}
								<a
									href="mailto:support@cudaspace.com"
									className="hover:text-blue-700 transition-colors">
									support@cudaspace.com
								</a>
							</li>
							<li className="text-gray-700">
								Phone:{' '}
								<a
									href="tel:+1 225-255-1510"
									className="hover:text-blue-700 transition-colors">
									+1 225-255-1510
								</a>
							</li>
						</ul>
					</div>

					{/* Newsletter Section */}
					<div className="lg:col-span-1">
						<h2 className="text-xl font-semibold mb-4 pb-2 w-fit border-b-2 border-text-primary">
							Newsletter
						</h2>
						<p className="text-gray-700 mb-4">
							Information about current events related to our company
						</p>
						<MyFormWrapper
							onSubmit={handleSubmit}
							resolver={zodResolver(newsLetterValidationSchema)}
							className="space-y-2">
							<MyFormInput
								type="email"
								name="email"
								placeHolder="Enter your email"
								inputClassName="w-full bg-white"
							/>
							<Button
								htmlType="submit"
								className="w-full bg-primary text-white hover:bg-blue-800">
								Subscribe
							</Button>
						</MyFormWrapper>
					</div>
				</div>

				{/* Copyright Section */}
				{/* <div className="mt-12 pt-4 border-t border-gray-300 text-center text-gray-600">
					<p>&quot;© Copyright 2025. - All Rights Reserved.&quot;</p>
				</div> */}
			</MyContainer>
		</footer>
	);
};

export default Footer;
