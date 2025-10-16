import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-gray-50 py-12">
			{/* Main Content */}
			<MyContainer>
				<div className="bg-white shadow-sm rounded-lg overflow-hidden">
					{/* Policy Header */}
					<div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-400">
						<h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
						<p className="mt-2 text-teal-100">Last updated: May 17, 2025</p>
					</div>

					{/* Table of Contents */}
					<div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-900">
							Table of Contents
						</h2>
						<nav className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
							{[
								{ id: 'introduction', label: 'Introduction' },
								{
									id: 'information-collection',
									label: 'Information We Collect',
								},
								{
									id: 'use-of-information',
									label: 'How We Use Your Information',
								},
								{ id: 'data-storage', label: 'Data Storage and Security' },
								{ id: 'payment-processing', label: 'Payment Processing' },
								{ id: 'hosted-data', label: 'Your Data on Our Servers' },
								{ id: 'cookies', label: 'Cookies and Tracking' },
								{ id: 'user-rights', label: 'Your Rights' },
								{ id: 'policy-changes', label: 'Changes to This Policy' },
								{ id: 'contact', label: 'Contact Us' },
							].map((item) => (
								<a
									key={item.id}
									href={`#${item.id}`}
									className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
									<ChevronRight className="h-4 w-4 mr-2 text-teal-500" />
									{item.label}
								</a>
							))}
						</nav>
					</div>

					{/* Policy Content */}
					<div className="px-6 py-8 prose prose-teal max-w-none">
						<section id="introduction" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								1. Introduction
							</h2>
							<p className="text-gray-700">
								Welcome to <strong>CudaSpace</strong> ("we", "our", or "us"). We
								are committed to protecting your privacy and the security of
								your personal information. This Privacy Policy explains how we
								collect, use, disclose, and safeguard your information when you
								visit our website, use our services, or purchase our VPS, GPU,
								or dedicated server hosting solutions.
							</p>
							<p className="text-gray-700 mt-4">
								Please read this Privacy Policy carefully. By accessing or using
								our services, you acknowledge that you have read, understood,
								and agree to be bound by the terms in this Privacy Policy. If
								you do not agree with our policies and practices, please do not
								use our services.
							</p>
						</section>

						<section id="information-collection" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								2. Information We Collect
							</h2>
							<p className="text-gray-700">
								We collect several types of information from and about users of
								our services, including:
							</p>
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								Personal Information
							</h3>
							<ul className="list-disc pl-6 text-gray-700 space-y-2">
								<li>Name, email, phone number, and postal address</li>
								<li>Account credentials (username and password)</li>
								<li>Billing and payment details</li>
								<li>Company name and job title (if applicable)</li>
								<li>Identity verification documents (as required by law)</li>
							</ul>

							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								Technical Information
							</h3>
							<ul className="list-disc pl-6 text-gray-700 space-y-2">
								<li>IP address, location data</li>
								<li>Browser and device info</li>
								<li>Usage behavior and logs</li>
								<li>Cookies and tracking data</li>
							</ul>
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								Service Usage Information
							</h3>
							<ul className="list-disc pl-6 text-gray-700 space-y-2">
								<li>Server specs and config</li>
								<li>Bandwidth and usage metrics</li>
								<li>Support history and ticket logs</li>
							</ul>
						</section>

						<section id="use-of-information" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								3. How We Use Your Information
							</h2>
							<p className="text-gray-700">We use the data we collect to:</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Deliver, maintain, and improve our services</li>
								<li>Process payments and manage your account</li>
								<li>Ensure performance, uptime, and reliability</li>
								<li>Communicate updates, alerts, and responses</li>
								<li>Enforce legal compliance and prevent abuse</li>
								<li>Understand how users interact with our platform</li>
							</ul>
						</section>

						<section id="data-storage" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								4. Data Storage and Security
							</h2>
							<p className="text-gray-700">
								We take security seriously. Measures include:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>End-to-end encryption (at rest & transit)</li>
								<li>MFA, role-based access, firewalls</li>
								<li>Routine security audits and patching</li>
								<li>Data center physical access controls</li>
								<li>Frequent backups and failover systems</li>
							</ul>
							<p className="text-gray-700 mt-4">
								Despite these efforts, no online system is 100% secure. We
								cannot guarantee absolute data safety.
							</p>
						</section>

						<section id="payment-processing" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								5. Payment Processing
							</h2>
							<p className="text-gray-700">
								We use <span className="font-bold">Stripe</span> to process
								payments
							</p>
							<p className="text-gray-700 mt-4">
								Your full credit card details are{' '}
								<span className="font-bold">never stored</span> on our servers.
								Stripe shares only limited payment metadata with us (e.g., last
								4 digits, card type) for customer service purposes.
							</p>
							<p className="text-gray-700 mt-4">
								Refer to{' '}
								<a
									href="https://stripe.com/privacy"
									className="text-teal-600 hover:text-teal-800"
									target="_blank"
									rel="noopener noreferrer">
									Stripe&apos;s Privacy Policy{' '}
								</a>
								for more.
							</p>
						</section>

						<section id="hosted-data" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								6. Your Data on Our Servers
							</h2>
							<p className="text-gray-700">
								We do not access your hosted data unless:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>You request support</li>
								<li> There's a security issue</li>
								<li>We're legally required to do so</li>
								<li>You give explicit permission</li>
							</ul>
							<p className="text-gray-700 mt-4">
								You retain full rights and control over your data. You’re
								responsible for encrypting and securing your applications.
							</p>
						</section>

						<section id="cookies" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								7. Cookies and Tracking
							</h2>
							{/* <p className="text-gray-700">
								We use cookies and similar tracking technologies to collect
								information about your browsing activities on our website.
								Cookies are small text files stored on your device that help us
								improve your experience, analyze site usage, and assist in our
								marketing efforts.
							</p> */}
							<p className="text-gray-700 mt-4">
								We use cookies to improve your experience. Types:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>
									<strong>Essential:</strong> critical for site function
								</li>
								<li>
									<strong>Analytical:</strong> help us track site usage
								</li>
								<li>
									<strong>Functionality: </strong> remember preferences
								</li>
								<li>
									<strong>Targeting :</strong> for tailored marketing
								</li>
							</ul>
							<p className="text-gray-700 mt-4">
								Control cookies via your browser settings. Blocking some may
								affect site features.
							</p>
						</section>

						<section id="user-rights" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								8. Your Rights
							</h2>
							<p className="text-gray-700">
								Depending on your jurisdiction, your rights may include:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Requesting access or copies of your data</li>
								<li>Updating/correcting inaccurate info</li>
								<li>Deleting your data (in certain cases)</li>
								<li>Objecting to or restricting processing</li>
								<li>Porting your data to another provider</li>
								<li>Withdrawing consent (where applicable)</li>
							</ul>
							<p className="text-gray-700 mt-4">
								To make requests, contact us below.
							</p>
						</section>

						<section id="policy-changes" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								9. Changes to This Policy
							</h2>
							<p className="text-gray-700">
								We may modify this Privacy Policy occasionally. Updates will be
								posted on this page with a revised "Last updated" date.
								Significant changes will be communicated.
							</p>
							<p className="text-gray-700 mt-4">
								Continued use of our services after updates means you accept the
								revised policy.
							</p>
						</section>

						<section id="contact" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								10. Contact Us
							</h2>
							<p className="text-gray-700">
								If you have any questions or requests:
							</p>
							<div className="bg-gray-50 p-6 rounded-lg mt-4">
								<p className="text-gray-900 font-medium">CudaSpace LLC</p>
								<p className="text-gray-700 mt-2">
									Email: privacy@cudaspace.com
								</p>
								<p className="text-gray-700">Phone: +1 (225) 255-1510</p>
								<p className="text-gray-700">
									Address: 30 N Gould ST #29780, Sheridan, WY 82801, USA
								</p>
							</div>
							<p className="text-gray-700 mt-6">
								We will make every effort to respond to your inquiry promptly
								and address your concerns thoroughly.
							</p>
						</section>
					</div>
				</div>
			</MyContainer>
		</div>
	);
}
