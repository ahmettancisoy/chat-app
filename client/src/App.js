import RequireAuth from "./features/auth/components/RequireAuth";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./features/auth/AuthLayout";
import NoPage from "./components/NoPage";
import Layout from "./components/Layout";
import PersistLogin from "./features/auth/components/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="login" element={<AuthLayout name="login" />} />
      <Route path="register" element={<AuthLayout name="register" />} />
      <Route path="*" element={<NoPage />} />
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
