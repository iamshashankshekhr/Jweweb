
import React from 'react';
import { Layout, Menu, Button, Typography, Space } from 'antd';
import {
    DashboardOutlined,
    ShopOutlined,
    FileImageOutlined,
    LogoutOutlined,
    ArrowLeftOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Protect the route
    if (!user) {
        // Simple check, real apps might check roles
        navigate('/login');
        return null;
    }

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const getPageTitle = () => {
        if (location.pathname.includes('products')) return 'Product Management';
        if (location.pathname.includes('posters')) return 'Poster Management';
        if (location.pathname.includes('settings')) return 'Shop Settings';
        return 'Admin Dashboard';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" width={250} style={{ background: '#1A1A1A' }}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#D4AF37', margin: 0 }}>Admin Panel</Title>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{ background: '#1A1A1A' }}
                    items={[
                        {
                            key: '/admin',
                            icon: <DashboardOutlined />,
                            label: <Link to="/admin">Dashboard</Link>
                        },
                        {
                            key: '/admin/products',
                            icon: <ShopOutlined />,
                            label: <Link to="/admin/products">Products</Link>
                        },
                        {
                            key: '/admin/posters',
                            icon: <FileImageOutlined />,
                            label: <Link to="/admin/posters">Posters</Link>
                        },
                        {
                            key: '/admin/settings',
                            icon: <SettingOutlined />,
                            label: <Link to="/admin/settings">Settings</Link>
                        },
                    ]}
                />

                <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '20px' }}>
                    <Button
                        type="text"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left' }}
                    >
                        Logout
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                    <Title level={4} style={{ margin: 0 }}>{getPageTitle()}</Title>
                    <Space>
                        <Link to="/">
                            <Button icon={<ArrowLeftOutlined />}>Back to Shop</Button>
                        </Link>
                        <div style={{ fontWeight: 'bold' }}>{user.email}</div>
                    </Space>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
