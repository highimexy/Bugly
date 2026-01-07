import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth/Auth";
import { Home } from "./pages/Home";

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
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
