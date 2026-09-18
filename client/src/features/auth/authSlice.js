import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, authChecked: false},

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload,
            state.authChecked = true;
        },

        logout: (state)=> {
            console.log("logout reducer RUNNING — setting authChecked true");
            state.user = null;
            state.authChecked = true;
        }
    }
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthChecked = (state) => state.auth.authChecked;