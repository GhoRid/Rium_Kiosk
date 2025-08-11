import { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as DirectionDown } from "../../../assets/svgs/directionDown.svg";

type JoinPathAccordionProps = {
  route?: string;
  setRoute: (v: string) => void;
  paths: string[];
  maxHeight?: number;
};

const JoinPathAccordion = ({
  route = "가입 경로",
  setRoute,
  paths,
  maxHeight = 360,
}: JoinPathAccordionProps) => {
  const [open, setOpen] = useState(true);

  const handlePathClick = (text: string) => {
    setRoute(text); // ✅ title 변경
    setOpen(false); // 선택 후 닫기 원하면 추가
  };

  return (
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
        <Body $maxHeight={maxHeight}>
          <Inner>
            {paths.map((text, i) => (
              <PathRow key={i} onClick={() => handlePathClick(text)}>
                {text}
              </PathRow>
            ))}
          </Inner>
        </Body>
      )}
    </Card>
  );
};

export default JoinPathAccordion;

const Card = styled.div`
  overflow: hidden;
`;

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
  color: #f5f5f5;
  font-size: 22px;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 160ms ease;
`;

const Body = styled.div<{ $maxHeight: number }>`
  background: ${colors.app_white};
  height: ${({ $maxHeight }) => $maxHeight}px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.app_background};
    border-radius: 3px;
  }
`;

const Inner = styled.div`
  padding: 18px 24px;
`;

const PathRow = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #0f0f0f;
  padding: 18px 4px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;
