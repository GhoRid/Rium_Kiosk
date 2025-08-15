import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { getAccessToken } from "../../utils/tokens";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = getAccessToken();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (token && pathname === "/") {
      navigate("/home", { replace: true });
    }
    if (!token && pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [pathname, navigate, token]);

  return <Outlet />;
};

export default MainLayout;
