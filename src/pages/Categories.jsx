
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Typography, Select, Slider, Checkbox, Card, Divider } from 'antd';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabaseClient';
// import { products } from '../data/mockProducts'; // Mock data no longer used

const { Title, Text } = Typography;
const { Option } = Select;

const Categories = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('price-low');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
            setFilteredProducts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle URL query params for initial filtering
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [location.search]);

    // Derived unique categories based on fetched products
    const categories = [...new Set(products.map(p => p.category))];

    useEffect(() => {
        let result = [...products];

        // Filter by Category
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }

        // Filter by Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        if (sortOption === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
    }, [selectedCategories, priceRange, sortOption, products]);

    const handleCategoryChange = (checkedValues) => {
        setSelectedCategories(checkedValues);
    };

    return (
        <div style={{ padding: '40px 50px', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <Title level={1} style={{ fontFamily: "'Playfair Display', serif", color: 'var(--luxury-black)' }}>
                    Our Collection
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Explore our exquisite range of handcrafted jewelry.
                </Text>
            </div>

            <Row gutter={[40, 40]}>
                {/* Sidebar Filters */}
                <Col xs={24} md={6}>
                    <Card title="Filters" bordered={false} style={{ height: '100%', boxShadow: 'none', background: 'transparent' }}>
                        <Title level={5}>Categories</Title>
                        <Checkbox.Group
                            options={categories}
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                        />

                        <Divider />

                        <Title level={5}>Price Range</Title>
                        <Slider
                            range
                            min={0}
                            max={200000}
                            defaultValue={[0, 200000]}
                            onChange={setPriceRange}
                            trackStyle={{ backgroundColor: 'var(--primary-gold)' }}
                            handleStyle={{ borderColor: 'var(--primary-gold)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Text>₹{priceRange[0]}</Text>
                            <Text>₹{priceRange[1]}</Text>
                        </div>
                    </Card>
                </Col>

                {/* Product Grid */}
                <Col xs={24} md={18}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>{filteredProducts.length} Products Found</Text>
                        <Select defaultValue="price-low" style={{ width: 200 }} onChange={setSortOption}>
                            <Option value="price-low">Price: Low to High</Option>
                            <Option value="price-high">Price: High to Low</Option>
                            <Option value="rating">Top Rated</Option>
                        </Select>
                    </div>

                    <Row gutter={[24, 24]}>
                        {loading ? <div style={{ width: '100%', textAlign: 'center' }}>Loading products...</div> : (
                            filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <Col xs={24} sm={12} lg={8} key={product.id}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))
                            ) : (
                                <div style={{ width: '100%', textAlign: 'center', padding: 50 }}>
                                    <Text>No products found. Login as Admin to add some!</Text>
                                </div>
                            )
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Categories;
