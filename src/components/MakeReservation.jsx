import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBInput,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from 'mdb-react-ui-kit';
import logo from '../assets/logo.png';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function MakeReservation() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user } = useAuth();

  const [occasion, setOccasion] = useState('');
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  let date = sessionStorage.getItem('Date');
  let startTime = sessionStorage.getItem('st');
  let endTime = sessionStorage.getItem('et');
  let no_of_people = sessionStorage.getItem('seats');
  let restaurant = sessionStorage.getItem("id");

  
  const isValidTime = (time) => {
    const date = new Date(time);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toISOString();
  };

  const utcStartTime = isValidTime(startTime) ? formatTime(startTime) : null;
  const utcEndTime = isValidTime(endTime) ? formatTime(endTime) : null;

  const handleDropdownClick = (value) => {
    setOccasion(value);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please Sign in to Reserve Your Seats");
      return;
    }

    if (!name || !email || !date || !utcStartTime || !utcEndTime || !no_of_people || !restaurant) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/restaurant/booking`, {
        name,
        email,
        user: user.user_id,
        restaurant,
        date,
        special_occasion: occasion,
        startTime: utcStartTime,
        endTime: utcEndTime,
        no_of_people
      });

      if (response.status === 201) {
        toast.success("Restaurant Booked Successfully");
        setName('');
        setEmail('');
      } else {
        toast.error(response.data.message || "Unexpected error occurred");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to Book Restaurant");
      } else if (error.request) {
        toast.error("No response received from server");
      } else {
        toast.error("Error in making request: " + error.message);
      }
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form" style={{ position: 'relative', right: '15px' }}>
      <MDBCol col='5' className="mb-5 mx-auto">
        <h5 className="reservation-header">
          Make Reservation
        </h5>
        <div className="d-flex flex-column ms-5" style={{ position: 'relative', marginTop: '-20px' }}>
          <div className="text-center">
            <img src={logo} style={{ width: '165px', height: '120px' }} alt="logo" />
            <h4 className="mt-1 mb-5 pb-1">Feast Finder Reservation</h4>
          </div>

          <div style={{ marginTop: '-10px' }}>
            <MDBInput
              wrapperClass='mb-4'
              label='Name'
              id='form0'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Email address'
              id='form1'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <MDBDropdown className='mb-4 full-width-dropdown'>
              <MDBDropdownToggle caret color='danger'>
                {occasion || 'Special Occasion'}
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem className='dropdown-item' onClick={() => handleDropdownClick('Birthday')}>Birthday</MDBDropdownItem>
                <MDBDropdownItem className='dropdown-item' onClick={() => handleDropdownClick('Anniversary')}>Anniversary</MDBDropdownItem>
                <MDBDropdownItem className='dropdown-item' onClick={() => handleDropdownClick('Graduation')}>Graduation</MDBDropdownItem>
                <MDBDropdownItem className='dropdown-item' onClick={() => handleDropdownClick('None')}>None</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>

          <div className="text-center pt-1 mb-5 pb-1">
            <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleSubmit}>Submit</MDBBtn>
          </div>
        </div>
      </MDBCol>
    </MDBContainer>
  );
}

export default MakeReservation;
