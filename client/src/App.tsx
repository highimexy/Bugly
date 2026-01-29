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
import { Toaster } from "@/components/ui/toaster";
import { ProjectShareView } from "./pages/project-share-view/ProjectShareView";

function App() {
  return (
    // 1. GLOBAL STATE MANAGEMENT
    // ProjectProvider otacza całą aplikację, udostępniając stan projektów i błędów
    // dla wszystkich komponentów podrzędnych.
    <ProjectProvider>
      <BrowserRouter>
        {/* 2. GLOBAL UI COMPONENTS */}
        {/* Komponenty widoczne niezależnie od aktywnej trasy (Powiadomienia + Przełącznik motywu) */}
        <Toaster />

        <Box position="fixed" top="4" right="4" zIndex="1000">
          <ToggleColorMode />
        </Box>

        {/* 3. ROUTING ARCHITECTURE */}
        <Routes>
          {/* A. PUBLIC ROUTES & REDIRECTS */}
          {/* Domyślne przekierowanie ścieżki głównej do panelu logowania */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<Auth />} />

          {/* B. PROTECTED ROUTES (ADMIN PANEL) */}
          {/* Strefa chroniona - dostępna tylko dla zweryfikowanych użytkowników.
              Używa 'DashboardLayout' do renderowania wspólnego paska bocznego i nagłówka. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
            </Route>
          </Route>

          {/* C. FALLBACK ROUTE */}
          {/* Przekierowanie wszelkich nieznanych ścieżek do strony głównej panelu */}
          <Route path="*" element={<Navigate to="/home" replace />} />

          {/* D. CLIENT FACING ROUTES */}
          {/* Publiczny widok 'tylko do odczytu' dla klientów zewnętrznych.
              Renderowany poza głównym layoutem administracyjnym (brak paska bocznego). */}
          <Route path="/share/:id" element={<ProjectShareView />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
