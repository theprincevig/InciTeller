import { Outlet, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layouts";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import Home from "../pages/dashboard/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";
import StoryDetail from "../pages/dashboard/StoryDetail.jsx";
import MyStories from "../pages/dashboard/MyStories.jsx";
import StoryForm from "../pages/dashboard/StoryForm.jsx";
import Profile from "../pages/dashboard/Profile.jsx";

// Defined outside AppRoutes so it isn't recreated on every render.
// Used once as the parent route, so the sidebar stays mounted across pages.
function PageShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        {/* Everyone */}
        <Route index element={<Home />} />
        <Route path="stories/:storyId" element={<StoryDetail />} />

        {/* Logged-out only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Logged-in only */}
        <Route element={<ProtectedRoute />}>
          <Route path="my-stories" element={<MyStories />} />
          <Route path="stories/new" element={<StoryForm />} />
          <Route path="stories/:storyId/edit" element={<StoryForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="*"
          element={
            <>
              <h1 className="font-display text-4xl font-bold">Page not found</h1>
              <p className="mt-3">That page doesn't exist.</p>
            </>
          }
        />
      </Route>
    </Routes>
  );
}