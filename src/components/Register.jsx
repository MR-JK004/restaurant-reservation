import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import logo from '../assets/logo.png';
import CardTransition from '../common/CardTransition';

const inputVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

const PasswordInput = ({ label, value, onChange, showPassword, togglePassword }) => (
  <div className="position-relative">
    <MDBInput
      wrapperClass='mb-4'
      label={label}
      type={showPassword ? 'text' : 'password'}
      size="lg"
      value={value}
      onChange={onChange}
    />
    <MDBBtn
      className="position-absolute top-50 end-0 translate-middle-y"
      color="link"
      onClick={togglePassword}
      style={{ backgroundColor: 'transparent', border: 'none' }}
    >
      <MDBIcon icon={showPassword ? 'eye-slash' : 'eye'} />
    </MDBBtn>
  </div>
);

function Register() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error('Password and Confirm Password must be the same');
      return;
    }
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        name,
        email,
        password
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardTransition>
      <div style={{ position: 'relative', bottom: '20px' }}>
        <MDBContainer className="my-5 d-flex justify-content-center">
          <MDBCard style={{ borderRadius: '1rem', maxWidth: '900px' }} className='box'>
            <MDBRow className='g-0'>
              <MDBCol md='6'>
                <MDBCardBody className='d-flex flex-column justify-content-center box'>
                  <div className='d-flex flex-row mt-2 justify-content-center'>
                    <img className='logo' style={{ width: '100px', height: '100px' }} src={logo} alt="Logo" />
                  </div>

                  <h5 className="fw-normal my-4 pb-3 text-center" style={{ letterSpacing: '1px' }}>Create your account</h5>

                  <motion.div variants={inputVariant} initial="hidden" animate="visible">
                    <MDBInput wrapperClass='mb-4' label='Full Name' id='formControlName' type='text' size="lg" value={name} onChange={(e) => setName(e.target.value)} required />
                  </motion.div>
                  <motion.div variants={inputVariant} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <MDBInput wrapperClass='mb-4' label='Email address' id='formControlEmail' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </motion.div>
                  <motion.div variants={inputVariant} initial="hidden" animate="visible">
                    <PasswordInput
                      label="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword(!showPassword)}
                    />
                  </motion.div>

                  <motion.div variants={inputVariant} initial="hidden" animate="visible">
                    <PasswordInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      showPassword={showConfirmPassword}
                      togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </motion.div>

                  <motion.div variants={inputVariant} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                    <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleRegister} disabled={loading}>
                      {loading ? <BeatLoader size={10} color="#ffffff" /> : 'Register'}
                    </MDBBtn>
                  </motion.div>
                  <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Already have an account? <Link to={'/login'} style={{ color: '#393f81' }}>Login here</Link></p>

                  <div className='d-flex flex-row justify-content-center'>
                    <a href="#!" className="small text-muted me-1">Terms of use.</a>
                    <a href="#!" className="small text-muted">Privacy policy</a>
                  </div>
                </MDBCardBody>
              </MDBCol>
              <MDBCol md='6'>
                <MDBCardImage src='https://images.pexels.com/photos/7246556/pexels-photo-7246556.jpeg?auto=compress&cs=tinysrgb&w=600' alt="login form" className='rounded-start w-100 h-100 box' style={{ objectFit: 'cover' }} />
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBContainer>
      </div>
    </CardTransition>
  );
}

export default Register;