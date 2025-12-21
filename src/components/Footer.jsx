
import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { InstagramOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
    return (
        <AntFooter style={{ background: '#2C2C2C', color: '#FAF9F6', padding: '60px 50px' }}>
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={12} md={6}>
                    <Title level={4} style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>Jewelry Shop</Title>
                    <Text style={{ color: '#ddd' }}>
                        Discover the finest collection of premium jewelry, crafted with elegance and passion.
                    </Text>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Quick Links</Title>
                    <Space direction="vertical">
                        <Link to="/" style={{ color: '#bbb' }}>Home</Link>
                        <Link to="/categories" style={{ color: '#bbb' }}>Categories</Link>
                        <Link to="/try-at-home" style={{ color: '#bbb' }}>Try at Home</Link>
                        <Link to="/about" style={{ color: '#bbb' }}>About Us</Link>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Support</Title>
                    <Space direction="vertical">
                        <Link to="/contact" style={{ color: '#bbb' }}>Contact Us</Link>
                        <Link to="/faq" style={{ color: '#bbb' }}>FAQ</Link>
                        <Link to="/shipping" style={{ color: '#bbb' }}>Shipping & Returns</Link>
                        <Link to="/privacy" style={{ color: '#bbb' }}>Privacy Policy</Link>
                    </Space>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Follow Us</Title>
                    <Space size="large">
                        <InstagramOutlined style={{ fontSize: '24px', color: '#D4AF37', cursor: 'pointer' }} />
                        <FacebookOutlined style={{ fontSize: '24px', color: '#D4AF37', cursor: 'pointer' }} />
                        <TwitterOutlined style={{ fontSize: '24px', color: '#D4AF37', cursor: 'pointer' }} />
                    </Space>
                </Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #444', paddingTop: '20px', color: '#888' }}>
                © {new Date().getFullYear()} Jewelry Shop. All Rights Reserved.
            </div>
        </AntFooter>
    );
};

export default Footer;
