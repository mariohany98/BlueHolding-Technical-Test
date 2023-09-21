import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    user: {
        id:"",
        status:"",
        birth_date:"",
        global_score:"",
        team_score:"",
        social_links:"",
        department:"",
        visitedDepartment:"",
        image_path: '/images/defaultProfile.jpg',
        visitedImage_path: '/images/defaultProfile.jpg',
        name: '',
        visitedName: '',
        title: '',
        visitedTitle: '',
        email: '',
        visitedEmail: '',
        mobile: '',
        visitedMobile: '',
        content: 'edit-profile',
        posts: [],
        visitedPosts: [],
        authorisation: {}
    },
    notifications: [],
    selectedPostID: null,
    trueCreateFalseEdit: true,
    selectedSubFeatureID: null,
    selectedSubFeatureContent: '',
    profileFeatures: [
        {
            title: 'Experience',
            content: 'edit-experience',
            companies: [],
            subFeatures: [],
            visitedSubFeatures: []
        },
        {
            title: 'Education',
            content: 'edit-education',
            colleges: [],
            subFeatures: [],
            visitedSubFeatures: []
        },
        {
            title: 'Licenses & certifications',
            content: 'edit-license-certification',
            subFeatures: [],
            visitedSubFeatures: []
        }
    ]
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        userLogin: function(state, action) {
            const {user, posts, authorisation} = action.payload;
            state.user = {...user, content: 'edit-profile'};
            state.user.posts = posts;
            state.user.authorisation = authorisation;
            state.profileFeatures[0].subFeatures = user.experiences;
            state.profileFeatures[1].subFeatures = user.educations;
            state.profileFeatures[2].subFeatures = user.certifications;
        },

        userLogout: () => initialState,
        
        selectSubFeature: function(state, action) {
            state.selectedSubFeatureID = action.payload.id;
            state.selectedSubFeatureContent = action.payload.content;
        },

        addFeature: function(state, action) {
            const featureIndex = state.profileFeatures.findIndex(feature => feature.content === action.payload.content);
            state.profileFeatures[featureIndex].subFeatures.unshift({...action.payload.feature});
        },

        editProfile: function(state, action) {
            if( action.payload.content === 'edit-profile' ) {
                state.user.image_path = action.payload.feature.image_path;
                state.user.title = action.payload.feature.title;
                state.user.mobile = action.payload.feature.mobile;
            } else {
                const featureIndex = state.profileFeatures.findIndex(feature => feature.content === state.selectedSubFeatureContent);
                const subFeatureIndex = state.profileFeatures[featureIndex].subFeatures.findIndex(
                    subFeature => subFeature.id === state.selectedSubFeatureID
                );
                state.profileFeatures[featureIndex].subFeatures[subFeatureIndex] = {
                    id: state.selectedSubFeatureID, ...action.payload.feature
                };
            }
        },

        deleteSubFeature: function(state) {
            const featureIndex = state.profileFeatures.findIndex(feature => feature.content === state.selectedSubFeatureContent);
            const subFeatureIndex = state.profileFeatures[featureIndex].subFeatures.findIndex(
                subFeature => subFeature.id === state.selectedSubFeatureID
            );
            state.profileFeatures[featureIndex].subFeatures.splice(subFeatureIndex, 1);
        },

        getAllCompanies: function(state, action) {
            state.profileFeatures[0].companies = action.payload.companies;
        },

        getAllColleges: function(state, action) {
            state.profileFeatures[1].colleges = action.payload.colleges;
        },

        getNotifications(state, action) {
            state.notifications = action.payload;
        },

        selectPostByID: function(state, action) {
            state.selectedPostID = action.payload.id;
            state.trueCreateFalseEdit = action.payload.trueCreateFalseEdit;
        },

        updatePosts: function(state, action) { state.user.posts = action.payload; },

        setVisitedProfile: function(state, action) {
            state.user.visitedName = action.payload.name;
            state.user.visitedTitle = action.payload.title;
            state.user.visitedEmail = action.payload.email;
            state.user.visitedImage_path = action.payload.image_path;
            state.user.visitedDepartment = action.payload.department;
            state.user.visitedMobile = action.payload.mobile;
            state.user.visitedPosts = action.payload.posts;
            state.profileFeatures[0].visitedSubFeatures = action.payload.experiences;
            state.profileFeatures[1].visitedSubFeatures = action.payload.educations;
            state.profileFeatures[2].visitedSubFeatures = action.payload.certifications;
        },

        extraReducers: builder => {
            builder.addCase(HYDRATE, (state, action) => {
                return {
                    ...state,
                    ...action.payload.profile
                }
            })
        }
    }
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;