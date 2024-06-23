import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { withAuthInfo } from '@propelauth/react';
import frog from '../assets/frog-landing.svg';
import topCircles from '../assets/upper-circles.svg';
import lowerCircles from '../assets/lower-circles.svg';

const Landing = withAuthInfo((props) => {
  const navigate = useNavigate();

  const routeChange = () => {
    let path = `carbon-footprint`;
    navigate(path);
  };

  console.log(props.user.email);

  return (
    <Box sx={{ display: 'flex', fontFamily: 'Open Sans', height: '100vh' }}>
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${topCircles}), url(${lowerCircles})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left, bottom left',
        backgroundSize: '25% auto'  // Adjusts the size of both images
      }}>
        <Box sx={{ width: '80%', ml: '10%' }}>
          <Typography variant="h3" component="h1" fontWeight="bold" mb={1}>
            Reduce Your Carbon Footprint
          </Typography>
          <Typography variant="h5" component="p">
            ClimaGuard encourages you to report and manage trash in your community. Each report contributes to our collective understanding of waste impact and helps reduce our carbon footprint. Start today and make a difference for a cleaner, greener tomorrow.
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        backgroundColor: '#58A4B0',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <Box component="img" src={frog} sx={{ width: 200 }}/>
        <Button onClick={routeChange} sx={{
          backgroundColor: '#373F51', 
          color: 'white', 
          borderRadius: '20px', 
          padding: '20px 10px',
          fontWeight: '600',
          fontSize: '18px'
        }}>
          Track and Report Trash!
        </Button>
      </Box>
    </Box>
  );
});

export default Landing;
