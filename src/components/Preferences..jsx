import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCheckbox,
  MDBInput,
  MDBRange,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../css/Preferences.css';
import { useAuth } from '../auth/AuthContext';
import CardTransition from '../common/CardTransition';

function Preferences() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    cuisines: [],
    budget: 500,
    location: '',
  });

  const {user} = useAuth();

  const handleCuisinesChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const cuisines = checked
        ? [...prevData.cuisines, value]
        : prevData.cuisines.filter((cuisine) => cuisine !== value);
      return { ...prevData, cuisines };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/users/preferences/${user.user_id}`, formData);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error saving preferences. Please try again.');
    }
  };

  return (
    <CardTransition>
    <MDBContainer className="preferences-container">
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <h1 className="text-center mb-4">Set Your Preferences</h1>
          <form onSubmit={handleSubmit}>

            {/* Favorite Cuisines */}
            <h4>Favorite Cuisines</h4>
            <div className="checkbox-group">
              <MDBCheckbox
                name="cuisine"
                value="Italian"
                id="cuisineItalian"
                label="Italian"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Italian")}
              />
              <MDBCheckbox
                name="cuisine"
                value="Indian"
                id="cuisineIndian"
                label="Indian"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Indian")}
              />
              <MDBCheckbox
                name="cuisine"
                value="Chinese"
                id="cuisineChinese"
                label="Chinese"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Chinese")}
              />
              <MDBCheckbox
                name="cuisine"
                value="Japanese"
                id="cuisineJapanese"
                label="Japanese"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Japanese")}
              />
              <MDBCheckbox
                name="cuisine"
                value="Chettinad"
                id="cuisineChettinad"
                label="Chettinad"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Chettinad")}
              />
              <MDBCheckbox
                name="cuisine"
                value="Asian"
                id="cuisineAsian"
                label="Asian"
                onChange={handleCuisinesChange}
                checked={formData.cuisines.includes("Asian")}
              />
            </div>

            {/* Budget */}
            <h4 className="mt-4">Budget (in ₹)</h4>
            <MDBRange
              value={formData.budget}
              min="500"
              max="10000"
              step="100"
              id="budgetRange"
              label={`Budget: ₹ ${formData.budget}`}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />

            {/* Location */}
            <h4 className="mt-4">Preferred Location</h4>
            <MDBInput
              label="Enter Location"
              id="locationInput"
              type="text"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* Submit Button */}
            <MDBBtn className="mt-4 w-100" color="primary" type="submit">
              Save Preferences
            </MDBBtn>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </CardTransition>
  );
}

export default Preferences;