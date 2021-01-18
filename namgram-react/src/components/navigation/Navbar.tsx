import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Avatar,
  Button,
  createStyles,
  Fade,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AutoComplete from "@material-ui/lab/AutoComplete";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { logoutAction } from "../../redux/auth/actions";
import { AddCircleRounded, LocationDisabledSharp } from "@material-ui/icons";
import { DebounceInput } from "react-debounce-input";
import { IUser } from "../../models/user";
import { getProfileByUsername } from "../../services/profile";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField/TextField";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import _ from "lodash";
import { getUserById } from "../../services/user";
import { getPost } from "../../services/posts";
import { IImage, INotification } from "../../models/post";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    btn: {
      color: "white",
      paddingRight: "1rem",
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    logo: {
      background: "white",
      borderRadius: "10%",
      height: "50px",
      width: "70px",
      "&:hover": {
        background: "rgb(220, 220, 220, 50)",
        cursor: "pointer",
      },
    },
  })
);

function Navbar() {
  const [anchorNotif, setAnchorNotif] = React.useState<null | HTMLElement>(
    null
  );

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifs([]);
    notifications.map((not) => {
      Promise.all([getUserById(not.liker), getPost(not.post)])
        .then((res: [{message: string, Data: IUser}, IImage]) => {
          let n: INotification = {
            liker: res[0].Data.username,
            post: res[1].id,
          };
          setNotifs([...notifs, n]);
          console.log(res)
        })
    });
    setAnchorNotif(anchorNotif ? null : event.currentTarget);
  };
  const [notifs, setNotifs] = React.useState<INotification[]>([]);

  const open = Boolean(anchorNotif);
  const id = open ? "transitions-popper" : undefined;

  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth.auth);
  const chatNotifications = useSelector((state: RootState) => state.chat.chatNotifications);
  const notifications = useSelector(
    (state: RootState) => state.auth.notifications
  );

  const [searchResults, setSearchResults] = useState<IUser[]>([]);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMyProfile = () => {
    history.push(("/profile/" + auth?.id) as string);
    handleMenuClose();
  };
  const handeNewPost = () => {
    history.push("/posts/create");
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    handleMenuClose();
  };

  const handleHome = () => {
    if (auth) history.push("/posts");
    else history.push("/");
  };

  const searchUsers = (username: any) => {
    getProfileByUsername(username).then((profile) => {
      setSearchResults([profile]);
    });
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMyProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link className={classes.link} to="/posts/create">
          <IconButton aria-label="Add new image" color="inherit">
            <AddCircleRounded />
          </IconButton>
        </Link>
        <p>Add post</p>
      </MenuItem>
      <MenuItem>
        <Link className={classes.link} to="/chat">
          <IconButton aria-label="Chat" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
        </Link>
        <p>Messages</p>
      </MenuItem>
      {/* <MenuItem>
        <IconButton
          aria-describedby={id}
          type="button"
          onClick={handleNotificationOpen}
          color="inherit"
          aria-label="show new notifications"
        >
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
          <Popper id={id} open={open} anchorEl={anchorNotif} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div>The content of the Popper.</div>
              </Fade>
            )}
          </Popper>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" className={classes.link}>
            <img
              className={classes.logo}
              src="https://cdn.discordapp.com/attachments/777890574253817889/792441180054749224/e52d18ae-4e0c-40cf-8d30-07396304f4e0_200x200.png"
            />
          </Link>
          {/* <Typography className={classes.title} variant="h6" noWrap>
            namgram
          </Typography> */}
          <div className={classes.search}>
            <AutoComplete
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              style={{ width: 200 }}
              options={searchResults}
              renderOption={(profile) => {
                if (profile)
                  return (
                    <div
                      onClick={() => {
                        history.push("/profile/" + profile.id);
                      }}
                    >
                      <Avatar src={profile.profilePic} />
                      {"    " + profile.username}
                    </div>
                  );
                else return <React.Fragment>Not found</React.Fragment>;
              }}
              renderInput={(params) => (
                <TextField {...params} label="" variant="standard" />
              )}
              onInputChange={(event, newValue) => searchUsers(newValue)}
              onClick={() => {
                console.log("klik");
              }}
              getOptionLabel={(profile: IUser | undefined) => {
                return profile ? profile.username : "Not found";
              }}
            />
          </div>
          <Link className={classes.link} to="/hot">
                  <IconButton aria-label="Whats hot?" color="inherit">
                    <WhatshotIcon />
                  </IconButton>
          </Link>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {!auth ? (
              <div>
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  <Button
                    className={classes.btn}
                    variant="outlined"
                    color="primary"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="secondary">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <Link className={classes.link} to="/posts/create">
                  <IconButton aria-label="Add new image" color="inherit">
                    <AddCircleRounded />
                  </IconButton>
                </Link>
                <Link className={classes.link} to="/chat">
                  <IconButton aria-label="Chat" color="inherit">
                    <Badge badgeContent={chatNotifications} color="secondary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                </Link>
                <IconButton
                  aria-describedby={id}
                  type="button"
                  onClick={handleNotificationOpen}
                  color="inherit"
                  aria-label="show new notifications"
                >
                  <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                  {/* <Popper id={id} open={open} anchorEl={anchorNotif} transition>
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        {notifs.map((not) => (
                          // <Typography key={i}>{not.liker} sadsad</Typography>
                        ))}
                      </Fade>
                    )}
                  </Popper> */}
                  {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorNotif}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography >The content of the Popover.</Typography>
      </Popover> */}
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {/* <AccountCircle /> */}
                  <Avatar src={auth.profilePic} />
                </IconButton>{" "}
              </div>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Navbar;
