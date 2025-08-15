import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { getAccessToken } from "../../utils/tokens";

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const token = getAccessToken();
    if (token && pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [pathname, navigate]);

  return <Outlet />;
};

export default MainLayout;
