import React, { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as lk} from 'react-router-dom'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import bgImg from '../images/background.png'
import * as Constants from '../Constants';
import { sha3_512 } from 'js-sha3';
import FancyCheckbox from './FancyCheckbox.jsx';

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const [isFormInvalid, setIsFormInvalid] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        var prevAuth = JSON.parse(localStorage.getItem('auth'));
        if(prevAuth && prevAuth.success) {
            setAuth(prevAuth);
            navigate('/dashboard');
        }

        document.title = "DNSolver - Login"
        userRef.current.focus();
    }, [setAuth, navigate])

    const handleSubmit = (e) => {
      let hash = sha3_512(pwd);

      e.preventDefault();
      axios.post(Constants.BACKEND_URL + 'login', {
          username: user,
          password: hash
      })
      .then(function (response) {
          setAuth({
              success: true,
              name: response.data.name,
              surname: response.data.surname,
              username: response.data.username
          });

          if(checked){
              localStorage.setItem('auth', JSON.stringify({ success: true,
              name: response.data.name,
              surname: response.data.surname,
              username: response.data.username }));
          }

          navigate('/dashboard');
      })
      .catch(function (error) {
          if (!error?.response) {
              alert('Connection timeout!');
              console.log('Server timeout!');
          } else if (error.response?.status === 404) {
              setIsFormInvalid(true);
              console.log('Wrong username or password!');
          } else if (error.response?.status === 500) {
              alert('Server error!');
              console.log('Server error!');
          } else {
              console.log('Unknown cause (login failed)!');
          }
      });
    }

    const handleCheckOnClick = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }

    function Copyright(props) {
      return (
        <Typography variant = "body2" color = "text.secondary" align = "center" {...props}>
          {'Copyright © '}
          <Link color="inherit" href = { "./" }>
            DNSolver
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    }

    const theme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(' + bgImg +')',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid style = {{backgroundColor: 'rgb(2,52,48)'}} item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <WhiteBorderTextField
                  margin="normal"
                  required
                  fullWidth
                  ref = {userRef}
                  value = {user}
                  onChange={(e) => setUser(e.target.value)}
                  error = { isFormInvalid }
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  style={{color: 'white'}}
                />
                <WhiteBorderTextField
                  margin="normal"
                  required
                  fullWidth
                  value = {pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  error = { isFormInvalid }
                  helperText={isFormInvalid && "Wrong username or password!"}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  style={{ color: 'white'}}
                />
                <FancyCheckbox label = 'Remember me' onChange = {handleCheckOnClick} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{backgroundColor: '#13aa52', color: 'white'}}
                >
                  Log In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link component={lk} to="/signin" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }

export default Login;
