import { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as DirectionDown } from "../../../assets/svgs/directionDown.svg";

type JoinPathAccordionProps = {
  route?: string;
  setRoute: (v: string) => void;
  paths: string[];
  error?: string;
};

const JoinPathAccordion = ({
  route = "가입 경로",
  setRoute,
  paths,
  error,
}: JoinPathAccordionProps) => {
  const [open, setOpen] = useState(false);

  const handlePathClick = (text: string) => {
    setRoute(text);
    setOpen(false);
  };

  return (
    <Wrapper>
      <Card>
        <Header
          $selected={route !== "가입 경로"}
          onClick={() => setOpen((v) => !v)}
        >
          <Title>{route}</Title>
          <Caret $open={open}>
            <DirectionDown />
          </Caret>
        </Header>

        {open && (
          <Body>
            {paths.map((text, i) => (
              <PathRow key={i} onClick={() => handlePathClick(text)}>
                <PathText>{text}</PathText>
              </PathRow>
            ))}
          </Body>
        )}
      </Card>
      {!!error && (
        <ErrorMsgBox>
          <ErrorMsg>{error}</ErrorMsg>
        </ErrorMsgBox>
      )}
    </Wrapper>
  );
};

export default JoinPathAccordion;

const Wrapper = styled.div`
  position: relative;
`;

const Card = styled.div``;

const Header = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  border-bottom: ${({ $selected }) =>
    $selected
      ? `2px solid ${colors.app_white}`
      : `1px solid ${colors.app_white}`};
  background: transparent;
`;

const Title = styled.div`
  color: ${colors.app_white};
  font-size: 36px;
`;

const Caret = styled.span<{ $open: boolean }>`
  color: ${colors.app_white};
  font-size: 22px;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 160ms ease;
`;

const Body = styled.div`
  position: absolute;
  width: 100%;
  top: 100px;
  left: 0;
  z-index: 1;
  background: ${colors.app_white};
  height: 350px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.app_black};
    border-radius: 3px;
  }
`;

const PathRow = styled.div`
  width: 100%;
  height: 96px;
  display: flex;
  align-items: center;
  padding: 0 35px;

  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const PathText = styled.span`
  font-size: 30px;
  color: ${colors.app_black};
`;

const ErrorMsgBox = styled.div`
  position: absolute;
  margin-top: 5px;
`;

const ErrorMsg = styled.p`
  color: #ff0000;
  font-size: 24px;
`;
