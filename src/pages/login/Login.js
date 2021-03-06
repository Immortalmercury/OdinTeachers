import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  FormControlLabel,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// context
import { useUserDispatch, loginUser } from "./../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginValue, setLoginValue] = useState("jaglin");
  const [remember, setRemember] = useState(false);
  const [passwordValue, setPasswordValue] = useState("95784268");
  // const [showPasswordValue, setShowPasswordValue] = useState(false);


  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error ? 
            (<Typography color="error"  className={classes.errorMessage}>
            {error}
            </Typography>) : null
        }
        <div className={classes.form} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="?????????? ?????? Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => { setLoginValue(e.target.value); setError(false);}}
            onClick={(e) => { if (error) setError(false);}}
            error={error ? true : false}
            value = {loginValue}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="????????????"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => {setPasswordValue(e.target.value); setError(false);}}
            onClick={(e) => { if (error) setError(false);}}
            error = {error? true:false}
            value={passwordValue}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" checked={remember}
                              onClick={(e) => setRemember(!remember)}/>}
            label="?????????????????? ????????"
          />
          <Button
            // type="submit"
            disabled={isLoading}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() =>
              loginUser(
                userDispatch,
                loginValue,
                passwordValue,
                remember,
                props.history,
                setIsLoading,
                setError
              )
            }
          >
            ????????
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link disabled variant="body2">
                ???????????? ?????????????
              </Link>
            </Grid>
          </Grid> */}
        </div>
      </div>
    </Container>
  );
}

export default withRouter(Login);