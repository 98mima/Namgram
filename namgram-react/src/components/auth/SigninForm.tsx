import React, { useState } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

import { ISignin } from '../../models/auth'
import { signin } from "../../services/auth";
import { useDispatch, useSelector } from 'react-redux'
import { START_LOADING, STOP_LOADING } from '../../redux/ui/actions'
import { RootState } from '../../redux/index'


const useStyles = makeStyles((theme: Theme) => ({
    paper: {
      paddingTop: '10vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgb(255, 255, 255)',
      padding: '4rem',
      borderRadius: '5%'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));





function SigninForm() {
    const dispatch = useDispatch()
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loading = useSelector((state: RootState) => state.ui.loading);
    
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const user: ISignin = {email, password};
      dispatch({type: START_LOADING});
      await signin(user);
      dispatch({type: STOP_LOADING});
    }

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
        <form onSubmit={onSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          {loading ? <CircularProgress color="secondary" /> : "Sign in"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        Kopirajt
      </Box>
    </Container>
    )
}

export default SigninForm
