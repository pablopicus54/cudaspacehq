 
'use client';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

const MyFormCheckbox = ({
  name,
  label,
  labelClassName,
  checkboxClassName,
  value,
  onValueChange,
}: {
  name: string;
  label?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  value?: boolean;
  onValueChange?: (newValue: boolean) => void;
}) => {
  const { setValue, control } = useFormContext();

  // Watch the checkbox value
  const checkboxValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    setValue(name, value, { shouldValidate: false });
  }, [value, name, setValue]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(checkboxValue); // Trigger the callback whenever the value changes
    }
  }, [checkboxValue, onValueChange]);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{
          required: false,
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col justify-center w-full">
            <label htmlFor={name} className={cn('flex items-center gap-2', checkboxClassName)}>
              <input
                id={name}
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 accent-blue-600"
                autoComplete="off"
              />
              {label && (
                <span className={cn('text-base font-normal leading-6 text-text-primary', labelClassName)}>
                  {label}
                </span>
              )}
            </label>
            {error && <small style={{ color: 'red' }}>{error.message}</small>}
          </div>
        )}
      />
    </div>
  );
};

export default MyFormCheckbox;
