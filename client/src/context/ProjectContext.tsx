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
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
  priority: "Low" | "Medium" | "High";
  device: string;
  screenshotUrl?: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  bugs?: Bug[];
}

interface ProjectContextType {
  projects: Project[];
  bugs: Bug[];
  addProject: (name: string, color: string) => Promise<string | undefined>;
  deleteProject: (id: string) => Promise<void>;
  addBug: (bugData: Omit<Bug, "id" | "createdAt">) => Promise<void>;
  deleteBug: (bugId: string, projectId: string) => Promise<void>;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const API_URL = "http://localhost:8081/api";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
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
  const addProject = async (name: string, color: string) => {
    // Generujemy unikalne ID dla projektu
    const newProject = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      color,
    };

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject), // Wysyłamy kompletny obiekt z ID
      });

      if (response.ok) {
        const savedProject = await response.json();
        await fetchAllData();
        return savedProject.id; // Zwracamy ID, aby nawigacja mogła zadziałać
      }
    } catch (error) {
      console.error("Błąd dodawania projektu:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error("Błąd usuwania projektu:", error);
    }
  };

  const addBug = async (bugData: Omit<Bug, "id" | "createdAt">) => {
    // Teraz filtrujemy tylko błędy z tego projektu - to jest bezpieczne!
    const projectBugs = bugs.filter((b) => b.projectId === bugData.projectId);

    const lastNumber = projectBugs.reduce((max, bug) => {
      const num = parseInt(bug.id.replace("BUG-", ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    const nextId = `BUG-${lastNumber + 1}`;

    const response = await fetch(`${API_URL}/bugs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bugData, id: nextId }),
    });

    if (response.ok) await fetchAllData();
  };

  // DODANA FUNKCJA USUWANIA BŁĘDU
  const deleteBug = async (bugId: string, projectId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/bugs/${bugId}`,
        {
          method: "DELETE",
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
