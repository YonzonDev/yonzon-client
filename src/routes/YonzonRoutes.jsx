import { Routes, Route } from "react-router-dom";

import Header from "../components/header/Header";
import PrivateRoute from "./PrivateRoute";
// import Auth from "../pages/auth/Auth";
import Dashboard from "../pages/dashboard/Dashboard";
import Invoice from "../pages/invoice/Invoice";
import Inventory from "../pages/inventory/Inventory";
import Settings from "../pages/settings/Settings";
import NotFound from "../pages/NotFound";

const YonzonRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Auth />} /> */}
      <Route element={<PrivateRoute />}>
        <Route element={<Header />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default YonzonRoutes;
