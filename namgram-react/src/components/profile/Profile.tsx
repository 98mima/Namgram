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

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "../../redux/profile/actions";
import { RootState } from "../../redux";
import { follow, unfollow, getFollowers } from "../../services/profile";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(3),
    marginBottom: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "space-around",
    padding: "0 5px",
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
      backgroundColor: "rgb(0, 0, 0, 0.1)",
      cursor: "pointer",
      borderRadius: "5%",
    },
  },
  gridList: {
    paddingTop: "20px",
    width: "100%",
    height: "50vh",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Profile() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const error = useSelector((state: RootState) => state.ui.error);
  const loading = useSelector((state: RootState) => state.ui.loading);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(loadProfile(id));
    }
    console.log(isFollowing);
    if (auth?.following.find((user) => user.username == profile?.username)) {
      setIsFollowing(true);
    }
    return () => {};
  }, [auth, profile, isFollowing]);

  const handleEdit = () => {
    //history.push("/profile/edit/" + auth?.id);
  };
  const handleFollow = () => {
    const username1 = auth?.username;
    const username2 = profile?.username;
    follow(username1 as string, username2 as string);
    setIsFollowing(true);
  };
  const handleUnFollow = () => {
    const username1 = auth?.username;
    const username2 = profile?.username;
    unfollow(username1 as string, username2 as string);
    if (isFollowing == true) setIsFollowing(false);
  };

  const checkMyProfile = () => {
    if (!auth) return false;
    else {
      return profile?.id == auth?.id;
    }
  };

  const close = () => (
    <div className="modal">
      <button className="close" onClick={close}>
        &times;
      </button>
      <div className="header"> Modal Title </div>
      <div className="content">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a
        nostrum. Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam
        voluptates delectus doloremque, explicabo tempore dicta adipisci fugit
        amet dignissimos?
        <br />
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur
        sit commodi beatae optio voluptatum sed eius cumque, delectus saepe
        repudiandae explicabo nemo nam libero ad, doloribus, voluptas rem alias.
        Vitae?
      </div>
      <div className="actions">
        <Popup
          trigger={<button className="button"> Trigger </button>}
          position="top center"
          nested
        >
          <span>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
            magni omnis delectus nemo, maxime molestiae dolorem numquam
            mollitia, voluptate ea, accusamus excepturi deleniti ratione
            sapiente! Laudantium, aperiam doloribus. Odit, aut.
          </span>
        </Popup>
        <button
          className="button"
          onClick={() => {
            console.log("modal closed ");
            close();
          }}
        >
          close modal
        </button>
      </div>
    </div>
  );

  return (
    <Container component="main" maxWidth="xs">
      {error && <Typography>{error}</Typography>}
      {loading && <CircularProgress className={classes.loading} />}
      {profile && (
        <Paper variant="outlined" className={classes.paper}>
          <div className={classes.container}>
            <Avatar
              className={classes.avatar}
              src="https://miro.medium.com/max/10368/1*o8tTGo3vsocTKnCUyz0wHA.jpeg"
            ></Avatar>
            <Popup
              trigger={<button className="button"> Open Modal </button>}
              modal
              nested
            >
              <List className={classes.root}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Vacation" secondary="July 20, 2014" />
                </ListItem>
              </List>
            </Popup>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleEdit}
              >
                Izmeni profil
              </Button>
            )}
            {!checkMyProfile() && !isFollowing && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleFollow}
              >
                Follow
              </Button>
            )}
            {!checkMyProfile() && isFollowing && (
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={handleUnFollow}
              >
                Unfollow
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
