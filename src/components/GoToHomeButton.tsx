import { useNavigate } from "react-router";
import styled from "styled-components";
import { ReactComponent as HomeIcon } from "../assets/svgs/home.svg";
import { colors } from "../colors";

const GoToHomeButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <Button onClick={handleClick}>
      <HomeIcon width={50} height={50} />
      <Text>HOME</Text>
    </Button>
  );
};
export default GoToHomeButton;

const Button = styled.button`
  position: absolute;
  top: 75px;
  left: 75px;
  /* margin: 75px 0 0 75px */
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Text = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
  text-align: center;
`;
