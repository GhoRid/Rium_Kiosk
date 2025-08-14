import { HashRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainLayout from "./components/MainLayout";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import SelectPassPage from "./pages/SelectPassPage/SelectPassPage";
import SinglePassPage from "./pages/SinglePassPage/SinglePassPage";
import PeriodPassPage from "./pages/PeriodPassPage/PeriodPassPage";
import TimePassPage from "./pages/TimePassPage/TimePassPage";
import SelectSeatPage from "./pages/SelectSeatPage/SelectSeatPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import CheckExtendPassPage from "./pages/CheckExtendPassPage/CheckExtendPassPage";
import ChangeSeatPage from "./pages/ChangeSeatPage/ChangeSeatPage";
import CompletePaymentPage from "./pages/CompletePaymentPage/CompletePaymentPage";
import KioskLoginPage from "./pages/KioskLoginPage/KioskLoginPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* <Route path="/" element={<KioskLoginPage />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/select-pass" element={<SelectPassPage />} />
          <Route path="/singlepass" element={<SinglePassPage />} />
          <Route path="/periodpass" element={<PeriodPassPage />} />
          <Route path="/timepass" element={<TimePassPage />} />
          <Route path="/select-seat" element={<SelectSeatPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/checkextendpass" element={<CheckExtendPassPage />} />
          <Route path="/changeseat" element={<ChangeSeatPage />} />
          <Route path="/completepayment" element={<CompletePaymentPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
