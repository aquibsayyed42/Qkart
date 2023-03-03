import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
// import { Navigate } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  const goToExplore = () => {
     history.push("/products")
  }

  const goToRegister = () => {
     history.push("/register")
  }

  const goToLogin = () => {
     history.push("/login")
  }

  const logout = () => {
    localStorage.clear();
    window.location.reload();
     history.push("/")
  }
  useEffect(() => {
    if (localStorage.getItem("username")){
       setIsLoggedIn(true)
       }
  },[])

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Link to ="/" className="link">
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text" onClick={goToExplore}
        >
          Back to explore
        </Button>
        </Link>
      </Box>
    );
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {!isLoggedIn ? (
          <>
          <Box sx={{width:0.4}}>{children}</Box>
          <Stack direction="row" spacing={2}>
            <Button onClick={goToLogin}>Login</Button>
            <Button variant="contained" role="button" onClick={goToRegister}>Register</Button>
          </Stack>
          </>
        ) : (
          <>
          <Box sx={{width:0.4}}>{children}</Box>
          <Stack direction="row" spacing={2}>         
            <Box display="flex">
              <Avatar src="avatar.png" alt={localStorage.getItem("username")} />
              <Button>{localStorage.getItem("username")}</Button>
            </Box>
            <Button onClick={logout}>Logout</Button>
          </Stack>
          </>
        )}
      </Box>
    );
};

export default Header;
