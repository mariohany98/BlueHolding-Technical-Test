import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation } from "react-query";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import useConvertDateAndTime from "../../../hooks/useConvertDateAndTime";
import styles from "./Popup.module.css";
import PostMedia from "@/compnents/Posts/PostMedia/PostMedia";
import PostPoll from "@/compnents/Posts/PostPoll/PostPoll";
import { postsActions } from "@/store/posts-slice";
import { uiActions } from "@/store/ui-slice";
import Mentions from "../../shared/Mentions/Mentions";
import PostsService from "@/services/PostsService";
import { Toastify } from "../../../libs/Toasts";
import { pollSelect } from "../../../libs/DateAndTime";

export default function Popup() {
  // const imageFiles = useSelector(state => state.posts.postMedia);
  const dispatch = useDispatch();
  const {
    user: {
      authorisation: { token },
      name,
      image_path,
      posts: { data },
      role
    },
    trueCreateFalseEdit,
    selectedPostID
  } = useSelector(state => state.profile);
  const selectedPost = data?.find(post => post.id === selectedPostID);

  // const { sendMails, postMedia } = useSelector((state) => state.posts);
  const mainPopupIsOpen = useSelector((state) => state.ui.mainPopup.isOpen);
  // const mainPopupContent = useSelector((state) => state.ui.mainPopup.content);
  // const isPollExisted = useSelector(state => state.posts.postPoll.question );
  // const schdulePost = useSelector((state) => state.posts.schedulePost);
  const popupRef = useRef(null);
  // const messageRef = useRef();

  useEffect(() => {
    if ( !(postMedia.files[0] instanceof File) ) {
      dispatch(postsActions.addPostMedia({ files: [], paths: [], old_images: [], old_images_Req: [] }));
    }
    if( !trueCreateFalseEdit ) {
      const old_images = selectedPost?.images_paths.map(path => ({preview: path}));
      dispatch(postsActions.addOldImages({old_images_Req: selectedPost?.images, old_images}));
      dispatch(postsActions.addMessage({message: selectedPost?.thread ? selectedPost.thread : ''}));
      selectedPost?.polls &&  dispatch(postsActions.addIncomingPolls({
        polls: selectedPost?.polls,
        poll_caption: selectedPost?.poll_caption,
        poll_end_date: selectedPost?.poll_end_date,
        created_at: selectedPost?.created_at
      }));
    }

    if( trueCreateFalseEdit ) {
      
    }
  }, [mainPopupIsOpen, trueCreateFalseEdit]);
  // useEffect(() => {
  //   if( trueCreateFalseEdit ) {
  //     dispatch(postsActions.addPostMedia({ files: [], paths: [] }));
  //   } else {
  //     console.log('Selected Post: ', selectedPost);
  //     const imagesPath = selectedPost.images_paths.map(path => ({preview: path}));
  //     dispatch(postsActions.addIncomingPaths(imagesPath));
  //   }
  // }, []);

  useEffect(() => {
    popupRef.current = document.querySelector("#popup");
  }, [mainPopupIsOpen]);
  const {
    postMessage,
    schedulePost,
    schedulePost: { date, hour, minute, sunTime },
    postPoll: { question, options, duration },
    sendMails, 
    postMedia
  } = useSelector((state) => state.posts);
  let parsedHour = parseInt(hour, 10) % 12;
  parsedHour += sunTime === "PM" ? 12 : 0;

  const parsedDate = new Date(date);
  parsedDate.setHours(parsedHour, minute);

  const isoString = parsedDate != "Invalid Date" && parsedDate.toISOString();

  const convertedObject = {
    thread: postMessage,
    created_at: isoString,
    poll_caption: question,
    polls: options.map((opt) => ({ poll: opt.option })),
    poll_end_date: pollSelect(duration),
    send_all: sendMails? 1: 0,
  };
  // Check if poll_caption is empty and remove poll keys if it is
  if (!convertedObject.poll_caption || convertedObject.poll_caption.length === 0) {
    delete convertedObject.poll_caption;
    delete convertedObject.polls;
    delete convertedObject.poll_end_date;
  }
  if (date.length === 0) {
    delete convertedObject.created_at;
  }
  if (postMessage.trim().length === 0) {
    delete convertedObject.thread;
  }


  // function recieveFilesHanlder(files) {
  //   setImageFiles(prevFiles => files);
  // }
  const DateAndTime = useConvertDateAndTime(date, hour, minute, sunTime);

  const { isLoading: isPosting, mutate: postPosting } = useMutation(
    async (data) => {
      return await PostsService.addPost(token, data);
    },
    {
      onSuccess: (res) => {
        Toastify("success", res.data.message);
        dispatch(postsActions.clearPosts());
        dispatch(uiActions.clossPopups());
      },
      onError: (err) => {
        Toastify("error", err.response?.data.data);
      },
    }
  );

  const { isLoading: isEditPostLoading, mutate: editPostMutation } = useMutation(
    async (data) => await PostsService.editPost(token, data, selectedPostID),
    {
      onSuccess: (res) => {
        Toastify("success", res.data.message);
        dispatch(postsActions.clearPosts());
        dispatch(uiActions.clossPopups());
      },
      onError: (err) => {
        Toastify("error", err.response?.data.data);
      },
    }
  );

  function postHandler() {
    let formDataPost = new FormData();
    
    if(postMedia.files.length > 0 || postMedia.old_images_Req?.length > 0) {
      formDataPost.append("_method", "PUT");
      for(let key of Object.keys(convertedObject)) {
        if( key !== 'polls' ) formDataPost.append(key, convertedObject[key]);
        else for( let poll of convertedObject[key]) formDataPost.append(`polls[][poll]`, poll.poll);
      }
      for(let c = 0; c < postMedia.files.length; c++) formDataPost.append('images[]', postMedia.files[c]);
      for (let c = 0; c < postMedia.old_images_Req.length; c++) formDataPost.append('old_images[]', postMedia.old_images_Req[c]);

      if( trueCreateFalseEdit ) {
        postPosting(formDataPost);
      } else {
        editPostMutation(formDataPost);
      }

    } else {
      console.log('Data witout images: ', { ...convertedObject });
      for(let key of Object.keys(convertedObject)) {
        if( key !== 'polls' ) formDataPost.append(key, convertedObject[key]);
        else for( let poll of convertedObject[key]) formDataPost.append(`polls[][poll]`, poll.poll);
      }
      if( trueCreateFalseEdit ) {
        postPosting(formDataPost);
        // postPosting({ ...convertedObject });
      }
      else if( !trueCreateFalseEdit ) {
        formDataPost.append("_method", "PUT");
        editPostMutation(formDataPost);
        // editPostMutation({ ...convertedObject });
      }
    }

    // dispatch(postsActions.addMessage({message: ''}));
    //   dispatch(postsActions.addPostMedia({ files: [], paths: [], old_images: [], old_images_Req: [] }));
    //   dispatch(postsActions.addPostPoll({
    //     postPoll: {
    //       question: '',
    //       options: [{ option: '' }, { option: '' }],
    //       duration: '1 day'
    //     }
    // }))
  }

  return mainPopupIsOpen && popupRef.current
    ? createPortal(
      <div className={styles.popup}>
        <header className="d-flex justify-content-between">
          <span>{trueCreateFalseEdit ? 'Create a Post!' : 'Edit a Post!'}</span>
          <button onClick={() => dispatch(uiActions.clossPopups())}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>
        <div className={styles.subHeader}>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <Image
                src={image_path}
                width={32}
                height={32}
                alt="User"
                className="rounded-circle me-3"
              />
              <span>{name}</span>
            </div>
            <button
              className="d-flex align-items-center"
              onClick={() => dispatch(uiActions.openPopups({ popupType: "sub", content: "schedule-post" }))}>
              <Image
                src="/dummy-images/clock-icon.png"
                width={20}
                height={20}
                alt="clock"
                className="me-1" />
              <span>{schedulePost.date.toString().length > 0 ? DateAndTime : `Schedule Post`}</span>
            </button>
          </div>
          <Mentions
            comment={postMessage}
            setComment={(data) => { dispatch(postsActions.addMessage({ message: data })) }} />
        </div>
        <div className={styles.popupContent}>
          <PostMedia />
          {
            question && <PostPoll />
          }
        </div>
        <footer className="d-flex justify-content-between">
          <div className="d-flex">
            {(role === "super_admin" || role === "manager") && trueCreateFalseEdit && <div className="d-flex align-items-center me-3">
              <input
                type="checkbox"
                className="me-2"
                id="sendMails"
                onChange={() => dispatch(postsActions.sendMails())}
                checked={sendMails}
              />
              <label htmlFor="sendMails">Send Mails</label>
            </div>}
            <button
              className="d-flex align-items-center me-3"
              onClick={() =>
                dispatch(
                  uiActions.openPopups({
                    popupType: "main",
                    content: "insert-media",
                  })
                )
              }
            >
              <Image
                src="/dummy-images/media-icon.png"
                width={20}
                height={20}
                alt="clock"
                className="me-1"
              />
              <span>Insert Media</span>
            </button>
            <button
              className="d-flex align-items-center"
              onClick={() =>
                dispatch(
                  uiActions.openPopups({
                    popupType: "sub",
                    content: "create-poll",
                  })
                )
              }
            >
              <Image
                src="/dummy-images/poll-icon.png"
                width={20}
                height={20}
                alt="clock"
                className="me-1"
              />
              <span>Create Poll</span>
            </button>
          </div>
          <div className={styles.action}>
            <button
              className={(Object.keys(convertedObject).length === 0 && postMedia.files.length === 0) ? "disabled" : ""}
              onClick={postHandler}
            >
              Post
            </button>
          </div>
        </footer>
      </div>,
      popupRef.current
    )
    : null;
}
