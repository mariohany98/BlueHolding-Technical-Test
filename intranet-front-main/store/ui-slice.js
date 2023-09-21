import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    mainPopup: {
        isOpen: false,
        content: 'insert-media'
    },
    subPopup: {
        isOpen: false,
        content: '',
    },
    profilePopup: {
        isOpen: false,
        content: '',
        mode: ''
    },
    confirmPopup: {
        isOpen: false,
        content: 'delete-subFeature',
    },
    loading:false,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        clossPopups: function(state) {
            state.mainPopup.isOpen = false;
            state.subPopup.isOpen = false;
            state.profilePopup.isOpen = false;
            state.confirmPopup.isOpen = false;
        },
        openPopups: function(state, action) {
            if( action.payload.popupType === 'main' ) {
                state.mainPopup.isOpen = true;
                state.subPopup.isOpen = false;
                state.profilePopup.isOpen = false;
                state.confirmPopup.isOpen = false;
                state.mainPopup.content = action.payload.content;
            } else if( action.payload.popupType === 'sub' ) {
                state.mainPopup.isOpen = false;
                state.subPopup.isOpen = true;
                state.profilePopup.isOpen = false;
                state.confirmPopup.isOpen = false;
                state.subPopup.content = action.payload.content;
            } else if( action.payload.popupType === 'profile' ) {
                state.mainPopup.isOpen = false;
                state.subPopup.isOpen = false;
                state.profilePopup.isOpen = true;
                state.confirmPopup.isOpen = false;
                state.profilePopup.content = action.payload.content;
                state.profilePopup.mode = action.payload.mode;
            } else if( action.payload.popupType === 'deleteSubFeature' ) {
                state.mainPopup.isOpen = false;
                state.subPopup.isOpen = false;
                state.profilePopup.isOpen = false;
                state.confirmPopup.isOpen = true;
                state.profilePopup.content = action.payload.content;
                // state.confirmPopup.content = action.payload.content;
                state.profilePopup.mode = action.payload.mode;
            }
        },
        setLoading: function(state, action ) {
            state.loading = action.payload.loading
        }
    },
    extraReducers: builder => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.ui
            }
        })
    }
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;