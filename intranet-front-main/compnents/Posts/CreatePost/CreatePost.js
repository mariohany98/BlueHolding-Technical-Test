import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import styles from "./CreatePost.module.css";
import Overlay from "@/compnents/shared/Overlay/Overlay";
import Popup from "@/compnents/shared/Popup/Popup";
import SubPopup from "@/compnents/shared/Popup/SubPopup/SubPopup";
import { uiActions } from "@/store/ui-slice";
import { profileActions } from "@/store/profile-slice";
import { postsActions } from "@/store/posts-slice";

export default function CreatePost() {
  const dispatch = useDispatch();
  const { image_path } = useSelector((state) => state.profile.user);
  return (
    <div className={`container ${styles.createPost}`}>
      <header>Let’s make a new Post!</header>
      <div
        onClick={() => {
          dispatch(postsActions.clearPosts());
          dispatch(uiActions.openPopups({ popupType: "main", content: "insert-media" }));
          dispatch(profileActions.selectPostByID({ id: null, trueCreateFalseEdit: true }));
        }}
      >
        <Image
          src={image_path}
          width={32}
          height={32}
          alt="User"
          className="rounded-circle me-3"
        />
        <span>How’s your day going?</span>
      </div>
      <Overlay />
      <Popup />
      <SubPopup />
    </div>
  );
}
