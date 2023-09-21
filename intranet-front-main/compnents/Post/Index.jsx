import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import PostContainer from "@/compnents/Posts/PostContainer/PostContainer";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import PostsService from "../../services/PostsService";
import { Col, Container, Row } from "react-bootstrap";
import Loading from "../shared/Loading/Loading";

export default function Index() {
  const router = useRouter();
  const postId = router.query["id"];
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    isLoading,
    isError,
    data: post,
    error,
    refetch,
  } = useQuery(
    ['post', postId],
    async () => {
      if (postId) {
        const res = await PostsService.getPost(token, postId);
        dispatch(uiActions.setLoading({ loading: false }));
        return res.data.data.post;
      }
    },
    {
      refetchInterval: 5000,
    }
  );

  if (isLoading) {
    return <Loading/>;
  }
  if (isError) {
    // dispatch(profileActions.userLogout());
    // localStorage.removeItem("redux");
    // router.push("/login");
    return <span>Error: {error.message}</span>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xl={8}>
          {post && <PostContainer data={post} />}
        </Col>
      </Row>
    </Container>
  );
}
