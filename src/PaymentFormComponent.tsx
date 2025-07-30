import React, { useState, useMemo } from "react";
import { createPaymentBuffer } from "./utils/paymentUtils";
import { usePayment } from "./hooks/usePayment";
import { formatDateToYYMMDD } from "./utils/formatDate";

const PAYMENT_TYPES = [
  { value: "credit", label: "신용승인" },
  { value: "credit_fallback", label: "신용승인(FALLBACK)" },
  { value: "credit_cancel", label: "신용취소" },
  // { value: "kakao_money", label: "카카오머니" },
  // { value: "kakao_approval", label: "카카오카드승인" },
  // { value: "kakao_card_cancel", label: "카카오카드취소" },
  // { value: "paypro", label: "PAYPRO간편결제승인" },
  // { value: "paypro_cancel", label: "PAYPRO간편결제취소" },
];

type PaymentType = "credit" | "credit_fallback" | "credit_cancel";

const PaymentFormComponent = () => {
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const newdate = formatDateToYYMMDD(new Date());
  const [form, setForm] = useState({
    money: "",
    tax: "",
    bongsa: "",
    halbu: "",
    catid: "",
    myunse: "",
    agreenum: "",
    agreedate: newdate,
    cashno: "",
  });

  const paymentMutation = usePayment();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const sendbuf = createPaymentBuffer(paymentType, form);
    paymentMutation.mutate(sendbuf); // React Query mutation 실행
  };

  // ✅ createPaymentBuffer 결과를 실시간으로 계산해서 표시
  const sendDataPreview = useMemo(() => {
    return createPaymentBuffer(paymentType, form);
  }, [paymentType, form]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>거래 테스트 Form</h2>

      {/* 거래 유형 선택 */}
      <fieldset style={{ marginBottom: "20px" }}>
        <legend>거래 유형 선택</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {PAYMENT_TYPES.map((type) => (
            <label
              key={type.value}
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="radio"
                name="paymentType"
                value={type.value}
                checked={paymentType === type.value}
                onChange={() => setPaymentType(type.value as PaymentType)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 요청 파라미터 입력 */}
      <fieldset>
        <legend>요청 파라미터</legend>
        <div
          style={{
            // display: "flex",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>승인번호</label>
            <input
              type="text"
              name="agreenum"
              value={form.agreenum}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>승인일자</label>
            <input
              type="text"
              name="agreedate"
              value={form.agreedate}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>CAT ID</label>
            <input
              type="text"
              name="catid"
              value={form.catid}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>할부 (개월)</label>
            <input
              type="number"
              name="halbu"
              value={form.halbu}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>현금식별번호(바코드)</label>
            <input
              type="text"
              name="cashno"
              value={form.cashno}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>총금액</label>
            <input
              type="number"
              name="money"
              value={form.money}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>부가세</label>
            <input
              type="number"
              name="tax"
              value={form.tax}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>봉사료</label>
            <input
              type="number"
              name="bongsa"
              value={form.bongsa}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ width: "80px" }}>면세금액</label>
            <input
              type="number"
              name="myunse"
              value={form.myunse}
              onChange={handleChange}
            />
          </div>
        </div>
      </fieldset>

      {/* 결제 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={paymentMutation.isPending}
        style={{
          marginTop: "20px",
          padding: "10px",
          width: "100%",
          background: paymentMutation.isPending ? "#ccc" : "#007bff",
          color: "#fff",
        }}
      >
        {paymentMutation.isPending ? "결제 요청 중..." : "결제 요청"}
      </button>

      {/* 응답 및 상태 표시 */}
      {paymentMutation.isPending && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          ⏳ 결제 요청 중입니다...
        </p>
      )}

      {paymentMutation.isSuccess && (
        <div style={{ marginTop: "20px" }}>
          <h3>단말기 응답</h3>
          <pre>{paymentMutation.data}</pre>
        </div>
      )}

      {/* ✅ 사진처럼 SendData 미리보기 */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ fontWeight: "bold" }}>SendData :</label>
        <input
          type="text"
          readOnly
          value={sendDataPreview}
          style={{
            width: "100%",
            marginTop: "5px",
            padding: "5px",
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
};

export default PaymentFormComponent;
