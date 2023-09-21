import React from "react";
import Image from "next/image";
import classes from "./CardItem.module.css";
import {formatDateToCustomFormat} from "../../../libs/DateAndTime"

const CardItem = ({ data }) => {
  const { image_path, name, description, start_date, end_date } = data;
  return (
    <div className={classes.fullCard}>
      <div className={classes.Header}>
        <div className={classes.Imagebg}>
          <Image src={image_path} width={58} height={58} alt="event logo"/>
        </div>
        <div className={classes.HeaderTitle}>
          <p>{name}</p>
          <p>{description}</p>
        </div>
      </div>
      <div>
        <div>
          <p>{formatDateToCustomFormat(start_date)}</p>
          <p>Start</p>
        </div>
        <div>
          <p>{formatDateToCustomFormat(end_date)}</p>
          <p>End</p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
