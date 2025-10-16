'use client';

import { useState, useMemo, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Checkbox, Image } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BiSolidCloudUpload } from 'react-icons/bi';

const { Option } = Select;

interface AddServiceFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  defaultValue?: any;
}

export default function AddServiceForm({
  onSubmit,
  onCancel,
  defaultValue,
}: AddServiceFormProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<string>('');

  const initialValues = {
    uploadMainImage: defaultValue?.image ? [defaultValue?.image] : [],
    packageType: defaultValue?.packageType || '',
    serviceName: defaultValue?.serviceName || '',
    packageStatus: defaultValue?.packageStatus || 'PUBLISHED',
    perMonthPrice: defaultValue?.perMonthPrice || '',
    perYearPrice: defaultValue?.perYearPrice || '',
    perQuarterPrice: defaultValue?.perQuarterPrice || '',
    promotional: defaultValue?.promotional || false,
    serviceDetails: defaultValue?.serviceDetails || [''],
    vpsType: defaultValue?.vpsType || 'WINDOWS_SERVER_VPS',
    serverType: defaultValue?.serverType || 'SSD_SERVER',
  };

  useEffect(() => {
    if (defaultValue?.packageImage) {
      setMainImage(defaultValue?.packageImage);
    }
    if (defaultValue?.packageType) {
      setPackageType(defaultValue?.packageType);
    }
    if (defaultValue?.promotianal) {
      form.setFieldsValue({ promotional: defaultValue?.promotianal });
    }
  }, [defaultValue]);

  // Watch for changes in the packageType field
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.packageType) {
      const value = changedValues.packageType;
      setPackageType(value);

      // Reset conditional fields when package type changes
      if (value === 'GPU_HOSTING') {
        form.setFieldsValue({ promotional: false });
      } else if (value === 'VPS_HOSTING') {
        form.setFieldsValue({
          vpsType: 'WINDOWS_SERVER_VPS',
          promotional: undefined,
        });
      } else if (value === 'DEDICATED_SERVER') {
        form.setFieldsValue({
          serverType: 'SSD_SERVER',
          promotional: undefined,
        });
      }
    }
  };

  // Generate preview URLs for uploaded images
  const previewImage = useMemo(() => {
    if (fileList.length === 0) return null;

    const file = fileList[0];
    if (file.url) {
      return file.url;
    }
    if (file.originFileObj) {
      return URL.createObjectURL(file.originFileObj);
    }
    return null;
  }, [fileList]);

  const handleSubmit = (values: any) => {
    // Revoke object URLs before submitting
    if (previewImage && fileList[0]?.originFileObj) {
      URL.revokeObjectURL(previewImage);
    }

    const formData = {
      ...values,
      image: fileList.length > 0 ? fileList[0] : null,
    };
    onSubmit(formData);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      console.log(file, 'Prevent automatic upload');
      return false;
    },
    showUploadList: false,
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Add Service</h1>

      {/* <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues} className="max-w-4xl"> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        className="max-w-4xl"
      >
        <h1 className="text-xl font-medium mb-4">Upload Image</h1>
        <div className="rounded-xl flex items-start gap-6 max-w-2xl flex-wrap md:flex-nowrap">
          <Form.Item
            name="uploadMainImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: 'Main image is required' }]}
            className="w-full md:w-1/2"
          >
            <Upload
              {...uploadProps}
              fileList={form.getFieldValue('uploadMainImage')}
              onChange={({ fileList }) => {
                form.setFieldsValue({ uploadMainImage: fileList });
                if (fileList.length > 0 && fileList[0].originFileObj) {
                  setMainImage(URL.createObjectURL(fileList[0].originFileObj));
                } else if (fileList.length > 0 && fileList[0].url) {
                  setMainImage(fileList[0].url);
                } else {
                  setMainImage(null);
                }
              }}
            >
              <div className="border-2 border-dashed p-6 rounded-lg">
                {mainImage ? (
                  <div className="relative">
                    <button
                      className="absolute top-2 right-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainImage(null);
                        form.setFieldsValue({ uploadMainImage: [] });
                      }}
                    >
                      <RiDeleteBinLine className="size-6 text-red-600" />
                    </button>
                    <div
                      className="flex flex-col items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <Image
                        src={
                          typeof mainImage === 'string'
                            ? mainImage
                            : URL.createObjectURL(mainImage)
                        }
                        alt="Main Image"
                        height={200}
                        width={200}
                        className="object-cover"
                        preview={{
                          onVisibleChange: (visible, event) => {
                            if (visible && event) {
                              // event.stopPropagation()
                            }
                          },
                          mask: (
                            <div
                              onClick={(e) => {
                                // e.stopPropagation()
                              }}
                            >
                              Click to preview
                            </div>
                          ),
                        }}
                      />
                      <div className="mt-2">
                        <p className="font-semibold">Uploaded File</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-gray-300 p-6 h-40 text-center cursor-pointer w-full">
                    <div>
                      <BiSolidCloudUpload className="size-6" />
                    </div>
                    <p className="mt-2 text-base text-gray-600">
                      Drag and Drop files to Upload
                    </p>
                    <p className="text-sm font-medium text-gray-800">or</p>
                    <Button className="mt-2 bg-green-800 text-white hover:bg-green-700 rounded-3xl">
                      Browse
                    </Button>
                    <p className="text-xs mt-1 text-gray-400">
                      Supported files: PNG, JPG, JPEG
                    </p>
                  </div>
                )}
              </div>
            </Upload>
          </Form.Item>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-medium mb-4">Service details</h2>

          <Form.Item
            rules={[
              { required: true, message: 'Please select a package type' },
            ]}
            name="packageType"
            label="Select Package"
            className="mb-4"
          >
            <Select
              size="large"
              onChange={(value) => {
                setPackageType(value);
              }}
            >
              <Option value="GPU_HOSTING">GPU Server</Option>
              <Option value="VPS_HOSTING">VPS Hosting</Option>
              <Option value="DEDICATED_SERVER">Dedicated Server</Option>
            </Select>
          </Form.Item>

          {packageType === 'GPU_HOSTING' && (
            <Form.Item
              rules={[
                { required: true, message: 'Please select a service type' },
              ]}
              name="promotional"
              valuePropName="checked"
              className="mb-4"
            >
              <Checkbox>Promotional</Checkbox>
            </Form.Item>
          )}

          {packageType === 'VPS_HOSTING' && (
            <Form.Item
              rules={[{ required: true, message: 'Please select a VPS type' }]}
              name="vpsType"
              label="VPS Type"
              className="mb-4"
            >
              <Select size="large">
                <Option value="WINDOWS_DESKTOP_VPS">Windows Desktop VPS</Option>
                <Option value="WINDOWS_SERVER_VPS">Windows Server VPS</Option>
                <Option value="LINUX_VPS">Linux VPS</Option>
                <Option value="GPU_VPS">GPU VPS</Option>
              </Select>
            </Form.Item>
          )}

          {packageType === 'DEDICATED_SERVER' && (
            <Form.Item
              rules={[
                { required: true, message: 'Please select a server type' },
              ]}
              name="serverType"
              label="Server Type"
              className="mb-4"
            >
              <Select size="large">
                <Option value="NVME_SERVER">NVMe Server</Option>
                <Option value="SSD_SERVER">SSD Server</Option>
                <Option value="HDD_SERVER">HDD Server</Option>
                <Option value="RAID_SERVER">RAID Server</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            rules={[{ required: true, message: 'Service name is required' }]}
            name="serviceName"
            label="Service Name"
            className="mb-4"
          >
            <Input size="large" placeholder="Enter service name" />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: 'Per year price is required' }]}
            name="perYearPrice"
            label="Per Year Price"
            className="mb-4"
          >
            <Input size="large" placeholder="Enter price" prefix="$" />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: 'Per quarter price is required' },
            ]}
            name="perQuarterPrice"
            label="Per Quarter Price"
            className="mb-4"
          >
            <Input size="large" placeholder="Enter price" prefix="$" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Per month price is required' }]}
            name="perMonthPrice"
            label="Per Month Price"
            className="mb-4"
          >
            <Input size="large" placeholder="Enter price" prefix="$" />
          </Form.Item>

          <Form.Item label="Service Details" className="mb-4">
            <Form.List name="serviceDetails">
              {(fields, { add, remove }) => (
                <div className="border rounded-md p-4">
                  {fields.map(({ key, name }) => (
                    <div key={key} className="flex gap-4 mb-3">
                      <Form.Item
                        name={name}
                        rules={[{ required: true, message: 'Missing detail' }]}
                        className="mb-0 flex-1"
                      >
                        <Input
                          size="large"
                          placeholder="Enter service detail"
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(name)}
                          className="text-red-500 hover:text-red-700 cursor-pointer flex items-center"
                        >
                          <MinusCircleOutlined />
                        </button>
                      )}
                    </div>
                  ))}
                  <Form.Item className="mb-0">
                    <Button
                      onClick={() => add('')}
                      block
                      size="large"
                      className="border border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-500"
                    >
                      + Add detail
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: 'Please select a package status' },
            ]}
            name="packageStatus"
            label="Status"
            className="mb-4"
          >
            <Select size="large">
              <Option value="PUBLISHED">Published</Option>
              <Option value="UNPUBLISHED">Unpublished</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onCancel} className="h-10 px-6">
            Cancel
          </Button>
          <Button
            htmlType="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-6"
          >
            Publish Service
          </Button>
        </div>
      </Form>
    </div>
  );
}
