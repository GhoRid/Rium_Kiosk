import styled from "styled-components";
import { clearUserId } from "../../../utils/tokens";

const LogutButton = () => {
  const handleLogout = () => {
    clearUserId();
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogutButton;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
