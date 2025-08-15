import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getUserId } from "../../utils/tokens";

const UserLoginLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserId();
    const fullPath = location.pathname + location.search + location.hash;

    if (userId && location.pathname === "/") {
      navigate("/home", { replace: true });
    } else if (!userId && location.pathname !== "/login") {
      // 로그인 페이지로 보낼 때 'from' 상태에 원래 가려던 경로를 저장
      navigate("/login", {
        replace: true,
        state: { from: fullPath },
      });
    }
  }, [location, navigate]);

  return <Outlet />;
};

export default UserLoginLayout;
