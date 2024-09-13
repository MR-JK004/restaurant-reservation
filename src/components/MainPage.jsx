import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FaStar } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/MainPage.css'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

function MainPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [restaurants, setRestaurants] = useState([]);
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('authToken');

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (user && user.user_id) {
                try {
                    const response = await axios.get(`${BASE_URL}/users/recommended-restaurants/${user.user_id}`);
                    const restaurantsData = Array.isArray(response.data) ? response.data : response.data.restaurants || [];
                    setRestaurants(restaurantsData);
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message === 'No restaurants match your preferences') {
                        setError(true);
                    } else if (error.response && error.response.data && error.response.data.message === 'User preferences not found') {
                        setFlag(true);
                        fetchFeaturedRestaurants();
                    } else {
                        console.error('Error fetching recommended restaurants:', error);
                        toast.error('Error fetching recommended restaurants');
                    }
                }
            } else if (!token) {
                setFlag(true);
                fetchFeaturedRestaurants();
            }
        };

        const fetchFeaturedRestaurants = async () => {
            try {
                const featuredResponse = await axios.get(`${BASE_URL}/restaurant/featured-restaurants`);
                const featuredRestaurantsData = Array.isArray(featuredResponse.data) ? featuredResponse.data : featuredResponse.data.featuredRestaurants || [];
                setRestaurants(featuredRestaurantsData);
            } catch (innerError) {
                console.error('Error fetching featured restaurants:', innerError);
                toast.error('Error fetching featured restaurants');
            }
        };

        fetchRestaurants();
    }, [user, token]);

    const handleCardClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

    const CustomPrevArrow = ({ onClick }) => (
        <button className="slick-arrow slick-prev" onClick={onClick}>
            <i className="fas fa-chevron-left"></i>
        </button>
    );

    const CustomNextArrow = ({ onClick }) => (
        <button className="slick-arrow slick-next" onClick={onClick}>
            <i className="fas fa-chevron-right"></i>
        </button>
    );

    CustomPrevArrow.propTypes = {
        onClick: PropTypes.func.isRequired
    };

    CustomNextArrow.propTypes = {
        onClick: PropTypes.func.isRequired
    };

    const settings = {
        dots: restaurants.length > 1,
        infinite: restaurants.length > 1,
        speed: 500,
        slidesToShow: restaurants.length < 4 ? restaurants.length : 4,
        slidesToScroll: 1,
        autoplay: restaurants.length > 1,
        autoplaySpeed: 5000,
        centerMode: restaurants.length === 1,
        nextArrow: restaurants.length > 1 ? <CustomNextArrow /> : null,
        prevArrow: restaurants.length > 1 ? <CustomPrevArrow /> : null,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: restaurants.length < 2 ? restaurants.length : 2,
                    centerMode: restaurants.length === 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerMode: restaurants.length === 1
                }
            }
        ]
    };

    if (!restaurants.length && !error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <BeatLoader size={10} color="#000000" />
            </div>
        );
    }

    return (
        <>
            <div className="body">
                <h1>Discover Your Next Dining Experience</h1>
                {
                    error ? 'No Restaurants Found for your Preferences' :
                        <>
                            <p className='feature-title'>{flag ? 'Featured Restaurants' : 'Recommended For You'}</p>
                            <div className="carousel-container">
                                <Slider {...settings}>
                                    {restaurants.map((restaurant) => (
                                        <motion.div
                                            key={restaurant._id}
                                            className="fea-restaurant-card"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div onClick={() => handleCardClick(restaurant.restaurant_id)}>
                                                <img
                                                    src={restaurant.featured_image}
                                                    alt={restaurant.name}
                                                    className="fea-restaurant-image"
                                                />
                                                <div className="fea-restaurant-info">
                                                    <h3 className="fea-restaurant-name">{restaurant.name}</h3>
                                                    <div className="fea-restaurant-rating">
                                                        <span>
                                                            {restaurant.averageRating !== null
                                                                ? restaurant.averageRating.toFixed(1)
                                                                : 'No ratings'}
                                                        </span>
                                                        <FaStar className="star-icon" />
                                                    </div>
                                                    <p className="fea-restaurant-price">₹{restaurant.price}</p>
                                                    <p className="fea-restaurant-address">{restaurant.address}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </Slider>
                            </div>
                        </>
                }
            </div>

            <Button className='explore-button' style={{ backgroundColor: '#d26134' }} as={Link} to={'/restaurants'}>Explore Restaurants</Button>
            <div className="footer">
                <p>&copy; 2024 Feast Finder</p>
            </div>
        </>
    );
}

export default MainPage;
