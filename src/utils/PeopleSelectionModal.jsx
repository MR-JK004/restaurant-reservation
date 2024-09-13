import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';

const PeopleSelectionModal = ({ open, onClose, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState(1);

  const handleSeatChange = (seatNumber) => {
    setSelectedSeats(seatNumber);
    onSeatSelect(seatNumber);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography id="seat-selection-modal" variant="h6" component="h2">
          How Many People?
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          {[...Array(10).keys()].map(seat => (
            <Grid item key={seat} onClick={() => handleSeatChange(seat + 1)}>
              <Button
                variant={selectedSeats === seat + 1 ? 'contained' : 'outlined'}
                color="primary"
              >
                {seat + 1}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={onClose}
        >
          Select
        </Button>
      </Box>
    </Modal>
  );
};

export default PeopleSelectionModal;
