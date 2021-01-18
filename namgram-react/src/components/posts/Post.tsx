import React, { useState } from "react";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import Satisfied from "@material-ui/icons/SentimentVerySatisfiedOutlined";
import Dissatisfied from "@material-ui/icons/SentimentDissatisfied";
import SendIcon from "@material-ui/icons/SendOutlined";

import {
  Button,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Paper,
  TextField,
} from "@material-ui/core";

import moment from "moment"
import { IComment, IImage } from "../../models/post";
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
  deletePost,
  dislikePost,
  getComments,
  likePost,
  removedisLike,
  removeLike,
} from "../../services/posts";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { IUser } from "../../models/user";

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
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: 500,
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
    deleteBtn: {
      color: "red",
    },
  })
);
//@ts-ignore
function PaperComponent(props) {
  return <Paper {...props} />;
}

function Post(props: { post: IImage; socket: SocketIOClient.Socket }) {
  const { post, socket } = props;
  const classes = useStyles();
  const auth = useSelector((state: RootState) => state.auth.auth);
  const history = useHistory();

  const [likes, setLikes] = useState(props.post.likes);
  const [dislikes, setdisLikes] = useState(props.post.dislikes);
  const [alreadyLiked, setAlreadyLiked] = useState(props.post.ifLiked);
  const [alreadyDisliked, setAlreadyDisliked] = useState(props.post.ifDisliked);

  const [openComments, setOpenComments] = React.useState(false);

  const [comments, setComments] = React.useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    console.log(comments);
    if (newComment) {
      const id = auth?.id as string;
      addComment(postId, id, newComment).then((res) => {
        console.log(res);
        const id = Math.random().toString();

        const user: IUser = {
          //@ts-ignore
          id: auth?.id,
          //@ts-ignore
          email: auth?.email,
          //@ts-ignore
          lastname: auth?.lastname,
          //@ts-ignore
          name: auth?.name,
          //@ts-ignore
          username: auth?.username,
          //@ts-ignore
          password: "1",
          //@ts-ignore
          profilePic: auth?.profilePic,
          //@ts-ignore
          birthday: new Date(),
        };
        const com: IComment = {
          id: id,
          content: res.content,
          date: res.date,
          creator: user,
        };
        setComments([...comments, com]);
        setNewComment("");
      });
    }
  };
  const handleClick = (userId: string) => {
    history.push(`/profile/${userId}`);
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

  const handleDelete = (imageId: string) => {
    deletePost(imageId);
    history.push(`/profile/${auth?.id}`);
  };

  const handleLike = (imageId: string) => {
    if (!alreadyLiked && !alreadyDisliked) {
      likePost(auth?.id as string, imageId).then((res) => {
        setLikes((prevLikes) => prevLikes + 1);
        socket.emit("like", {
          liker: auth?.id,
          liked: post.creator.id,
          post: post.id,
        });
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
              <CardActionArea onClick={() => handleClick(post.creator.id)}>
                <Avatar src={post.creator.profilePic} />
              </CardActionArea>
            }
            title={post.creator.username}
            subheader={moment(new Date(post.date)).fromNow()}
          />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <CardHeader
              avatar={
                <CardActionArea onClick={() => handleLike(post.id)}>
                  <Avatar className={alreadyLiked ? classes.avatar : ""}>
                    <Satisfied />
                  </Avatar>
                </CardActionArea>
              }
              title={likes}
            />
            <CardHeader
              avatar={
                <CardActionArea onClick={() => handleDislike(post.id)}>
                  <Avatar className={alreadyDisliked ? classes.avatar : ""}>
                    <Dissatisfied />
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
                        <CardActionArea
                          onClick={() => handleClick(comment.creator.id)}
                        >
                          <Avatar src={comment.creator.profilePic}></Avatar>
                        </CardActionArea>
                      </ListItemAvatar>

                      <ListItemText
                        primary={comment.creator.username}
                        secondary={comment.content}
                      />
                      <Typography>{moment(comment.date).fromNow()}</Typography>
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
          {auth?.id === post.creator.id && (
            <CardContent className={classes.button}>
              <Button
                variant="contained"
                className={classes.deleteBtn}
                onClick={handleClickOpen}
              >
                Delete
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
              >
                <DialogTitle
                  style={{ cursor: "move" }}
                  id="draggable-dialog-title"
                >
                  Delete Post
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this post?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose} color="primary">
                    No
                  </Button>
                  <Button onClick={() => handleDelete(post.id)} color="primary">
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          )}
        </Card>
      </div>

      <div className={classes.imgContainer}>
        <img alt="slicka" className={classes.img} src={post.sasToken} />
      </div>
    </div>
  );
}

export default Post;
