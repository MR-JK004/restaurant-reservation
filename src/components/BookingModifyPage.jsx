import React, { useState, useEffect } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import CardTransition from '../common/CardTransition';
import { useAuth } from '../auth/AuthContext';
import { useParams } from 'react-router-dom';

const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

function BookingModifyPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { user } = useAuth();
    const [booking, setBooking] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [formData, setFormData] = useState({
        restaurant: '',
        name: '',
        no_of_people: 1,
        special_occasion: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        fetchBooking();
        fetchRestaurants();
    }, [user]);

    const fetchBooking = async () => {
        if (!user || !user.user_id) {
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/bookings/${id}`, {
                params: { id }
            });

            if (response.status === 200) {
                const bookingData = response.data;
                setBooking(bookingData);

                const date = new Date(bookingData.booking.date).toISOString().split('T')[0];
                const startTime = new Date(bookingData.booking.startTime).toISOString().split('T')[1].split('.')[0];
                const endTime = new Date(bookingData.booking.endTime).toISOString().split('T')[1].split('.')[0];

                setFormData({
                    restaurant: bookingData.booking.restaurant || '',
                    name: bookingData.booking.name || '',
                    no_of_people: bookingData.booking.no_of_people || 1,
                    special_occasion: bookingData.booking.special_occasion || '',
                    date: date || '',
                    startTime: startTime || '',
                    endTime: endTime || ''
                });
            }
        } catch (error) {
            toast.error('Error fetching reservation details');
        }
    };

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/restaurant/restaurant-list`);
            setRestaurants(response.data);
        } catch (error) {
            toast.error('Error fetching restaurants.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            restaurant: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { date, startTime, endTime } = formData;
            const formatdate = new Date(date)
            const combinedStartDateTime = new Date(`${date}T${startTime}`).toISOString();
            const combinedEndDateTime = new Date(`${date}T${endTime}`).toISOString();

            const updatedFormData = {
                ...formData,
                date:formatdate,
                startTime: combinedStartDateTime,
                endTime: combinedEndDateTime
            };
    

            const response = await axios.put(`${BASE_URL}/bookings/modify/${id}`, updatedFormData);

            if(response.status === 200)
                toast.success('Booking modified successfully.');
        } catch (error) {
            console.log(error)
            toast.error('Error modifying booking.');
        } finally {
            setLoading(false);
        }
    };

    if (!booking) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <BeatLoader size={10} color="#000000" />
        </div>;
    }

    return (
        <CardTransition>
            <MDBContainer className="my-5 d-flex justify-content-center align-items-center MDBContainer" style={{ height: '100vh', position: 'relative', bottom: '100px' }}>
                <MDBCard className='MDBCard' style={{ borderRadius: '1rem', maxWidth: '600px', width: '100%' }}>
                    <MDBCardBody className='d-flex flex-column justify-content-center'>
                        <h5 className="fw-normal my-4 pb-3 text-center" style={{ letterSpacing: '1px'}}>Modify Your Reservation</h5>

                        <form onSubmit={handleSubmit}>
                            <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                <div className='mb-4'>
                                    <label htmlFor='restaurant' className='form-label'>Restaurant Name</label>
                                    <select
                                        id='restaurant'
                                        name='restaurant'
                                        value={formData.restaurant}
                                        onChange={handleSelectChange}
                                        className='form-select'
                                        size='lg'
                                    >
                                        <option value='' disabled>Select a restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant.id} value={restaurant.restaurant_id}>
                                                {restaurant.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>

                            <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Customer Name'
                                    type='text'
                                    className='MDBInput'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    size="lg"
                                />
                            </motion.div>

                            <MDBRow>
                            <MDBCol col='6'>
                                <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                    <MDBInput
                                        className='MDBInput'
                                        wrapperClass='mb-4'
                                        label='Number of People'
                                        type='number'
                                        name='no_of_people'
                                        value={formData.no_of_people}
                                        onChange={handleChange}
                                        size="lg"
                                    />
                                </motion.div>
                            </MDBCol>

                            <MDBCol col='6'>
                                <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                    <div className='mb-4'>
                                        <select
                                            id='special_occasion'
                                            name='special_occasion'
                                            value={formData.special_occasion}
                                            onChange={handleChange}
                                            className='form-select'
                                            size='lg'
                                        >
                                            <option value='' disabled>Select an occasion</option>
                                            <option value='Birthday'>Birthday</option>
                                            <option value='Anniversary'>Anniversary</option>
                                            <option value='Graduation'>Graduation</option>
                                            <option value='None'>None</option>
                                        </select>
                                    </div>
                                </motion.div>
                            </MDBCol>
                            </MDBRow>

                            <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                <MDBInput
                                className='MDBInput'
                                    wrapperClass='mb-4'
                                    label='Date'
                                    type='date'
                                    name='date'
                                    value={formData.date}
                                    onChange={handleChange}
                                    size="lg"
                                />
                            </motion.div>

                            <MDBRow>
                            <MDBCol col='6'>
                            <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                <MDBInput
                                    className='MDBInput'
                                    wrapperClass='mb-4'
                                    label='Start Time'
                                    type='time'
                                    name='startTime'
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    size="lg"
                                />
                            </motion.div>
                            </MDBCol>
                            <MDBCol col='6'>
                            <motion.div variants={inputVariant} initial="hidden" animate="visible">
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='End Time'
                                    type='time'
                                    name='endTime'
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    size="lg"
                                />
                            </motion.div>
                            </MDBCol>
                            </MDBRow>

                            <motion.div variants={inputVariant} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                                <MDBBtn className="mb-4 px-5" color='dark' size='lg' type='submit' disabled={loading}>
                                    {loading ? <BeatLoader size={10} color="#ffffff" /> : 'Modify'}
                                </MDBBtn>
                            </motion.div>
                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </CardTransition>
    );
}

export default BookingModifyPage;
