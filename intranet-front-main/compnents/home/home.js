import React from "react";
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { profileActions } from "@/store/profile-slice";
import { usersActions } from "@/store/users-slice";
import UpcommingEvents from "./Upcomming-Events/Card";
import BirthdaysCard from "./Birthdays/BirthdaysCard";
import CreatePost from "../Posts/CreatePost/CreatePost";
import BestFive from "../BestFive/BestFive";
import Employees from "../Employees/Employees";
import HomePosts from "./HomePosts/HomePosts";
import PostsAndCommentsService from "../../services/PostsAndCommentsService";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    isLoading,
    isError,
    data,
    error,
  } = useQuery("users", async () => {
    const res = await PostsAndCommentsService.GetUsers(token);
    dispatch(usersActions.setUsers({users:res.data.data.users}))
    return res.data.data.users ;
  });
  if (isError) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
    // return <span>Error: {error.message}</span>;
  }
  return (
    <Container fluid>
      <ToastContainer />
      <Row className="justify-content-center">
        <Col xl={10}>
          <Row>
            <Col xxl={6}>
              <CreatePost />
              <HomePosts/>
            </Col>
            <Col xxl={6}>
              <Row className="d-none d-xxl-flex">
                <Col xs={12} xl={7}>
                  <Employees/>
                </Col>
                <Col xs={12} xl={5}>
                  <BestFive/>
                </Col>
              </Row>
              <Row className="mt-3 d-none d-xxl-flex">
                <Col xs={12} xl={7}>
                  <UpcommingEvents short={true} />
                </Col>
                <Col xs={12} xl={5}>
                  <BirthdaysCard />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
