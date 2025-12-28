import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Landing } from "../pages/Landing";
import { Dashboard } from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Outlet /></Layout>,
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
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

