import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Typography, Button, Divider, Rate, Tag, Breadcrumb, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined, ShareAltOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const { Title, Text, Paragraph } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                message.error('Product not found or error loading details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        message.success(`Added ${product.name} to cart!`);
    };

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out this ${product.name} on Jewelry Shop!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                message.success('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading details...</div>;
    if (!product) return <div style={{ padding: '50px', textAlign: 'center' }}>Product not found. <Link to="/categories">Go back to shop</Link></div>;

    return (
        <div style={{ padding: '40px 50px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/categories">Categories</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
                <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Link to="/categories" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '30px', color: 'var(--luxury-black)' }}>
                <ArrowLeftOutlined style={{ marginRight: '8px' }} /> Back to Collection
            </Link>

            <Row gutter={[60, 40]}>
                {/* Product Image */}
                <Col xs={24} md={12}>
                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '2px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        textAlign: 'center'
                    }}>
                        <img
                            src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'}
                            alt={product.name}
                            style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
                        />
                    </div>
                </Col>

                {/* Product Info */}
                <Col xs={24} md={12}>
                    <Tag color="gold" style={{ marginBottom: '10px' }}>{product.category}</Tag>
                    <Title level={1} style={{ fontFamily: "'Playfair Display', serif", margin: '0 0 10px 0', color: 'var(--luxury-black)' }}>
                        {product.name}
                    </Title>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <Rate disabled defaultValue={product.rating || 4.5} style={{ color: 'var(--primary-gold)', fontSize: '14px', marginRight: '10px' }} />
                        <Text type="secondary">(24 Reviews)</Text>
                    </div>

                    <Title level={2} style={{ color: 'var(--primary-gold)', margin: '0 0 30px 0' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </Title>

                    <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#555', marginBottom: '40px' }}>
                        {product.description || "Experience the elegance of this handcrafted piece, designed to bring out the royal charm in you. Made with precision and passion, it's perfect for every special occasion."}
                    </Paragraph>

                    <Divider />

                    <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            style={{
                                height: '50px',
                                padding: '0 40px',
                                fontSize: '16px',
                                background: 'var(--primary-gold)',
                                borderColor: 'var(--primary-gold)'
                            }}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            size="large"
                            icon={product && isInWishlist(product.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                            style={{
                                height: '50px',
                                fontSize: '16px'
                            }}
                            onClick={() => {
                                const added = toggleWishlist(product);
                                message.success(added ? `Added ${product.name} to wishlist!` : `Removed ${product.name} from wishlist`);
                            }}
                        >
                            {product && isInWishlist(product.id) ? 'Wishlisted' : 'Wishlist'}
                        </Button>
                        <Button
                            size="large"
                            icon={<ShareAltOutlined />}
                            onClick={handleShare}
                            style={{
                                height: '50px',
                                fontSize: '16px'
                            }}
                        >
                            Share
                        </Button>
                    </div>

                    <div style={{ marginTop: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '4px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '10px' }}>Product Details:</Text>
                        <ul style={{ paddingLeft: '20px', margin: 0, color: '#666' }}>
                            <li style={{ marginBottom: '5px' }}>Material: 22K Gold / Premium Alloy</li>
                            <li style={{ marginBottom: '5px' }}>Certified by: Hallmark</li>
                            <li style={{ marginBottom: '5px' }}>Warranty: Lifetime Polish</li>
                            <li>Stock Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetails;
