import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PeopleSelectionModal from '../utils/PeopleSelectionModal';
import { MDBCardImage, MDBCard, MDBTextArea } from 'mdb-react-ui-kit';
import { FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import MakeReservation from './MakeReservation';
import { Link } from 'react-scroll';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { BeatLoader } from 'react-spinners';
import userProfile from '../assets/user_profile.png'

function BookingRestaurant() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [activeCategory, setActiveCategory] = useState('Lunch/Dinner');
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState('');
    const [openModal, setOpenModal] = useState(true);
    const [userName, setUserName] = useState('');
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const [showEditReviewModal, setShowEditReviewModal] = useState(false);
    const [editReviewText, setEditReviewText] = useState('');
    const { id } = useParams();
    const { user } = useAuth();

    let date = sessionStorage.getItem('Date');
    const retrieveDate = (key) => {
        const storedDate = sessionStorage.getItem(key);
        const date = storedDate ? new Date(storedDate) : null;
        return date instanceof Date && !isNaN(date) ? date : null;
    };

    let start_time = retrieveDate('st');
    let end_time = retrieveDate('et');

    const formatTime = (date) => date ? `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}` : 'Time not available';

    const st_time = formatTime(start_time);
    const ed_time = formatTime(end_time);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/restaurant/${id}`);
                const { restaurant, reviews, averageRating, userName } = response.data;
                setRestaurant(restaurant);
                setRating(averageRating);
                setReviews(reviews);
                setUserName(userName);
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
                toast.error('Failed to fetch restaurant data');
            }
        };

        fetchRestaurantData();
    }, [id]);


    if (!restaurant) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <BeatLoader size={10} color="#000000" />
        </div>;
    }
    sessionStorage.setItem("id", restaurant.restaurant_id);

    const handleCloseModal = () => setOpenModal(false);
    const handleSeatSelect = (seats) => setSelectedSeats(seats);

    const handleStarClick = (newRating) => {
        setUserRating(newRating);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    sessionStorage.setItem('seats', selectedSeats);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!review.trim()) {
            toast.error('Review cannot be empty');
            return;
        }

        if (!user) {
            toast.error('Please Sign in to leave a review');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/review`, {
                rating: userRating,
                comment: review,
                restaurant: restaurant.restaurant_id,
                user: user.user_id
            });
            if (response.status === 201) {
                toast.success(response.data.message || 'Review submitted successfully');
                setReview('');
                setUserRating(0);
            } else {
                toast.error(response.data.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const fetchReview = async (userId, restaurantId) => {
        try {
            // Sending restaurantId as a query parameter
            const response = await axios.get(
                `${BASE_URL}/review/user/${userId}`, 
                { params: { restaurant_id: restaurantId } }
            );
    
            if (response.status === 200) {
                setReviewToEdit(response.data);
                setEditReviewText(response.data.reviews[0].comment);
                setShowEditReviewModal(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch review');
        }
    };
    

    const handleEditReviewChange = (event) => {
        setEditReviewText(event.target.value);
    };

    const handleEditReviewSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL}/review/edit/${reviewToEdit.reviews[0].review_id}`, {
                comment: editReviewText
            });
            if (response.status === 200) {
                toast.success(response.data.message || 'Review updated successfully');
                setShowEditReviewModal(false);
                const updatedReviews = reviews.map((rev) =>
                    rev.id === reviewToEdit.id ? { ...rev, comment: editReviewText } : rev
                );
                setReviews(updatedReviews);
                setReviewToEdit(null);
                setEditReviewText('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update review');
        }
    };

    const deleteReview = async (userId, restaurantId) => {
        try {
            const response = await axios.delete(
                `${BASE_URL}/review/delete/${userId}`,
                { params: { restaurant_id: restaurantId } } 
            );
    
            if (response.status === 200) {
                toast.success('Review deleted successfully.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };
    

    return (
        <>
            <PeopleSelectionModal
                open={openModal}
                onClose={handleCloseModal}
                onSeatSelect={handleSeatSelect}
            />

            {/* Edit Review Modal */}
            <Modal show={showEditReviewModal} onHide={() => setShowEditReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Your Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditReviewSubmit}>
                        <MDBTextArea
                            value={editReviewText}
                            onChange={handleEditReviewChange}
                            rows="3"
                            label="Edit your Review"
                            style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}
                        />
                        <div className="text-right" style={{ marginTop: '10px' }}>
                            <Button variant="secondary" onClick={() => setShowEditReviewModal(false)}>Cancel</Button>
                            <Button type="submit" style={{ marginLeft: '10px' }}>Save Changes</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <div className="full-container">
                <div className="restaurant-container" style={{ height: '100%', marginLeft: '50px' }}>
                    <MDBCard className="small-card" style={{ height: '320px', marginBottom: '30px' }}>
                        <MDBCardImage style={{ height: '100%' }} src={restaurant.featured_image} position="top" alt={restaurant.name} />
                    </MDBCard>
                    <h5>{restaurant.name}</h5>
                    <div className="time" style={{ marginTop: '15px' }}>
                        <FaCalendarAlt className="fa-lg" />
                        <span>{date ? date : 'Date not Selected'}</span>
                        <FaClock className="fa-lg" style={{ position: 'relative', top: '2px' }} />
                        <span>
                            {start_time && end_time
                                ? `From ${st_time} to ${ed_time}`
                                : 'Time or Date not Selected'}
                        </span>
                        <i className="fas fa-user fa-lg"></i>
                        <span> {selectedSeats} People</span>
                    </div>
                    <div className="restaurant-rating" style={{ marginTop: '15px' }}>
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={`star-icon ${rating > index ? 'filled' :
                                'empty'}`} />
                        ))}
                        <span style={{ position: 'relative', top: '1px' }}>
                            {rating}
                        </span>
                        <i style={{ position: 'relative', top: '2px' }} className="far fa-comment-alt"></i>
                        <span style={{ marginTop: '1px' }}>{reviews.length} Reviews</span>
                    </div>

                    <div className="details-header">
                        <span>
                            <Link to="menu" spy={true} smooth={true} duration={500}>
                                Menu
                            </Link>
                        </span>
                        <span>
                            <Link to="about" spy={true} smooth={true} duration={500}>
                                About
                            </Link>
                        </span>
                        <span>
                            <Link to="ratings-reviews" spy={true} smooth={true} duration={500}>
                                Reviews
                            </Link>
                        </span>
                        <span>
                            <Link to="contact-details" spy={true} smooth={true} duration={500}>
                                Contact Details
                            </Link>
                        </span>
                    </div>

                    <div className="menu" name="menu">
                        <h2>Menu</h2>
                        <div className="tabs">
                            {[...new Set(restaurant.menu.map(cat => cat.category))].map((category, index) => (
                                <button
                                    key={index}
                                    className={`tab-button ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                    <div className="border-bottom"></div>
                                </button>
                            ))}
                        </div>
                        <div className="menu-content">
                            {restaurant.menu
                                .filter(cat => cat.category === activeCategory)
                                .map((cat, index) => (
                                    <div key={index}>
                                        {cat.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="menu-item">
                                                <div className="menu-item-details">
                                                    <span className="menu-item-name">{item.menu_item_name}</span>
                                                    <span className="menu-item-price">{item.menu_item_price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '50px' }} className="about" name="about">
                        <h2>About</h2>
                        <span style={{ margin: '0', fontWeight: 'bold' }}>Address</span><br />
                        {restaurant.address}
                        <p style={{ marginTop: '10px' }}>
                            <span style={{ margin: '0', fontWeight: 'bold' }}>Cuisine</span><br />
                            {restaurant.cuisine_type.join(', ')}
                        </p>
                        <p style={{ fontWeight: 'bold' }}>Signature Dishes</p>
                        <span style={{ position: 'relative', right: '11px', bottom: '13px' }}>
                            {restaurant.menu
                                .flatMap(cat => cat.items.filter(item => item.isSignatureDish))
                                .map((dish, i) => (
                                    <React.Fragment key={i}>
                                        {dish.menu_item_name}
                                        {i < restaurant.menu.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                        </span>
                        <div className="facilities-features">
                            <p style={{ fontWeight: 'bold' }}>Facilities & Features</p>
                            <div className="facilities">
                                {restaurant.features.map((feature, index) => (
                                    <p key={index}>{feature}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="ratings-reviews" name="ratings-reviews">
                        <h2>Ratings & Reviews</h2>
                        <div className="ratings-summary">
                            <div className="past-ratings">
                                <div className="average-rating">
                                    <span className="rating-value">{rating}</span>
                                    <span className="rating-stars">
                                        {'★'.repeat(Math.round(rating))}
                                        {'☆'.repeat(5 - Math.round(rating))}
                                    </span>
                                </div>
                                <div className="votes-summary">
                                    <p style={{ marginLeft: '10px' }}>{reviews.length} Reviews</p>
                                </div>
                                {user && (
                                    <div style={{ position: 'relative', bottom: '10px', display: 'flex' }}>
                                        <div className="filter-item">
                                            <i className="fas fa-edit icon edit-icon" onClick={() => fetchReview(user.user_id,restaurant.restaurant_id)} />
                                            <span className="tooltip">Edit my Review</span>
                                        </div>
                                        <div className="filter-item">
                                            <i className="fas fa-trash-alt icon delete-icon" style={{ color: 'red' }} onClick={() => deleteReview(user.user_id,restaurant.restaurant_id)} />
                                            <span className="tooltip">Delete my Review</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="rate-this-place">
                                <p>Rate This Place</p>
                                <div className="rate-stars">
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            onClick={() => handleStarClick(index + 1)}
                                            style={{ cursor: 'pointer', fontSize: '24px' }}
                                        >
                                            {userRating > index ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <MDBTextArea
                                        value={review}
                                        onChange={handleReviewChange}
                                        rows="2"
                                        cols="40"
                                        label='Write your Review'
                                        style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}
                                    />
                                    <br />
                                    <Button type="submit" style={{ marginTop: '10px', padding: '10px', fontSize: '13px', width: '100%' }}>
                                        Submit
                                    </Button>
                                </form>
                            </div>
                        </div>
                        {
                            rating ? (
                                <>
                                    <div className="reviews-section" style={{ position: 'relative', bottom: '150px', width: '40%', maxHeight: '250px', overflowY: 'scroll' }}>
                                        {reviews.map((review, index) => (
                                            <div key={index} className="review-item">
                                                <div className="review-header">
                                                    <h6 style={{ fontWeight: 'bold', position: 'relative', top: '7px' }}>{userName}</h6>
                                                    <div style={{ color: 'gold', fontSize: '20px' }} className="review-rating">
                                                    <img style={{width:'40px',height:'40px',position:'relative',right:'15px'}} src={userProfile} alt="" />
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <p style={{fontWeight:'bold',margin:'0'}}>{review.reviewerName}</p>
                                                <p>{review.comment}</p>
                                                {review.reply && (
                                                    <>
                                                        <p style={{ fontWeight: 'bold', marginBottom: '0px', marginTop: '-10px' }}>Restaurant Owner</p>
                                                        <p>{review.reply}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : <span style={{ position: 'relative', bottom: '130px', fontSize: '25px' }}>No Reviews</span>
                        }
                    </div>

                    <div className="contact-details" name="contact-details">
                        <h2>Contact Details</h2>
                        <p>
                            <strong>Phone:</strong> {restaurant.contact_number}
                        </p>
                        <p>
                            <strong>Email:</strong> {restaurant.email}
                        </p>
                    </div>
                    <div className="footer">
                        <p>&copy; 2024 Feast Finder</p>
                    </div>
                </div>
                <div className="reserve-container">
                    <MakeReservation restaurant={restaurant} selectedSeats={selectedSeats} startTime={start_time} endTime={end_time} />
                </div>
            </div>
        </>
    );
}

export default BookingRestaurant;
