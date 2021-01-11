export const START_LOADING = 'START_LOADING'
export const STOP_LOADING = 'STOP_LOADING'

export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'
export const INC_NOTIFICATIONS = 'INC_NOTIFICATIONS'
export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS"


export interface StartLoadingAction {
    type: typeof START_LOADING
}

export interface StopLoadingAction {
    type: typeof STOP_LOADING
}

export interface SetErrorAction {
    type: typeof SET_ERROR,
    payload: string
}

export interface ClearErrorAction {
    type: typeof CLEAR_ERROR
}

export interface IncrementNotificationsAction {
    type: typeof INC_NOTIFICATIONS
}

export interface ClearNotificationsAction {
    type: typeof CLEAR_NOTIFICATIONS
}

export type UIActionTypes = StartLoadingAction | StopLoadingAction | SetErrorAction
 | ClearErrorAction | IncrementNotificationsAction | ClearNotificationsAction