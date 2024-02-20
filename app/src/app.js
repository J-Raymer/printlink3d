import { Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import LargeButton from "./components/largeButton.js";
import "./app.css";
import Home from "./routes/home.js";
import Create from "./routes/create.js";
import Browse from "./routes/browse.js";
import Login from "./routes/login.js";

function Layout() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto">
      <nav className="p-4">
        <button
          className="bg-transparent rounded-lg px-4 py-2"
          onClick={() => navigate("/")}
        >
          <h2 className="text-xl font-bold">PrintLink3d</h2>
        </button>
        {/* TODO: remove temp button */}
        <Link className="self-end" to="/login">
          <LargeButton text="Login" />
        </Link>
        {/*  */}
      </nav>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="browse" element={<Browse />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
