import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useQuery, useInfiniteQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";

import Styles from "./profile.module.css";
import PostContainer from "../Posts/PostContainer/PostContainer";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import CreatePost from "../Posts/CreatePost/CreatePost";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileServices from "@/services/ProfileService";
import Loading from "../shared/Loading/Loading";

export default function Profile() {
  const { ref, inView } = useInView();
  const [expand, setExpand] = useState(false);
  // const { posts } = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const router = useRouter();

  const queryCompanies = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const companiesRes = await ProfileServices.getCompanies(
        profile.user.authorisation
      );
      dispatch(uiActions.setLoading({ loading: false }));
      dispatch(
        profileActions.getAllCompanies({
          companies: companiesRes.data.data.companies,
        })
      );
    },
  });

  const queryColleges = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const collegesRes = await ProfileServices.getColleges(
        profile.user.authorisation
      );
      dispatch(
        profileActions.getAllColleges({
          colleges: collegesRes.data.data.colleges,
        })
      );
    },
  });

  const {
    isLoading,
    isError,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    "profile",
    async ({ pageParam = 1 }) => {
      let profileRes;
      if (router.query['id']) {
        profileRes = await ProfileServices.getProfile(profile.user.authorisation.token, router.query['id'], pageParam);
        const visitedProfileData = profileRes.data.data.user;
        dispatch(
          profileActions.setVisitedProfile({
            posts: profileRes.data.data.posts.data,
            name: visitedProfileData.name,
            department: visitedProfileData.department.name,
            title: visitedProfileData.title,
            email: visitedProfileData.email,
            image_path: visitedProfileData.image_path,
            mobile: visitedProfileData.mobile,
            experiences: visitedProfileData.experiences,
            educations: visitedProfileData.educations,
            certifications: visitedProfileData.certifications
          })
        );
      } else {
        profileRes = await ProfileServices.getPosts(profile.user.authorisation.token, pageParam);
        dispatch(profileActions.updatePosts(profileRes.data.data.posts));
      }
      dispatch(uiActions.setLoading({ loading: false }));
      return profileRes.data.data.posts.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length === 10 ? allPages.length + 1 : undefined;
        return nextPage;
      },
      refetchInterval: 5000,
    }
  );

  // const postsDataArr = router.query['id'] ? profile.user.visitedName : data.pages;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
  }

  function editUserDataHandler() {
    dispatch(
      uiActions.openPopups({
        popupType: "profile",
        mode: "edit",
        content: "edit-profile",
      })
    );
  }

  return (
    <Container fluid>
      <ToastContainer />
      <Row className="justify-content-center px-3 px-lg-0">
        <Col md={10}>
          <Row>
            <Col lg={5}>
              <Row className={`p-3 p-lg-4 ${Styles.profileContainer}`}>
                <Col
                  className={`px-0 pb-2 pb-lg-3 d-flex align-items-center justify-content-between ${Styles.header}`}
                >
                  <div className={`${Styles.leftSection}`}>
                    <div className="position-relative">
                      <Image
                        className="rounded-circle"
                        width={100}
                        height={100}
                        src={router.query['id'] ? profile.user.visitedImage_path : profile.user.image_path}
                        alt="profile image"
                      />
                    </div>
                    <div>
                      <h4 className="mb-0">{router.query['id'] ? profile.user.visitedName : profile.user.name}</h4>
                      <small>{router.query['id'] ? profile.user.visitedDepartment : profile.user.department.name}</small>
                    </div>
                  </div>
                  {!router.query['id'] && <div className={`${Styles.iconConatiner}`}>
                    <button type="button" onClick={editUserDataHandler}>
                      <TbEdit />
                    </button>
                  </div>}
                </Col>
                <Col
                  xs={12}
                  className={`px-0 py-2 py-lg-4 ${Styles.contactContainer}`}
                >
                  <div className="mb-2 mb-lg-3">
                    <h5>Mobile</h5> <small>{router.query['id'] ? profile.user.visitedMobile : profile.user.mobile}</small>
                  </div>
                  <div className="mb-2 mb-lg-3">
                    <h5>Email</h5> <small>{router.query['id'] ? profile.user.visitedEmail : profile.user.email}</small>
                  </div>
                </Col>
                <small
                  className="d-block d-lg-none pointer mb-2 text-end"
                  onClick={() => setExpand(!expand)}
                >
                  Show More
                </small>
                <Col
                  xs={12}
                  className={`px-0 ${expand ? "d-block" : "d-none d-lg-block"}`}
                >
                  {profile.profileFeatures.map((feature, index) => (
                    <ProfileInfoCard key={index} feature={feature} />
                  ))}
                </Col>
              </Row>
            </Col>
            <Col lg={7}>
              {!router.query['id'] && <CreatePost />}
              <>
                {data.pages.map((page) =>
                  page.map((post, index) => {
                    if (page.length === index + 1) return <PostContainer ref={ref} key={index} data={post} />;
                    return <PostContainer key={index} data={post} />;
                  })
                )}
                {isFetchingNextPage && (
                  <span className="d-block text-center">Loading...</span>
                )}
              </>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
