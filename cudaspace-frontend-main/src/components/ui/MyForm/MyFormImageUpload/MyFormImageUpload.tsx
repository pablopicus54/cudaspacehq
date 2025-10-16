/* eslint-disable @next/next/no-img-element */
 
import React, { ReactNode, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { RiDeleteBinLine } from 'react-icons/ri';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { getImageSrc } from '@/utils/getImageSrc';

type TImageUploadProps = {
  name: string;
  label?: string;
  children?: ReactNode;
  size?: string;
  parentClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  previewImageClassName?: string;
  defaultValue?: (string | StaticImport)[] | string | StaticImport;
  maxImages?: number;
  multiple?: boolean;
  [key: string]: any; // Allow other props
};

const MyFormImageUpload = ({
  name,
  label,
  size = 'medium',
  parentClassName = '',
  labelClassName = '',
  inputClassName = '',
  previewImageClassName = '',
  defaultValue,
  maxImages = 5,
  multiple = true,
  children,
  ...rest
}: TImageUploadProps) => {
  const { control, setValue, resetField } = useFormContext();
  
  // Helper function to normalize defaultValue to array
  const normalizeDefaultValue = (value: any): (string | StaticImport)[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value]; // Convert single value to array
  };

  const [previews, setPreviews] = useState<(string | StaticImport)[]>(() => 
    normalizeDefaultValue(defaultValue),
  );
  const [fileInputKey, setFileInputKey] = useState(0);

  // Handle file change (set preview and form value)
  const handleFileChange = (files: FileList) => {
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    const filesToProcess = multiple 
      ? Math.min(files.length, maxImages - previews.length)
      : 1;

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file) {
        newFiles.push(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          
          // When all files are processed, update state
          if (newPreviews.length === filesToProcess) {
            if (multiple) {
              const updatedPreviews = [...previews, ...newPreviews];
              setPreviews(updatedPreviews);
              
              // Get existing files from form value
              const existingFiles = control._formValues[name] || [];
              const updatedFiles = Array.isArray(existingFiles) 
                ? [...existingFiles, ...newFiles]
                : newFiles;
              setValue(name, updatedFiles);
            } else {
              setPreviews([newPreviews[0]]);
              setValue(name, newFiles[0]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove specific image
  const handleRemoveImage = (index: number) => {
    if (multiple) {
      const updatedPreviews = previews.filter((_, i) => i !== index);
      setPreviews(updatedPreviews);
      
      // Update form value
      const existingFiles = control._formValues[name] || [];
      const updatedFiles = Array.isArray(existingFiles) 
        ? existingFiles.filter((_: any, i: number) => i !== index)
        : [];
      setValue(name, updatedFiles);
      
      if (updatedFiles.length === 0) {
        resetField(name);
      }
    } else {
      setPreviews([]);
      resetField(name);
    }
    
    setFileInputKey((prev) => prev + 1); // Force file input reset
  };

  // Remove all images
  const handleRemoveAllImages = () => {
    setPreviews([]);
    resetField(name);
    setFileInputKey((prev) => prev + 1);
  };

  // Effect to set default value in the form when the component mounts or defaultValue changes
  useEffect(() => {
    const normalizedValue = normalizeDefaultValue(defaultValue);
    if (normalizedValue.length > 0) {
      setValue(name, multiple ? normalizedValue : normalizedValue[0], { shouldValidate: false });
      setPreviews(normalizedValue);
    } else {
      // Reset when defaultValue becomes empty/undefined
      setPreviews([]);
      resetField(name);
    }
  }, [defaultValue, name, setValue, multiple, resetField]);

  const showInput = multiple ? previews.length < maxImages : previews.length === 0;


  return (
    <div className={cn(`form-group h-full ${size}`, parentClassName)}>
      {label && <p className={cn('mb-2', labelClassName)}>{label}</p>}
      <Controller
        control={control}
        name={name}
        render={({ fieldState: { error } }) => (
          <>
            {/* Preview Images */}
            {Array.isArray(previews) && previews.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-4 mb-2">
                  {previews.map((preview, index) => (
                    <div key={index} className={cn('relative max-h-44', previewImageClassName)}>
                      {/* <Image
                        height={200}
                        width={200}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-fill"
                        priority
                      /> */}
                       <img
                        src={getImageSrc(preview)}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-1 py-1 bg-black bg-opacity-80 text-white rounded-md absolute top-2 right-2 hover:bg-opacity-100 transition-opacity"
                      >
                        <RiDeleteBinLine size={16} className="hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Remove All Button (for multiple images) */}
                {multiple && previews.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRemoveAllImages}
                    className="mb-4 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                  >
                    Remove All Images
                  </button>
                )}
              </div>
            )}

            {/* File Input */}
            {showInput && (
              <>
                {children && (
                  <label htmlFor={name} className="h-full w-full cursor-pointer">
                    {children}
                  </label>
                )}

                <input
                  key={fileInputKey} // Force reset of input field
                  id={name}
                  type="file"
                  accept="image/*"
                  multiple={multiple}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleFileChange(files);
                    }
                  }}
                  className={cn(
                    'w-full rounded-md border border-gray-300 p-2',
                    inputClassName,
                    children && 'hidden',
                  )}
                  {...rest}
                />
              </>
            )}

            {/* Image Count Info */}
            {multiple && Array.isArray(previews) && (
              <p className="text-sm text-gray-500 mt-2">
                {previews.length} of {maxImages} images selected
                {previews.length < maxImages && ' (You can add more)'}
              </p>
            )}

            {error && <small style={{ color: 'red' }}>{error.message}</small>}
          </>
        )}
      />
    </div>
  );
};

export default MyFormImageUpload;