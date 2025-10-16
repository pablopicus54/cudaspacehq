"use client";
import { Modal, Form, InputNumber, DatePicker, Input, Button } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useExtendPeriodEndMutation } from '@/redux/features/order/orderApi';

interface ExtendTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // expects at least { id, orderId, currentPeriodEnd }
}

export default function ExtendTimeModal({ isOpen, onClose, order }: ExtendTimeModalProps) {
  const [form] = Form.useForm();
  const [extendPeriodEnd] = useExtendPeriodEndMutation();

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    } else if (order) {
      form.setFieldsValue({
        extendDays: undefined,
        newEndDate: order.currentPeriodEnd ? moment(order.currentPeriodEnd) : undefined,
        reason: '',
      });
    }
  }, [isOpen, order, form]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: { extendDays?: number; newEndDate?: string; reason?: string } = {};
      if (values.extendDays) {
        payload.extendDays = Number(values.extendDays);
      }
      if (values.newEndDate) {
        payload.newEndDate = values.newEndDate.toISOString();
      }
      if (values.reason) {
        payload.reason = values.reason;
      }

      const response = await handleAsyncWithToast(async () => {
        return extendPeriodEnd({ id: order.id, payload });
      });

      if (response?.data?.success) {
        form.resetFields();
        onClose();
      }
    } catch (e) {
      // AntD will surface form validation messages automatically
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title={`Extend/Set Expiration — ${order?.orderId || ''}`} centered>
      <Form form={form} layout="vertical">
        <Form.Item label="Extend by days" name="extendDays" rules={[{ type: 'number', min: 1, message: 'Enter at least 1 day' }]}> 
          <InputNumber placeholder="e.g. 7" min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Or set new end date" name="newEndDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Reason (optional)" name="reason">
          <Input placeholder="Note for audit" />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSubmit}>Save</Button>
        </div>
      </Form>
    </Modal>
  );
}