import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';

import styles from './confirmation.module.css';
import { uiActions } from '@/store/ui-slice';
import { profileActions } from '@/store/profile-slice';
import ProfileServices from '@/services/ProfileService';
import { Toastify } from '@/libs/Toasts';
import PostsAndCommentsService from '@/services/PostsAndCommentsService';

export default function Confirmation() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const profileStatus = useSelector(state => state.ui.profilePopup);
    const isExperienceContent = profileStatus.content === 'edit-experience';
    const isEducationContent = profileStatus.content === 'edit-education';
    const isLicenseContent = profileStatus.content === 'edit-license-certification';
    const infoSelected = { id: profile.selectedSubFeatureID, content: profile.selectedSubFeatureContent }
    const { mutate: mutationDelete } = useMutation({
        mutationFn: async (id) => {
            return await ProfileServices.editProfile({
                mode: profileStatus.mode,
                url: isExperienceContent && profileStatus.mode === 'delete' ? `experiences/${id}` :
                    isEducationContent && profileStatus.mode === 'delete' ? `educations/${id}` :
                        isLicenseContent && profileStatus.mode === 'delete' ? `certifications/${id}` :
                            null,
                token: profile.user.authorisation.token
            })
        },
        onSuccess: (res) => {
            Toastify('success', res.data.message);
            dispatch(profileActions.deleteSubFeature());
        },
        onError: (err) => {
            Toastify('error', err.response?.data.message);
        },
    });

    const { mutate: deleteCommentMutation } = useMutation(
        async () => {
            return await PostsAndCommentsService.deleteComment(profile.user.authorisation.token, infoSelected.id);
        },
        {
            onSuccess: (res) => {
                Toastify("success", res.data.message);
            },
            onError: (err) => {
                console.log(err);
                Toastify("error", err.response?.data.data);
            },
        }
    );

    function cancelHandler() {
        dispatch(uiActions.clossPopups());
    }

    function deleteHandler() {
        if (infoSelected.content === 'delete-comment') deleteCommentMutation();
        else mutationDelete(infoSelected.id);
        dispatch(uiActions.clossPopups());
    }

    return (
        <div className={styles.confirmContent}>
            <p className='mb-0 mb-4'>This will delete this item permanently. you cannot undo this action</p>
            <div className={`${styles.action} d-flex justify-content-between`}>
                <button type='button' onClick={cancelHandler}>Cancel</button>
                <button type='button' onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    )
}