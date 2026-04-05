import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/guest/HomePage";
import IncidentsPage from "./pages/guest/IncidentsPage";
import LoginPage from "./pages/guest/LoginPage";
import RegisterPage from "./pages/guest/RegisterPage";
import ReportIncidentPage from "./pages/guest/ReportIncidentPage";

import ModeratorDashboardPage from "./pages/moderator/ModeratorDashboardPage";
import ModeratorPendingPage from "./pages/moderator/ModeratorPendingPage";
import ModeratorApprovedPage from "./pages/moderator/ModeratorApprovedPage";
import ModeratorProfilePage from "./pages/moderator/ModeratorProfilePage";

import UserHomePage from "./pages/user/UserHomePage";
import UserIncidentsPage from "./pages/user/UserIncidentsPage";
import UserReportIncidentPage from "./pages/user/UserReportIncidentPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import AdminProfilePage from "./pages/admin/AdminProfilePage";

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

        <Route path="/user" element={<UserHomePage />} />
        <Route path="/user/incidents" element={<UserIncidentsPage />} />
        <Route path="/user/report" element={<UserReportIncidentPage />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;