import { IAuth, ISignin, ISigninRes, ISignup, ISignupRes } from "../../models/auth";
import { signin, signup } from "../../services/auth"
import { SET_ERROR, CLEAR_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";

import jwtDecode from 'jwt-decode'
import axios, { AxiosError } from 'axios'

export const SET_AUTH = 'SET_AUTH';
export const CLEAR_AUTH = 'CLEAR_AUTH';

export interface SetAuthAction {
  type: typeof SET_AUTH,
  payload: IAuth
}

export interface ClearAuthAction {
  type: typeof CLEAR_AUTH
}

export type AuthActionTypes = SetAuthAction | ClearAuthAction

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

export const signinAction = (user: ISignin) => (dispatch: any) => {
    dispatch({ type: START_LOADING });
    signin(user)
      .then((res : ISigninRes | AxiosError<string>) => {
        dispatch({ type: CLEAR_ERROR });
        const token = `Bearer ${(res as ISigninRes).AuthToken}`;
        window.localStorage.setItem('TOKEN', token);
        axios.defaults.headers.common["Authorization"] = token;
        const decodedToken: IAuth= jwtDecode(token);
        dispatch({type: SET_AUTH, payload: decodedToken.id})
        dispatch({type: STOP_LOADING});
        window.location.href = '/';
      })
      .catch((err : AxiosError<string>) => {
        dispatch({type: STOP_LOADING});
        dispatch({ type: SET_ERROR, payload: err.message });
      });
  };

  export const signupAction = (user: ISignup) => (dispatch: any) => {
    dispatch({ type: START_LOADING });
    signup(user)
      .then((res : ISignupRes | AxiosError<string>) => {
        dispatch({ type: CLEAR_ERROR });
        const token = `Bearer ${(res as ISigninRes).AuthToken}`;
        window.localStorage.setItem('TOKEN', token);
        axios.defaults.headers.common["Authorization"] = token;
        const decodedToken: IAuth= jwtDecode(token);
        dispatch({type: SET_AUTH, payload: decodedToken.id})
        dispatch({type: STOP_LOADING});
        window.location.href = '/';
      })
      .catch((err : AxiosError<string>) => {
        dispatch({type: STOP_LOADING});
        dispatch({ type: SET_ERROR, payload: err.message });
      });
  };

  export const logoutAction = () => (dispatch: any) => {
    localStorage.removeItem('TOKEN');
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: CLEAR_AUTH });
  };