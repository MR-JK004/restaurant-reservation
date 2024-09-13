import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FormControl, InputGroup } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { BeatLoader } from 'react-spinners';
import '../css/CustomToggleSwitch.css';
import { motion } from 'framer-motion';

function Restaurants() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const locations = ['Chennai', 'Madurai', 'Tiruchirappalli', 'Coimbatore', 'Ramanathapuram', 'Cuddalore','Salem'];
    const [restaurants, setRestaurants] = useState([]);
    const [location, setLocation] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState([]);
    const [featuredRestaurants, setFeaturedRestaurants] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/restaurant/restaurant-list`);
                const restaurantsData = response.data;

                setRestaurants(restaurantsData);

                const featuredState = {};
                restaurantsData.forEach(restaurant => {
                    featuredState[restaurant._id] = restaurant.isFeatured;
                });

                setFeaturedRestaurants(featuredState);
            } catch (error) {
                console.log(error);
                toast.error('Error fetching restaurants');
            }
        };

        fetchRestaurants();
    }, []);

    const handleFeatureChange = async (restaurantId, isChecked) => {
        try {
            await axios.put(`${BASE_URL}/restaurant/update-featured`, {
                restaurantId,
                isFeatured: isChecked
            });

            setFeaturedRestaurants(prevState => ({
                ...prevState,
                [restaurantId]: isChecked
            }));

        } catch (error) {
            toast.error('Error updating restaurant status');
        }
    };

    const handleCardClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

    const formatDateTime = (date, time, offsetHours = 0, offsetMinutes = 0) => {
        if (!date || !time) return null;
        const [hours, minutes] = time.split(':').map(Number);
        const dateTime = new Date(date);
        dateTime.setHours(hours + offsetHours, minutes + offsetMinutes, 0, 0);
        return dateTime.toISOString();
    };

    const offsetHours = 5;
    const offsetMinutes = 30;
    sessionStorage.setItem('Date', selectedDate);
    sessionStorage.setItem('st', formatDateTime(selectedDate, startTime, offsetHours, offsetMinutes));
    sessionStorage.setItem('et', formatDateTime(selectedDate, endTime, offsetHours, offsetMinutes));

    const fetchFilteredRestaurants = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/restaurant/restaurant-list`, {
                params: {
                    location,
                    date: selectedDate,
                    startTime,
                    endTime
                }
            });
            setRestaurants(response.data);

            if (response.status === 404) {
                toast.error("No Restaurants Found");
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching restaurants');
        }
    };

    const handleFilter = () => {
        fetchFilteredRestaurants();
        setFiltersApplied(true);
    };

    const handleClose = () => setShow(false);
    const handleShow = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setShow(true);
    };

    const handleLocationChange = (loc) => {
        setLocation(loc);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleCheckboxChange = (cuisineType, event) => {
        const updatedCuisines = event.target.checked
            ? [...selectedCuisines, cuisineType]
            : selectedCuisines.filter(cuisine => cuisine !== cuisineType);

        setSelectedCuisines(updatedCuisines);
        handleCuisineFilter(updatedCuisines);
    };

    const handleCheckboxPriceChange = (price, e) => {
        const updatedPrice = e.target.checked
            ? [...selectedPrice, price]
            : selectedPrice.filter(p => p != price);

        setSelectedPrice(updatedPrice);
        handlePriceFilter(updatedPrice);
    };

    const handlePriceFilter = async (selectedPrices) => {
        try {
            const response = await axios.get(`${BASE_URL}/restaurant/price-filter`, {
                params: { prices: JSON.stringify(selectedPrices) }
            });
            setRestaurants(response.data);
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching restaurants');
        }
    };

    const handleCuisineFilter = async (selectedCuisines) => {
        try {
            const response = await axios.get(`${BASE_URL}/restaurant/cuisine-filter`, {
                params: { cuisines: selectedCuisines }
            });
            setRestaurants(response.data);
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching restaurants');
            toast.error('Error fetching cuisine data');
        }
    };

    const cuisine = ['Indian', 'European', 'Chinese', 'Italian', 'Japanese', 'Asian', 'Chettinad'];
    const prices = ['Under ₹1,000', '₹1,000-₹5,000', 'Above ₹5,000'];

    if (!restaurants.length) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <BeatLoader size={10} color="#000000" />
        </div>;
    }

    return (
        <>
            <button className="filter-menu-button" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`filter-menu ${menuVisible ? 'show' : ''}`}>
                <div className="filter-item">
                    <FaCalendarAlt className="icon" />
                    <input
                        type="date"
                        style={{ cursor: 'pointer', padding: '0 5px' }}
                        placeholder="Select Date"
                        className="filter-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={today}
                    />
                    <span className="tooltip">Select Date</span>
                </div>

                <div className="filter-item">
                    <FaClock className="filter-icon" />
                    <InputGroup>
                        <FormControl
                            style={{ cursor: 'pointer' }}
                            type="time"
                            placeholder="Start Time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </InputGroup>
                    <span className="tooltip">Select Start Time</span>
                </div>

                <div className="filter-item">
                    <FaClock className="filter-icon" />
                    <InputGroup>
                        <FormControl
                            style={{ cursor: 'pointer' }}
                            type="time"
                            placeholder="End Time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </InputGroup>
                    <span className="tooltip">Select End Time</span>
                </div>

                <div className="filter-item">
                    <FaMapMarkerAlt className="filter-icon" />
                    <div className="custom-dropdown">
                        <input
                            type="text"
                            className="custom-dropdown-input"
                            value={location ? searchTerm || location : 'Select Location'}
                            onClick={() => setIsOpen(!isOpen)}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsOpen(true);
                            }}
                            placeholder="Select Location"
                        />
                        {isOpen && (
                            <div className="custom-dropdown-menu">
                                {locations.filter(loc =>
                                    loc.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((loc, index) => (
                                    <div
                                        key={index}
                                        className="custom-dropdown-item"
                                        onClick={() => handleLocationChange(loc)}
                                    >
                                        {loc}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <span className="tooltip">Select Location</span>
                </div>

                <Button className="apply-filters-btn" onClick={handleFilter}>
                    Find Table
                </Button>

            </div>
            <div className="container">
                <div className="filter-column">
                    <p>Filters</p>
                    <p style={{ marginBottom: '5px' }}>Cuisine Types</p>
                    {cuisine.map((cuisineType, index) => (
                        <div className="cuisine" key={`cuisine-${index}`}>
                            <input
                                type="checkbox"
                                id={`cuisine-${index}`}
                                onChange={(e) => handleCheckboxChange(cuisineType, e)}
                            />
                            <label className='cuisine-type' htmlFor={`cuisine-${index}`}>{cuisineType}</label>
                        </div>
                    ))}
                    <p style={{ marginTop: '20px', marginBottom: '2px' }}>Price</p>
                    {prices.map((price, index) => (
                        <div className="cuisine" key={`price-${index}`}>
                            <input type="checkbox" id={`price-${index}`}
                                onChange={(e) => handleCheckboxPriceChange(price, e)}
                            />
                            <label className='cuisine-type' htmlFor={`price-${index}`}>{price}</label>
                        </div>
                    ))}
                </div>

                <div className="restaurant-list">
                    {restaurants.map((restaurant) => (
                        <motion.div
                            key={restaurant._id}
                            className="restaurant-card-container"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div
                                className="restaurant-card"
                                onClick={() => handleCardClick(restaurant.restaurant_id)}
                            >
                                <img
                                    className="restaurant-image"
                                    src={restaurant.featured_image}
                                    alt={restaurant.name}
                                    style={{ width: '45%' }}
                                />
                                <div style={{ position: 'relative', left: '2%' }}>
                                    <div className="restaurant-info">
                                        <h3 className="restaurant-name">
                                            {restaurant.name}
                                        </h3>
                                        <div className="restaurant-details">
                                            <span>{restaurant.cuisine_type.join(' , ')}</span>
                                        </div>
                                        <p className='restaurant-price' style={{ margin: '0px', color: 'black' }}>
                                            <span style={{ color: '#FF4D00', fontWeight: 'bold' }}>
                                                ₹{restaurant.price}
                                            </span>
                                        </p>
                                        <div className="restaurant-rating">
                                            <span style={{ marginRight: '5px' }}>
                                                {restaurant.averageRating !== null
                                                    ? restaurant.averageRating.toFixed(1)
                                                    : 'No ratings'}
                                            </span> <FaStar className="star-icon" />
                                        </div>
                                        <p className='restaurant-address'>
                                            {restaurant.address}
                                        </p>
                                        {
                                            user?.email === 'admin@gmail.com' ? (
                                                <>
                                                    <Link to={`/reviews/${restaurant.restaurant_id}`}>
                                                        <Button
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                            }}
                                                            className="menu-button"
                                                        >
                                                            View Reviews
                                                        </Button>
                                                    </Link>

                                                    <div className="toggle-switch" style={{ position: 'relative', left: '250px', bottom: '10px' }} onClick={(event) => {
                                                        event.stopPropagation();
                                                    }}>
                                                        <span className="toggle-label">{featuredRestaurants[restaurant._id] ? 'Featured' : 'Not Featured'}</span>
                                                        <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={featuredRestaurants[restaurant._id] || false}
                                                                onChange={(e) => handleFeatureChange(restaurant._id, e.target.checked)}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                            />
                                                            <span className="slider"></span>
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <Button
                                                    className="menu-button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleShow(restaurant);
                                                    }}
                                                >
                                                    View Signature Dish
                                                </Button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {selectedRestaurant && (
                    <Modal show={show} onHide={handleClose} animation={true} className='custom-modal' style={{ overflow: 'hidden' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Signature Dish - {selectedRestaurant.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='modal-body'>
                            {selectedRestaurant.menu
                                .flatMap(category => category.items)
                                .filter(item => item.isSignatureDish)
                                .map((item, index) => (
                                    <div key={index} className="menu-item">
                                        <div className="menu-item-details">
                                            <span className="menu-item-name" style={{ position: 'relative', left: '5px' }}>{item.menu_item_name}</span>
                                            <span className="menu-item-price">{item.menu_item_price}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

            </div>
        </>
    );
}

export default Restaurants;
