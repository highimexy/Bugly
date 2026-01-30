import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// MODELE DANYCH
export interface Bug {
  id: string;
  projectId: string;
  title: string;
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
  priority: "Low" | "Medium" | "High";
  device: string;
  screenshotUrl?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  bugs?: Bug[];
}

// KONTRAKT KONTEKSTU
interface ProjectContextType {
  projects: Project[];
  bugs: Bug[];
  addProject: (name: string, color: string) => Promise<string | undefined>;
  deleteProject: (id: string) => Promise<void>;
  addBug: (bugData: Omit<Bug, "id" | "createdAt">) => Promise<void>;
  deleteBug: (bugId: string, projectId: string) => Promise<void>;
  isLoading: boolean;
  // 👇 1. DODANO: Definicja funkcji odświeżania w typach
  refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SYNCHRONIZACJA DANYCH
  const fetchAllData = async () => {
    const token = localStorage.getItem("token");

    // STRAŻNIK: Brak tokena = brak pobierania danych
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        return;
      }

      const data: Project[] = await response.json();
      setProjects(data);
      const allBugs = data.flatMap((p) => p.bugs || []);
      setBugs(allBugs);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // TWORZENIE PROJEKTU
  const addProject = async (name: string, color: string) => {
    const newProject = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      color,
    };

    try {
      // 👇 Pobieramy token do każdego zapytania
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👇 Dodano autoryzację
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const savedProject = await response.json();
        await fetchAllData();
        return savedProject.id;
      }
    } catch (error) {
      console.error("Błąd dodawania projektu:", error);
    }
  };

  // USUWANIE PROJEKTU
  const deleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 👇 Dodano autoryzację
        },
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Błąd usuwania projektu:", error);
    }
  };

  // TWORZENIE ZGŁOSZENIA (BUG)
  const addBug = async (bugData: Omit<Bug, "id" | "createdAt">) => {
    const projectBugs = bugs.filter((b) => b.projectId === bugData.projectId);

    const lastNumber = projectBugs.reduce((max, bug) => {
      const num = parseInt(bug.id.replace("BUG-", ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    const nextId = `BUG-${lastNumber + 1}`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👇 Dodano autoryzację
        },
        body: JSON.stringify({ ...bugData, id: nextId }),
      });

      if (response.ok) await fetchAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // USUWANIE BŁĘDU
  const deleteBug = async (bugId: string, projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/projects/${projectId}/bugs/${bugId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // 👇 Dodano autoryzację
          },
        },
      );

      if (response.ok) await fetchAllData();
    } catch (error) {
      console.error("Błąd usuwania błędu:", error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        bugs,
        addProject,
        deleteProject,
        addBug,
        deleteBug,
        isLoading,
        // 👇 2. DODANO: Udostępniamy funkcję reszcie aplikacji
        refreshData: fetchAllData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProjects must be used within ProjectProvider");
  return context;
};
