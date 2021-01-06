import React from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Favorite from '@material-ui/icons/FavoriteBorder'
import { CardActionArea, Grid } from '@material-ui/core';

import { IImage } from '../../models/post'
import { width, maxHeight, height } from '@material-ui/system';

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
      maxWidth: '100%',
      height: 'auto',
    },
    imgContainer: {
      width: '100%',
      maxWidth: '500px',
    },

    levo: {
      display: 'flex',
      maxWidth: 'auto',
      maxHeight: '100%'
    },

    root: {
      display: 'flex',
      maxWidth: '345px',
      flexDirection: 'column',
      width: '100%'
      // marginRight: '0',
      // width: "100%" 

    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }),
);

function Post(props: { post: IImage }) {
  const { post } = props;

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={classes.container}>
      <div className={classes.levo}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {/* <img style={{ maxHeight: '100%' }} src={post.user.image} /> */}
              </Avatar>
            }
            subheader={post.date}
          />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <CardHeader
              avatar={
                <CardActionArea><Avatar className={classes.avatar}><Favorite /></Avatar></CardActionArea>
              }
              title={post.likes}
            />
            <CardHeader
              avatar={
                <CardActionArea><Avatar color="primary" className={classes.avatar}><Favorite /></Avatar></CardActionArea>
              }
              title={post.dislikes}
            />
          </div>

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with your
              guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
          </CardContent>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with your

          </Typography>
          </CardContent>
        </Card>
      </div>

      <div className={classes.imgContainer}>
        <img className={classes.img} src={post.sasToken} />
      </div>
    </div >



  );
}

export default Post
