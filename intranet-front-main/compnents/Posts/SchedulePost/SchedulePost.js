import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { postsActions } from "@/store/posts-slice";
import { uiActions } from "@/store/ui-slice";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from "react-datepicker";
import useConvertDateAndTime from "../../../hooks/useConvertDateAndTime";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./SchedulePost.module.css";

export default function SchedulePost() {
    const schedulePostData = useSelector((state) => state.posts.schedulePost);
    const dispatch = useDispatch();
    const { control, register, handleSubmit, formState, setValue, watch } =
        useForm({
            defaultValues: {
                date: new Date(),
                hour: "12",
                minute: "00",
                sunTime: "PM",
            },
        });
    const { errors } = formState;

    const dateSelected = watch("date");
    const DateAndTime = useConvertDateAndTime(
        dateSelected.toDateString(),
        watch("hour"),
        watch("minute"),
        watch("sunTime")
    );

    const renderHours = () => {
        let hours = [];
        for (let i = 1; i <= 12; i++) {
            hours.push(i);
        }
        return hours.map((value, index) => <option key={index} value={value}>{value}</option>);
    };

    const renderMinute = () => {
        const minute = [];
        for (let i = 0; i <= 55; i += 5) {
            minute.push(i.toString().padStart(2, "0"));
        }
        return minute.map((value, index) => <option key={index} value={value}>{value}</option>);
    };

    useEffect(() => {
        if (schedulePostData.date.length > 0) {
            setValue("date", new Date(schedulePostData.date));
            setValue(`hour`, schedulePostData.hour);
            setValue(`minute`, schedulePostData.minute);
            setValue(`sunTime`, schedulePostData.sunTime);
        }
    }, [schedulePostData]);


    function submitHandler(formData) {
        dispatch(postsActions.addSchedulePost({ schedulePost: {...formData, date:formData.date.toString()} }));
        dispatch(uiActions.openPopups({ popupType: "main", content: "insert-media" }));
    }
    function ClearTime(formData) {
         dispatch(postsActions.addSchedulePost({ schedulePost: {
        date: '',
        hour: '12',
        minute: '00',
        sunTime: 'PM'
    } }));
        dispatch(uiActions.openPopups({ popupType: "main", content: "insert-media" }));
    }

    return (
        <form
            className={styles.scheduleForm}
            onSubmit={handleSubmit(submitHandler)}
            noValidate
        >
            <div className={styles.formContent}>
                {dateSelected.toString().length > 0 && (
                    <p className="m-0 mb-4">{DateAndTime}</p>
                )}
                <div className="mb-3">
                    <label htmlFor="date" className="mb-2">
                        Date
                    </label>
                    <div className={styles.date}>
                        <Controller
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Date field is required!",
                                },
                            }}
                            id="date"
                            name="date"
                            render={({ field }) => (
                                <DatePicker
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    className="dateInput"
                                    withPortal
                                    minDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                />
                            )}
                        />
                    </div>
                    <p className={`${styles.error} m-0`}>{errors?.date?.message}</p>
                </div>
                <div>
                    <label htmlFor="hour" className="mb-2">
                        Time
                    </label>
                    <Row>
                        <Col md={12} lg={4}>
                            <div
                                className={`${styles.timeWrapper} d-flex align-items-center justify-content-between mb-3 mb-sm-3 mb-lg-auto`}
                            >
                                <div
                                    className={`position-relative ${styles.dropdownWrapper} w-100`}
                                >
                                    <p className="m-0 mt-3 ps-3">Hour</p>
                                    <select
                                        className="w-100 position-absolute pt-4 px-3 border-0"
                                        id="hour"
                                        {...register("hour")}
                                    >
                                        {renderHours()}
                                    </select>
                                    <div className="text-end pe-3">
                                        <IoIosArrowDown />
                                    </div>
                                </div>
                            </div>
                            <p className={`${styles.error} m-0`}>{errors?.hour?.message}</p>
                        </Col>
                        <Col md={12} lg={4}>
                            <div
                                className={`${styles.timeWrapper} d-flex align-items-center justify-content-between mb-3 mb-sm-3 mb-lg-auto`}
                            >
                                <div
                                    className={`position-relative ${styles.dropdownWrapper} w-100`}
                                >
                                    <p className="m-0 mt-3 ps-3">Minute</p>
                                    <select
                                        className="w-100 position-absolute pt-4 px-3 border-0"
                                        id="minute"
                                        {...register("minute")}
                                    >
                                        {renderMinute()}
                                    </select>
                                    <div className="text-end pe-3">
                                        <IoIosArrowDown />
                                    </div>
                                </div>
                            </div>
                            <p className={`${styles.error} m-0`}>{errors?.minute?.message}</p>
                        </Col>
                        <Col md={12} lg={4}>
                            <div
                                className={`${styles.timeWrapper} d-flex align-items-center justify-content-between`}
                            >
                                <div
                                    className={`position-relative ${styles.dropdownWrapper} w-100`}
                                >
                                    <p className="m-0 mt-3 ps-3">AM/PM</p>
                                    <select
                                        className="w-100 position-absolute pt-4 px-3 border-0"
                                        id="sunTime"
                                        {...register("sunTime")}
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    <div className="text-end pe-3">
                                        <IoIosArrowDown />
                                    </div>
                                </div>
                            </div>
                            <p className={`${styles.error} m-0`}>
                                {errors?.sunTime?.message}
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>

            <footer className="d-flex justify-content-end">
                {schedulePostData.date.length > 0 && <div className={`${styles.action} me-2`}>
                    <button onClick={ClearTime}>Clear time</button>
                </div>}
                <div className={styles.action}>
                    <button type="submit">Confirm</button>
                </div>
            </footer>
        </form>
    );
}
