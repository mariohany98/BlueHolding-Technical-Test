import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector, useDispatch } from "react-redux";
import { useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";

import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import PostContainer from "../../Posts/PostContainer/PostContainer";
import PostsService from "../../../services/PostsService";
import Loading from "@/compnents/shared/Loading/Loading";

const HomePosts = () => {
  const { ref, inView } = useInView();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    isLoading,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "posts",
    async ({ pageParam = 1 }) => {
      const res = await PostsService.Posts(token, pageParam);
      dispatch(uiActions.setLoading({ loading: false }));
      return res.data.data.posts.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === 10 ? allPages.length + 1 : undefined;
        return nextPage;
      },
      refetchInterval: 5000,
    }
  );
  
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <Loading/>;
  }
  if (isError) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
  }

  return (
    <>
      {data.pages.map((page) =>
        page.map((post, index) => {
          if (page.length === index + 1) {
            return <PostContainer ref={ref} key={index} data={post} />;
          }
          return <PostContainer key={index} data={post} />;
        })
      )}
      {isFetchingNextPage && <span className="d-block text-center">Loading...</span>}
    </>
  );
};

export default HomePosts;
