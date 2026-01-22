import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  bugs?: Bug[]; // Backend zwraca błędy wewnątrz obiektu projektu (Preload)
}

interface ProjectContextType {
  projects: Project[];
  bugs: Bug[];
  addProject: (name: string, color: string) => Promise<string | undefined>;
  deleteProject: (id: string) => Promise<void>;
  addBug: (
    projectId: string,
    title: string,
    priority: Bug["priority"],
  ) => Promise<void>;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const API_URL = "http://localhost:8081/api"; // Twój nowy port w Go

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. POBIERANIE DANYCH Z BACKENDU
  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      const data: Project[] = await response.json();

      setProjects(data);

      // Wyciągamy błędy ze wszystkich projektów do jednej płaskiej tablicy dla wygody interfejsu
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

  // 2. DODAWANIE PROJEKTU
  const addProject = async (name: string, color: string) => {
    const newProject = {
      // ID zostanie nadane przez backend lub zostawiamy to co masz
      id: Date.now().toString(),
      name,
      color,
    };

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const savedProject = await response.json();
        await fetchAllData(); // Odświeżamy listę
        return savedProject.id; // Zwracamy ID otrzymane z backendu
      }
    } catch (error) {
      console.error("Błąd dodawania projektu:", error);
    }
  };

  // 3. USUWANIE PROJEKTU
  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setBugs((prev) => prev.filter((b) => b.projectId !== id));
      }
    } catch (error) {
      console.error("Błąd usuwania projektu:", error);
    }
  };

  // 4. DODAWANIE BŁĘDU
  const addBug = async (
    projectId: string,
    title: string,
    priority: Bug["priority"],
  ) => {
    const newBug = {
      id: `BUG-${Math.floor(Math.random() * 1000)}`,
      projectId,
      title,
      priority,
      status: "Open",
    };

    try {
      const response = await fetch(`${API_URL}/bugs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBug),
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Błąd dodawania błędu:", error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{ projects, bugs, addProject, deleteProject, addBug, isLoading }}
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
