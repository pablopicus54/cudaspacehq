import React from 'react';

const SectionHead = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="text-center mb-8 md:mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="max-w-3xl mx-auto text-gray-700">{description}</p>
    </div>
  );
};

export default SectionHead;
