import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/login"));
const Boards = lazy(() => import("./pages/boards"));
const Board = lazy(() => import("./pages/board"));
const Profile = lazy(() => import("./pages/profile"));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("user");
  return user ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    const newTheme = dark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDark(!dark);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark ? "#1a1a2e" : "#ffffff",
        color: dark ? "#ffffff" : "#000000",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/boards"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Доски
          </a>
          <a
            href="/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Профиль
          </a>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          {dark ? "☀️ Светлая" : "🌙 Тёмная"}
        </button>
      </div>
      <BrowserRouter>
        <Suspense
          fallback={
            <div style={{ padding: "40px", textAlign: "center" }}>
              Загрузка...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/boards"
              element={
                <PrivateRoute>
                  <Boards />
                </PrivateRoute>
              }
            />
            <Route
              path="/board/:id"
              element={
                <PrivateRoute>
                  <Board />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
