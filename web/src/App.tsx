import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import { hasToken } from "./lib/api";

const Membership = lazy(() => import("./pages/Membership"));
const Services = lazy(() => import("./pages/Services"));
const Stores = lazy(() => import("./pages/Stores"));
const About = lazy(() => import("./pages/About"));

const AdminLogin = lazy(() => import("./admin/Login"));
const AdminLayout = lazy(() => import("./admin/Layout"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminSite = lazy(() => import("./admin/pages/Site"));
const AdminCategories = lazy(() => import("./admin/pages/Categories"));
const AdminServices = lazy(() => import("./admin/pages/Services"));
const AdminTiers = lazy(() => import("./admin/pages/Tiers"));
const AdminStores = lazy(() => import("./admin/pages/Stores"));
const AdminBanners = lazy(() => import("./admin/pages/Banners"));
const AdminMedia = lazy(() => import("./admin/pages/Media"));

function RequireAuth({ children }: { children: any }) {
  if (!hasToken()) return <Navigate to="/admin/login" replace />;
  return children;
}

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-32 text-[color:var(--color-ink-mute)] text-sm tracking-[0.18em]">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--color-sage-400)] animate-pulse mr-2" />
      LOADING
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
}
