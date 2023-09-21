import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import BestEmployees from "@/compnents/home/BestEmployees/BestEmployees";
import HomeServices from "../../services/HomeServices";
import { profileActions } from "@/store/profile-slice";
import { uiActions } from "@/store/ui-slice";
import Loading from "../shared/Loading/Loading";

export default function Employees() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const employees = useQuery({
    queryKey: ["employees", page], //used internally for refetching, caching, and sharing your queries throughout your application.
    queryFn: async () => {
      const res = await HomeServices.CompanyLeaderboards(token, page);
      dispatch(uiActions.setLoading({ loading: false }));
      return res.data.data;
    },
    keepPreviousData: true,
  });

  if (employees.isLoading) {
    return <Loading/>;
  }

  if (employees.error) {
    dispatch(profileActions.userLogout());
    localStorage.removeItem("redux");
    router.push("/login");
    return "An error has occurred: " + employees.error.message;
  }

  return (
    <BestEmployees
      bestFive={false}
      page={page}
      lastPage={employees.data.last_page}
      employees={employees.data.data}
      setPage={setPage}
    />
  );
}
