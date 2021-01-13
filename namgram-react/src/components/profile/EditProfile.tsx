import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import { SET_ERROR, START_LOADING, STOP_LOADING } from '../../redux/ui/actions';
import Avatar from '@material-ui/core/Avatar/Avatar';
import { changeProfilePicture } from '../../services/auth';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

const useStyles = makeStyles((theme) => ({
    paper: {
      maxWidth: "600px",
      padding: "20px",
      margin: "10vw auto 0 auto",
      height: "50vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    },
    form: {
      
    },
    input: {
      flex: 1,
        width: "80%"
    },
    image: {
      maxWidth: "600px",
    },
    btn:{
      marginTop: "3rem",
      width: "80%",
    },
    avatar: {
        width: "200px",
        height: "200px",
      },
  }));

function EditProfile() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [file, setFile] = useState<File>();
    const auth = useSelector((state: RootState) => state.auth.auth);
    const loading = useSelector((state: RootState) => state.ui.loading);
    const error = useSelector((state: RootState) => state.ui.error);

    
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    if (!event.currentTarget.files?.length) return;
    const name = event.currentTarget.files[0].name;
    if (name.includes(".jpg") || name.includes(".png")) {
      setFile(event.currentTarget.files[0]);
    } else {
        dispatch({type: SET_ERROR, payload: "Tip fajla nije podržan (podržani .jpg i .png)"})
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
        dispatch({type: START_LOADING});
        const id = auth?.id as string;
        changeProfilePicture(id, file).then(res => {
            dispatch({type: STOP_LOADING});
            dispatch({type: SET_ERROR, payload: ""})
            history.push("/profile/" + id);
            //Da bude redirect do slike
        }).catch(err => {
            dispatch({type: STOP_LOADING});
            dispatch({type: SET_ERROR, payload: "Sva polja su obavezna!"})
        })
    } else {
      dispatch({type: SET_ERROR, payload: "Sva polja su obavezna!"})
    }
  };
    
    return (
        <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Paper className={classes.paper}>
            <Typography>Change your profile picture</Typography>
            {file && <Avatar
              className={classes.avatar}
              src={URL.createObjectURL(file)}
            ></Avatar>}
            <input type="file" name="file" onChange={onFileChange} />
            <Button variant="contained" color="primary" className={classes.btn} type="submit">{loading ? <CircularProgress /> : "Submit"}</Button>
            <Typography color="error">{error}</Typography>
        
      </Paper>
     </form>
    )
}

export default EditProfile
