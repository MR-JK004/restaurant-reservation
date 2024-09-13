import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../css/ReservationHistory.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

function ReservationHistory() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchDetails = async () => {
    if (!user || !user.user_id) {
      return;
    }

    try {
      let url = `${BASE_URL}/bookings/history`;
      const params = user.email === 'admin@gmail.com' ? {} : { id: user.user_id };

      const response = await axios.get(url, { params });

      if (response.status === 200) {
        setReservations(response.data);
      }
    } catch (error) {
      toast.error('Error fetching reservation details');
    }
  };
  
  useEffect(() => {
    fetchDetails();
  }, [user]);

  const handleCancel = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/bookings/delete`, {
        params: { id: selectedBookingId }
      });

      if (response.status === 204) {
        toast.success('Booking cancelled successfully');
        setShowModal(false);
        fetchDetails();
      }
    } catch (error) {
      toast.error('Error cancelling booking');
    }
  };

  const confirmCancel = (booking_id) => {
    setSelectedBookingId(booking_id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBookingId(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4" style={{ display: 'flex', flexDirection: 'column' }}>
      <h1 className="text-center mb-4">Reservation History</h1>
      <div className="containerr">
        {reservations.length > 0 ? (
          reservations.map(reservation => {
            const date = new Date(reservation.date);
            const formattedDate = date.toISOString().split('T')[0];
            const formattedStartTime = new Date(reservation.startTime).toISOString().split('T')[1].substring(0, 5);
            const formattedEndTime = new Date(reservation.endTime).toISOString().split('T')[1].substring(0, 5);

            return (
              <div
                key={reservation._id}
                className="reservation-card-container"
              >
                <div className="reservation-card" style={{ cursor: 'auto' }}>
                  <img
                    className="re-restaurant-image"
                    src={reservation.restaurantDetails.featured_image}
                    alt={reservation.restaurantDetails.name}
                    style={{ width: '45%',height:'240px'}}
                  />
                  <div style={{ position: 'relative', left: '2%' }}>
                    <div>
                      <h3 className="restaurant-name">
                        {reservation.restaurantDetails.name}
                      </h3>
                      <p className='re-restaurant-address'>
                        {reservation.restaurantDetails.address}
                      </p>
                      <p style={{marginBottom:'5px'}}>
                      {
                        user.email == 'admin@gmail.com'? `Reserved By ${reservation.userDetails.name?reservation.userDetails.name : 'No User'}` 
                                      : ''
                      }
                      </p>
                      <p>
                        Reserved Date: {formattedDate}
                      </p>
                      <p style={{ position: 'relative', bottom: '10px' }}>
                        Reserved Time: From <span style={{ fontWeight: 'bold' }}>{formattedStartTime}</span> to <span style={{ fontWeight: 'bold' }}>{formattedEndTime}</span>
                      </p>
                      <p style={{ position: 'relative', bottom: '20px' }}>
                        Occasion: {reservation.special_occasion}
                      </p>
                      <div className="buttons" style={{ position: 'relative', bottom: '22px' }}>
                        <Button className='modify' variant='success'>
                          <Link style={{ color: 'white' }} to={`/booking-modify/${reservation.booking_id}`}>Modify Reservation</Link>
                        </Button>
                        <Button
                          className='cancel'
                          variant='danger'
                          onClick={() => confirmCancel(reservation.booking_id)}
                        >
                          Cancel Reservation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No reservations found</div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this reservation?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservationHistory;