import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/guest/HomePage";
import IncidentsPage from "./pages/guest/IncidentsPage";
import LoginPage from "./pages/guest/LoginPage";
import RegisterPage from "./pages/guest/RegisterPage";
import ReportIncidentPage from "./pages/guest/ReportIncidentPage";

import ModeratorDashboardPage from "./pages/moderator/ModeratorDashboardPage";
import ModeratorPendingPage from "./pages/moderator/ModeratorPendingPage";
import ModeratorMapPage from "./pages/moderator/ModeratorMapPage";
import ModeratorApprovedPage from "./pages/moderator/ModeratorApprovedPage";
import ModeratorProfilePage from "./pages/moderator/ModeratorProfilePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/report" element={<ReportIncidentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/moderator" element={<ModeratorDashboardPage />} />
        <Route path="/moderator/pending" element={<ModeratorPendingPage />} />
        <Route path="/moderator/approved" element={<ModeratorApprovedPage />} />
        <Route path="/moderator/profile" element={<ModeratorProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;