import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";

import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { usernameValidator } from "../utils/validators";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import { server } from "../constants/config";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate()
  const toogleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async(e) => {
    e.preventDefault();
    const toastId= toast.loading("Logging In...")
    setIsLoading(true)
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

   try {
    const {data} = await axios.post(`${server}/api/v1/user/login`,{
      username: username.value,
      password: password.value,
    },config)
    navigate("/");
    dispatch(userExists(data.user));
    toast.success(data.message,{id:toastId})
    
   } catch (error) {
    toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId}
    )
    
   }finally{
    setIsLoading(false)
   }
    
  }
  const handelSignUp= async(e) => {
    e.preventDefault();
    const toastId= toast.loading("Signing Up...") 
    setIsLoading(true)

    
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);


    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message,{id:toastId});
      
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId}
      )
    }finally{
      setIsLoading(false)
    }
    }
  
  return (
    <div style={{backgroundImage:"linear-gradient(rgba(250,250,255,1) 0%, rgba(76,145,240,0.6587885154061625) 45%, rgba(0,102,255,1) 85%)"}}>
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>

            <form
              style={{ width: "100%", marginTop: "1rem" }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />
              <Button
                sx={{ marginTop: "1rem" }}
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                disabled={isLoading}
              >
                Login
              </Button>

              <Typography textAlign={"center"} m={"1rem"}>
                Don't have an account..?
              </Typography>
              <Button
                // sx={{ marginTop: "1rem" }}
                fullWidth
                variant="text"
                color="secondary"
                onClick={toogleLogin}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5">Sign Up</Typography>

            <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handelSignUp}>
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{ width: "10rem", height: "10rem", objectFit: "contain" }}
                  src={avatar.preview}
                />
                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    textAlign={"center"}
                    color={"red"}
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                  component="label"
                >
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </>
                </IconButton>
              </Stack>
              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />

              {username.error && (
                <Typography
                  textAlign={"center"}
                  color={"red"}
                  variant="caption"
                >
                  {username.error}
                </Typography>
              )}
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />

              {password.error && (
                <Typography
                  textAlign={"center"}
                  color={"red"}
                  variant="caption"
                >
                  {password.error}
                </Typography>
              )}
              <Button
                sx={{ marginTop: "1rem" }}
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                disabled={isLoading}
              >
                Sign Up
              </Button>

              <Typography textAlign={"center"} m={"1rem"}>
                Already have an account..?
              </Typography>
              <Button
                // sx={{ marginTop: "1rem" }}
                fullWidth
                variant="text"
                color="secondary"
                onClick={toogleLogin}
                disabled={isLoading}
              >
                Login
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
    </div>
  );
};

export default Login;
