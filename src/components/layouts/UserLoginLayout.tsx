import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getUserId } from "../../utils/tokens";

const UserLoginLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserId();

    if (userId && pathname === "/") {
      navigate("/home", { replace: true });
    } else if (!userId && pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [pathname, navigate]);

  return <Outlet />;
};

export default UserLoginLayout;
