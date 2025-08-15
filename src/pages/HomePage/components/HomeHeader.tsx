import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as Logo } from "../../../assets/svgs/Logo1.svg";

type HomeHeaderProps = {
  placeName: string;
  placeMobileNumber: string;
};

const HomeHeader = ({ placeName, placeMobileNumber }: HomeHeaderProps) => {
  return (
    <Container>
      <BranchInfo>
        <BranchName>{placeName}</BranchName>
        <BranchPhone>{placeMobileNumber}</BranchPhone>
      </BranchInfo>

      {/* 로고 + 지점명 */}
      <LogoWrapper>
        <Logo width={280} height={130} fill={colors.app_white} />
        <BrandName>리 움</BrandName>
      </LogoWrapper>
    </Container>
  );
};

export default HomeHeader;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
  margin-bottom: 125px;
`;

const BranchInfo = styled.div`
  display: flex;
  gap: 30px;
`;

const BranchName = styled.span`
  font-size: 30px;
  font-weight: 500;
  color: ${colors.app_white};
`;
const BranchPhone = styled.span`
  font-size: 30px;
  font-weight: 300;
  color: ${colors.app_white};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

const BrandName = styled.span`
  font-size: 90px;
  font-weight: bold;
`;
