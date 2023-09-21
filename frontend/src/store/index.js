import {createStore} from 'redux';
import {configureStore, createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAdmin: false,
    isLoggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setLogin(state, action) {
            state.isLoggedIn = action.payload
        },
        setAdmin(state, action) {
            state.isAdmin = action.payload
        }
    }
})

export const authActions = authSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})

export default store