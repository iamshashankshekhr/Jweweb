
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, message, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // New state for Admin Mode
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await signIn(values.email, values.password);
            if (error) throw error;
            message.success(isAdmin ? 'Welcome, Admin!' : 'Welcome back!');
            navigate(isAdmin ? '/admin' : '/'); // Optional: Redirect admins to dashboard
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
                    width: 400,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: isAdmin ? 'var(--primary-gold)' : '#EFEFEF', // Gold border for admin mode
                    borderWidth: isAdmin ? '2px' : '1px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: 'var(--primary-gold)', marginBottom: 8 }}>
                        {isAdmin ? 'Admin Portal' : 'Welcome Back'}
                    </Title>
                    <Text type="secondary">
                        {isAdmin ? 'Secure login for store managers' : 'Sign in to your account'}
                    </Text>
                </div>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder={isAdmin ? "Admin Email" : "Email"}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={isAdmin ? <SafetyCertificateOutlined style={{ color: 'var(--primary-gold)' }} /> : <LockOutlined style={{ color: 'var(--primary-gold)' }} />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a style={{ color: 'var(--primary-gold)' }} href="">
                            Forgot password?
                        </a>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {isAdmin ? 'Log in as Admin' : 'Log in'}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        {!isAdmin ? (
                            <>
                                <Text>Don't have an account? </Text>
                                <Link to="/signup" style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>Sign up</Link>
                                <Divider style={{ margin: '12px 0' }}><Text type="secondary" style={{ fontSize: 12 }}>OR</Text></Divider>
                                <Button type="link" onClick={() => setIsAdmin(true)} style={{ color: 'var(--luxury-black)' }}>
                                    Log in as Admin
                                </Button>
                            </>
                        ) : (
                            <Button type="link" onClick={() => setIsAdmin(false)} style={{ color: 'var(--luxury-black)' }}>
                                ← Back to Customer Login
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
