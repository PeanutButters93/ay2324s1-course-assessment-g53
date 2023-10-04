import {configureStore, createSlice} from '@reduxjs/toolkit'

const initialState = {
    is_admin: false,
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
            state.is_admin = action.payload
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