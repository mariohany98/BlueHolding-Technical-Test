import React, { Fragment, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useOutsideClick from "@/hooks/useOutsideClick";
import Reactions from "@/compnents/shared/Reactions/Reactions";
import ReactionList from "@/compnents/shared/Reactions/ReactionList";
import WriteComment from "@/compnents/home/Comment/WriteComment";
import Comment from "@/compnents/home/Comment/Comment";
import Styles from "./PostContainer.module.css";
import Poll from "@/compnents/shared/Poll/Poll";
import { formatDate } from "../../../libs/DateAndTime";
import PostsService from "@/services/PostsService";
import { uiActions } from "@/store/ui-slice";
import { profileActions } from "@/store/profile-slice";
import { convertTextToLinks } from "../../../libs/convertTextToLinks";
import ImageGallery from "../ImageGallery/ImageGallery";

const PostContainer = React.forwardRef(({ data }, ref) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    id,
    thread,
    poll_caption,
    poll_end_date,
    created_at,
    images_paths,
    likes_count,
    loves_count,
    celebrate_count,
    total_reactions,
    my_post,
    my_like,
    votes,
    is_edited,
    polls,
    comments,
    user,
    pending,
  } = data;
  const profile = useSelector((state) => state.profile.user);

  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMoreComments, setShowMoreComments] = useState(false);

  const handleClickOutside = () => {
    setShow(false);
  };

  const customRef = useOutsideClick(handleClickOutside);

  const deletePost = useMutation((id) => {
    return PostsService.DeletePost(token, id);
  });

  function selectPostForEditHanlder() {
    dispatch(uiActions.openPopups({ popupType: "main", content: "insert-media" }));
    dispatch(profileActions.selectPostByID({id, trueCreateFalseEdit: false}));
  }

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
            return <Fragment key={index}>{link.text}</Fragment>;
          }
        })}
      </p>
    );
  };

  const renderComments = () => {
    return comments.map((comment, index) => {
      if (showMoreComments || index < 1)
        return <Comment key={index} data={comment} />;
    });
  };

  function openProfileHanlder(e) {
    e.preventDefault();
    if( router.pathname === '/profile') return null;
    else if( user?.id && profile.id !== user?.id ) router.push(`/profile/${user?.id}`);
    else router.push(`/profile`);
  }
  
  function deletePostHandler() {
    // dispatch(uiActions.openPopups({ popupType: "deleteSubFeature", mode: 'delete', content: 'delete-post' }));
    deletePost.mutate(id);
  }

  const renderPost = () => {
    return (
      <>
        <Row className={`${Styles.headerContainer}`}>
          <Col className="p-0 d-flex align-items-center justify-content-between">
            <div className={`${Styles.header}`}>
              <Image
                src={user ? user.image_path : router.query['id'] ? profile.visitedImage_path : profile.image_path}
                width={40}
                height={40}
                alt="profile image"
              />
              <div>
                <h6>
                  <Link className="mb-0" href='#' onClick={openProfileHanlder}>{
                    user ? user.name : 
                    router.query['id'] ? profile.visitedName : 
                    profile.name}
                  </Link>
                </h6>
                <small>
                  {user ? user.department.name : router.query['id'] ? profile.visitedDepartment : profile.department.name}
                </small>
              </div>
            </div>
            {my_post && (
              <div className={`${Styles.iconConatiner}`} ref={customRef}>
                <i
                  className="fa-solid fa-ellipsis"
                  onClick={() => {
                    setShow(!show);
                  }}
                ></i>

                {show && (
                  <ul className={`${Styles.listConatiner}`}>
                    <li onClick={selectPostForEditHanlder}>
                      <i className="fa-regular fa-pen-to-square"></i> Edit
                    </li>
                    <li onClick={deletePostHandler}>
                      <i className="fa-regular fa-trash-can"></i> Delete
                    </li>
                  </ul>
                )}
              </div>
            )}
          </Col>
        </Row>
        <Row className={`${Styles.bodyContainer}`}>
          <Col className="p-0">
            {showMore && thread
              ? renderThread()
              : renderThread()
              ? renderThread()
              : ""}
            <p>
              {/* {showMore && thread ? thread : thread ? `${thread?.substring(0, 250)}` : ''} */}
              {showMore.length > 250 && (
                <button
                  className={Styles.showMore}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              )}
            </p>
            <ImageGallery images ={images_paths}/>
            {polls.length > 0 && (
              <Poll
                question={poll_caption}
                postId={id}
                options={polls}
                totalVoteCount={votes}
                poll_end_date={poll_end_date}
              />
            )}
            <div className="d-flex flex-wrap justify-content-between">
              <div>
                <ReactionList
                  likes={likes_count}
                  loves={loves_count}
                  celebrate={celebrate_count}
                  total_reactions={total_reactions}
                />
                {comments.length !== 0 && (
                  <small
                    className="pointer"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <i className="fa-regular fa-message"></i>
                    &nbsp;&nbsp;{comments.length}&nbsp;Comment
                  </small>
                )}
              </div>
              <div>
                <small>
                  {is_edited && "Edited . "}
                  {formatDate(created_at)}
                </small>
              </div>
            </div>
          </Col>
        </Row>
        <Row className={`${Styles.footerContainer}`}>
          <Col className="p-0 d-flex" style={{ gap: "24px" }}>
            <div>
              <Reactions postId={id} my_like={my_like} />
            </div>
            <div>
              <small
                className="pointer"
                onClick={() => setShowComments(!showComments)}
              >
                <i className="fa-regular fa-message"></i>&nbsp;&nbsp;Comment
              </small>
            </div>
          </Col>
        </Row>
        {showComments && (
          <Row className={`${Styles.commentContainer} fadeIn`}>
            <WriteComment postId={id} />
            {renderComments()}
            {comments.length > 1 && !showMoreComments && (
              <button
                onClick={() => {
                  setShowMoreComments(true);
                }}
              >
                {" "}
                Load More comments
              </button>
            )}
          </Row>
        )}
      </>
    );
  };

  return pending ? (
    <></>
  ) : ref ? (
    <Container className={`${Styles.createPost} mb-4 ${router.query['id'] && 'mt-0'}`} ref={ref}>
      {renderPost()}
    </Container>
  ) : (
    <Container className={`${Styles.createPost} mb-4 ${router.query['id'] && 'mt-0'}`}>
      {renderPost()}
    </Container>
  );
});

export default PostContainer;
