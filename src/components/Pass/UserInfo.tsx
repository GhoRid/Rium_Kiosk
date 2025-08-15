import styled from "styled-components";
import { colors } from "../../colors";

type UserInfoProps = {
  name: string;
  isUsing: boolean;
};

const UserInfo = ({ name, isUsing }: UserInfoProps) => {
  return (
    <Wrapper>
      <NameBox>
        <Name>{name}</Name>
        <Text>님</Text>
      </NameBox>

      <IsUsingBox $isUsing={!!isUsing}>
        <IsUsingText>{isUsing ? "좌석 이용중" : "미 이용중"}</IsUsingText>
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

const IsUsingBox = styled.div<{ $isUsing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background-color: ${({ $isUsing }) =>
    $isUsing ? colors.app_main_color : "#2C2E32"};
  border-radius: 30px;
`;

const IsUsingText = styled.span`
  font-size: 25px;
  font-weight: 600;
  color: ${colors.app_white};
  font-weight: bold;
`;
