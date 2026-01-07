import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth/Auth";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
