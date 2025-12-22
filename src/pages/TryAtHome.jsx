
import React, { useState } from 'react';
import { Typography, Form, Input, DatePicker, TimePicker, Button, Row, Col, message, Card } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const TryAtHome = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // For now, we'll just simulate a successful booking or insert into a table if it exists
            // Ideally, you'd have an 'appointments' table in Supabase
            // const { error } = await supabase.from('appointments').insert([ ... ]);

            console.log('Success:', values);

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            message.success('Appointment booked successfully! We will contact you shortly.');
            form.resetFields();
        } catch (error) {
            console.error('Failed:', error);
            message.error('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '60px 50px', minHeight: '80vh', background: '#fafafa' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <Title level={1} style={{ fontFamily: "'Playfair Display', serif", color: 'var(--luxury-black)' }}>
                    Try at Home
                </Title>
                <Paragraph style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto', color: '#666' }}>
                    Experience our exquisite jewelry in the comfort of your home. Book a free appointment with our jewelry consultants.
                </Paragraph>
            </div>

            <Row justify="center">
                <Col xs={24} md={16} lg={12}>
                    <Card style={{ padding: '20px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Title level={3} style={{ textAlign: 'center', marginBottom: '30px', fontFamily: "'Playfair Display', serif" }}>
                            Book Your Appointment
                        </Title>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        rules={[{ required: true, message: 'Please input your name!' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="address"
                                rules={[{ required: true, message: 'Please input your address!' }]}
                            >
                                <TextArea rows={3} placeholder="Full Address (Street, City, Zip Code)" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="date"
                                        rules={[{ required: true, message: 'Please select a date!' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Select Date" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="time"
                                        rules={[{ required: true, message: 'Please select a time!' }]}
                                    >
                                        <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="Select Time" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="notes">
                                <TextArea rows={2} placeholder="Any specific jewelry types you are interested in? (e.g. Rings, Necklaces)" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    style={{
                                        height: '50px',
                                        fontSize: '18px',
                                        background: 'var(--primary-gold)',
                                        borderColor: 'var(--primary-gold)'
                                    }}
                                >
                                    Confirm Booking
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TryAtHome;
