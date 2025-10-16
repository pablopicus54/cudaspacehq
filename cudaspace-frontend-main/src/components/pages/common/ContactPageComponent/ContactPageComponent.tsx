'use client';

import { useState } from 'react';
import {
	MapPinIcon,
	PhoneIcon,
	EnvelopeIcon,
	ClockIcon,
	CheckCircleIcon,
} from './icons';
import { useCreateContactTicketMutation } from '@/redux/features/contact/contact.user.api';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import Link from 'next/link';

const ContactPageComponent = () => {
	const [formState, setFormState] = useState({
		name: '',
		email: '',
		subject: '',
		description: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [createContactTicket] = useCreateContactTicketMutation();

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formState.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (!formState.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		if (!formState.subject.trim()) {
			newErrors.subject = 'Subject is required';
		}

		if (!formState.description.trim()) {
			newErrors.description = 'Description is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));

		// Clear error when user types
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);

		const res = await handleAsyncWithToast(async () => {
			return createContactTicket(formState);
		});

		if (res?.data?.success) {
			// Simulate form submission
			setTimeout(() => {
				setIsSubmitting(false);
				setIsSubmitted(true);
				setFormState({
					name: '',
					email: '',
					subject: '',
					description: '',
				});

				// Reset success message after 5 seconds
				setTimeout(() => {
					setIsSubmitted(false);
				}, 5000);
			}, 1500);
		}
	};
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white py-12 border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
							Contact Us
						</h1>
						<p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
							Have questions or need assistance? We&apos;re here to help. Reach
							out to our team using the form below.
						</p>
					</div>
				</div>
			</div>

			{/* Contact Section */}
			<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Contact Information */}
						<div className="bg-blue-600 p-10 text-white">
							<h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
							<p className="mb-8 max-w-sm">
								We&apos;d love to hear from you. Fill out the form and our team
								will get back to you as soon as possible.
							</p>

							<div className="space-y-6">
								<div className="flex items-start">
									<MapPinIcon className="h-6 w-6 mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="text-lg font-medium mb-1">Our Location</h3>
										<p className="text-blue-100">
											30 N gould st #29780
											<br />
											Sheridan, WY, 82801
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<PhoneIcon className="h-6 w-6 mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="text-lg font-medium mb-1">Phone</h3>
										<p className="text-blue-100">+1 (225) 255-1510</p>
									</div>
								</div>

								<div className="flex items-start">
									<EnvelopeIcon className="h-6 w-6 mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="text-lg font-medium mb-1">Email</h3>
										<p className="text-blue-100">contact@cudaspace.com</p>
									</div>
								</div>

								<div className="flex items-start">
									<ClockIcon className="h-6 w-6 mt-1 mr-4 flex-shrink-0" />
									<div>
										<h3 className="text-lg font-medium mb-1">Business Hours</h3>
										<p className="text-blue-100">Open 24/7</p>
									</div>
								</div>
							</div>

							<div className="mt-12">
								<h3 className="text-lg font-medium mb-4">Connect With Us</h3>
								<div className="flex space-x-4">
									<Link
										href="https://www.facebook.com/cudaspace"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											/>
										</svg>
									</Link>
									<Link
										href="https://www.t.me/cudaspacehq"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
											className="w-5 h-5"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
												fill="currentColor">
											<g clipPath="url(#clip0_1016_1718)">
												<path
													d="M7.8475 12.651L7.51666 17.3043C7.99 17.3043 8.195 17.101 8.44083 16.8568L10.66 14.736L15.2583 18.1035C16.1017 18.5735 16.6958 18.326 16.9233 17.3277L19.9417 3.18434L19.9425 3.18351C20.21 1.93684 19.4917 1.44934 18.67 1.75518L0.928329 8.54768C-0.282504 9.01768 -0.264171 9.69268 0.722496 9.99851L5.25833 11.4093L15.7942 4.81684C16.29 4.48851 16.7408 4.67018 16.37 4.99851L7.8475 12.651Z"
												
												/>
											</g>
											<defs>
												<clipPath id="clip0_1016_1718">
													<rect width="20" height="20" fill="white" />
												</clipPath>
											</defs>
										</svg>
									</Link>
									<Link
										href="https://www.linkedin.com/company/cudaspacehq"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
                    className="w-5 h-5"
											xmlns="http://www.w3.org/2000/svg"
											
											viewBox="0 0 20 20"
												fill="currentColor">
											<path
												d="M4.1696 5.83334H4.14613C3.89061 5.84875 3.63466 5.81132 3.39426 5.72338C3.15386 5.63544 2.93417 5.49887 2.74891 5.32222C2.56366 5.14557 2.41681 4.93262 2.31754 4.69667C2.21827 4.46072 2.16871 4.20684 2.17196 3.95088C2.17521 3.69491 2.2312 3.44237 2.33642 3.20902C2.44165 2.97566 2.59386 2.76651 2.78354 2.59462C2.97322 2.42272 3.19631 2.29178 3.43886 2.20997C3.68142 2.12816 3.93824 2.09724 4.19328 2.11913C4.44959 2.10056 4.70696 2.13523 4.94923 2.22095C5.19149 2.30666 5.41339 2.44158 5.601 2.6172C5.7886 2.79282 5.93783 3.00536 6.03932 3.24145C6.14081 3.47754 6.19236 3.73207 6.19072 3.98905C6.18908 4.24602 6.13429 4.49988 6.0298 4.73465C5.92531 4.96943 5.77337 5.18005 5.58355 5.35326C5.39372 5.52648 5.17011 5.65855 4.92678 5.74117C4.68344 5.82379 4.42565 5.85517 4.1696 5.83334Z"
												
											/>
											<path
												d="M5.84792 8.33301H2.51459V18.333H5.84792V8.33301Z"
												
											/>
											<path
												d="M14.5976 8.33301C14.0359 8.33454 13.4818 8.46302 12.9767 8.70883C12.4717 8.95464 12.0287 9.31143 11.6809 9.75253V8.33301H8.3476V18.333H11.6809V13.7497C11.6809 13.3076 11.8565 12.8837 12.1691 12.5712C12.4816 12.2586 12.9056 12.083 13.3476 12.083C13.7896 12.083 14.2135 12.2586 14.5261 12.5712C14.8387 12.8837 15.0143 13.3076 15.0143 13.7497V18.333H18.3476V12.083C18.3476 11.5906 18.2506 11.1029 18.0621 10.6479C17.8737 10.193 17.5975 9.77958 17.2492 9.43136C16.901 9.08314 16.4876 8.80691 16.0327 8.61846C15.5777 8.43 15.0901 8.33301 14.5976 8.33301Z"
												
											/>
										</svg>
									</Link>
									<Link
										href="https://x.com/cudaspacehq"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
											className="h-5 w-5"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor">
											<path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path>
										</svg>
									</Link>
									{/* <a
										href="#"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a
										href="#"
										className="bg-primary hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
										<svg
											className="h-5 w-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
												clipRule="evenodd"
											/>
										</svg>
									</a> */}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<div className="p-10">
							<h2 className="text-2xl font-semibold text-gray-900 mb-6">
								Send us a Message
							</h2>

							{isSubmitted ? (
								<div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start">
									<CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
									<div>
										<h3 className="text-lg font-medium text-green-800">
											Message sent successfully!
										</h3>
										<p className="mt-2 text-green-700">
											Thank you for reaching out. We&apos;ve received your
											message and will get back to you shortly.
										</p>
									</div>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 mb-1">
											Your Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formState.name}
											onChange={handleChange}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.name ? 'border-red-500' : 'border-gray-300'
											} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
											placeholder="John Doe"
										/>
										{errors.name && (
											<p className="mt-1 text-sm text-red-500">{errors.name}</p>
										)}
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formState.email}
											onChange={handleChange}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.email ? 'border-red-500' : 'border-gray-300'
											} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
											placeholder="john@example.com"
										/>
										{errors.email && (
											<p className="mt-1 text-sm text-red-500">
												{errors.email}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium text-gray-700 mb-1">
											Subject
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formState.subject}
											onChange={handleChange}
											className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											placeholder="How can we help you?"
										/>
										{errors.subject && (
											<p className="mt-1 text-sm text-red-500">
												{errors.subject}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor="description"
											className="block text-sm font-medium text-gray-700 mb-1">
											Description <span className="text-red-500">*</span>
										</label>
										<textarea
											id="description"
											name="description"
											value={formState.description}
											onChange={handleChange}
											rows={5}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.message ? 'border-red-500' : 'border-gray-300'
											} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
											placeholder="Your message here..."></textarea>
										{errors.description && (
											<p className="mt-1 text-sm text-red-500">
												{errors.description}
											</p>
										)}
									</div>

									<div>
										<button
											type="submit"
											disabled={isSubmitting}
											className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium ${
												isSubmitting
													? 'opacity-70 cursor-not-allowed'
													: 'hover:bg-blue-700'
											} transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}>
											{isSubmitting ? 'Sending...' : 'Send Message'}
										</button>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Map Section */}
			{/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-7">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0927348952256!2d-122.39663492392031!3d37.78284711681925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807abad77c99%3A0x3919765d55b1c90a!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div> */}
		</div>
	);
};

export default ContactPageComponent;
