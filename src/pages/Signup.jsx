
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await signUp(values.email, values.password, { full_name: values.fullName });
            if (error) throw error;
            message.success('Registration successful! Please check your email for verification.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            background: 'var(--rich-cream)'
        }}>
            <Card
                style={{
                    width: 450,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: '#EFEFEF'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: 'var(--primary-gold)', marginBottom: 8 }}>Create Account</Title>
                    <Text type="secondary">Join us for an exclusive experience</Text>
                </div>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form
                    name="signup"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    scrollToFirstError
                >
                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your Full Name!', whitespace: true }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder="Full Name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { type: 'email', message: 'The input is not valid E-mail!' },
                            { required: true, message: 'Please input your E-mail!' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters.' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Register
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Text>Already have an account? </Text>
                        <Link to="/login" style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>Log in</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Signup;
