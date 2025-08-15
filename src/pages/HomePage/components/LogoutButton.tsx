import styled from "styled-components";
import { clearUserId } from "../../../utils/tokens";
import { colors } from "../../../colors";

const LogoutButton = () => {
  const handleLogout = () => {
    clearUserId();
  };

  return (
    <Wrapper>
      <Button onClick={handleLogout} aria-label="로그아웃" title="로그아웃">
        <Message>로그아웃</Message>
      </Button>
    </Wrapper>
  );
};

export default LogoutButton;

const Wrapper = styled.div`
  position: absolute;
  top: 110px;
  right: 60px;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  border: none;
  border-radius: 30px;

  width: 190px;
  height: 75px;
`;

const Message = styled.p`
  color: ${colors.app_white};
  font-size: 32px;
`;
