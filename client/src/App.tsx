import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom"; // <--- 1. Dodaj import Outlet
import { Auth } from "./pages/auth/Auth";
import { Home } from "./pages/home/Home";
import { CreateProject } from "./pages/create-project/CreateProject";
import { DashboardLayout } from "./pages/home/DashboardLayout";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { Box } from "@chakra-ui/react";
import { ToggleColorMode } from "./components/ui/ToggleColorMode";
import { ProjectProvider } from "./context/ProjectContext";
import { ProjectDetails } from "./pages/project-details/ProjectDetails";
import { Toaster } from "@/components/ui/toaster";
import { ProjectShareView } from "./pages/project-share-view/ProjectShareView";

// 2. KOMPONENT POMOCNICZY
// Ten "Layout" służy tylko do tego, żeby dostarczyć Context API.
// Użyjemy go, żeby otoczyć nim TYLKO Admina i Auth, ale NIE ShareView.
const AppDataLayer = () => {
  return (
    <ProjectProvider>
      <Outlet />
    </ProjectProvider>
  );
};

function App() {
  return (
    // 3. ProjectProvider ZNIKNĄŁ STĄD (był na samej górze)
    <BrowserRouter>
      {/* Globalne elementy UI */}
      <Toaster />
      <Box position="fixed" top="4" right="4" zIndex="1000">
        <ToggleColorMode />
      </Box>

      <Routes>
        {/* ================================================================ */}
        {/* A. WIDOKI IZOLOWANE (BEZ DOSTĘPU DO PROJECT CONTEXT)             */}
        {/* ================================================================ */}
        {/* Tutaj ProjectProvider fizycznie nie istnieje. 
            Nie ma szans, żeby pobrał jakiekolwiek dane wszystkich projektów. */}

        <Route path="/share/:id" element={<ProjectShareView />} />

        {/* ================================================================ */}
        {/* B. STREFA APLIKACJI (Z DOSTĘPEM DO PROJECT CONTEXT)              */}
        {/* ================================================================ */}
        {/* Wszystko wewnątrz tej trasy jest otoczone przez ProjectProvider. 
            Auth tego potrzebuje (do refreshData), Dashboard też. */}

        <Route element={<AppDataLayer />}>
          {/* Publiczne (ale z kontekstem) */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Chronione (Admin) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
