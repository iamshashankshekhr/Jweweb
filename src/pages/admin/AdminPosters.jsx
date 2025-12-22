
import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Form, Input, Upload, message, Switch, Typography, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import { supabase } from '../../supabaseClient';

const { Meta } = Card;

const AdminPosters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    const [editingPoster, setEditingPoster] = useState(null);
    const [availableCategories, setAvailableCategories] = useState([]);

    const fetchPosters = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('posters').select('*').order('created_at', { ascending: false });
        if (error) message.error('Error fetching posters');
        else setPosters(data);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('products').select('category');
        if (!error && data) {
            const uniqueCats = [...new Set(data.map(item => item.category))];
            setAvailableCategories(uniqueCats);
        }
    };

    useEffect(() => {
        fetchPosters();
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this poster?')) {
            const { error } = await supabase.from('posters').delete().eq('id', id);
            if (error) message.error('Failed to delete');
            else {
                message.success('Deleted');
                fetchPosters();
            }
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        const { error } = await supabase.from('posters').update({ active: !currentStatus }).eq('id', id);
        if (error) message.error('Failed to update status');
        else fetchPosters();
    };

    const handleEdit = (poster) => {
        setEditingPoster(poster);
        form.setFieldsValue({
            title: poster.title,
            target_link: poster.target_link,
            image_url: poster.image
        });
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setEditingPoster(null);
        form.resetFields();
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            setUploading(true);
            let imageUrl = values.image_url;

            if (values.upload && values.upload[0]) {
                const file = values.upload[0].originFileObj;
                const fileExt = file.name.split('.').pop();
                const fileName = `posters/${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

                if (uploadError) {
                    message.error('Image upload failed');
                    setUploading(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                imageUrl = publicUrl;
            }

            // If editing and no new image provided, keep old one
            if (editingPoster && !imageUrl) {
                imageUrl = editingPoster.image;
            }

            if (!imageUrl) {
                message.error('Please provide an image URL or upload a file');
                setUploading(false);
                return;
            }

            let error;
            if (editingPoster) {
                const { error: updateError } = await supabase.from('posters').update({
                    title: values.title,
                    target_link: values.target_link,
                    image: imageUrl
                }).eq('id', editingPoster.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('posters').insert([{
                    title: values.title,
                    target_link: values.target_link,
                    image: imageUrl,
                    active: true
                }]);
                error = insertError;
            }

            if (error) {
                message.error(editingPoster ? 'Failed to update poster' : 'Failed to add poster');
            } else {
                message.success(editingPoster ? 'Poster updated' : 'Poster added');
                handleModalCancel();
                fetchPosters();
            }
            setUploading(false);
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Promotional Posters</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                    Add Poster
                </Button>
            </div>

            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={posters}
                loading={loading}
                renderItem={item => (
                    <List.Item>
                        <Card
                            cover={<img alt={item.title} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
                            actions={[
                                <EditOutlined key="edit" onClick={() => handleEdit(item)} />,
                                <Switch
                                    checked={item.active}
                                    onChange={() => handleToggleActive(item.id, item.active)}
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />,
                                <DeleteOutlined key="delete" style={{ color: 'red' }} onClick={() => handleDelete(item.id)} />
                            ]}
                        >
                            <Meta title={item.title || 'Untitled'} description={item.active ? 'Active' : 'Hidden'} />
                        </Card>
                    </List.Item>
                )}
            />

            <Modal
                title={editingPoster ? "Edit Poster" : "Add New Poster"}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={handleModalCancel}
                confirmLoading={uploading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Title (Optional)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="target_link" label="Target Link (Select Destination)">
                        <Select placeholder="Select a page or category" allowClear showSearch>
                            <Select.OptGroup label="Pages">
                                <Select.Option value="/">Home Page</Select.Option>
                                <Select.Option value="/categories">All Products (Shop)</Select.Option>
                                <Select.Option value="/profile">User Profile</Select.Option>
                            </Select.OptGroup>
                            <Select.OptGroup label="Shop Collections">
                                {availableCategories.map(cat => (
                                    <Select.Option key={cat} value={`/categories?category=${encodeURIComponent(cat)}`}>
                                        {cat} Collection
                                    </Select.Option>
                                ))}
                            </Select.OptGroup>
                        </Select>
                    </Form.Item>
                    <Form.Item name="image_url" label="Image URL (Optional)">
                        <Input placeholder="Or upload below" />
                    </Form.Item>
                    <Form.Item name="upload" label="Upload Image" valuePropName="fileList" getValueFromEvent={(e) => {
                        if (Array.isArray(e)) return e;
                        return e && e.fileList;
                    }}>
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminPosters;
