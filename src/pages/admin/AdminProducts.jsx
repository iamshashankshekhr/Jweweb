
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { supabase } from '../../supabaseClient';

const { TextArea } = Input;
const { Option } = Select;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) {
            message.error('Error fetching products');
        } else {
            setProducts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        // Ideally show confirm dialog
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) message.error('Failed to delete');
            else {
                message.success('Deleted successfully');
                fetchProducts();
            }
        }
    };

    const handleAddEdit = () => {
        form.validateFields().then(async (values) => {
            setUploading(true);
            let imageUrl = values.image;

            // Handle Image Upload Logic if it's a file object (this example assumes direct URL or handled elsewhere for simplicity first)
            // Ideally we upload to bucket here. Let's implementing basic upload if a file is present.
            if (values.upload && values.upload[0]) {
                const file = values.upload[0].originFileObj;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

                if (uploadError) {
                    message.error('Image upload failed');
                    setUploading(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            const productData = {
                name: values.name,
                price: values.price,
                category: values.category,
                description: values.description,
                image: imageUrl, // or values.image_url if manually entered
                stock: values.stock
            };

            let error;
            if (editingProduct) {
                const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('products').insert([productData]);
                error = insertError;
            }

            if (error) {
                message.error('Operation failed: ' + error.message);
            } else {
                message.success(editingProduct ? 'Product updated' : 'Product added');
                setIsModalVisible(false);
                form.resetFields();
                setEditingProduct(null);
                fetchProducts();
            }
            setUploading(false);
        });
    };

    const columns = [
        { title: 'Image', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} /> },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `₹${price}` },
        { title: 'Stock', dataIndex: 'stock', key: 'stock' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingProduct(record); form.setFieldsValue(record); setIsModalVisible(true); }} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Product Inventory</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingProduct(null); form.resetFields(); setIsModalVisible(true); }}>
                    Add Product
                </Button>
            </div>

            <Table dataSource={products} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title={editingProduct ? "Edit Product" : "Add New Product"}
                open={isModalVisible}
                onOk={handleAddEdit}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={uploading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Rings">Rings</Option>
                            <Option value="Necklaces">Necklaces</Option>
                            <Option value="Earrings">Earrings</Option>
                            <Option value="Bangles">Bangles</Option>
                            <Option value="Bracelets">Bracelets</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="image" label="Image URL (Optional)">
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

export default AdminProducts;
