import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Overlay.module.css';
import { uiActions } from '@/store/ui-slice';

export default function Overlay() {
    const popupIsOpen = useSelector((state) => state.ui.mainPopup.isOpen || state.ui.subPopup.isOpen || state.ui.profilePopup.isOpen || state.ui.confirmPopup.isOpen );
    const dispatch = useDispatch();
    const ref = useRef(null);
    useEffect(() => { ref.current = document.querySelector("#overlay"); }, [popupIsOpen]);

    return popupIsOpen && ref.current ? 
        createPortal(<div onClick={() => dispatch( uiActions.clossPopups() )} className={styles.overlay} />, ref.current) : 
        null;
}