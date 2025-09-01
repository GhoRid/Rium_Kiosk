import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { colors } from "../../../colors";
import { clearTokens, clearUserId } from "../../../utils/tokens";

type HeaderInfoBoxProps = {
  userName: string;
};

const TAP_THRESHOLD_MS = 600;
const REQUIRED_TAPS = 3;

const HeaderInfoBox = ({ userName }: HeaderInfoBoxProps) => {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const isLoggedIn = Boolean(userName);

  const tapMeta = useRef<{
    count: number;
    last: number;
    resetId: number | null;
  }>({
    count: 0,
    last: 0,
    resetId: null,
  });

  const handleLogout = () => {
    clearUserId();
  };

  const handleSecretTap = () => {
    const now = Date.now();

    if (now - tapMeta.current.last < TAP_THRESHOLD_MS) {
      tapMeta.current.count += 1;
    } else {
      tapMeta.current.count = 1;
    }
    tapMeta.current.last = now;

    if (tapMeta.current.resetId) window.clearTimeout(tapMeta.current.resetId);
    tapMeta.current.resetId = window.setTimeout(() => {
      tapMeta.current.count = 0;
      tapMeta.current.resetId = null;
    }, TAP_THRESHOLD_MS) as unknown as number;

    if (tapMeta.current.count >= REQUIRED_TAPS) {
      tapMeta.current.count = 0;

      try {
        (window as any).electronAPI?.quit?.();
        (window as any).api?.quitApp?.();
        (window as any).electron?.app?.quit?.();
      } catch {}

      window.close();
      handleLogout();
      clearTokens();

      window.dispatchEvent(new Event("secret-exit"));
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const weekday = "일월화수목금토"[now.getDay()];
      const date = `${month}/${day}(${weekday})`;
      const time = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setDateTime({ date, time });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <LoggedInWrap>
          <InfoCard>
            <GreetingBox>
              <GreetTitle>{userName} 님 안녕하세요.</GreetTitle>
              <GreetSub>나만의 학습 공간, 리움입니다.</GreetSub>
            </GreetingBox>
            <Divider />
            <DateTimeCol>
              <DateText>{dateTime.date}</DateText>
              <TimeText>{dateTime.time}</TimeText>
            </DateTimeCol>
          </InfoCard>

          <LogoutButton
            type="button"
            onClick={handleLogout}
            aria-label="로그아웃"
            title="로그아웃"
          >
            로그아웃
          </LogoutButton>
        </LoggedInWrap>
      ) : (
        <LoggedOutWrap>
          <SecretCloseButton
            aria-label="hidden-close-button"
            title=""
            onClick={handleSecretTap}
            onTouchStart={handleSecretTap}
          />
          <>
            <DateText style={{ opacity: 0.9 }}>{dateTime.date}</DateText>
            <TimeText style={{ fontSize: 30, marginTop: 6 }}>
              {dateTime.time}
            </TimeText>
          </>
        </LoggedOutWrap>
      )}
    </>
  );
};

export default HeaderInfoBox;

/* ---------- styles ---------- */

const LoggedInWrap = styled.div`
  margin: 50px 40px 0 40px;
  height: 200px;
  width: calc(100% - 80px);
  display: flex;
  align-items: stretch;
  gap: 20px;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 35px;
  border-radius: 30px;
  background: #6f7073;
  color: ${colors.app_white};
  flex: 3 1 0;
  box-sizing: border-box;
`;

const LogoutButton = styled.button`
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 30px;
  background: #f3f3f3;
  color: ${colors.app_black};
  font-size: 40px;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
`;

const GreetingBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 4 1 0;
`;

const GreetTitle = styled.div`
  font-size: 40px;
  font-weight: 800;
`;

const GreetSub = styled.div`
  font-size: 30px;
`;

const Divider = styled.div`
  width: 1px;
  height: 130px;
  background: rgba(255, 255, 255, 0.7);
`;

const DateTimeCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  gap: 5px;
`;

const LoggedOutWrap = styled.div`
  margin: 50px 70px 0 70px;
  height: 200px;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: ${colors.app_white};
  position: relative;
`;

const DateText = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
`;

const TimeText = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: ${colors.app_white};
`;

const SecretCloseButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;

  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: default;
  opacity: 0;
  background-color: red;
  z-index: 1000;
`;
