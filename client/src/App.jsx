import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./components/PublicLayout";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminSchemes from "./pages/admin/AdminSchemes";
import Analytics from "./pages/admin/Analytics";
import ManageUsers from "./pages/admin/ManageUsers";
import WorkerApprovals from "./pages/admin/WorkerApprovals";
import Certificates from "./pages/citizen/Certificates";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CreateComplaint from "./pages/citizen/CreateComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import Schemes from "./pages/citizen/Schemes";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import PublicNotices from "./pages/public/PublicNotices";
import Register from "./pages/public/Register";
import WorkerDirectory from "./pages/public/WorkerDirectory";
import WorkerRegister from "./pages/public/WorkerRegister";
import Chat from "./pages/shared/Chat";
import Profile from "./pages/shared/Profile";
import AssignedTasks from "./pages/worker/AssignedTasks";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerPending from "./pages/worker/WorkerPending";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="worker-register" element={<WorkerRegister />} />
        <Route path="notices" element={<PublicNotices />} />
        <Route path="workers" element={<WorkerDirectory />} />
      </Route>

      <Route path="worker/pending" element={<ProtectedRoute roles={["worker"]}><WorkerPending /></ProtectedRoute>} />

      <Route element={<ProtectedRoute roles={["citizen"]}><DashboardLayout /></ProtectedRoute>}>
        <Route path="citizen" element={<CitizenDashboard />} />
        <Route path="citizen/complaints/new" element={<CreateComplaint />} />
        <Route path="citizen/complaints" element={<MyComplaints />} />
        <Route path="citizen/schemes" element={<Schemes />} />
        <Route path="citizen/certificates" element={<Certificates />} />
        <Route path="citizen/chat" element={<Chat />} />
        <Route path="citizen/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute roles={["worker"]} requireWorkerApproval><DashboardLayout /></ProtectedRoute>}>
        <Route path="worker" element={<WorkerDashboard />} />
        <Route path="worker/tasks" element={<AssignedTasks />} />
        <Route path="worker/chat" element={<Chat />} />
        <Route path="worker/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/admins" element={<AdminAccounts />} />
        <Route path="admin/users" element={<ManageUsers />} />
        <Route path="admin/workers" element={<WorkerApprovals />} />
        <Route path="admin/complaints" element={<AdminComplaints />} />
        <Route path="admin/schemes" element={<AdminSchemes />} />
        <Route path="admin/certificates" element={<AdminCertificates />} />
        <Route path="admin/notices" element={<AdminNotices />} />
        <Route path="admin/chat" element={<Chat />} />
        <Route path="admin/analytics" element={<Analytics />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/citizen" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
