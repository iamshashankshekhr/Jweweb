
import React, { useState, useEffect } from 'react';
import { Typography, Carousel, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [posters, setPosters] = useState([]);
    const [bestCollection, setBestCollection] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Posters
                const { data: postersData } = await supabase
                    .from('posters')
                    .select('*')
                    .eq('active', true)
                    .order('created_at', { ascending: false });

                if (postersData) setPosters(postersData);

                // Fetch Best Collection Products
                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_best_collection', true)
                    .limit(8); // Limit to top 8 for homepage

                if (productsData) setBestCollection(productsData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                <Carousel autoplay autoplaySpeed={5000} infinite={true} style={{ height: '600px' }}>
                    {posters.map((poster) => (
                        <div key={poster.id}>
                            {poster.target_link ? (
                                <Link to={poster.target_link}>
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
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}>
                                    </div>
                                </Link>
                            ) : (
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
                                </div>
                            )}
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
                </div>
            )}

            <div style={{ padding: '80px 50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title level={2} style={{ fontFamily: "'Playfair Display', serif", color: '#333', marginBottom: '10px' }}>Our Best Collection</Title>
                <Paragraph style={{ marginBottom: '50px', fontSize: '18px', color: '#666' }}>Handpicked favorites just for you.</Paragraph>

                <Row gutter={[24, 24]} style={{ width: '100%', maxWidth: '1200px' }}>
                    {bestCollection.length > 0 ? (
                        bestCollection.map(product => (
                            <Col xs={24} sm={12} lg={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    ) : (
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <Paragraph>No products available in this collection yet.</Paragraph>
                        </div>
                    )}
                </Row>
            </div>
        </div>
    );
};

export default Home;
