'use client';
import {
  useConfirmOrderMutation,
  useGetOrderDetailsQuery,
} from '@/redux/features/order/orderApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { Check, Eye, EyeOff } from 'lucide-react';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ServerOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function ServerOrderModal({
  isOpen,
  onClose,
  id,
}: ServerOrderModalProps) {
  const { data, isLoading } = useGetOrderDetailsQuery(id, {
    skip: !id,
  });
  const [form] = Form.useForm();

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [confirmOrderMutation] = useConfirmOrderMutation();

  // Reset form when modal closes or when data changes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    } else if (data?.data?.order) {
      // Initialize form values when data is loaded
      form.setFieldsValue({
        primaryIp: data.data.order.primaryIp || '',
        accessPort: data.data.order.accessPort || '',
        // Do not prefill username from order's hostname; admin should set actual login username
        loginName: '',
        loginPassword: data.data.order.rootPassword || '',
        operatingSystem: data.data.order.operatingSystem || '',
      });
    }
  }, [isOpen, form, data]);

  const handleSubmit = async () => {
    try {
      // This will throw an error if validation fails
      const values = await form.validateFields();

      // If validation passes, proceed with submission
      const response = await handleAsyncWithToast(async () => {
        return confirmOrderMutation({
          id,
          formData: { ...values, isCreate: !orderId },
        });
      });

      if (response?.data?.success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      // Ant Design automatically shows validation errors on the form fields
      // So we don't need to manually handle them here
      console.log('Form validation or submission error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      forceRender
      width={900}
      centered
      title={data?.data?.order?.package?.serviceName}
      className="server-order-modal"
    >
      <div>
        <h3 className="text-center text-3xl font-semibold">
          {data?.data?.order?.package?.serviceName}
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4 mt-4 w-fit mx-auto">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              <span className="font-semibold pe-2">Sender Name 1:</span>
              {data?.data?.order?.user?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              <span className="font-semibold pe-2">Contact Number:</span>
              {data?.data?.order?.user?.number}
            </span>
          </div>
        </div>
      </div>

      {/* Server Specifications */}
      <div className="border rounded-md p-4 mb-6">
        <h3 className="font-semibold mb-3 text-lg">
          {data?.data?.order?.package?.serviceName}
        </h3>
        <ul className="space-y-2">
          {data?.data?.order?.package?.serviceDetails?.map(
            (spec: any, index: number) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600">{spec}</span>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Invoice Section */}
      <div className="border rounded-md p-4">
        <div className="bg-[#f6f6f6] rounded-md p-4 mb-5">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">New Invoice</h3>
            <div className="text-right">
              <div className="text-sm">Invoice No.</div>
              <div className="font-medium">{data?.data?.order?.orderId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Billed to:</div>
              <div className="font-medium">{data?.data?.order?.user?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Billed by:</div>
              <div className="font-medium">{data?.data?.order?.user?.name}</div>

              <div className="text-sm text-gray-500 mt-2">
                Issued on
                <span className="ml-1 font-medium">
                  {moment(data?.data?.order?.createdAt).format('YYYY-MM-DD')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm ms-1 mb-2">Name</div>
            <div className="text-sm text-gray-900 bg-gray-100 p-3 rounded-md">
              {data?.data?.order?.user?.name}
            </div>
          </div>
          <div>
            <div className="text-sm ms-1 mb-2">Service Name</div>
            <div className="text-sm text-gray-900 bg-gray-100 p-3 rounded-md">
              {data?.data?.order?.package?.packageType}
            </div>
          </div>
          <div>
            <div className="text-sm ms-1 mb-2">Amount</div>
            <div className="text-sm text-gray-900 bg-gray-100 p-3 rounded-md">
              $ {data?.data?.order?.amount}
            </div>
          </div>
          <div>
            <div className="text-sm ms-1 mb-2">Payment Method</div>
            <div className="text-sm text-gray-900 bg-gray-100 p-3 rounded-md">
              Stripe
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-md mt-5 p-4">
        <Form
          form={form}
          layout="vertical"
          size="small"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
            <Form.Item
              label="Primary IP"
              name="primaryIp"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input placeholder="000.000.0.0" size="large" />
            </Form.Item>
            <Form.Item
              label="Access Port"
              name="accessPort"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input placeholder="0000" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
            <Form.Item
              label="Username"
              name="loginName"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input placeholder="administrator" size="large" />
            </Form.Item>
            <Form.Item
              label="Login Password"
              name="loginPassword"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                suffix={
                  showPassword ? (
                    <EyeOff
                      className="h-4 w-4 cursor-pointer text-gray-400"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4 cursor-pointer text-gray-400"
                      onClick={togglePasswordVisibility}
                    />
                  )
                }
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Operating System"
            name="operatingSystem"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input placeholder="Windows 10 Pro" size="large" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}