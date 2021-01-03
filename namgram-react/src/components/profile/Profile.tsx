import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "../../redux/profile/actions";
import { RootState } from "../../redux";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "space-around",
    padding: "0 5px"
  },
  avatar: {
    width: "200px",
    height: "200px",
  },
  loading: {
    width: "500px",
    height: "500px",
    margin: "0 auto",
  },
  userName: {
    display: "flex",
    flexDirection: "row",
  },
  count: {
      textAlign: "center",
      "&:hover": {
        backgroundColor: 'rgb(0, 0, 0, 0.1)',
        cursor: "pointer",
        borderRadius: "5%"
      }
  },
  gridList: {
    paddingTop: "20px",
    width: "100%",
    height: "50vh",
  },
}));

function Profile() {
  const { id } = useParams<{id: string}>();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const error = useSelector((state: RootState) => state.ui.error);
  const loading = useSelector((state: RootState) => state.ui.loading);
  const auth = useSelector((state: RootState) => state.auth.auth);

  useEffect(() => {
    dispatch(loadProfile(id));
    return () => {};
  }, []);

  const handleEdit = () => {
    //history.push("/profile/edit/" + auth?.id);
  };

  const checkMyProfile = () => {
      if(!auth) return false;
      else{
          return profile?.id == auth?.id;
      }
  }

  return (
    <Container component="main" maxWidth="xs">
      {error && <Typography>{error}</Typography>}
      {loading && <CircularProgress className={classes.loading} />}
      {profile && (
        <Paper variant="outlined" className={classes.paper}>
          <div className={classes.container}>
            <Avatar className={classes.avatar} src="https://miro.medium.com/max/10368/1*o8tTGo3vsocTKnCUyz0wHA.jpeg"></Avatar>
            <br />
            <Typography variant="h4">{profile.username}</Typography>
            <Grid container>
                <Grid className={classes.count} item xs={4}>
                    <Typography>{profile?.posts.length}</Typography>
                    <Typography>Posts</Typography>
                </Grid>
                <Grid className={classes.count} item xs={4}>
                    <Typography>{profile?.followers.length}</Typography>
                    <Typography>Followers</Typography>
                    
                </Grid>
                <Grid className={classes.count} item xs={4}>
                    <Typography>{profile?.following.length}</Typography>
                    <Typography>Following</Typography>
                </Grid> 
            </Grid>
            {checkMyProfile() && (
              <Button type="submit" variant="contained" color="primary" onClick={handleEdit}>
                Izmeni profil
              </Button>
            )}
          </div>
            <GridList cellHeight={160} className={classes.gridList} cols={3}>
                {profile.posts.map((post, i) => (
                    <GridListTile key={i} cols={1}>
                    <img src={post.image} alt={"DIK"} />
                    </GridListTile>
                ))}
            </GridList>
        </Paper>
      )}
    </Container>
  );
}

export default Profile;
