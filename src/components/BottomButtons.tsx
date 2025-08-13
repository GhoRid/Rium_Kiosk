import styled from "styled-components";
import { colors } from "../colors";
import { useNavigate } from "react-router";

type BottomButtonsProps = {
  submitName: string;
  submit: () => void;
  isSingle?: boolean;
};

const BottomButtons = ({
  submitName,
  submit,
  isSingle,
}: BottomButtonsProps) => {
  const navigate = useNavigate();

  return (
    <Container>
      {!isSingle ? null : (
        <BackButton onClick={() => navigate(-1)}>
          <Text>이전</Text>
        </BackButton>
      )}

      <SubmitButton onClick={submit} $isSingle={isSingle ?? false}>
        <Text>{submitName}</Text>
      </SubmitButton>
    </Container>
  );
};

export default BottomButtons;

const Container = styled.div`
  position: absolute;
  bottom: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 135px;
  width: 100%;
  gap: 20px;
`;

const Text = styled.p`
  color: ${colors.app_white};
  font-size: 40px;
  font-weight: 700;
`;

const BackButton = styled.button`
  width: 280px;
  height: 100%;
  border-radius: 30px;
  border: 1px solid ${colors.app_white};
`;

const SubmitButton = styled.button<{ $isSingle: boolean }>`
  width: ${({ $isSingle }) => ($isSingle ? "460px" : "760px")};
  height: 100%;
  border-radius: 30px;
  background-color: ${colors.app_main_color};
`;
