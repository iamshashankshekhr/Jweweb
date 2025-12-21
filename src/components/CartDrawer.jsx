
import React from 'react';
import { Drawer, List, Button, Typography, InputNumber, Empty, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CartDrawer = ({ open, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingOutlined style={{ color: 'var(--primary-gold)' }} />
                    <span>Your Cart</span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={400}
            footer={
                cartItems.length > 0 && (
                    <div style={{ padding: '10px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <Text strong style={{ fontSize: '16px' }}>Total:</Text>
                            <Title level={4} style={{ margin: 0, color: 'var(--primary-gold)' }}>
                                ₹{getCartTotal().toLocaleString('en-IN')}
                            </Title>
                        </div>
                        <Button type="primary" block size="large" style={{ marginBottom: '10px' }}>
                            Proceed to Checkout
                        </Button>
                        <Button block onClick={clearCart}>
                            Clear Cart
                        </Button>
                    </div>
                )
            }
        >
            {cartItems.length === 0 ? (
                <Empty
                    description="Your cart is empty"
                    style={{ marginTop: '50px' }}
                >
                    <Link to="/categories">
                        <Button type="primary">Start Shopping</Button>
                    </Link>
                </Empty>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFromCart(item.product.id)}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <img
                                        src={item.product.image || 'https://via.placeholder.com/60'}
                                        alt={item.product.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                }
                                title={
                                    <Link to={`/product/${item.product.id}`} onClick={onClose}>
                                        {item.product.name}
                                    </Link>
                                }
                                description={
                                    <div>
                                        <Text strong style={{ color: 'var(--primary-gold)' }}>
                                            ₹{item.product.price.toLocaleString('en-IN')}
                                        </Text>
                                        <div style={{ marginTop: '8px' }}>
                                            <InputNumber
                                                min={1}
                                                max={99}
                                                value={item.quantity}
                                                onChange={(value) => updateQuantity(item.product.id, value)}
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Drawer>
    );
};

export default CartDrawer;
