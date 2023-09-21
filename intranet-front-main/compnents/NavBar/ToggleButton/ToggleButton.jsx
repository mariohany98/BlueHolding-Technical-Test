import React, { useContext } from "react";
import Styles from "./ToggleButton.module.css";
import MyThemeContext from "../../../context/myThemeContext";

export default function ToggleButton() {

  const themeCtx = useContext(MyThemeContext);
  
  return (
    <label className={`${Styles.switch} theme-switch`}>
      <input type="checkbox" onChange={themeCtx.toggleThemeHandler} checked={themeCtx.isDarkTheme}/>
      <div className={Styles.switch__button}></div>
      <div className={Styles.switch__background}></div>
    </label>
  );
}
