import React, { useState } from 'react';
import { Card, Button, Typography, Rate, Badge, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Meta } = Card;
const { Text, Title } = Typography;

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        message.success(`Added ${product.name} to cart!`);
    };

    return (
        <Card
            hoverable
            style={{
                width: '100%',
                borderRadius: '2px',
                borderColor: isHovered ? 'var(--primary-gold)' : '#f0f0f0',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
            }}
            cover={
                <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                    <Link to={`/product/${product.id}`}>
                        <img
                            alt={product.name}
                            src={product.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.5s ease'
                            }}
                        />
                    </Link>
                    {/* Wishlist Button Overlay */}
                    <Button
                        shape="circle"
                        icon={isWishlisted ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                    />
                </div>
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {product.category}
                </Text>
                <Title level={5} style={{ margin: '5px 0', fontFamily: "'Playfair Display', serif" }}>
                    {product.name}
                </Title>
                <div style={{ marginBottom: '10px' }}>
                    <Rate disabled defaultValue={product.rating} style={{ fontSize: '12px', color: 'var(--primary-gold)' }} />
                </div>
                <Title level={4} style={{ color: 'var(--luxury-black)', margin: '0 0 15px 0' }}>
                    {product.currency}{product.price.toLocaleString()}
                </Title>

                <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    style={{
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        background: 'var(--luxury-black)',
                        borderColor: 'var(--luxury-black)',
                        height: '40px'
                    }}
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
