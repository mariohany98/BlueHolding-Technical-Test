import React, {
  useContext,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { profileActions } from "@/store/profile-slice";
import ToggleButton from "../../NavBar/ToggleButton/ToggleButton";
import { MenuContext } from "../../../context/menu-context";
import MyThemeContext from "../../../context/myThemeContext";
import { useRouter } from "next/router";
import style from "./MobileMenu.module.css";

const MobileMenu = () => {
  const router = useRouter();
  const rout = router.pathname;
  const { menuStatus, updateMenuStatus } = useContext(MenuContext);
  const themeCtx = useContext(MyThemeContext);
  const menuEl = useRef(null);
  const dispatch = useDispatch();

  const handleMenuClick = (e, link) => {
    e.preventDefault();
    if(link !== "#"){
      updateMenuStatus(!menuStatus);
      router.push(link);
    }
    updateMenuStatus(!menuStatus);
  };

  return (
    <div
      className={`${style.mobileMenu}`}
    >
      <div
        className={`${style.mobileMenuOverlay}`}
        onClick={(e)=>handleMenuClick(e,)}
      ></div>
      <div className={`${style.mobileMenuInner}`}>
        <div className={`${style.mobileMenuTop}`}>
          <div className={`${style.mobileMenuLogo}`}>
            <Link href={`/`}>
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
          <Link href={"#"} className={`${style.mobileMenuClose}`} onClick={(e)=>handleMenuClick(e,"#")}>
              <i className="fa fa-times"></i>
          </Link>
        </div>
        <nav className={`${style.mobileMenuLinks}`} ref={menuEl}>
          <ul>
                <li>
                  <Link href={"/"} className={rout === "/" ? style.active : ''} onClick={(e)=>handleMenuClick(e,"/")}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={"/profile"} className={rout === "/profile" ? style.active : ''} onClick={(e)=>handleMenuClick(e,"/profile")}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href={"/dashboard"} className={rout === "/dashboard" ? style.active : ''} onClick={(e)=>handleMenuClick(e,"/dashboard")}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={"/events"} className={rout === "/events" ? style.active : ''} onClick={(e)=>handleMenuClick(e,"/events")}>
                    Events
                  </Link>
                </li>
                <li>
                  <Link href={"#"} onClick={(e) => {
                  e.preventDefault();
                  dispatch(profileActions.userLogout())
                  updateMenuStatus(!menuStatus);
                  localStorage.removeItem("redux");
                  router.push("/login");
                }}>
                    logout
                  </Link>
                </li>
                <li>
                  <div style={{marginLeft:"-0.75rem"}}>
                    <ToggleButton/>
                  </div>
                </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
