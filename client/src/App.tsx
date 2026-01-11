import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth/Auth";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ui/ProtectedRoute"; // Import strażnika
import { Box } from "@chakra-ui/react";
import { ToggleColorMode } from "./components/ui/ToggleColorMode";

function App() {
  return (
    <BrowserRouter>
      <Box position="fixed" top="4" right="4" zIndex="1000">
        <ToggleColorMode />
      </Box>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
