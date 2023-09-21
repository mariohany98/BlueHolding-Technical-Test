import React, { Fragment, useContext } from "react";
import { useSelector } from "react-redux";
import Script from "next/script";
import Head from "next/head";
import { MenuContext } from "../../context/menu-context";
import MobileMenu from "./MobileMenu/MobileMenu";
import Navbar from "./NavBar/NavBar";
import Loading from "./Loading/Loading";

const Layout = (props) => {
  const { children, seo } = props;
  const { loading } = useSelector((state) => state.ui);
  const { menuStatus } = useContext(MenuContext);
  return (
    <Fragment>
      <Head>
        <title>{seo ? seo?.title : "Intranet"}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name={`description`} content={seo?.description} />
        <link rel="canonical" href={seo?.url} />
        <meta name="keywords" content={seo?.keywords} />
        <meta property={"og:title"} content={seo?.title} />
        <meta property={"og:url"} content={seo?.url} />
        <meta property={"og:description"} content={seo?.description} />
        <meta property={"og:type"} content="website" />
        <meta
          property={"og:image"}
          content={`${process.env.NEXT_PUBLIC_BACK_URL}/${seo?.image}`}
        />
        <meta property={"og:site_name"} content="Inteligencia" />

        <meta name={`twitter:title`} content={seo?.title} />
        <meta name={`twitter:url`} content={seo?.url} />
        <meta name={`twitter:description`} content={seo?.description} />
        <meta
          name={"twitter:image"}
          content={`${process.env.NEXT_PUBLIC_BACK_URL}/${seo?.image}`}
        />
        <Script
          src="https://maps.googleapis.com/maps/api/js"
          strategy="lazyOnload"
        />
      </Head>

      {/* {loading === true ? (
        <Loading />
      ) : (
        <>
          <Navbar /> {menuStatus === true ? <MobileMenu /> : null}
          <main>{children}</main>
        </>
      )} */}
      <Navbar /> {menuStatus === true ? <MobileMenu /> : null}
          <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
