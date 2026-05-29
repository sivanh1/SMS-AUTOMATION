import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "../pages/admin/DashboardPage";

import CustomersPage from "../pages/admin/CustomerPage";

import TemplatesPage from "../pages/admin/TemplatesPage";

import LogsPage from "../pages/admin/LogsPage";

import SmsSenderPage from "../pages/operator/SmsSenderPage";

import Users from "../pages/admin/UsersPage"

export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* ADMIN ROUTES */}

        <Route

          path="/admin"

          element={

            <ProtectedRoute>

              <MainLayout />

            </ProtectedRoute>

          }
        >

          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="customers"
            element={<CustomersPage />}
          />

          <Route
            path="templates"
            element={<TemplatesPage />}
          />

          <Route
            path="logs"
            element={<LogsPage />}
          />
          <Route
            path="addusers"
            element={<Users/>}
          />

        </Route>
        

        {/* OPERATOR ROUTES */}

        <Route

          path="/operator"

          element={

            <ProtectedRoute>

              <MainLayout />

            </ProtectedRoute>

          }
        >

          <Route
            index
            element={<SmsSenderPage />}
          />
          <Route
            path="customers"
            element={<CustomersPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}