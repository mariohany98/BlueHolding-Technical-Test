import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { VscSend } from "react-icons/vsc";
import { Toastify } from "@/libs/Toasts";

import Styles from "./Comment.module.css";
import Reactions from "@/compnents/shared/Reactions/Reactions";
import ReactionList from "@/compnents/shared/Reactions/ReactionList";
import { convertTextToLinks } from "../../../libs/convertTextToLinks";
import useOutsideClick from "@/hooks/useOutsideClick";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import Mentions from "@/compnents/shared/Mentions/Mentions";
import PostsAndCommentsService from "@/services/PostsAndCommentsService";

export default function Comment({ data }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);

  const {
    id,
    thread,
    likes_count,
    loves_count,
    celebrate_count,
    total_reactions,
    my_like,
    user,
  } = data;
  const [comment, setComment] = useState(thread);
  // console.log('Comment Date : ', data);
  const { name, image_path, department } = user;
  const dispatch = useDispatch();
  const { user: { id: user_id, authorisation: { token } } } = useSelector(state => state.profile);
  const { mutate: editCommentMutation } = useMutation(
    async () => {
        return await PostsAndCommentsService.editComment(token, id, { thread: comment });
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

  const handleClickOutside = () => {
    setShowMenu(false);
  };
  const customRef = useOutsideClick(handleClickOutside);
  const renderThread = () => {
    const linksArray = convertTextToLinks(thread);
    return (
      <p>
        {linksArray.map((link, index) => {
          if (link.href) {
            return (
              <Link href={`/profile/${link.href}`} key={index} className="mention">
                {link.text}
              </Link>
            );
          } else {
            return link.text;
          }
        })}
      </p>
    );
  };

  function openEditHandler() {
    setShowEditInput(true);
  }

  function cancelEditHandler() {
    setShowEditInput(false);
    setComment(thread);
  }

  function confirmDeleteHandler() {
    dispatch(profileActions.selectSubFeature({ id, content: 'delete-comment' }));
    dispatch(uiActions.openPopups({ popupType: "deleteSubFeature", mode: 'delete', content: 'delete-comment' }));
  }

  function editCommentHandler() {
    setShowEditInput(false);
    editCommentMutation();
  }

  return (
    <div className={`${Styles.commentContainer}`}>
      <div>
        <Image src={image_path} width={40} height={40} alt="profile image" />
      </div>
      <div className="w-100">
        <div className="d-flex justify-content-between pe-3">
          <div>
            <h6 className="mb-0">{name}</h6>
            <small>{department?.name}</small>
          </div>

          {
            user_id === user.id && <div>
              <div className={`${Styles.iconConatiner}`} ref={customRef}>
                <i
                  className="fa-solid fa-ellipsis"
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                ></i>

                {showMenu && (
                  <ul className={`${Styles.listConatiner}`}>
                    <li onClick={openEditHandler}>
                      <i className="fa-regular fa-pen-to-square"></i> Edit
                    </li>
                    <li onClick={confirmDeleteHandler}>
                      <i className="fa-regular fa-trash-can"></i> Delete
                    </li>
                  </ul>
                )}
              </div>
            </div>
          }
        </div>
        {showEditInput ? <div>
          <div className={`${Styles.writeComment} ps-0`}>
            <div>
              <Mentions comment={comment} setComment={setComment} />
            </div>
            <div>
              <button className="me-2" onClick={cancelEditHandler}>Cancel</button>
              <VscSend className={`${comment.length > 0 ? '' : "disabled"}`} onClick={ editCommentHandler } />
            </div>
          </div>
        </div> : <p>{renderThread()}</p>}
        <div className="d-flex align-items-center">
          <ReactionList
          likes={likes_count}
          loves={loves_count}
          celebrate={celebrate_count}
          total_reactions={total_reactions}
          />
          {total_reactions > 0 && <span>&nbsp;|&nbsp;</span>}
          <Reactions commentId={id} my_like={my_like} />
        </div>
      </div>
    </div>
  );
}
