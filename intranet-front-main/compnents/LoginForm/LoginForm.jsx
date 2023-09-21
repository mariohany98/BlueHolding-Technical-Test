import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { profileActions } from '@/store/profile-slice';
import AuthServices from "../../services/AuthServices";
import { Toastify } from "../../libs/Toasts";
import Styles from "./LoginForm.module.css";

function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => postData(data);

  const [loginResult, setLoginResult] = useState(null);

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  const { isLoading: isLogin, mutate: postLogin } = useMutation(
    async (data) => {
      return await AuthServices.Login({
        email:data.email,
        password:data.password,
        remember_me:data.staylogin
      })
    },
    {
      onSuccess: (res) => {
        Toastify('success', res.data.message);
        dispatch(profileActions.userLogin(res.data.data));
        router.push("/")
      },
      onError: (err) => {
        Toastify('error', err.response?.data.message)
        setLoginResult(null)
      },
    }
  );

  useEffect(()=>{
    localStorage.removeItem("redux")
  },[])

  useEffect(() => {
    if (isLogin) setLoginResult("Loding...");
  }, [isLogin]);

  function postData(data) {
    try {
      postLogin(data);
    } catch (err) {
      setLoginResult(fortmatResponse(err));
    }
  }

  return (
    <Container className={Styles.Conatiner}>
      <ToastContainer />
      <Row>
        <Col>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>login</h1>
            <pre>{loginResult}</pre>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type === "required" && (
              <small className={Styles.error} role="alert">
                Email is required
              </small>
            )}
            {errors.email?.type === "pattern" && (
              <small className={Styles.error} role="alert">
                {errors.email?.message}
              </small>
            )}
            <label htmlFor="password" className="mt-4">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", { required: true })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password?.type === "required" && (
              <small className={Styles.error} role="alert">
                Password is required
              </small>
            )}
            <div className={Styles.rememberme}>
              <div className="round">
                <input
                  type="checkbox"
                  id="staylogin"
                  {...register("staylogin")}
                />
                <label htmlFor="staylogin"></label>
              </div>
              <label htmlFor="staylogin" className="d-inline-block">
                Stay Login
              </label>
            </div>
            <button type="submit" className="mt-4">
              Sign In
            </button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
