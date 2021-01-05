import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";


//MUI
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  fileControl: {
    margin: "0 auto",
  },
  container: {
    height: "80vw",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paper: {
    maxWidth: "600px",
    margin: "10vw auto 0 auto",
  },
}));

function CreatePost() {
  const classes = useStyles();
  const history = useHistory();

  const [caption, setCaption] = useState("");
    const auth = useSelector((state: RootState) => state.auth.auth);

  useEffect(() => {
    return () => {};
  }, []);

  const onInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCaption(event.currentTarget.value);
  };


  const onFileChange = () => {
    // if (!event.target.files.length) return;
    // const name = event.target.files[0].name;
    // if (name.includes(".jpg") || name.includes(".png")) {
    //   setFile(event.target.files[0]);
    // } else {
    //   setError("Tip fajla nije podržan (podržani .jpg i .png)");
    // }
  };

  const onSubmit = () => {
    // event.preventDefault();
    // if (courseId && examType && year && term && file) {
    //   postExamPaper(courseId, examType, year, term, file)
    //     .then((data) => {
    //       history.push("/");
    //       alert("Uspešno ste dodali blanket. potrebno je samo još Administrator da odobri dodavanje.");
    //     })
    //     .catch((err) => setError(err.message));
    // } else {
    //   setError("Sva polja su obavezna!");
    // }
  };

  const getTerms = () => ["Januar", "April", "Jun I", "Jun II", "Septembar", "Oktobar", "Novembar", "Decembar"];
  const getTypes = () => ["Pismeni", "Usmeni", "Kolokvijum I", "Kolokvijum II", "Kolokvijum III"];

  return (
    <Paper className={classes.paper}>

    </Paper>
  );
}

export default CreatePost;