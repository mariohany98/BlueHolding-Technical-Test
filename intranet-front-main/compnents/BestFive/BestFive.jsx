import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import BestEmployees from "@/compnents/home/BestEmployees/BestEmployees";
import HomeServices from "../../services/HomeServices";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import Loading from "../shared/Loading/Loading";

export default function BestFive() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const bestFive = useQuery("bestFive", async () => {
    const res = await HomeServices.DepartmentLeaderboards(token);
    return res.data.data.data;
  });
  if (bestFive.isLoading) {
    return <Loading/>;
  }

  if (bestFive.error) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
    return "An error has occurred: " + bestFive.error.message;
  }

  return (
    <BestEmployees bestFive={true} employees={bestFive.data} />
  );
}
