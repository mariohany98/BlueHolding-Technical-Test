import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import classes from "./BirthdaysCard.module.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import BirthdayItem from "./BirthdayItem";
import Link from "next/link";
import HomeServices from "../../../services/HomeServices";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import Loading from "@/compnents/shared/Loading/Loading";

const Birthday = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    isLoading,
    isError,
    data: birthdates,
    error,
  } = useQuery("birthdates", async () => {
    const res = await HomeServices.Birthdates(token);
    return res.data.data.users;
  });

  if (isLoading) {
    return <Loading/>;
  }
  if (isError) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
    // return <span>Error: {error.message}</span>;
  }
  return (
    <div className={classes.BirthDayCard}>
      <Row className={classes.BirthDayCardHeader}>
        <Col className="d-flex justify-content-between">
          <p>Birthdays</p>
          <Link href="/events" className={classes.SeeAll}>
            <p>See All</p>
          </Link>
        </Col>
      </Row>
      <div className="p-3">
        {birthdates.length > 0 ? (
          birthdates.map((birthday, index) => {
            return <BirthdayItem key={index} data={birthday} />;
          })
        ) : (
          <small className="d-block text-center">No Birthdays</small>
        )}
      </div>
    </div>
  );
};

export default Birthday;
