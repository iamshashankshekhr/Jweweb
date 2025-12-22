import React, { useState } from 'react';
import { Layout, Menu, Input, Badge, Button, Dropdown, Avatar, Drawer, Grid } from 'antd';
import { SearchOutlined, HeartOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined, ProfileOutlined, ShoppingOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const { Header } = Layout;
const { useBreakpoint } = Grid;

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const screens = useBreakpoint();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const menuItems = [
        { key: 'home', label: <Link to="/">Home</Link> },
        { key: 'categories', label: <Link to="/categories">Categories</Link> },
        { key: 'try-at-home', label: <Link to="/try-at-home">Try at Home</Link> },
    ];

    const userProfileItems = [
        { key: 'profile', icon: <ProfileOutlined />, label: <Link to="/profile">My Profile</Link> },
        { key: 'orders', icon: <ShoppingOutlined />, label: 'My Orders' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout, danger: true },
    ];

    // Search Component
    const SearchBar = ({ style }) => (
        <Input
            placeholder="Search..."
            prefix={<SearchOutlined style={{ color: 'var(--primary-gold)' }} />}
            bordered={false}
            style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '5px 15px',
                width: '200px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                ...style
            }}
        />
    );

    // Cart Button Component
    const CartButton = () => (
        <Badge count={getCartCount()} color="#D4AF37">
            <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: 'var(--luxury-black)' }} />}
                onClick={() => setCartOpen(true)}
            />
        </Badge>
    );

    return (
        <>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--rich-cream)',
                    padding: screens.md ? '0 50px' : '0 20px', // Responsive padding
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: '80px',
                }}
            >
                {/* Logo */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--primary-gold)',
                            fontSize: screens.md ? '28px' : '22px', // Responsive font
                            margin: 0,
                            fontWeight: 700,
                            letterSpacing: '1px'
                        }}>
                            Jewelry Shop
                        </h1>
                    </Link>
                </div>

                {screens.md ? (
                    // DESKTOP LAYOUT
                    <>
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
                            items={menuItems}
                        />

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <SearchBar />

                            <Badge count={0} showZero color="#D4AF37">
                                <Button type="text" icon={<HeartOutlined style={{ fontSize: '20px', color: 'var(--luxury-black)' }} />} />
                            </Badge>

                            <CartButton />

                            {user ? (
                                <Dropdown menu={{ items: userProfileItems }} placement="bottomRight" arrow>
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
                    </>
                ) : (
                    // MOBILE LAYOUT
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CartButton />
                        <Button type="text" icon={<MenuOutlined style={{ fontSize: '20px' }} />} onClick={() => setMobileMenuOpen(true)} />
                    </div>
                )}

                {/* Mobile Drawer */}
                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    width={280}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <Avatar
                                    style={{ backgroundColor: 'var(--primary-gold)' }}
                                    icon={<UserOutlined />}
                                    src={user.user_metadata?.avatar_url}
                                />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>Hello,</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                                </div>
                            </div>
                        ) : (
                            <Button type="primary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} block>
                                Login / Sign Up
                            </Button>
                        )}

                        <SearchBar style={{ width: '100%', border: '1px solid #eee' }} />

                        <Menu
                            mode="vertical"
                            items={menuItems}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderRight: 'none' }}
                        />

                        {user && (
                            <>
                                <div style={{ height: '1px', background: '#f0f0f0', margin: '10px 0' }} />
                                <Menu
                                    mode="vertical"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ borderRight: 'none' }}
                                    items={userProfileItems}
                                />
                            </>
                        )}
                    </div>
                </Drawer>

            </Header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default Navbar;
