import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../pages/login";
import Dashboard from "../../pages/dashboard";
import Clients from "../../pages/clients";
import ClientNew from "../../pages/ClientNew";
import ClientDetail from "../../pages/ClientDetail";
import ClientEdit from "../../pages/ClientEdit";
import Locations from "../../pages/locations";
import Layout from "../../shared/components/Layout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/clients"
            element={<Clients />}
          />
          <Route
            path="/clients/new"
            element={<ClientNew />}
          />
          <Route
            path="/clients/:id"
            element={<ClientDetail />}
          />
          <Route
            path="/clients/:id/edit"
            element={<ClientEdit />}
          />
          <Route
            path="/locations"
            element={<Locations />}
          />
        </Route>
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}
