import { Route, Routes } from "react-router-dom";
import Login from "../../pages/login";
import Layout from "../../shared/components/Layout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={<div>Dashboard</div>}
        />
        <Route
          path="/clients"
          element={<div>Clients</div>}
        />
        <Route
          path="/locations"
          element={<div>Locations</div>}
        />
        <Route
          path="/settings"
          element={<div>Settings</div>}
        />
      </Route>

      <Route
        path="*"
        element={<div>NotFound</div>}
      />
      <Route
        path="/login"
        element={<Login />}
      />
    </Routes>
  );
}
