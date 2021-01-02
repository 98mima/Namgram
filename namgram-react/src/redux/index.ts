import { combineReducers } from "redux";

import uiReducer from './ui/reducer'
import postsReducer from './posts/reducer'
import authReducer from './auth/reducer'
import profileReducer from './profile/reducer'

export const rootReducer = combineReducers({
    ui: uiReducer,
    posts: postsReducer,
    auth: authReducer,
    profile: profileReducer
})

export type RootState = ReturnType<typeof rootReducer>