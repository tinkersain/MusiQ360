import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/Mainlayout";
import axios from "axios";
import Auth from "./pages/Auth/Auth";
import { AuthProvider } from "./context/AuthContext";
axios.defaults.baseURL = "http://localhost:8080";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Wrap the layout with the Navbar and Footer
    children: [{ path: "/", element: <Auth /> }],
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
