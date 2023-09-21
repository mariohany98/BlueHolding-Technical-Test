import { createContext, useEffect, useState } from "react";

const MyThemeContext = createContext({
  isDarkTheme: true,
  toggleThemeHandler: () => {},
});


export function MyThemeContextProvider(props){
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  useEffect(() => initialThemeHandler());

  function isLocalStorageEmpty() {
    return !localStorage.getItem("isDarkTheme");
  }

  function initialThemeHandler() {
    if (isLocalStorageEmpty()) {
      localStorage.setItem("isDarkTheme", `true`);
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDarkTheme(true);
    } else {
      const isDarkTheme= JSON.parse(
        localStorage.getItem("isDarkTheme")
      );
      isDarkTheme ? document.documentElement.setAttribute("data-theme", "dark"): document.documentElement.setAttribute("data-theme", "light");
      setIsDarkTheme(() => {
        return isDarkTheme;
      });
    }
  }

  function toggleThemeHandler() {
    const isDarkTheme = JSON.parse(
      localStorage.getItem("isDarkTheme")
    );
    setIsDarkTheme(!isDarkTheme);
    toggleDarkClassToBody(!isDarkTheme);
    setValueToLocalStorage();
  }

  function toggleDarkClassToBody(isDarkTheme) {
    document.documentElement.setAttribute("data-theme", isDarkTheme? "dark" : "light");
  }

  function setValueToLocalStorage() {
    localStorage.setItem("isDarkTheme", `${!isDarkTheme}`);
  }

  return (
    <MyThemeContext.Provider value={{ isDarkTheme: isDarkTheme, toggleThemeHandler }}>
      {props.children}
    </MyThemeContext.Provider>
  );
}

export default MyThemeContext;