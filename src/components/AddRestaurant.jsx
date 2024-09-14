import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';
import logo from '../assets/logo.png';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import axios from 'axios';

function AddRestaurant() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        featured_image: '',
        name: '',
        address: '',
        price: '',
        location: '',
        menu: [{ category: '', items: [{ menu_item_name: '', menu_item_price: '', isSignatureDish: false }] }],
        contact_number: '',
        cuisine_type: [''],
        images: [''],
        features: [''],
        email: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleArrayChange = (e, index, arrayName, itemName) => {
        const newArr = [...formData[arrayName]];
        if (itemName) {
            newArr[index] = { ...newArr[index], [itemName]: e.target.value };
        } else {
            newArr[index] = e.target.value;
        }
        setFormData({ ...formData, [arrayName]: newArr });
    };

    const handleNestedArrayChange = (e, menuIndex, itemIndex) => {
        const newMenu = [...formData.menu];
        newMenu[menuIndex].items[itemIndex] = { ...newMenu[menuIndex].items[itemIndex], [e.target.name]: e.target.value };
        setFormData({ ...formData, menu: newMenu });
    };

    const handleSignatureDishChange = (menuIndex, itemIndex) => {
        const newMenu = [...formData.menu];
        newMenu[menuIndex].items[itemIndex].isSignatureDish = !newMenu[menuIndex].items[itemIndex].isSignatureDish;
        setFormData({ ...formData, menu: newMenu });
    };

    const addArrayItem = (arrayName, item) => {
        setFormData({ ...formData, [arrayName]: [...formData[arrayName], item] });
    };

    const addNestedArrayItem = (menuIndex) => {
        const newMenu = [...formData.menu];
        newMenu[menuIndex].items.push({ menu_item_name: '', menu_item_price: '', isSignatureDish: false });
        setFormData({ ...formData, menu: newMenu });
    };

    const removeArrayItem = (index, arrayName) => {
        const newArr = [...formData[arrayName]];
        newArr.splice(index, 1);
        setFormData({ ...formData, [arrayName]: newArr });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/restaurant/add-restaurant`, formData);

            if (response.status === 201) {
                toast.success("Restaurant added successfully");
                setFormData({
                    featured_image: '',
                    name: '',
                    address: '',
                    price: '',
                    location: '',
                    menu: [{ category: '', items: [{ menu_item_name: '', menu_item_price: '' }] }],
                    signature_dish: [{ dish_name: '', price: '' }],
                    contact_number: '',
                    email:'',
                    cuisine_type: [''],
                    images: [''],
                    features: ['']
                });
            } else {
                toast.error(response.data.message || 'Failed to add restaurant');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MDBContainer className="my-5 d-flex justify-content-center">
            <MDBCard style={{ maxWidth: '800px', width: '100%' }}>
                <MDBCardBody className='d-flex flex-column'>
                    <div className='d-flex flex-row mt-2 mb-4'>
                        <img src={logo} alt="logo" style={{ width: '100px', height: '100px' }} />
                        <span className="mb-0" style={{ fontSize: '50px', marginLeft: '20px' }}>Feast Finder</span>
                    </div>

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Featured Image URL'
                        id='featured_image'
                        type='text'
                        size="lg"
                        value={formData.featured_image}
                        onChange={handleInputChange}
                    />

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Name'
                        id='name'
                        type='text'
                        size="lg"
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Address'
                        id='address'
                        type='text'
                        size="lg"
                        value={formData.address}
                        onChange={handleInputChange}
                    />

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Location'
                        id='location'
                        type='text'
                        size="lg"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                    <MDBInput
                        wrapperClass='mb-4'
                        label='Price'
                        id='price'
                        type='text'
                        size="lg"
                        value={formData.price}
                        onChange={handleInputChange}
                    />

                    {/* Menu Section */}
                    {formData.menu.map((menu, menuIndex) => (
                        <div key={menuIndex} className='menu-section mb-4'>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Menu Category'
                                type='text'
                                size="lg"
                                value={menu.category}
                                onChange={(e) => handleArrayChange(e, menuIndex, 'menu', 'category')}
                            />
                            {menu.items.map((item, itemIndex) => (
                                <div key={itemIndex} className='menu-item'>
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Menu Item Name'
                                        name='menu_item_name'
                                        type='text'
                                        size="lg"
                                        value={item.menu_item_name}
                                        onChange={(e) => handleNestedArrayChange(e, menuIndex, itemIndex)}
                                    />
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Menu Item Price'
                                        name='menu_item_price'
                                        type='text'
                                        size="lg"
                                        value={item.menu_item_price}
                                        onChange={(e) => handleNestedArrayChange(e, menuIndex, itemIndex)}
                                    />
                                    <div className='button-group mb-4'>
                                        <MDBBtn size='sm' onClick={() => handleSignatureDishChange(menuIndex, itemIndex)}>
                                            {item.isSignatureDish ? 'Unmark as Signature Dish' : 'Mark as Signature Dish'}
                                        </MDBBtn>
                                        <MDBBtn size='sm' onClick={() => removeArrayItem(itemIndex, 'menu.items')}>Remove Item</MDBBtn>
                                    </div>
                                </div>
                            ))}
                            <MDBBtn style={{ width: '100%' }} onClick={() => addArrayItem('menu', { category: '', items: [{ menu_item_name: '', menu_item_price: '', isSignatureDish: false }] })}>Add Menu Category</MDBBtn>
                        </div>
                    ))}

                    {/* Cuisine Type Section */}
                    {formData.cuisine_type.map((cuisine, index) => (
                        <div key={index} className='cuisine-type-section'>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Cuisine Type'
                                type='text'
                                size="lg"
                                value={cuisine}
                                onChange={(e) => handleArrayChange(e, index, 'cuisine_type', '')}
                            />
                            <div className='button-group mb-4'>
                                <MDBBtn size='sm' onClick={() => removeArrayItem(index, 'cuisine_type')}>Remove Cuisine</MDBBtn>
                                <MDBBtn size='sm' onClick={() => addArrayItem('cuisine_type', '')}>Add Cuisine</MDBBtn>
                            </div>
                        </div>
                    ))}

                    {/* Features Section */}
                    {formData.features.map((feature, index) => (
                        <div key={index} className='features-section'>
                            <MDBInput
                                wrapperClass='mb-4'
                                label='Feature'
                                type='text'
                                size="lg"
                                value={feature}
                                onChange={(e) => handleArrayChange(e, index, 'features', '')}
                            />
                            <div className='button-group mb-4'>
                                <MDBBtn size='sm' onClick={() => removeArrayItem(index, 'features')}>Remove Feature</MDBBtn>
                                <MDBBtn size='sm' onClick={() => addArrayItem('features', '')}>Add Feature</MDBBtn>
                            </div>
                        </div>
                    ))}

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Contact number'
                        id='contact_number'
                        type='text'
                        size="lg"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                    />

                    <MDBInput
                        wrapperClass='mb-4'
                        label='Email'
                        id='email'
                        type='text'
                        size="lg"
                        value={formData.email}
                        onChange={handleInputChange}
                    />

                    <MDBBtn className="mb-4 px-5" color='dark' onClick={handleSubmit} block>
                        {loading ? <BeatLoader size={10} color="#ffffff" /> : 'Submit'}
                    </MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default AddRestaurant;
