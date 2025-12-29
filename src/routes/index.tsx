import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Landing } from "../pages/Landing";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";
import { Settings } from "../pages/Settings";
import { Events } from "../pages/Events";
import { CreateEvent } from "../pages/CreateEvent";
import { ChristmasPresents } from "../pages/ChristmasPresents";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "create-event",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "christmas-presents",
        element: <ChristmasPresents />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
