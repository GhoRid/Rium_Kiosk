import styled from "styled-components";
import { ReactComponent as PurchasePass } from "../../../assets/svgs/purchase_pass.svg";
import { ReactComponent as CheckExtendPass } from "../../../assets/svgs/check_extend_pass.svg";
import { ReactComponent as ChangeSeat } from "../../../assets/svgs/change_seat.svg";
import { ReactComponent as Enter } from "../../../assets/svgs/enter.svg";
import { ReactComponent as Exit } from "../../../assets/svgs/exit.svg";
import { colors } from "../../../colors";
import { useNavigate } from "react-router";

const HomeMenu = () => {
  const navigate = useNavigate();

  const FeatureList = [
    {
      name: "이용권 구매",
      icon: <PurchasePass />,
      // action: () => console.log("구매"),
      action: () => navigate("/select-pass"),
    },
    {
      name: "이용권\n확인/연장",
      icon: <CheckExtendPass />,
      action: () => navigate("/checkextendpass"),
    },
    {
      name: "자리 이동",
      icon: <ChangeSeat />,
      action: () => navigate("/changeseat"),
    },
  ];

  const ActionList = [
    {
      name: "퇴실하기",
      icon: <Exit />,
      action: () => console.log("퇴실하기"),
    },
    {
      name: "입실하기",
      icon: <Enter />,
      action: () => console.log("입실하기"),
    },
  ];

  return (
    <MenuContainer>
      <FeatureBox>
        {FeatureList.map((feature) => (
          <MenuButton key={feature.name} onClick={feature.action}>
            <Label>{feature.name}</Label>
            <IconBox>{feature.icon}</IconBox>
          </MenuButton>
        ))}
      </FeatureBox>

      <ActionBox>
        {ActionList.map((action) => (
          <ActionButton key={action.name} onClick={action.action}>
            <Label>{action.name}</Label>
            <IconBox>{action.icon}</IconBox>
          </ActionButton>
        ))}
      </ActionBox>

      <ReprintBox onClick={() => console.log("출입증 재발행")}>
        <Label>출입증 재발행</Label>
      </ReprintBox>
    </MenuContainer>
  );
};
export default HomeMenu;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeatureBox = styled.div`
  display: flex;
  gap: 20px;
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 30px;
  color: ${colors.app_white};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  padding: 30px;
  text-align: left;
`;

const MenuButton = styled(BaseButton)`
  width: 260px;
  height: 240px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
`;

const Label = styled.span`
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
  white-space: pre-line; /* \n 줄바꿈 표시 */
`;

const IconBox = styled.div`
  align-self: flex-end;
  pointer-events: none;
`;

const ActionBox = styled.div`
  display: flex;
  gap: 20px;
`;

const ActionButton = styled(BaseButton)`
  width: 400px;
  height: 350px;
  background: linear-gradient(180deg, #1c2e4a 0%, #112037 100%),
    ${colors.app_main_color};
`;

const ReprintBox = styled.button`
  width: 290px;
  height: 90px;
  border: none;
  border-radius: 30px;
  color: ${colors.app_white};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: flex-end;

  background: linear-gradient(
      180deg,
      rgba(45, 47, 50, 1) 0%,
      rgba(36, 38, 41, 1) 100%
    ),
    #2b2b2b;
`;
