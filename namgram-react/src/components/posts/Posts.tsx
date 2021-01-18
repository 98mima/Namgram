import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IUser } from "../../models/user";
import { RootState } from "../../redux";
import { loadPosts } from "../../redux/posts/actions";
import { getRecommended } from "../../services/profile";
import Post from "./Post";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      justifyContent: "center",
      marginLeft: "2rem",
    },
    loading: {
      margin: "20vh auto auto auto",
    },
    button: {
      textDecoration: "none",
    },
    root: {
      width: "500px",
      maxWidth: 360,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.background.paper,
    },
    bigContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    suggestions: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      alignSelf: "flex-start",
      left: "2rem",
      top: "5rem",
    },
    hidden: {
      display: "none",
    },
  })
);

function Posts() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const socket = useSelector((state: RootState) => state.auth.socket);
  const history = useHistory();
  const matches = useMediaQuery("(min-width:850px)");

  const [profiles, setProfiles] = React.useState<IUser[]>([]);

  useEffect(() => {
    if (auth) dispatch(loadPosts(auth?.id as string));
    if (profiles.length === 0) {
      getRecommended(auth?.username as string).then((res) => {
        setProfiles(res);
      });
    }
  }, [auth]);

  const loading = useSelector((state: RootState) => state.ui.loading);

  const visit = (id: string) => {
    history.push(`/profile/${id}`);
  };

  return (
    <div className={classes.bigContainer}>
      <Container
        className={matches && profiles ? classes.suggestions : classes.hidden}
      >
        <Typography style={{ color: "white" }}>Suggestions For You</Typography>
        <List className={classes.root}>
          {profiles.map((person) => (
            <ListItem key={person.id}>
              <ListItemAvatar>
                <Avatar src={person.profilePic}></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={person.username}
                secondary={person.name + " " + person.lastname}
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={() => visit(person.id)}
              >
                Visit
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <div className={classes.container}>
        {loading && (
          <CircularProgress size={"20vw"} className={classes.loading} />
        )}
        {posts &&
          posts.map((post) => (
            <Post
              key={post.id}
              socket={socket as SocketIOClient.Socket}
              post={post}
            />
          ))}
      </div>
    </div>
  );
}

export default Posts;
