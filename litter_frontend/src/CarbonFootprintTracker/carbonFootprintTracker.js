import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Paper, Icon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RecyclingIcon from '@mui/icons-material/Recycling';

const CarbonFootprintTracker = () => {
  const [formData, setFormData] = useState({
    type: '',
    quantity: '',
    disposalMethod: ''
  });
  const [emissions, setEmissions] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculateEmissions = () => {
    // Real emission factors based on environmental impact assessments
    const factors = {
      'Plastic': { 'Recycling': -1.5, 'Landfill': 0.15 },
      'Organic': { 'Composting': -0.2, 'Landfill': 0.08 },
      'Metal': { 'Recycling': -9, 'Landfill': 0.01 },
      'Glass': { 'Recycling': -0.315, 'Landfill': 0.02 }
    };
  
    // Calculate the emissions using the selected type and disposal method
    const emissionFactor = factors[formData.type][formData.disposalMethod];
    const calculatedEmissions = (formData.quantity * emissionFactor).toFixed(2);
    setEmissions(calculatedEmissions);
  };  

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 5, bgcolor: 'background.paper' }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ color: 'green', fontWeight: 'medium' }}>
        <RecyclingIcon sx={{ mr: 1, verticalAlign: 'center', color: 'green' }} />
        Carbon Footprint Tracker
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Type of Waste</InputLabel>
        <Select
          name="type"
          value={formData.type}
          label="Type of Waste"
          onChange={handleInputChange}
          startAdornment={<Icon edge="start"><DeleteIcon /></Icon>}
        >
          <MenuItem value="Plastic">Plastic</MenuItem>
          <MenuItem value="Organic">Organic</MenuItem>
          <MenuItem value="Metal">Metal</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        name="quantity"
        type="number"
        label="Quantity (lbs)"
        value={formData.quantity}
        onChange={handleInputChange}
        sx={{ mb: 3 }}
      />
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Disposal Method</InputLabel>
        <Select
          name="disposalMethod"
          value={formData.disposalMethod}
          label="Disposal Method"
          onChange={handleInputChange}
        >
          <MenuItem value="Recycling">Recycling</MenuItem>
          <MenuItem value="Landfill">Landfill</MenuItem>
          <MenuItem value="Composting">Composting</MenuItem>
        </Select>
      </FormControl>
      <Button 
        variant="contained" 
        onClick={calculateEmissions} 
        sx={{ 
        py: 1.5, 
        fontSize: '1.1rem', 
        backgroundColor: 'blue', // You can specify any color here, like '#007bff' for a Bootstrap-like blue
        '&:hover': {
        backgroundColor: 'darkblue' // Darken the button on hover
    }
  }}
>
  Calculate Emissions
</Button>

      <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
      Estimated Emissions: {emissions} lbs CO₂e
      </Typography>
    </Paper>
  );
};

export default CarbonFootprintTracker;
