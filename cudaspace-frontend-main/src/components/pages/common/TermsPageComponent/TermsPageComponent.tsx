import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { ChevronRight } from 'lucide-react';
import React from 'react';

const TermsPageComponent = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<MyContainer>
				<div className="bg-white shadow-sm rounded-lg overflow-hidden">
					{/* Terms Header */}
					<div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-400">
						<h1 className="text-3xl font-bold text-white">
							Terms and Conditions
						</h1>
						<p className="mt-2 text-teal-100">Last updated: May 17, 2025</p>
					</div>

					{/* Table of Contents */}
					<div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-900">
							Table of Contents
						</h2>
						<nav className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
							{[
								{ id: 'acceptance', label: 'Acceptance of Terms' },
								{ id: 'services', label: 'Services Description' },
								{ id: 'accounts', label: 'Account Registration' },
								{ id: 'payment', label: 'Payment Terms' },
								{ id: 'sla', label: 'Service Level Agreement' },
								{ id: 'acceptable-use', label: 'Acceptable Use' },
								{ id: 'data-ownership', label: 'Data Ownership' },
								{
									id: 'intellectual-property',
									label: 'Intellectual Property',
								},
								{
									id: 'limitation-liability',
									label: 'Limitation of Liability',
								},
								{ id: 'termination', label: 'Termination' },
								{ id: 'governing-law', label: 'Governing Law' },
								{ id: 'changes', label: 'Changes to Terms' },
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

					{/* Terms Content */}
					<div className="px-6 py-8 prose prose-teal max-w-none">
						<section id="acceptance" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								1. Acceptance of Terms
							</h2>
							<p className="text-gray-700">
								Welcome to <strong>CudaSpace LLC.</strong> These Terms and
								Conditions ("Terms") govern your access to and use of
								CudaSpace's website, services, and products, including VPS, GPU,
								and dedicated server hosting solutions (collectively, the
								“Services”).
							</p>
							<p className="text-gray-700 mt-4">
								By using our Services, you agree to these Terms. If you're using
								the Services on behalf of a business or organization, you
								represent that you have the authority to bind them to this
								agreement.
							</p>
							<p className="text-gray-700 mt-4">
								If you disagree with any part of the Terms, do not use the
								Services.
							</p>
						</section>

						<section id="services" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								2. Services Description
							</h2>
							<p className="text-gray-700">
								CudaSpace provides secure and scalable cloud infrastructure,
								including:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>VPS for web hosting and development</li>
								<li>GPU servers for AI, rendering, and computation</li>
								<li>Dedicated servers for high-performance needs</li>
								<li>Secure storage and network solutions</li>
							</ul>
							<p className="text-gray-700 mt-4">
								All specs, pricing, and availability are posted on our site and
								are subject to change. We may suspend, modify, or discontinue
								any service at our discretion.
							</p>
						</section>

						<section id="accounts" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								3. Account Registration
							</h2>
							<p className="text-gray-700">
								To use our Services, you must create an account with accurate
								and current info.
							</p>
							<p className="text-gray-700 mt-4">You are responsible for:</p>

							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Securing your login credentials</li>
								<li>All activity under your account</li>
								<li>Notifying us of any unauthorized access</li>
								<li>Logging out after sessions</li>
							</ul>
							<p className="text-gray-700 mt-4">
								We may suspend or terminate accounts that violate these Terms or
								applicable laws.
							</p>
						</section>

						<section id="payment" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								4. Payment Terms
							</h2>
							{/* <p className="text-gray-700">
								By subscribing to our Services, you agree to pay all fees
								associated with the Services you select. Fees are non-refundable
								except as required by law or as explicitly stated in these
								Terms.
							</p> */}
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								4.1 Billing
							</h3>
							<p className="text-gray-700">
								Payments are processed via Stripe. You’ll be charged monthly,
								yearly, or as usage-based.
							</p>
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								4.2 Auto Renewal
							</h3>
							<p className="text-gray-700">
								All subscriptions auto-renew unless cancelled prior to the
								renewal date.
							</p>
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								4.3 Late Payments
							</h3>
							<p className="text-gray-700">
								Non-payment may lead to suspension or termination. Taxes may
								apply based on your location.
							</p>
							<h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
								4.4 Price Changes
							</h3>
							<p className="text-gray-700">
								We’ll notify you 30 days in advance before any price hike.
								Continued usage = acceptance.
							</p>
						</section>

						<section id="sla" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								5. Service Level Agreement (SLA)
							</h2>
							<p className="text-gray-700">
								We aim for maximum uptime. Specific uptime guarantees and credit
								policies are outlined in our SLA (available on our website).
							</p>
							{/* <p className="text-gray-700 mt-4">
								We guarantee a monthly uptime percentage as specified in our SLA
								for each service tier. If we fail to meet these guarantees, you
								may be eligible for service credits as outlined in the SLA.
							</p> */}
							<p className="text-gray-700 mt-4">SLA exclusions include:</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Your software, actions, or configuration</li>
								<li>Third-party outages</li>
								<li>Scheduled maintenance</li>
								<li>Force majeure events</li>
							</ul>
						</section>

						<section id="acceptable-use" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								6. Acceptable Use
							</h2>
							<p className="text-gray-700">
								You agree not to use our Services to:
							</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Break any law</li>
								<li>Spread spam, malware, or harmful content</li>
								<li>Infringe on others' rights</li>
								<li>Overload or abuse infrastructure</li>
								<li>Attempt unauthorized access</li>
							</ul>
							<p className="text-gray-700 mt-4">
								Violating this policy can get your account suspended or
								terminated.
							</p>
							{/* <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>
									Use the Services in any manner that could disable, overburden,
									damage, or impair the site or interfere with any other
									party&apos;s use of the Services
								</li>
								<li>
									Use any robot, spider, or other automatic device, process, or
									means to access the Services for any purpose
								</li>
								<li>
									Use the Services to host, store, or transmit content that is
									illegal, harmful, threatening, abusive, harassing, tortious,
									defamatory, vulgar, obscene, libelous, or otherwise
									objectionable
								</li>
								<li>
									Use the Services to host, store, or transmit material that
									infringes or violates someone else&apos;s intellectual
									property rights
								</li>
								<li>
									Use the Services to distribute malware, viruses, or other
									malicious code
								</li>
								<li>
									Attempt to gain unauthorized access to, interfere with,
									damage, or disrupt any parts of the Services
								</li>
							</ul>
							<p className="text-gray-700 mt-4">
								Violation of these acceptable use policies may result in
								termination or suspension of your access to the Services.
							</p> */}
						</section>

						<section id="data-ownership" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								7. Data Ownership
							</h2>
							<p className="text-gray-700">All data you store is yours.</p>
							<p className="text-gray-700 mt-4">We only access it:</p>
							{/* <p className="text-gray-700 mt-4">You are responsible for:</p> */}
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>At your request for support</li>
								<li>To comply with law </li>
								<li>To prevent abuse</li>
								<li>With your permission</li>
							</ul>
							<p className="text-gray-700 mt-4">
								You're responsible for legal compliance, accuracy, and backups.
							</p>
						</section>

						<section id="intellectual-property" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								8. Intellectual Property
							</h2>
							<p className="text-gray-700">
								All platform content, code, and design are property of CudaSpace
								LLC or its licensors.
							</p>
							<p className="text-gray-700 mt-4">You may not:</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Reproduce or distribute content</li>
								<li>Remove copyright notices</li>
								<li>Commercially use materials without permission</li>
							</ul>
							{/* <p className="text-gray-700 mt-4">You must not:</p>
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Modify copies of any materials from the Services</li>
								<li>
									Delete or alter any copyright, trademark, or other proprietary
									rights notices from copies of materials from the Services
								</li>
								<li>
									Access or use for any commercial purposes any part of the
									Services or any services or materials available through the
									Services
								</li>
							</ul> */}
							<p className="text-gray-700 mt-4">
								Misuse will result in account suspension and legal consequences.
							</p>
						</section>

						<section id="limitation-liability" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								9. Limitation of Liability
							</h2>
							{/* <p className="text-gray-700">
								To the fullest extent permitted by applicable law, in no event
								will Data Vault, its affiliates, or their licensors, service
								providers, employees, agents, officers, or directors be liable
								for damages of any kind, under any legal theory, arising out of
								or in connection with your use, or inability to use, the
								Services, including any direct, indirect, special, incidental,
								consequential, or punitive damages, including but not limited
								to, personal injury, pain and suffering, emotional distress,
								loss of revenue, loss of profits, loss of business or
								anticipated savings, loss of use, loss of goodwill, loss of
								data, and whether caused by tort (including negligence), breach
								of contract, or otherwise, even if foreseeable.
							</p>
							<p className="text-gray-700 mt-4">
								The foregoing does not affect any liability which cannot be
								excluded or limited under applicable law.
							</p>
							<p className="text-gray-700 mt-4">
								In no event shall our total liability to you for all claims
								arising from or relating to these Terms or your use of the
								Services exceed the amount paid by you to Data Vault during the
								twelve (12) months immediately preceding the event giving rise
								to the claim.
							</p> */}

							<p className="text-gray-700">
								To the maximum extent allowed by law, CudaSpace LLC is not
								liable for:
							</p>

							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>Lost data</li>
								<li>Lost profits</li>
								<li>Business interruption</li>
								<li>Indirect or punitive damages</li>
							</ul>

							<p className="text-gray-700 mt-4">
								Maximum liability is capped at the amount you paid us in the
								last 12 months.
							</p>
						</section>

						<section id="termination" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								10. Termination
							</h2>
							<p className="text-gray-700">
								We may suspend or delete your account at any time if:
							</p>
							{/* <p className="text-gray-700">
								We may terminate or suspend your account and access to the
								Services immediately, without prior notice or liability, for any
								reason whatsoever, including without limitation if you breach
								these Terms.
							</p>
							<p className="text-gray-700 mt-4">
								Upon termination, your right to use the Services will
								immediately cease. If you wish to terminate your account, you
								may simply discontinue using the Services or contact us to
								request account deletion.
							</p>
							<p className="text-gray-700 mt-4">
								All provisions of the Terms which by their nature should survive
								termination shall survive termination, including, without
								limitation, ownership provisions, warranty disclaimers,
								indemnity, and limitations of liability.
							</p>
							<p className="text-gray-700 mt-4">
								We are not obligated to maintain or provide you with copies of
								your data after termination. We may delete your data in the
								normal course of operation when it is no longer needed, subject
								to our data retention policies and applicable law.
							</p> */}
							<ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
								<li>You breach these Terms</li>
								<li>You're inactive for an extended period</li>
								<li>Required by law</li>
							</ul>

							<p className="text-gray-700 mt-4">
								After termination, we may delete your data unless retention is
								required.
							</p>
						</section>

						<section id="governing-law" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								11. Governing Law
							</h2>
							<p className="text-gray-700">
								These Terms are governed by <strong>Wyoming State law</strong> ,
								USA.
							</p>
							<p className="text-gray-700 mt-4">
								Any disputes will be resolved via arbitration through the{' '}
								<strong>American Arbitration Association</strong>, held in{' '}
								<strong>Sheridan, Wyoming</strong>.
							</p>
							{/* <p className="text-gray-700 mt-4">
								Any dispute, controversy, or claim arising out of or relating to
								these Terms, including the validity, invalidity, breach, or
								termination thereof, shall be settled by arbitration in
								accordance with the rules of the American Arbitration
								Association then in effect, by a panel of three arbitrators.
							</p> */}
						</section>

						<section id="changes" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								12. Changes to Terms
							</h2>
							<p className="text-gray-700">
								We may update these Terms as needed. If changes are significant,
								we’ll give you <strong>30 days' notice</strong>.
							</p>
							<p className="text-gray-700 mt-4">
								Your continued use of the Services = your acceptance of updated
								Terms.
							</p>
							{/* <p className="text-gray-700 ">
								By continuing to access or use our Services after any revisions
								become effective, you agree to be bound by the revised terms. If
								you do not agree to the new terms, you are no longer authorized
								to use the Services.
							</p>
							<p className="text-gray-700 mt-4">
								We encourage you to review these Terms periodically for any
								changes. The most current version will always be posted on our
								website with the effective date.
							</p> */}
						</section>

						<section id="contact" className="mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								13. Contact Us
							</h2>
							{/* <p className="text-gray-700">
								If you have any questions about these Terms, please contact us
								at:
							</p> */}
							<div className="bg-gray-50 p-6 rounded-lg mt-4">
								<p className="text-gray-900 font-medium">CudaSpace LLC</p>
								<p className="text-gray-700 mt-2">Email: legal@cudaspace.com</p>
								<p className="text-gray-700">Phone: +1 (225) 255-1510</p>
								<p className="text-gray-700">
									Address: 30 N Gould ST #29780, Sheridan, WY 82801, USA
								</p>
							</div>
							<p className="text-gray-700 mt-6">
								We're committed to resolving any issues professionally and
								quickly.
							</p>
						</section>
					</div>
				</div>
			</MyContainer>
		</div>
	);
};

export default TermsPageComponent;
