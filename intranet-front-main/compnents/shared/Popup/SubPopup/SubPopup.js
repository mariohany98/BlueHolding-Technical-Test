import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './SubPopup.module.css';
import { uiActions } from '@/store/ui-slice';
import SchedulePost from '@/compnents/Posts/SchedulePost/SchedulePost';
import CreatePoll from '@/compnents/Posts/CreatePoll/CreatePoll';
import EditProfile from '@/compnents/profile/EditProfile/EditProfile';
import Confirmation from '../confirmation/confirmation';

export default function SubPopup() {
    const dispatch = useDispatch();
    const subPopupState = useSelector(state => state.ui.subPopup);
    const popupProfileState = useSelector(state => state.ui.profilePopup);
    const confirmationPopup = useSelector(state => state.ui.confirmPopup);
    const ref = useRef(null);
    useEffect(() => { ref.current = document.querySelector("#sub-popup"); }, [subPopupState.isOpen, popupProfileState.isOpen, confirmationPopup.isOpen]);

    function closeHandler() {
        return popupProfileState.isOpen ? dispatch(uiActions.clossPopups()) : 
            confirmationPopup.isOpen ? dispatch(uiActions.clossPopups()) : 
            dispatch(uiActions.openPopups({popupType: 'main', content: 'insert-media'}));
    }

    return (subPopupState.isOpen || popupProfileState.isOpen || confirmationPopup.isOpen) && ref.current ? createPortal(
        <div className={styles.popup}>
            <header className='d-flex justify-content-between'>
                <span>
                {
                    popupProfileState.isOpen && popupProfileState.mode === 'add' ? 'Add ' : 
                    popupProfileState.isOpen && popupProfileState.mode === 'edit' ? 'Edit ' : 
                    null
                }
                { 
                    (popupProfileState.isOpen && popupProfileState.content === 'edit-profile') ? 'Profile' : 
                    (popupProfileState.isOpen && popupProfileState.content === 'edit-experience') ? 'Experience' : 
                    (popupProfileState.isOpen && popupProfileState.content === 'edit-education') ? 'Education' : 
                    (popupProfileState.isOpen && popupProfileState.content === 'edit-license-certification') ? 'Licenses & certifications' : 
                    ((subPopupState.isOpen || popupProfileState.isOpen) && subPopupState.content === 'create-poll') ? 'Create a poll' : 
                    ((subPopupState.isOpen || popupProfileState.isOpen) && subPopupState.content === 'schedule-post') ? 'Schedule post' : 
                    null
                }
                {
                    confirmationPopup.isOpen && 'Are you sure you want to delete this item ?'
                }
                </span>
                <button onClick={closeHandler}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </header>
            {
                (popupProfileState.isOpen && (
                    popupProfileState.content === 'edit-profile' || 
                    popupProfileState.content === 'edit-experience' ||
                    popupProfileState.content === 'edit-education' ||
                    popupProfileState.content === 'edit-license-certification'
                )) ? <EditProfile mode={popupProfileState.mode} /> : 
                (confirmationPopup.isOpen && confirmationPopup.content === 'delete-subFeature') ? <Confirmation /> : 
                ((subPopupState.isOpen || popupProfileState.isOpen) && subPopupState.content === 'create-poll') ? <CreatePoll /> : 
                ((subPopupState.isOpen || popupProfileState.isOpen) && subPopupState.content === 'schedule-post') ? <SchedulePost /> : 
                null
            }
        </div>, ref.current) : null;
}