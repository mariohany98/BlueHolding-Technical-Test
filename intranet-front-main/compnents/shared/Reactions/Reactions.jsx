import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useOutsideClick from "../../../hooks/useOutsideClick"
import Styles from "./Reactions.module.css";
import PostsAndCommentsService from "@/services/PostsAndCommentsService";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Toastify } from "@/libs/Toasts";

const Reactions = ({postId = 0, commentId = 0, my_like}) => {
  const [btnClicked, setBtnClicked] = useState(false);
  const [buttons] = useState([
    {
      id: 1,
      text: "Like",
      src: "/images/like.svg",
    },
    {
      id: 2,
      text: "Love",
      src: "/images/love.svg",
    },
    {
      id: 3,
      text: "Celebrate",
      src: "/images/celebrate.svg",
    },
  ]);
  const [selectReact, setSelectReact] = useState(my_like ? buttons.find((obj) => obj.id === my_like) : 0);
  const list = {
    visible: {
      opacity: 1,
      display: "flex",
      transition: {
        when: "afterChildren",
        staggerChildren: 0.2,
      },
    },
    hidden: {
      opacity: 0,
      display: "none",
      transition: {
        when: "beforeChildren",
      },
      scale: 0.6,
    },
  };

  const { token } = useSelector((state) => state.profile.user.authorisation);
  const { isLoading: isReact, mutate: postReact } = useMutation(
    async (data) => {
      const url = postId? `/posts/${postId}/like`:`/comments/${commentId}/like`;
      return await PostsAndCommentsService.React(
        url,
        token,
        {
          reaction: data,
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
  const { isLoading: isUndoReact, mutate: postUndoReact } = useMutation(
    async (data) => {
      const url = postId? `/posts/${postId}/undo-like`:`/comments/${commentId}/undo-like`;
      return await PostsAndCommentsService.React(
        url,
        token,
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

  const handleClick = (idClicked) => {
    setBtnClicked(false);
    if (idClicked == selectReact?.id) {
      setSelectReact(0);
      postUndoReact(0)
      return;
    }
    const reactClicked = buttons.find((obj) => obj.id === idClicked);
    setSelectReact(reactClicked);
     postReact(reactClicked.id);
  };

  const ref = useOutsideClick(()=>setBtnClicked(false));

  return (
    <motion.div
      className="position-relative"
      onClick={() => btnClicked === true && setBtnClicked(false)}
      ref={ref}
    >
      <motion.div
        className={`${Styles.reactionsHolder}`}
        variants={list}
        animate={btnClicked ? "visible" : "hidden"}
      >
        <motion.div whileHover={{ scale: 1.5 }} onClick={() => handleClick(1)}>
          <Image src={"/images/like.svg"} alt="Like" width="30" height="30" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.5 }} onClick={() => handleClick(2)}>
          <Image src={"/images/love.svg"} alt="Love" width="30" height="30" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.5 }} onClick={() => handleClick(3)}>
          <Image
            src={"/images/celebrate.svg"}
            alt="Celebrate"
            width="30"
            height="30"
          />
        </motion.div>
      </motion.div>
      <motion.div
        className={Styles.likeBtn}
        onClick={() => setBtnClicked(true)}
      >
        <small>
          {selectReact == 0 ? (
            <>
              <i className="fa-regular fa-thumbs-up"></i>
              &nbsp; Like
            </>
          ) : (
            <>
              <Image
                src={selectReact?.src}
                alt={selectReact?.text}
                width="20"
                height="20"
              />
              &nbsp; {selectReact?.text}
            </>
          )}
        </small>
      </motion.div>
    </motion.div>
  );
};

export default Reactions;
