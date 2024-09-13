import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/logo.png';
import profileIcon from '../assets/user_profile.png';
import { toast } from 'react-toastify';

function TopBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        toast.info("Logout Successful");
        sessionStorage.clear();
        logout();
        navigate('/');
    };

    return (
        <div className="navbar">
            <img className="navbar_logo" src={logo} alt="logo" />
            <h3 className='title'>Feast Finder</h3>
            <div className="end">
                {user ? (
                    <>
                        {
                            user.email === "admin@gmail.com" ?
                                <Button className='add-restaurant'>
                                    <Link style={{ color: 'white' }} to={'/add-restaurant'}>
                                        Add Restaurant
                                    </Link>
                                </Button> :
                                ''
                        }
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="profile-dropdown">
                                <img src={profileIcon} alt="Profile" style={{ width: '70px', height: '70px' }} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.ItemText style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '-15px', position: 'relative', bottom: '4px' }}>
                                    {user.name}
                                </Dropdown.ItemText>
                                <Dropdown.Divider />
                                <Link to={'/reservation-history'}>
                                    <Dropdown.ItemText style={{ textAlign: 'left', marginBottom: '-15px', position: 'relative', bottom: '7px' }}>
                                        {user.email == 'admin@gmail.com' ? 'All Dining History' : 'My Dining History'}
                                    </Dropdown.ItemText>
                                </Link>
                                <Dropdown.Divider />
                                {
                                    user.email != 'admin@gmail.com' ?
                                        <Link to={'/preferences'}>
                                            <Dropdown.ItemText style={{ textAlign: 'left', marginBottom: '-15px', position: 'relative', bottom: '7px' }}>
                                                Preferences
                                            </Dropdown.ItemText>
                                        </Link>
                                    : ''
                                }
                                <Dropdown.Divider/>
                                <Dropdown.Item style={{ marginBottom: '-15px', position: 'relative', bottom: '13px' }} onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                ) : (

                    <Button as={Link} to='/login' className='button'>Sign In</Button>
                )}
            </div>
        </div>
    );
}

export default TopBar;
