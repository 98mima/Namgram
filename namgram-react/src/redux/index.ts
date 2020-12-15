import { combineReducers } from "redux";

import uiReducer from './ui/reducer'
import postsReducer from './posts/reducer'

export const rootReducer = combineReducers({
    ui: uiReducer,
    posts: postsReducer
})

export type RootState = ReturnType<typeof rootReducer>