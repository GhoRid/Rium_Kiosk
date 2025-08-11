import styled from "styled-components";
import { colors } from "../../../colors";
import { useNavigate } from "react-router";

const AuthLinks = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LinkText onClick={() => navigate("/reset-password")}>
        비밀번호 재설정
      </LinkText>
      <Divider>|</Divider>
      <LinkText onClick={() => navigate("/signup")}>회원가입</LinkText>
    </Container>
  );
};

export default AuthLinks;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-bottom: 75px;
`;

const LinkText = styled.button`
  color: ${colors.app_white};
  font-size: 32px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  color: ${colors.app_white};
  font-size: 32px;
`;
