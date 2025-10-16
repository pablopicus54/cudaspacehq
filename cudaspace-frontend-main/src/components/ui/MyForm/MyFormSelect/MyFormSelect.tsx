import { Select } from 'antd';
import { Controller } from 'react-hook-form';
import { SelectProps } from 'antd';
import './MyFormSelect.css';
import { cn } from '@/lib/utils';

interface MyFormSelectProps {
  label?: string;
  labelClassName?: string;
  name: string;
  options?: SelectProps['options'];
  disabled?: boolean;
  mode?: 'multiple' | 'tags'; // these are the two modes supported by Ant Design's Select
  placeHolder: string;
  className?: string;
  isSearch?: boolean;
}

const MyFormSelect = ({
  label,
  labelClassName,
  name,
  options,
  disabled,
  mode,
  placeHolder,
  className,
  isSearch = false,
}: MyFormSelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col justify-center gap-1">
          {/* Label */}
          {label && (
            <p
              className={cn(
                'ps-1 mb-2 text-text-primary text-base font-normal leading-6',
                labelClassName,
              )}
            >
              {label}
            </p>
          )}

          {/* Ant Design Select */}
          <Select
            mode={mode}
            style={{ width: '100%' }}
            className={cn(className)}
            {...field}
            ref={null}
            value={field.value}
            onChange={(value) => field.onChange(value)}
            options={options}
            size="large"
            disabled={disabled}
            placeholder={placeHolder}
            showSearch={isSearch} // Enable search functionality based on isSearch prop
            filterOption={
              isSearch
                ? (input, option) =>
                    (option?.label ?? '')
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                : undefined
            }
          />

          {/* Error Message */}
          {error && <small style={{ color: 'red' }}>{error.message}</small>}
        </div>
      )}
    />
  );
};

export default MyFormSelect;
