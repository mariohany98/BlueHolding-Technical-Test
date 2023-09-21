import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { calculateTimeDifference } from "@/libs/DateAndTime";

const initialState = {
    postMessage: '',
    sendMails: false,
    postMedia: {
        files: [],
        paths: [],
        old_images: [],
        old_images_Req: []
    },
    postPoll: {
        question: '',
        options: [{ option: '' }, { option: '' }],
        duration: '1 day'
    },
    schedulePost: {
        date: '',
        hour: '12',
        minute: '00',
        sunTime: 'PM'
    }
}

const postsSlice = createSlice({
    name: 'Posts',
    initialState,
    reducers: {
        addMessage: function(state, action) {
            state.postMessage = action.payload.message
        },
        addPostMedia: function(state, action) {
            state.postMedia.files = action.payload.files;
            state.postMedia.paths = action.payload.paths;
            state.postMedia.old_images = action.payload.old_images;
            state.postMedia.old_images_Req = action.payload.old_images_Req;
        },
        removeImageFile: function(state, action) {
            state.postMedia.files = state.postMedia.files.filter(
                (path, index) => index !== state.postMedia.paths.findIndex(path => path === action.payload.blob_or_url)
            );
            state.postMedia.paths = state.postMedia.paths.filter(path => path.preview !== action.payload.blob_or_url);
            state.postMedia.old_images = state.postMedia.old_images.filter(path => path.preview !== action.payload.blob_or_url);
            state.postMedia.old_images_Req = state.postMedia.old_images_Req.filter(path => path !== action.payload.blob_or_url);
        },
        addPostPoll: function(state, action) {
            state.postPoll = action.payload.postPoll
        },
        addSchedulePost: function(state, action) {
            state.schedulePost = action.payload.schedulePost
        },
        addImageFormData: function(state, action) {state.postMedia.imagesData = action.payload.imagesData},
        sendMails: function(state, action) {state.sendMails = !state.sendMails},
        clearPosts: () => initialState,
        addOldImages: function(state, action) {
            state.postMedia.old_images = action.payload.old_images;
            state.postMedia.old_images_Req = action.payload.old_images_Req;
        },
        addIncomingPolls: function(state, action) {
            state.postPoll.question = action.payload.poll_caption;
            state.postPoll.options = action.payload.polls.map(poll => ({option: poll.poll}));
            state.postPoll.duration = calculateTimeDifference(action.payload.created_at, action.payload.poll_end_date);
        }
    },
    extraReducers: builder => {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...action.payload.Posts
            }
        })
    }
});

export const postsActions = postsSlice.actions;
export default postsSlice.reducer;