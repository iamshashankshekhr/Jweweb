import React, { useState } from 'react';
import { Card, Radio, Button, Typography, Space, Input, message } from 'antd';
import { ShoppingOutlined, WalletOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');
    const { getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handlePayment = () => {
        if (paymentMethod === 'upi' && !upiId) {
            message.error('Please enter a valid UPI ID');
            return;
        }

        // Mock payment processing
        setTimeout(() => {
            message.success('Order placed successfully!');
            clearCart();
            navigate('/');
        }, 1500);
    };

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40, fontFamily: 'Playfair Display, serif' }}>
                <ShoppingOutlined style={{ marginRight: 10, color: 'var(--primary-gold)' }} />
                Secure Checkout
            </Title>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                {/* Order Summary */}
                <Card title="Order Summary" bordered={false} style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text>Subtotal</Text>
                        <Text strong>₹{getCartTotal().toLocaleString('en-IN')}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text>Shipping</Text>
                        <Text type="success">Free</Text>
                    </div>
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                        <Title level={4}>Total</Title>
                        <Title level={4} style={{ color: 'var(--primary-gold)' }}>
                            ₹{getCartTotal().toLocaleString('en-IN')}
                        </Title>
                    </div>
                </Card>

                {/* Payment Options */}
                <Card title="Select Payment Method" bordered={false}>
                    <Radio.Group
                        onChange={e => setPaymentMethod(e.target.value)}
                        value={paymentMethod}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}
                    >
                        <Radio value="cod" style={{
                            border: `1px solid ${paymentMethod === 'cod' ? 'var(--primary-gold)' : '#d9d9d9'}`,
                            padding: 15,
                            borderRadius: 8,
                            transition: 'all 0.3s'
                        }}>
                            <Space>
                                <WalletOutlined style={{ fontSize: 24, color: 'var(--primary-gold)' }} />
                                <div>
                                    <Text strong>Cash on Delivery</Text>
                                    <div style={{ fontSize: 12, color: '#888' }}>Pay with cash upon delivery</div>
                                </div>
                            </Space>
                        </Radio>

                        <Radio value="upi" style={{
                            border: `1px solid ${paymentMethod === 'upi' ? 'var(--primary-gold)' : '#d9d9d9'}`,
                            padding: 15,
                            borderRadius: 8,
                            transition: 'all 0.3s'
                        }}>
                            <Space align="start">
                                <QrcodeOutlined style={{ fontSize: 24, color: 'var(--primary-gold)' }} />
                                <div>
                                    <Text strong>Pay by UPI ID</Text>
                                    <div style={{ fontSize: 12, color: '#888' }}>Google Pay, PhonePe, Paytm</div>
                                    {paymentMethod === 'upi' && (
                                        <Input
                                            placeholder="Enter UPI ID (e.g. user@bank)"
                                            style={{ marginTop: 10, width: 200 }}
                                            value={upiId}
                                            onChange={e => setUpiId(e.target.value)}
                                        />
                                    )}
                                </div>
                            </Space>
                        </Radio>
                    </Radio.Group>

                    <Button
                        type="primary"
                        size="large"
                        block
                        style={{ marginTop: 30, height: 50, fontSize: 16 }}
                        onClick={handlePayment}
                    >
                        Confirm Order
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default Payment;
