import React from "react";
import Image from "next/image";
import classes from "./BirthdayItem.module.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const BirthdayItem = (props) => {
  return (
    <div className={classes.BirthDayItem}>
      <div className="d-flex align-items-center" style={{gap:"8px"}}>
        <div>
          <Image
            className={classes.BirthdayItemImage}
            src={"/images/Frame15.png"}
            width={46}
            height={46}
            alt=""
          />
        </div>
        <div className={classes.BirthdayItemText}>
          <p>Ali Mohamed Ali</p>
          <p>22 Oct 2014</p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayItem;
