import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    users:[],
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: function(state, action) {
            const convertedArray = action.payload.users.map(({ id, name }) => ({
            id: id.toString(),
            display: name,
            }));
            state.users = convertedArray
        }
    },
    extraReducers: builder => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.users
            }
        })
    }
});

export const usersActions = usersSlice.actions;
export default usersSlice.reducer;