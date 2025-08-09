import styled from "styled-components";
import { useEffect, useState } from "react";

const HeaderDate = () => {
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
    <Header>
      <DateText>{dateTime.date}</DateText>
      <TimeText>{dateTime.time}</TimeText>
    </Header>
  );
};

export default HeaderDate;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
`;

const DateText = styled.span``;
const TimeText = styled.span``;
