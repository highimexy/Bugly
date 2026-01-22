import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth/Auth";
import { Home } from "./pages/home/Home";
import { CreateProject } from "./pages/create-project/CreateProject";
import { DashboardLayout } from "./pages/home/DashboardLayout";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { Box } from "@chakra-ui/react";
import { ToggleColorMode } from "./components/ui/ToggleColorMode";
import { ProjectProvider } from "./context/ProjectContext";
import { ProjectDetails } from "./pages/project-details/ProjectDetails";

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Box position="fixed" top="4" right="4" zIndex="1000">
          <ToggleColorMode />
        </Box>

        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
