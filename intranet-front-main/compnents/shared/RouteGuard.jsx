import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
export { RouteGuard };

function RouteGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const authorisation =
    JSON.stringify(useSelector((state) => state.profile.user.authorisation)) !== '{}';
    const publicPaths = ['/login'];
    useEffect(() => {
    const authCheck = () => {
      if (
        !authorisation &&
        !publicPaths.includes(router.asPath.split('?')[0])
      ) {
        setAuthorized(false);
        router.push({
          pathname: '/login',
        });
      } else {
        setAuthorized(true);
        if(router.asPath.split('?')[0] === "/login" && authorisation){
            router.push({
            pathname: '/',
        });
        }
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on('routeChangeStart', preventAccess);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router, router.events, authorisation]);

    return (authorized && children);
}