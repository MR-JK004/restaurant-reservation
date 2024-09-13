import React, { useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import '../css/ReviewItem.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewItem = ({ review}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [replyText, setReplyText] = useState('');

  const handleReplyChange = (e) => setReplyText(e.target.value);

  const handleReplySubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/review/reply`,{
         userId:review.userDetails.user_id,
         replyText
      })
      if(response.status === 200){
         toast.success("Replied Successfully")
      }
    } 
    catch (error) {
       toast.error(error)
    }
    setReplyText('');
  };

  return (
    <MDBCard className="mb-4 shadow-sm hover-zoom">
      <MDBCardBody>
        <MDBCardTitle>{review.userDetails.name} - {review.rating} <span style={{color:'gold',fontSize:'25px'}}>★</span></MDBCardTitle>
        <MDBCardText>comment : {review.comment}</MDBCardText>
        <form onSubmit={handleReplySubmit}>
          <MDBInput
            label="Write a reply..."
            type="text"
            value={replyText}
            onChange={handleReplyChange}
            className="mb-3"
          />
          <MDBBtn type="submit" color="primary" style={{width:'100%'}}>Reply</MDBBtn>
        </form>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ReviewItem;
