import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import InvestorForm from "./pages/investor/InvestorForm";
import ThankYou from "./pages/investor/ThankYou";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/invest"
          element={<InvestorForm />}
        />

        <Route
          path="/thank-you"
          element={<ThankYou />}
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;