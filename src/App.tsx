import { HashRouter, Route, Routes } from "react-router";
import "./App.css";
import PaymentFormComponent from "./PaymentFormComponent";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
