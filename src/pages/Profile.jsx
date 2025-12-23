
import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Upload, message, Typography, Divider, Modal, Form, Input, List, Empty } from 'antd';
import { UserOutlined, UploadOutlined, EditOutlined, HeartFilled, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
    const { user } = useAuth();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null);

    // Edit Details State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();
    const [userDetails, setUserDetails] = useState({
        fullName: user?.user_metadata?.full_name || '',
        phone: user?.user_metadata?.phone || '',
        address: user?.user_metadata?.address || ''
    });

    useEffect(() => {
        if (user) {
            setAvatarUrl(user.user_metadata?.avatar_url);
            setUserDetails({
                fullName: user.user_metadata?.full_name || '',
                phone: user.user_metadata?.phone || '',
                address: user.user_metadata?.address || ''
            });
        }
    }, [user]);

    const handleUpload = async (file) => {
        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `avatars/${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            // 3. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            message.success('Profile photo updated successfully!');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            message.error('Failed to update profile photo.');
        } finally {
            setLoading(false);
        }
        return false; // Prevent default upload behavior
    };

    const handleEditDetails = () => {
        form.setFieldsValue({
            full_name: userDetails.fullName,
            phone: userDetails.phone,
            address: userDetails.address
        });
        setIsModalVisible(true);
    };

    const handleSaveDetails = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: values.full_name,
                    phone: values.phone,
                    address: values.address
                }
            });

            if (error) throw error;

            setUserDetails({
                fullName: values.full_name,
                phone: values.phone,
                address: values.address
            });

            message.success('Profile details updated!');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error updating details:', error);
            message.error('Failed to update details');
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <div style={{ padding: 50, textAlign: 'center' }}>Please log in to view your profile.</div>;

    return (
        <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 20px' }}>
            <Card style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>My Profile</Title>
                    <Button icon={<EditOutlined />} onClick={handleEditDetails}>Edit Details</Button>
                </div>
                <Divider />

                <div style={{ marginBottom: 30 }}>
                    <Avatar
                        size={120}
                        src={avatarUrl}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: 'var(--primary-gold)', marginBottom: 20 }}
                    />
                    <div>
                        <Upload
                            showUploadList={false}
                            beforeUpload={handleUpload}
                            accept="image/*"
                            disabled={loading}
                        >
                            <Button icon={<UploadOutlined />} loading={loading} type="primary">
                                {loading ? 'Uploading...' : 'Change Photo'}
                            </Button>
                        </Upload>
                    </div>
                </div>

                <div style={{ textAlign: 'left', marginTop: 40 }}>
                    <Text type="secondary">Email Address</Text>
                    <Title level={4} style={{ marginTop: 5 }}>{user.email}</Title>

                    <Text type="secondary" style={{ display: 'block', marginTop: 20 }}>User ID</Text>
                    <Text strong>{user.id}</Text>

                    <Divider />

                    <Text type="secondary" style={{ display: 'block', marginTop: 20 }}>Full Name</Text>
                    <Title level={4} style={{ marginTop: 5 }}>{userDetails.fullName || <Text type="secondary" italic>Not set</Text>}</Title>

                    <Text type="secondary" style={{ display: 'block', marginTop: 20 }}>Phone Number</Text>
                    <Title level={4} style={{ marginTop: 5 }}>{userDetails.phone || <Text type="secondary" italic>Not set</Text>}</Title>

                    <Text type="secondary" style={{ display: 'block', marginTop: 20 }}>Address</Text>
                    <Title level={5} style={{ marginTop: 5 }}>{userDetails.address || <Text type="secondary" italic>Not set</Text>}</Title>
                </div>
            </Card>

            {/* Wishlist Section */}
            <Card style={{ marginTop: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={3} style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>
                        <HeartFilled style={{ color: '#ff4d4f', marginRight: 10 }} />
                        My Wishlist
                    </Title>
                    <Text type="secondary">{wishlistItems.length} items</Text>
                </div>

                {wishlistItems.length === 0 ? (
                    <Empty description="Your wishlist is empty">
                        <Link to="/categories">
                            <Button type="primary">Start Shopping</Button>
                        </Link>
                    </Empty>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={wishlistItems}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => {
                                            addToCart(item);
                                            message.success(`Added ${item.name} to cart!`);
                                        }}
                                    >
                                        Add to Cart
                                    </Button>,
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            removeFromWishlist(item.id);
                                            message.success(`Removed ${item.name} from wishlist`);
                                        }}
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <img
                                            src={item.image || 'https://via.placeholder.com/60'}
                                            alt={item.name}
                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    }
                                    title={<Link to={`/product/${item.id}`}>{item.name}</Link>}
                                    description={
                                        <Text strong style={{ color: 'var(--primary-gold)' }}>
                                            ₹{item.price?.toLocaleString('en-IN')}
                                        </Text>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Modal
                title="Edit Profile Details"
                open={isModalVisible}
                onOk={handleSaveDetails}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={saving}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="full_name" label="Full Name">
                        <Input placeholder="Enter your full name" />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number">
                        <Input placeholder="Enter user phone number" />
                    </Form.Item>
                    <Form.Item name="address" label="Address">
                        <Input.TextArea rows={3} placeholder="Enter your address" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
