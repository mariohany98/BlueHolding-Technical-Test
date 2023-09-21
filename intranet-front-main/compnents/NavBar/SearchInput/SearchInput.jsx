import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Container, Row, Col } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import useOutsideClick from "../../../hooks/useOutsideClick";
import HomeServices from "../../../services/HomeServices";
import Styles from "./SearchInput.module.css";
import { Toastify } from "../../../libs/Toasts";
import Link from "next/link";

export default function SearchInput() {
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchSearch = watch("search", false);

  const [show, setShow] = useState(watchSearch);

  const {
    isLoading: isSearch,
    data,
    mutate: postSearch,
  } = useMutation(
    async (text) => {
      const res = await HomeServices.Serach(token, {
        search: text,
      });
      return res.data.data;
    },
    {
      onSuccess: (res) => {
        // Toastify("success", res.data.message);
        setShow(true);
      },
      onError: (err) => {
        Toastify("error", err.response?.data.message);
      },
    }
  );

  // useEffect(() => {
  //   setShow(watchSearch)
  // },[watchSearch])

  const onSubmit = ({ search }) => {
    postSearch(search);
  };

  const handleClickOutside = () => {
    setShow(false);
  };

  const ref = useOutsideClick(handleClickOutside);
  return (
    <Container ref={ref}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xs={11} lg={7}>
            <div className="position-relative">
              <input
                type="text"
                name="search"
                autoComplete="off"
                className={Styles.input}
                {...register("search", { required: true })}
                aria-invalid={errors.search ? "true" : "false"}
              />
              {watchSearch && (
                <i
                  className={`fa-solid fa-xmark ${Styles.icon}`}
                  onClick={() => {reset(); setShow(false);}}
                ></i>
              )}
              {errors.search?.type === "required" && (
                <small className={Styles.error} role="alert">
                  search is required
                </small>
              )}
              {show && (
                <ul className={Styles.ul}>
                  {data?.users.length === 0 && data?.posts.length === 0 ? (
                    <div className="text-center p-4">No serach result</div>
                  ) : (
                    <>
                      {data?.users.map((user, index) => (
                        <Link href={`/profile/${user.id}`} key={index}><li>{user.name}</li></Link>
                      ))}
                      {data?.posts.map((post, index) => (
                        <Link href={`/posts/${post.id}`} key={index}><li>{post.thread}</li></Link>
                      ))}
                    </>
                  )}
                </ul>
              )}
            </div>
          </Col>
          <Col xs={1} className="ps-0">
            <button className={Styles.button} type="submit">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </Col>
        </Row>
      </form>
    </Container>
  );
}
