import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Notification.module.css";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [isUnread, setIsUnread] = useState(true);
  const { notifications } = useSelector((state) => state.profile);
  
  useEffect(() => {
    let unreadNotification;
    setIsUnread((prevState) => {
      unreadNotification = notifications.find((noti) => noti.read === 0);
      if (unreadNotification) return true;
      else return false;
    });
  }, [notifications]);
  return (
    <div className={styles.notifation}>
      <i className="fa-solid fa-bell" onClick={() => setOpen(!open)}></i>
      {isUnread && <span className={styles.badge}></span>}
    </div>
  );
}
