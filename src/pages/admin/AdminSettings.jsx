import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Divider, message, Space } from 'antd';
import { SettingOutlined, ShopOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useShopSettings } from '../../context/ShopSettingsContext';

const { Title, Text } = Typography;

const AdminSettings = () => {
    const { settings, updateSettings, resetSettings } = useShopSettings();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            shopName: settings.shopName,
            tagline: settings.tagline
        });
    }, [settings, form]);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            updateSettings(values);
            message.success('Settings saved successfully!');
        } catch (error) {
            message.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        resetSettings();
        form.setFieldsValue({
            shopName: 'Jewelry Shop',
            tagline: 'Exquisite Jewelry for Every Occasion'
        });
        message.info('Settings reset to defaults');
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: 30 }}>
                <Title level={3} style={{ margin: 0 }}>
                    <SettingOutlined style={{ marginRight: 10, color: 'var(--primary-gold)' }} />
                    Shop Settings
                </Title>
                <Text type="secondary">Configure your shop's basic information</Text>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={{
                        shopName: settings.shopName,
                        tagline: settings.tagline
                    }}
                >
                    <Form.Item
                        name="shopName"
                        label={
                            <span>
                                <ShopOutlined style={{ marginRight: 8 }} />
                                Shop Name
                            </span>
                        }
                        rules={[{ required: true, message: 'Please enter shop name' }]}
                    >
                        <Input
                            placeholder="Enter your shop name"
                            size="large"
                            style={{ fontSize: 18 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="tagline"
                        label="Tagline / Slogan"
                    >
                        <Input
                            placeholder="Enter your shop tagline"
                            size="large"
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                                size="large"
                            >
                                Save Settings
                            </Button>
                            <Button
                                icon={<UndoOutlined />}
                                onClick={handleReset}
                                size="large"
                            >
                                Reset to Defaults
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card style={{ marginTop: 20, background: '#f9f9f9' }}>
                <Title level={5}>Preview</Title>
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Title
                        level={2}
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--primary-gold)',
                            margin: 0
                        }}
                    >
                        {settings.shopName}
                    </Title>
                    <Text type="secondary">{settings.tagline}</Text>
                </div>
            </Card>
        </div>
    );
};

export default AdminSettings;
