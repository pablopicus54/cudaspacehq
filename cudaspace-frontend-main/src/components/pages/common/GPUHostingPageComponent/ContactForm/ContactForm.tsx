'use client';

import MyButton from '@/components/ui/MyButton/MyButton';
import type React from 'react';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        description: '',
      });
      setSubmitSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      setSubmitError(
        'There was an error sending your message. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 md:py-12 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Contact US</h2>
        <p className="text-gray-600">
          If you need more information or have any questions, feel free to reach
          out to us through our social media channels.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name:"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email:"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="sr-only">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject:"
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="sr-only">
            description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe what you need:"
            required
            rows={6}
            className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        {submitSuccess && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center">
            Your message has been sent successfully!
          </div>
        )}

        {submitError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {submitError}
          </div>
        )}

        <div className="flex justify-center">
          <MyButton
            label={isSubmitting ? 'Sending...' : 'Send Message'}
            className="rounded-full"
          />
        </div>
      </form>
    </section>
  );
}
