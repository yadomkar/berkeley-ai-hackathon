import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import logo from "../assets/ClimaGuard.png";
import menu from "../assets/menu-icon.svg";
import { Link } from "react-router-dom";
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';

const Navbar = withAuthInfo((props) => {
  const logoutFn = useLogoutFunction();
  const { redirectToSignupPage, redirectToLoginPage } = useRedirectFunctions();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fdfff8',
      filter: 'drop-shadow(2px 2px 4px)',
      width: '100vw',
      height: 60,
      fontFamily: 'Lora',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
        <Typography sx={{ fontSize: 45, fontWeight: 'bold', marginRight: 2 }} color="inherit">
        ClimaGuard
        </Typography>
        <Box component="img" src={logo} alt="logo" sx={{ width: 45, height: 45 }} />
      </Link>
      <IconButton sx={{ marginLeft: 'auto', marginRight: 2, backgroundColor: '#fdfff8', border: 'none' }} onClick={toggleDrawer}>
        <Box component="img" src={menu} alt="menu" />
      </IconButton>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: 300, backgroundColor: '#e0f7fa' } // Background color for the Drawer
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          sx={{ width: 300 }}
        >
          <List>
            <Typography sx={{ ml: 2, mt: 3, fontFamily: 'Lora', fontWeight: 'bold' }}>
              Welcome {props.user.email}
            </Typography>
            <Link to="/upload">
              <ListItem button key="Upload a Picture">
                <ListItemText primaryTypographyProps={{ fontFamily: 'Lora' }} primary="Upload a Picture" />
              </ListItem>
            </Link>
            <Link to="/map">
              <ListItem button key="Waste Map">
                <ListItemText primaryTypographyProps={{ fontFamily: 'Lora' }} primary="Waste Map" />
              </ListItem>
            </Link>
            <Link to='/leaderboard'>
              <ListItem button key="Leaderboards">
                <ListItemText primaryTypographyProps={{ fontFamily: 'Lora' }} primary="Leaderboards" />
              </ListItem>
            </Link>
            <ListItem button key="Logout" onClick={() => logoutFn()}>
              <ListItemText primaryTypographyProps={{ fontFamily: 'Lora' }} primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
});

export default Navbar;
