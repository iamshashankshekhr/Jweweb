
import React, { useState } from 'react';
import { Layout, Menu, Input, Badge, Button, Dropdown, Avatar } from 'antd';
import { SearchOutlined, HeartOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined, ProfileOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const { Header } = Layout;

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const menuItems = [
        { key: 'profile', icon: <ProfileOutlined />, label: <Link to="/profile">My Profile</Link> },
        { key: 'orders', icon: <ShoppingOutlined />, label: 'My Orders' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout, danger: true },
    ];

    return (
        <>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--rich-cream)',
                    padding: '0 50px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: '80px',
                }}
            >
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--primary-gold)',
                            fontSize: '28px',
                            margin: 0,
                            fontWeight: 700,
                            letterSpacing: '1px'
                        }}>
                            Jewelry Shop
                        </h1>
                    </Link>
                </div>

                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['home']}
                    style={{
                        background: 'transparent',
                        borderBottom: 'none',
                        flex: 1,
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontFamily: "'Lato', sans-serif"
                    }}
                    items={[
                        { key: 'home', label: <Link to="/">Home</Link> },
                        { key: 'categories', label: <Link to="/categories">Categories</Link> },
                        { key: 'try-at-home', label: <Link to="/try-at-home">Try at Home</Link> },
                    ]}
                />

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined style={{ color: 'var(--primary-gold)' }} />}
                        bordered={false}
                        style={{
                            background: '#fff',
                            borderRadius: '20px',
                            padding: '5px 15px',
                            width: '200px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                        }}
                    />

                    <Badge count={0} showZero color="#D4AF37">
                        <Button type="text" icon={<HeartOutlined style={{ fontSize: '20px', color: 'var(--luxury-black)' }} />} />
                    </Badge>

                    <Badge count={getCartCount()} color="#D4AF37">
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: 'var(--luxury-black)' }} />}
                            onClick={() => setCartOpen(true)}
                        />
                    </Badge>

                    {user ? (
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                            <Avatar
                                style={{ backgroundColor: 'var(--primary-gold)', cursor: 'pointer' }}
                                icon={<UserOutlined />}
                                src={user.user_metadata?.avatar_url}
                            />
                        </Dropdown>
                    ) : (
                        <Link to="/login">
                            <Button type="text" icon={<UserOutlined style={{ fontSize: '20px', color: 'var(--luxury-black)' }} />} />
                        </Link>
                    )}
                </div>
            </Header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default Navbar;
