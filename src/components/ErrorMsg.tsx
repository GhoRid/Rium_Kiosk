import styled from "styled-components";
import { colors } from "../colors";

const ErrorMsg = ({ children }: { children: any }) => {
  return (
    <ErrorMsgBox>
      <ErrorMsgText>{children}</ErrorMsgText>
    </ErrorMsgBox>
  );
};
export default ErrorMsg;

const ErrorMsgBox = styled.div`
  position: absolute;
  bottom: 400px;
  left: 50%;
  transform: translateX(-50%);
`;

const ErrorMsgText = styled.p`
  color: ${colors.red};
  font-size: 24px;
  white-space: pre-wrap;
  text-align: center;
`;
