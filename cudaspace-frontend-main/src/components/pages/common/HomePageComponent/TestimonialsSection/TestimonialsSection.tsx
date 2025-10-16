'use client';
import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { useGetAllTestimonialQuery } from '@/redux/features/testimonial/testimonial.user.api';
import Image from 'next/image';

// Define the testimonial type
interface Testimonial {
  id: string;
  name: string;
  company: string;
  image: string;
  quote: string;
}

type User = {
  name: string;
  profileImage: string | null;
};

type Message = {
  message: string;
  createdAt: string;
  user: User;
};

// Create an array of testimonials
const testimonials: Testimonial[] = [
  {
    id: 'lido-beach',
    name: 'Lido Beach',
    company: 'New Scar, Same Scar',
    image: '/review1.png',
    quote:
      'What really stands out is the 24/7 support. Anytime I have had a question or needed help, their team has been quick to respond with expert advice',
  },
  {
    id: 'paul-star',
    name: 'Paul Star',
    company: 'Be Alert | Blues',
    image: '/review2.png',
    quote:
      'What really stands out is the 24/7 support. Anytime I have had a question or needed help, their team has been quick to respond with expert advice',
  },
  {
    id: 'kaia-hol',
    name: 'Kaia Höl',
    company: 'America',
    image: '/review3.png',
    quote:
      'What really stands out is the 24/7 support. Anytime I have had a question or needed help, their team has been quick to respond with expert advice',
  },
];

export function TestimonialsSection() {
  const {
    data: getAllTestimonialResponse,
    isLoading,
    isFetching,
  } = useGetAllTestimonialQuery(undefined);
  const testimonials = getAllTestimonialResponse?.data?.testimonial || [];
  return (
    <></>
    // <section className="md:py-12 py-10 bg-white">
    //   <MyContainer>
    //     <SectionHead
    //       title="Testimonial"
    //       description=" From seamless experiences to exceptional support, our clients share how our services have made a difference.
    //         Take a look at their stories to see how we've helped them succeed."
    //     />

    //     {!isLoading && !isFetching && testimonials?.length > 0 ? (
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //         {testimonials.map((testimonial: Message, idx: number) => (
    //           <div
    //             key={idx}
    //             className="border border-gray-200 rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow"
    //           >
    //             <div className="flex items-center mb-4">
    //               <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
    //                 <Image
    //                   src={
    //                     testimonial?.user?.profileImage || '/placeholder.svg'
    //                   }
    //                   alt={testimonial?.user?.name}
    //                   fill
    //                   className="object-cover"
    //                   sizes="48px"
    //                 />
    //               </div>
    //               <div>
    //                 <h3 className="font-semibold">{testimonial?.user?.name}</h3>
    //                 <p className="text-sm text-gray-600">
    //                   {new Date(testimonial.createdAt).toLocaleDateString()}
    //                 </p>
    //               </div>
    //             </div>
    //             <p className="text-gray-700 text-sm">{testimonial?.message}</p>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       ''
    //     )}
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //       {isLoading || isFetching
    //         ? [1, 2, 3].map((el) => (
    //             <div
    //               key={el}
    //               className="border border-gray-200 rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow"
    //             >
    //               <div className="flex items-center mb-4">
    //                 Profile Image Skeleton
    //                 <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-300 animate-pulse"></div>

    //                 <div>
    //                   Name Skeleton
    //                   <h3 className="font-semibold bg-gray-300 w-32 h-4 mb-2 animate-pulse"></h3>

    //                   Date Skeleton
    //                   <p className="text-sm text-gray-600 bg-gray-300 w-24 h-3 animate-pulse"></p>
    //                 </div>
    //               </div>

    //               Message Skeleton
    //               <p className="text-gray-700 text-sm bg-gray-300 w-full h-6 animate-pulse"></p>
    //             </div>
    //           ))
    //         : ''}
    //     </div>
    //   </MyContainer>
    // </section>
  );
}
