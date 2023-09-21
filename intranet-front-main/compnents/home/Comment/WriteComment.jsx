import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { VscSend } from "react-icons/vsc";
import Styles from "./Comment.module.css";
import { extractMentionedIds } from "../../../libs/regexFunctons";
import { Toastify } from "../../../libs/Toasts";
import Mentions from "../../shared/Mentions/Mentions";
import PostsAndCommentsService from "../../../services/PostsAndCommentsService";

export default function WriteComment({ postId }) {
  const [comment, setComment] = useState("");
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const { isLoading: isMentions, mutate: postMentions } = useMutation(
    async ({id,mentions}) => {
      return await PostsAndCommentsService.Mentions(
        token,
        {
          mentions:mentions,
          comment_id:id,
        }
      );
    },
    {
      onSuccess: (res) => {
        // Toastify("success", res.data.message);
      },
      onError: (err) => {
        Toastify("error", err.response?.data.message);
      },
    }
  );
  const { isLoading: isCommenting, mutate: postComment } = useMutation(
    async (data) => {
      return await PostsAndCommentsService.AddComment(
        postId,
        token,
        {
          thread: data,
        }
      );
    },
    {
      onSuccess: (res) => {
        setComment("")
        const mentions =  extractMentionedIds(comment);
        mentions .length > 0 && postMentions({id:res.data.data.comment.id,mentions:mentions})
        // Toastify("success", res.data.message);
      },
      onError: (err) => {
        Toastify("error", err.response?.data.message);
      },
    }
  );
  

  function postData(data) {
    try {
      data.length > 0 && postComment(data);
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div className={`${Styles.writeComment}`}>
      <div>
        <Mentions comment={comment} setComment={setComment} />
      </div>
      <div>
        <VscSend className={`${comment.length > 0 ? '':"disabled" }`} onClick={() => postData(comment)} />
      </div>
    </div>
  );
}
