import styled from "styled-components";
import { useEffect, useState } from "react";
import { colors } from "../../../colors";

const DateInfo = () => {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const date = `${month}/${day}`;

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
    <Container>
      <DateText>{dateTime.date}</DateText>
      <TimeText>{dateTime.time}</TimeText>
    </Container>
  );
};

export default DateInfo;

const Container = styled.div`
  margin: 60px 70px 0 70px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const BaseText = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
`;

const DateText = styled(BaseText)`
  font-weight: 700;
`;
const TimeText = styled(BaseText)`
  font-weight: 500;
`;
