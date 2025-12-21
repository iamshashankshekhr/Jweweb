
import React, { useState, useEffect } from 'react';
import { Typography, Button, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosters = async () => {
            try {
                const { data, error } = await supabase
                    .from('posters')
                    .select('*')
                    .eq('active', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPosters(data || []);
            } catch (error) {
                console.error('Error fetching posters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosters();
    }, []);

    // Default hero content if no posters
    const defaultHero = {
        title: 'Timeless Elegance',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe635e2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    };

    return (
        <div style={{ minHeight: '80vh' }}>
            {/* Hero Section with Carousel */}
            {posters.length > 0 ? (
                <Carousel autoplay effect="fade" style={{ height: '600px' }}>
                    {posters.map((poster) => (
                        <div key={poster.id}>
                            <div style={{
                                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${poster.image}")`,
                                height: '600px',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#fff',
                                textAlign: 'center'
                            }}>
                                <Title style={{ color: '#FAF9F6', fontFamily: "'Playfair Display', serif", fontSize: '64px', margin: 0 }}>
                                    {poster.title || 'Timeless Elegance'}
                                </Title>
                                <Paragraph style={{ color: '#f0f0f0', fontSize: '20px', maxWidth: '600px', marginTop: '20px' }}>
                                    Discover our exclusive collection of handcrafted jewelry designed to make you shine.
                                </Paragraph>
                                <Link to="/categories">
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            marginTop: '30px',
                                            height: '50px',
                                            padding: '0 40px',
                                            fontSize: '18px',
                                            borderRadius: '2px'
                                        }}
                                    >
                                        Shop Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </Carousel>
            ) : (
                // Default Hero if no posters
                <div style={{
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${defaultHero.image}")`,
                    height: '600px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    <Title style={{ color: '#FAF9F6', fontFamily: "'Playfair Display', serif", fontSize: '64px', margin: 0 }}>
                        {defaultHero.title}
                    </Title>
                    <Paragraph style={{ color: '#f0f0f0', fontSize: '20px', maxWidth: '600px', marginTop: '20px' }}>
                        Discover our exclusive collection of handcrafted jewelry designed to make you shine.
                    </Paragraph>
                    <Link to="/categories">
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                marginTop: '30px',
                                height: '50px',
                                padding: '0 40px',
                                fontSize: '18px',
                                borderRadius: '2px'
                            }}
                        >
                            Shop Now
                        </Button>
                    </Link>
                </div>
            )}

            <div style={{ padding: '80px 50px', textAlign: 'center' }}>
                <Title level={2} style={{ fontFamily: "'Playfair Display', serif", color: '#333' }}>Featured Collections</Title>
                <Paragraph>Our most loved pieces, curated just for you.</Paragraph>
            </div>
        </div>
    );
};

export default Home;
