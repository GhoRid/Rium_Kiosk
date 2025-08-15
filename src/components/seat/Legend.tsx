import styled from "styled-components";
import { colors } from "../../colors";

const Legend = () => {
  return (
    <Wrap>
      <LegendItem>
        <Swatch
          style={{
            background: `${colors.app_main_color}`,
            border: `2px solid ${colors.app_white}`,
          }}
        />
        <Text>이용 가능 고정석</Text>
      </LegendItem>

      <LegendItem>
        <Swatch style={{ background: "#3b3f45" }} />
        <Text>이용 불가</Text>
      </LegendItem>

      <LegendItem>
        <Swatch
          style={{
            background: "transparent",
            border: `2px solid ${colors.app_white}`,
          }}
        />
        <Text>이용 가능</Text>
      </LegendItem>
    </Wrap>
  );
};

export default Legend;

const Wrap = styled.div`
  display: flex;
  gap: 100px;
  justify-content: center;
  margin-bottom: 40px;
`;

const LegendItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Swatch = styled.div`
  width: 35px;
  aspect-ratio: 1;
`;

const Text = styled.span`
  font-size: 20px;
  color: ${colors.app_white};
`;
