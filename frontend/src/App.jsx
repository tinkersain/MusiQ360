import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/Authlayout";
import axios from "axios";
import Auth from "./pages/Auth/Auth";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layout/Mainlayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Likes from "./pages/Likes/Likes";
import Playlist from "./pages/Playlist/Playlist";
axios.defaults.baseURL = "http://localhost:8080";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ path: "/", element: <Dashboard /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [{ path: "/likes", element: <Likes /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [{ path: "/playlist", element: <Playlist /> }],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "/auth", element: <Auth /> }],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
