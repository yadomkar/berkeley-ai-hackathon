import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, List, ListItem, CircularProgress } from '@mui/material';
import { Link } from "react-router-dom";
import axios from 'axios';
import { withAuthInfo } from '@propelauth/react';

const Leaderboard = withAuthInfo((props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = {
    headers: {
      'Authorization': 'Bearer ' + props.accessToken
    }
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/rewards`, config)
    .then(response => {
      console.log("response from server", response.data);
      setUsers(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    });
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: 'Open Sans',
    }}>
      <Typography variant="h4" sx={{
        textAlign: 'center',
        alignSelf: 'center',
        width: '100%',
        mt: 2,
        mb: 2
      }}>
        Leaderboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{
          listStylePosition: 'inside',
          paddingLeft: 0,
          alignSelf: 'center',
          width: '90%',
          bgcolor: 'background.paper'
        }}>
          {users.map((user, index) => (
            <ListItem sx={{
              bgcolor: '#C5D8A4',
              p: 2,
              m: 1,
              borderRadius: 2,
            }} key={index}>
              <Typography variant="body1">
                <b>{user.username}</b> ({user.points} points)
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        mt: 3,
      }}>
        <Link to='/map' style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{
            bgcolor: '#373F51',
            color: 'white',
            p: 2,
            borderRadius: 2,
            fontWeight: 'bold',
          }}>
            Go find places to raise your points
          </Button>
        </Link>
      </Box>
    </Box>
  );
});

export default Leaderboard;
