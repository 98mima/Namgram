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
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    margin: theme.spacing(3),
    marginBottom: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "space-around",
    padding: "0 5px",

    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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

  const [openFollowers, setOpenFollowers] = React.useState(false);
  const [openFollowing, setOpenFollowing] = React.useState(false);
  const [change, setChange] = React.useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(loadProfile(id));
    }
    if (
      profile &&
      auth?.following.some((user) => user.username == profile?.username)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
    return () => {};
  }, [auth, profile]);

  const following = (username: string) => {
    if (
      profile &&
      username &&
      auth?.following.some((user) => user.username == username)
    )
      return true;
    else return false;
  };
  const handleEdit = () => {
    console.log(profile?.following);
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
    setIsFollowing(false);
  };
  const handleFollowFromList = (username: string) => {
    const username1 = auth?.username;
    const username2 = username;
    follow(username1 as string, username2 as string);
  };
  const handleUnFollowFromList = (username: string) => {
    const username1 = auth?.username;
    const username2 = username;
    unfollow(username1 as string, username2 as string);
  };

  const checkMyProfile = () => {
    if (!auth) return false;
    else {
      return profile?.id == auth?.id;
    }
  };
  const handleOpenFollowers = () => {
    setOpenFollowers(true);
  };

  const handleCloseFollowers = () => {
    setOpenFollowers(false);
  };

  const handleOpenFollowing = () => {
    setOpenFollowing(true);
  };

  const handleCloseFollowing = () => {
    setOpenFollowing(false);
  };
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

            <br />
            <Typography variant="h4">{profile.username}</Typography>
            <Grid container>
              <Grid className={classes.count} item xs={4}>
                <Typography>{profile?.posts.length}</Typography>
                <Typography>Posts</Typography>
              </Grid>
              <Grid className={classes.count} item xs={4}>
                <div>
                  <div onClick={handleOpenFollowers}>
                    <Typography>{profile?.followers.length}</Typography>
                    <Typography>Followers</Typography>
                  </div>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openFollowers}
                    onClose={handleCloseFollowers}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={openFollowers}>
                      <List className={classes.root}>
                        {profile.followers.map((person) => (
                          <ListItem key={person.id}>
                            <ListItemAvatar>
                              <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={person.username}
                              secondary={person.name + " " + person.lastname}
                            />
                            {person.id != auth?.id &&
                              following(person.username) && (
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleUnFollowFromList(
                                      person.username as string
                                    )
                                  }
                                >
                                  Unfollow
                                </Button>
                              )}
                            {person.id != auth?.id &&
                              !following(person.username) && (
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleFollowFromList(
                                      person.username as string
                                    )
                                  }
                                >
                                  Follow
                                </Button>
                              )}
                          </ListItem>
                        ))}
                      </List>
                    </Fade>
                  </Modal>
                </div>
              </Grid>
              <Grid className={classes.count} item xs={4}>
                <div>
                  <div onClick={handleOpenFollowing}>
                    <Typography>{profile?.following.length}</Typography>
                    <Typography>Following</Typography>
                  </div>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openFollowing}
                    onClose={handleCloseFollowing}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={openFollowing}>
                      <List className={classes.root}>
                        {profile.following.map((person) => (
                          <ListItem key={person.id}>
                            <ListItemAvatar>
                              <Avatar src="data:image/jpeg;base64,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"></Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={person.username}
                              secondary={person.name + " " + person.lastname}
                            />

                            {person.id != auth?.id &&
                              following(person.username) && (
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleUnFollowFromList(
                                      person.username as string
                                    )
                                  }
                                >
                                  Unfollow
                                </Button>
                              )}
                            {person.id != auth?.id &&
                              !following(person.username) && (
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleFollowFromList(
                                      person.username as string
                                    )
                                  }
                                >
                                  Follow
                                </Button>
                              )}
                          </ListItem>
                        ))}
                      </List>
                    </Fade>
                  </Modal>
                </div>
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
                <img src={post.sasToken} alt={"Slicka bato"} />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
      )}
    </Container>
  );
}

export default Profile;
