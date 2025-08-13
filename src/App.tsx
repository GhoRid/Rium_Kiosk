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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/select-pass" element={<SelectPassPage />} />
          <Route path="/singlepass" element={<SinglePassPage />} />
          <Route path="/periodpass" element={<PeriodPassPage />} />
          <Route path="/timepass" element={<TimePassPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
