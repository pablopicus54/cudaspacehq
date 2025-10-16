 
'use client'; 
import { FormProvider, useForm } from 'react-hook-form';

import { ConfigProvider } from 'antd';
import { cn } from '@/lib/utils';

const MyFormWrapper = ({
  onSubmit,
  className,
  children,
  defaultValues,
  resolver,
}: {
  onSubmit: (data: any, reset: () => void) => void;
  className?: string;
  children: React.ReactNode;
  defaultValues?: any;
  resolver?: import('react-hook-form').Resolver<any, any>;
}) => {
  const formConfig: Record<string, any> = {};

  if (defaultValues) {
    formConfig['defaultValues'] = defaultValues;
  }

  if (resolver) {
    formConfig['resolver'] = resolver;
  }

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  const submit = (data: any) => {
    onSubmit(data, reset); // Pass reset function to onSubmit
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            hoverBorderColor: '#3257D9',
            activeBorderColor: '#3257D9',
          },
          Input: {
            hoverBorderColor: '#3257D9',
            activeBorderColor: '#3257D9',
          },
          Checkbox: {
            colorBorder: '#3257D9',
            colorPrimary: '#3257D9',
            colorPrimaryHover: '#3257D9',
          },
          DatePicker: {
            colorPrimary: '#3257D9',
            colorPrimaryHover: '#3257D9',
            colorBorder: '#3257D9',
            colorText: '#3257D9',
            colorTextDisabled: '#3257D9',
          },
        },
      }}
    >
      <FormProvider {...methods}>
        <form className={cn('', className)} onSubmit={handleSubmit(submit)}>
          {children}
        </form>
      </FormProvider>
    </ConfigProvider>
  );
};

export default MyFormWrapper;
