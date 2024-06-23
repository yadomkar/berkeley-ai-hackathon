import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RecyclingIcon from '@mui/icons-material/Recycling';

const CarbonFootprintTracker = () => {
  const [formData, setFormData] = useState({
    type: '',
    quantity: '',
    disposalMethod: ''
  });
  const [emissions, setEmissions] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calculateEmissions = () => {
    const factors = {
      'Plastic': { 'Recycling': -1.5, 'Landfill': 0.15 },
      'Organic': { 'Composting': -0.2, 'Landfill': 0.08 },
      'Metal': { 'Recycling': -9, 'Landfill': 0.01 },
      'Glass': { 'Recycling': -0.315, 'Landfill': 0.02 }
    };
  
    const emissionFactor = factors[formData.type][formData.disposalMethod];
    const calculatedEmissions = (formData.quantity * emissionFactor).toFixed(2);
    setEmissions(`Estimated Emissions from Manual Input: ${calculatedEmissions} lbs CO₂e`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setImagePreview(URL.createObjectURL(file));  // Create a URL for the image to be previewed
  };

  const handleImageUpload = async () => {
    setLoading(true);
    setTimeout(() => {
      setEmissions(`Estimated Emissions from Image: 120 lbs CO₂e`); // Set image emissions as the primary display
      setLoading(false);
    }, 2000); // Simulated delay for async operation
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 5, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', color: 'green' }}>
          <RecyclingIcon sx={{ mr: 1 }} />
          Carbon Footprint Calculator
        </Typography>
        <Box>
          <Button
            variant="contained"
            component="label"
            sx={{ backgroundColor: '#4caf50' }}
          >
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {imagePreview && (
            <Avatar src={imagePreview} sx={{ width: 56, height: 56, ml: 2 }} />
          )}
        </Box>
      </Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type of Waste</InputLabel>
        <Select
          name="type"
          value={formData.type}
          label="Type of Waste"
          onChange={handleInputChange}
        >
          <MenuItem value="Plastic">Plastic</MenuItem>
          <MenuItem value="Organic">Organic</MenuItem>
          <MenuItem value="Metal">Metal</MenuItem>
          <MenuItem value="Glass">Glass</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        name="quantity"
        type="number"
        label="Quantity (lbs)"
        value={formData.quantity}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 3 }}>
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
      <Button variant="contained" onClick={calculateEmissions} sx={{ mr: 2 }}>
        Calculate Manual Emissions
      </Button>
      <Button variant="contained" onClick={handleImageUpload} disabled={!file} sx={{ backgroundColor: '#2196f3' }}>
        Calculate From Image
      </Button>
      <Box sx={{ mt: 3 }}>
        <Typography>{emissions}</Typography>
        {loading && <CircularProgress />}
      </Box>
    </Paper>
  );
};

export default CarbonFootprintTracker;
