
import React, { useState, useEffect } from 'react';
import { List, Card, Button, Modal, Form, Input, Upload, message, Switch, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { supabase } from '../../supabaseClient';

const { Meta } = Card;

const AdminPosters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    const fetchPosters = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('posters').select('*').order('created_at', { ascending: false });
        if (error) message.error('Error fetching posters');
        else setPosters(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosters();
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

    const handleAdd = () => {
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

            if (!imageUrl) {
                message.error('Please provide an image URL or upload a file');
                setUploading(false);
                return;
            }

            const { error } = await supabase.from('posters').insert([{
                title: values.title,
                image: imageUrl,
                active: true
            }]);

            if (error) {
                message.error('Failed to add poster');
            } else {
                message.success('Poster added');
                setIsModalVisible(false);
                form.resetFields();
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
                title="Add New Poster"
                open={isModalVisible}
                onOk={handleAdd}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={uploading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Title (Optional)">
                        <Input />
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
