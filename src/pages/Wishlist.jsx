import React from 'react';
import { Card, Button, Typography, List, Empty, message } from 'antd';
import { HeartFilled, DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
            <Link to="/categories" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '30px', color: 'var(--luxury-black)' }}>
                <ArrowLeftOutlined style={{ marginRight: '8px' }} /> Continue Shopping
            </Link>

            <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                    <Title level={2} style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>
                        <HeartFilled style={{ color: '#ff4d4f', marginRight: 12 }} />
                        My Wishlist
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>{wishlistItems.length} items</Text>
                </div>

                {wishlistItems.length === 0 ? (
                    <Empty
                        description="Your wishlist is empty"
                        style={{ padding: '60px 0' }}
                    >
                        <Link to="/categories">
                            <Button type="primary" size="large">Start Shopping</Button>
                        </Link>
                    </Empty>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={wishlistItems}
                        renderItem={(item) => (
                            <List.Item
                                style={{ padding: '20px 0' }}
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
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
                                        size="large"
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
                                            src={item.image || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    }
                                    title={
                                        <Link to={`/product/${item.id}`} style={{ fontSize: 18 }}>
                                            {item.name}
                                        </Link>
                                    }
                                    description={
                                        <div>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>{item.category}</Text>
                                            <Title level={4} style={{ color: 'var(--primary-gold)', margin: 0 }}>
                                                ₹{item.price?.toLocaleString('en-IN')}
                                            </Title>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};

export default Wishlist;
