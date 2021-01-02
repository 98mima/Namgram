import { IAuth, ISignin, ISigninRes, ISignup, ISignupRes } from "../../models/auth";
import { signin, signup } from "../../services/auth"
import { SET_ERROR, CLEAR_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";

import jwtDecode from 'jwt-decode'
import axios, { AxiosError } from 'axios'
import { getUserById } from "../../services/user";

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
 
    const token = localStorage.TOKEN;
    if (token) {
      const decodedToken: {id: string} = jwtDecode(token);
      getUserById(decodedToken.id)
      .then((res) => {
        dispatch({ type: SET_AUTH, payload: res.Data });
        axios.defaults.headers.common["Authorization"] = token;
      })
      .catch((err) => console.log("Bad token"));
    }
  };

export const signinAction = (user: ISignin) => (dispatch: any) => {
    dispatch({ type: START_LOADING });
    dispatch({type: CLEAR_ERROR});
    signin(user)
      .then((res : ISigninRes) => {
        dispatch({ type: CLEAR_ERROR });
        const token = `Bearer ${(res as ISigninRes).AuthToken}`;
        window.localStorage.setItem('TOKEN', token);
        axios.defaults.headers.common["Authorization"] = token;
        const decodedToken: IAuth= jwtDecode(token);
        dispatch({type: SET_AUTH, payload: decodedToken.id})
        dispatch({type: STOP_LOADING});
      })
      .catch((err : AxiosError) => {
        dispatch({type: STOP_LOADING});
        if (err.request){
          dispatch({ type: SET_ERROR, payload: `${err.request.response}` });
        } else if (err.response){
          dispatch({ type: SET_ERROR, payload: `${err.response.data}` });
        }
        else{
          console.log(err);
        }
      });
  };

  export const signupAction = (user: ISignup) => (dispatch: any) => {
    dispatch({ type: START_LOADING });
    dispatch({type: CLEAR_ERROR});
    signup(user)
      .then((res : ISignupRes) => {
        dispatch({ type: CLEAR_ERROR });
        const token = `Bearer ${(res as ISigninRes).AuthToken}`;
        window.localStorage.setItem('TOKEN', token);
        axios.defaults.headers.common["Authorization"] = token;
        const decodedToken: IAuth= jwtDecode(token);
        dispatch({type: SET_AUTH, payload: decodedToken.id})
        dispatch({type: STOP_LOADING});
      })
      .catch((err : AxiosError) => {
        dispatch({type: STOP_LOADING});
        if (err.request){
          dispatch({ type: SET_ERROR, payload: `${err.request.response}` });
        } else if (err.response){
          dispatch({ type: SET_ERROR, payload: `${err.response.data}` });
        }
        else{
          console.log(err);
        }
      });
  };

  export const logoutAction = () => (dispatch: any) => {
    localStorage.removeItem('TOKEN');
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: CLEAR_AUTH });
  };