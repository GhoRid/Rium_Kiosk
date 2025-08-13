import styled from "styled-components";
import { colors } from "../colors";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <Container>
      <Text>{title}</Text>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);

  color: ${colors.app_white};
`;

const Text = styled.span`
  font-size: 40px;
  color: ${colors.app_white};
  text-align: center;
`;
