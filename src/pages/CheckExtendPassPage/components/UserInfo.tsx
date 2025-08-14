import styled from "styled-components";
import { colors } from "../../../colors";

const UserInfo = () => {
  return (
    <Wrapper>
      <NameBox>
        <Name>리움</Name>
        <Text>님</Text>
      </NameBox>

      <IsUsingBox>
        <IsUsingText>좌석 이용중</IsUsingText>
      </IsUsingBox>
    </Wrapper>
  );
};
export default UserInfo;

const Wrapper = styled.div`
  display: flex;
  gap: 45px;
`;

const NameBox = styled.div`
  display: flex;
  align-items: baseline;
  gap: 15px;
`;

const Text = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
  margin-right: 8px;
`;

const Name = styled.span`
  font-size: 50px;
  color: #ffffff;
  font-weight: bold;
`;

const IsUsingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background-color: ${colors.app_main_color};
  border-radius: 30px;
`;

const IsUsingText = styled.span`
  font-size: 25px;
  font-weight: 600;
  color: ${colors.app_white};
  font-weight: bold;
`;
