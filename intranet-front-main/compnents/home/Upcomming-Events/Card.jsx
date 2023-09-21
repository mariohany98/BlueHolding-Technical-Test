import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import classes from "./Card.module.css";
import CardItem from "./CardItem";
import HomeServices from "../../../services/HomeServices";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import Loading from "@/compnents/shared/Loading/Loading";

const Card = ({ short = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    isLoading,
    isError,
    data: events,
    error,
  } = useQuery("events", async () => {
    const res = await HomeServices.Events(token);
    return res.data.data.events;
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
    <div className={classes.mainCard}>
      <div className={classes.cardTitle}>
        <p className={classes.events}>Upcomming Events</p>
        {short && <Link href="/events" className={classes.SeeAll}>
          See All
        </Link>}
      </div>
      {events.length > 0 ? events.map((event, index) => {
        if (short) {
          if (index < 2) {
            return <CardItem key={index} data={event} />;
          }
        } else {
          return <CardItem key={index} data={event} />;
        }
      }):<small className="d-block text-center">No Events</small>}
    </div>
  );
};

export default Card;
