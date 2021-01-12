import React, { useEffect, useState } from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Favorite from "@material-ui/icons/FavoriteBorder";
import SendIcon from "@material-ui/icons/SendOutlined";
import {
  Button,
  CardActionArea,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";

import { IComment, IImage } from "../../models/post";
import { width, maxHeight, height } from "@material-ui/system";
import {
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
} from "@material-ui/core";
import {
  addComment,
  dislikePost,
  getComments,
  likePost,
  removedisLike,
  removeLike,
} from "../../services/posts";
import { RootState } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { START_LOADING, STOP_LOADING } from "../../redux/ui/actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      marginTop: "5rem",
      maxHeight: "500px",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
    imgContainer: {
      width: "100%",
      maxWidth: "500px",
    },

    levo: {
      display: "flex",
      maxWidth: "auto",
      maxHeight: "100%",
    },

    root: {
      display: "flex",
      maxWidth: "345px",
      flexDirection: "column",
      width: "100%",

      // marginRight: '0',
      // width: "100%"
    },
    comments: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
      filter: "blur(10px)",
    },
    avatar: {
      backgroundColor: red[500],
    },
    modal: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "center",
      boxShadow: theme.shadows[5],
      maxHeight: "100%",
      overflow: "auto",
      position: "absolute",
      marginTop: 200,
      marginBottom: 200,
    },
    button: {
      display: "flex",
      justifyContent: "center",
      paddingBottom: 0,
    },
    form: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },

    btn: {
      width: "20%",
      height: "80%",
      marginRight: 0,
    },
    input: {
      flex: 1,
      width: "80%",
    },
  })
);

function Post(props: { post: IImage }) {
  const { post } = props;

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const loading = useSelector((state: RootState) => state.ui.loading);
  const dispatch = useDispatch();

  const [likes, setLikes] = useState(0);
  const [dislikes, setdisLikes] = useState(0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);

  const [openComments, setOpenComments] = React.useState(false);

  const [comments, setComments] = React.useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setAlreadyLiked(props.post.ifLiked);
    setAlreadyDisliked(props.post.ifDisliked);
    setLikes(props.post.likes);
    setdisLikes(props.post.dislikes);

    return () => {};
  }, []);

  const onInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setNewComment(event.currentTarget.value);
  };
  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    event.preventDefault();
    if (newComment) {
      const id = auth?.id as string;
      addComment(postId, id, newComment).then((res) => {
        setComments([...comments, res]);
      });
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleOpenComments = (imageId: string) => {
    setOpenComments(true);
    getComments(imageId).then((res) => {
      setComments(res);
    });
  };

  const handleCloseComments = () => {
    setOpenComments(false);
  };

  const handleLike = (imageId: string) => {
    if (!alreadyLiked && !alreadyDisliked) {
      likePost(auth?.id as string, imageId).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        setAlreadyLiked(true);
      });
    } else if (!alreadyLiked && alreadyDisliked) {
      removedisLike(auth?.id as string, imageId).then((res) => {
        likePost(auth?.id as string, imageId).then((res) => {
          setLikes((prevLikes) => prevLikes + 1);
          setdisLikes((prevDislikes) => prevDislikes - 1);
          setAlreadyLiked(true);
          setAlreadyDisliked(false);
        });
      });
    } else if (alreadyLiked) {
      removeLike(auth?.id as string, imageId).then((res) => {
        setLikes((prevLikes) => prevLikes - 1);
        setAlreadyLiked(false);
      });
    }
  };

  const handleDislike = (imageId: string) => {
    if (!alreadyLiked && !alreadyDisliked) {
      dislikePost(auth?.id as string, imageId).then((res) => {
        setdisLikes((prevDislikes) => prevDislikes + 1);
        setAlreadyDisliked(true);
      });
    } else if (alreadyLiked && !alreadyDisliked) {
      removeLike(auth?.id as string, imageId).then((res) => {
        dislikePost(auth?.id as string, imageId).then((res) => {
          setLikes((prevLikes) => prevLikes - 1);
          setdisLikes((prevDislikes) => prevDislikes + 1);
          setAlreadyLiked(false);
          setAlreadyDisliked(true);
        });
      });
    } else if (alreadyDisliked) {
      removedisLike(auth?.id as string, imageId).then((res) => {
        setdisLikes((prevdisLikes) => prevdisLikes - 1);
        setAlreadyDisliked(false);
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.levo}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                {/* <img style={{ maxHeight: '100%' }} src={post.user.image} /> */}
              </Avatar>
            }
            title={post.creator.username}
            subheader={post.date}
          />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <CardHeader
              avatar={
                <CardActionArea onClick={() => handleLike(post.id)}>
                  <Avatar className={alreadyLiked ? classes.avatar : ""}>
                    <Favorite />
                  </Avatar>
                </CardActionArea>
              }
              title={likes}
            />
            <CardHeader
              avatar={
                <CardActionArea onClick={() => handleDislike(post.id)}>
                  <Avatar className={alreadyDisliked ? classes.avatar : ""}>
                    <Favorite />
                  </Avatar>
                </CardActionArea>
              }
              title={dislikes}
            />
          </div>

          <CardContent>
            <Typography variant="body2" color="textPrimary">
              {post.content}
            </Typography>
          </CardContent>
          <CardContent>
            <div
              className={classes.button}
              onClick={() => handleOpenComments(post.id)}
            >
              <Button variant="contained" color="secondary">
                Comments
              </Button>
            </div>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openComments}
              onClose={handleCloseComments}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openComments}>
                <List className={classes.comments}>
                  {comments.map((comment) => (
                    <ListItem key={comment.id}>
                      <ListItemAvatar>
                        <Avatar></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={comment.content}
                        secondary={comment.date}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <form
                      className={classes.form}
                      noValidate
                      onSubmit={(event) => onSubmit(event, post.id)}
                    >
                      <TextField
                        label="Add a comment"
                        onChange={onInput}
                        className={classes.input}
                      />
                      <Fab type="submit" color="primary" aria-label="add">
                        <SendIcon />
                      </Fab>
                    </form>
                  </ListItem>
                </List>
              </Fade>
            </Modal>
          </CardContent>
        </Card>
      </div>

      <div className={classes.imgContainer}>
        <img className={classes.img} src={post.sasToken} />
      </div>
    </div>
  );
}

export default Post;
