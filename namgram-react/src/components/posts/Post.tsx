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
import { CardActionArea, Grid } from "@material-ui/core";

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
  dislikePost,
  getComments,
  likePost,
  removedisLike,
  removeLike,
} from "../../services/posts";
import { RootState } from "../../redux";
import { useSelector, useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { INC_NOTIFICATIONS } from "../../redux/auth/actions";

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
    },
    avatar: {
      backgroundColor: red[500],
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

function Post(props: { post: IImage, socket: SocketIOClient.Socket }) {
  const { post, socket } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const auth = useSelector((state: RootState) => state.auth.auth);

  const [likes, setLikes] = useState(0);
  const [dislikes, setdisLikes] = useState(0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);

  const [openComments, setOpenComments] = React.useState(false);

  const [comments, setComments] = React.useState<IComment[]>([]);

  useEffect(() => {
    setAlreadyLiked(props.post.ifLiked);
    setAlreadyDisliked(props.post.ifDisliked);
    setLikes(props.post.likes);
    setdisLikes(props.post.dislikes);

    return () => {};
  }, []);

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
        socket.emit("like", {liker: auth?.id, liked: post.creator.id, post: post.id});
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
              {post.content +
                "SLAVISA KURAC saddddddddddddddd asdassadsad asdsadas asdas asdsad asda sd"}
            </Typography>
          </CardContent>
          <CardContent>
            <div onClick={() => handleOpenComments(post.id)}>
              <Typography>Comments</Typography>
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
                <List className={classes.root}>
                  {comments.map((comment) => (
                    <ListItem key={comment.id}>
                      <ListItemAvatar>
                        <Avatar></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={comment.date}
                        secondary={comment.content}
                      />

                      <Typography>KOMENTAR</Typography>
                    </ListItem>
                  ))}
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
