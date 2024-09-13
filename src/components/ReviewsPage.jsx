import React, { useState, useEffect } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import ReviewItem from '../components/ReviewItem';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewsPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [reviews, setReviews] = useState([]);
  const { id: restaurantId } = useParams(); 
  const [restaurantName, setRestaurantName] = useState('');

  const fetchReviews = async () => {
    try {

      const response = await axios.get(`${BASE_URL}/review/${restaurantId}`);
  
      if (Array.isArray(response.data.reviews)) {
        setReviews(response.data.reviews);
        if (response.data.reviews.length > 0 && response.data.reviews[0].restaurantDetails) {
          setRestaurantName(response.data.reviews[0].restaurantDetails.name);
        }
      else {
        throw new Error("Unexpected response format");
      }
    }
  } catch (error) {
      toast.error(error.message || "Error Fetching Data");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [restaurantId,reviews]);



  return (
    <Container>
      <h2 className="my-4" style={{position:'relative',left:'25%'}}>Reviews for Restaurant {restaurantName}</h2>
      <ListGroup>
        {reviews.map(review => (
          <ReviewItem key={review._id} review={review}/>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ReviewsPage;
