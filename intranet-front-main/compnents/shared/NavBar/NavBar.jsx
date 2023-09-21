import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Col, Row } from "react-bootstrap";
import { useQuery, useMutation } from "react-query";
import { useInView } from "react-intersection-observer";
import { profileActions } from "@/store/profile-slice";
import SearchInput from "../../NavBar/SearchInput/SearchInput";
import ToggleButton from "../../NavBar/ToggleButton/ToggleButton";
import Notification from "../../NavBar/Notification/Notification";
import MyThemeContext from "../../../context/myThemeContext";
import { MenuContext } from "../../../context/menu-context";
import Styles from "./NavBar.module.css";
import HomeServices from "@/services/HomeServices";
import Loading from "../Loading/Loading";

function NavBar() {
  const { ref, inView } = useInView();
  const themeCtx = useContext(MyThemeContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user: {
      id,
      name,
      title,
      image_path,
      authorisation: { token },
      authorisation,
    },
  } = useSelector((state) => state.profile);
  const auth = JSON.stringify(authorisation) !== "{}";
  const { menuStatus, updateMenuStatus } = useContext(MenuContext);

  const [searchMenu, setSearchMenu] = useState(false);

  const handleSearchMenuClick = (e, link) => {
    e.preventDefault();
    setSearchMenu(!searchMenu);
  };

  // const {
  //   data,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery(
  //   "notifications",
  //   async () => {
  //     const res = await HomeServices.getNotifications(token);
  //     dispatch(profileActions.getNotifications(res.data.data.data));
  //     return res.data.data.data;
  //   },
  //   {
  //     getNextPageParam: (lastPage, allPages) => {
  //       const nextPage =
  //         lastPage.length === 10 ? allPages.length + 1 : undefined;
  //       return nextPage;
  //     }
  //   }
  // );

  const notifications = useQuery(
    "notifications",
    async () => {
      const res = await HomeServices.getNotifications(token);
      dispatch(profileActions.getNotifications(res.data.data.data));
      return res.data.data.data;
    },
    {
      refetchInterval: 5000,
      enabled: !token ? false : true, // disable this query from automatically running
    }
  );

  const { mutate: mutateNotification } = useMutation(
    async (id) => {
      return await HomeServices.markNotificationAsRead(token, id);
    },
    {
      onSuccess: (res) => {
        // console.log(res);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  function markAsReadHandler(id, post_id) {
    mutateNotification(id);
    router.push(`/posts/${post_id}`);
  }

  return (
    <nav className="navbar navbar-light position-fixed w-100 justify-content-between">
      <div className="container-fluid px-md-3 px-xl-5 py-1">
        {!searchMenu ? (
          <Row className="w-100">
            <Col xs={4} xxl={1}>
              <div className="navbar-brand">
                <Link href="/">
                  <Image
                    className="dark"
                    src={
                      themeCtx.isDarkTheme
                        ? "/images/logo.png"
                        : "/images/bluelogo.png"
                    }
                    width={110}
                    height={46}
                    alt={`Logo`}
                  />
                </Link>
              </div>
            </Col>
            {auth && (
              <>
                <Col
                  xxl={7}
                  className="d-none d-xxl-flex flex-wrap align-content-center"
                >
                  <SearchInput />
                </Col>
                <Col
                  xxl={4}
                  className="d-none d-xxl-flex flex-wrap align-content-center align-items-center justify-content-end"
                >
                  <ToggleButton />

                  <NavDropdown
                    title={<Notification />}
                    id="notification-nav-dropdown"
                    className="Desk-notification-nav-dropdown"
                  >
                    {notifications.isSuccess &&
                    notifications.data.length > 0 ? (
                      notifications.data.map((noti, index) => (
                        <NavDropdown.Item
                          key={index}
                          onClick={markAsReadHandler.bind(
                            this,
                            noti.id,
                            noti.post_id
                          )}
                        >
                          {noti.type === "comment"
                            ? `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } add a comment in your post`
                            : noti.type === "mention"
                            ? `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } mentioned you in a post`
                            : `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } react on your post`}
                        </NavDropdown.Item>
                      ))
                    ) : (
                      <NavDropdown.Item>No notifications</NavDropdown.Item>
                    )}
                  </NavDropdown>
                  <NavDropdown
                    title={
                      <div className={Styles.profile}>
                        <Image
                          src={image_path}
                          width={44}
                          height={44}
                          alt={`profile`}
                        />
                        <div>
                          <p>{name}</p>
                          <small>{title}</small>
                        </div>
                      </div>
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item
                      onClick={() => {
                        router.push("/profile");
                      }}
                    >
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(profileActions.userLogout());
                        localStorage.removeItem("redux");
                        router.push("/login");
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Col>
                <Col
                  className={`d-flex d-xxl-none align-content-center align-items-center justify-content-end ${Styles.icons}`}
                >
                  <i
                    className="fa-solid fa-magnifying-glass"
                    onClick={handleSearchMenuClick}
                  />
                  <NavDropdown
                    title={<Notification />}
                    id="notification-nav-dropdown"
                    className="notification-nav-dropdown mx-2"
                  >
                    {notifications.isSuccess &&
                    notifications.data.length > 0 ? (
                      notifications.data.map((noti, index) => (
                        <NavDropdown.Item
                          key={index}
                          onClick={markAsReadHandler.bind(
                            this,
                            noti.id,
                            noti.post_id
                          )}
                        >
                          {noti.type === "comment"
                            ? `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } add a comment in your post`
                            : noti.type === "mention"
                            ? `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } mentioned you in a post`
                            : `${
                                noti.causer_name ? noti.causer_name : "Someone"
                              } react on your post`}
                        </NavDropdown.Item>
                      ))
                    ) : (
                      <NavDropdown.Item>No notifications</NavDropdown.Item>
                    )}
                  </NavDropdown>
                  <i
                    className="fa-solid fa-bars"
                    onClick={() => updateMenuStatus(!menuStatus)}
                  ></i>
                </Col>
              </>
            )}
          </Row>
        ) : (
          <Row className={"w-100 align-items-center fadeIn"}>
            <Col xs={10} className="d-flex flex-wrap align-content-center">
              <SearchInput />
            </Col>
            <Col className="text-end">
              <i className="fa fa-times" onClick={handleSearchMenuClick}></i>
            </Col>
          </Row>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
