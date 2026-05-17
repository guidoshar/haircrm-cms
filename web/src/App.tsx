import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import Membership from "./pages/Membership";
import Services from "./pages/Services";
import Stores from "./pages/Stores";
import About from "./pages/About";
import AdminLogin from "./admin/Login";
import AdminLayout from "./admin/Layout";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminSite from "./admin/pages/Site";
import AdminCategories from "./admin/pages/Categories";
import AdminServices from "./admin/pages/Services";
import AdminTiers from "./admin/pages/Tiers";
import AdminStores from "./admin/pages/Stores";
import AdminBanners from "./admin/pages/Banners";
import AdminMedia from "./admin/pages/Media";
import { hasToken } from "./lib/api";

function RequireAuth({ children }: { children: any }) {
  if (!hasToken()) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<Services />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="site" element={<AdminSite />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="tiers" element={<AdminTiers />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="media" element={<AdminMedia />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
