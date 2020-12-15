import { ISignin } from "../../models/auth";
import { signin } from "../../services/auth"
import { SET_ERROR, START_LOADING } from "../ui/actions";

import jwtDecode from 'jwt-decode'

export const SIGN_IN_USER = 'SIGN_IN_USER';

export const authUser = () => (dispatch: any) => {
    // const token = localStorage.TOKEN;
    // if (token) {
    //   const decodedToken = jwtDecode(token);
    //   if (decodedToken.exp * 1000 < Date.now()) {
    //     dispatch(logoutUser());
    //     window.location.href = "/login";
    //   } else {
    //     getUser(decodedToken.unique_name)
    //       .then((res) => {
    //         dispatch({ type: SET_USER, payload: res });
    //         dispatch({ type: CLEAR_EXAM_PAPERS });
    //         dispatch({ type: CLEAR_ANSWERS });
    //         dispatch({ type: CLEAR_QUESTIONS });
    //         axios.defaults.headers.common["Authorization"] = token;
    //       })
    //       .catch((err) => console.log("Bad token"));
    //   }
    // }
  };

export const sigin = (user: ISignin) => (dispatch: any) => {
    dispatch({ type: START_LOADING });
    // signin(user)
    //   .then(() => {
    //     const t = 's';
    //     const token = `Bearer ${t}`;
    //     window.localStorage.setItem('TOKEN', token);
    //     //axios.defaults.headers.common["Authorization"] = token;
    //     const decodedToken = jwtDecode(token);
    //   })
    //   .catch((err: string) => {
    //     dispatch({ type: SET_ERROR, payload: err });
    //   });
  };