import "bootstrap/dist/css/bootstrap.min.css";
import storeWrapper from "@/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "@/styles/globals.css";
import { MyThemeContextProvider } from "../context/myThemeContext";
import MenuContextProvider from "../context/menu-context";
import { RouteGuard } from "@/compnents/shared/RouteGuard";

export default function App({ Component, ...rest }) {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
  return (
    <Provider store={store}>
      <MyThemeContextProvider>
        <MenuContextProvider>
          <QueryClientProvider client={queryClient}>
            <RouteGuard>
              <Component {...pageProps} />
            </RouteGuard>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </MenuContextProvider>
      </MyThemeContextProvider>
    </Provider>
  );
}
