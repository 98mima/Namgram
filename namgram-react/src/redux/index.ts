import { combineReducers } from "redux";

import uiReducer from './ui/reducer'
import postsReducer from './posts/reducer'
import authReducer from './auth/reducer'

export const rootReducer = combineReducers({
    ui: uiReducer,
    posts: postsReducer,
    auth: authReducer
})

export type RootState = ReturnType<typeof rootReducer>