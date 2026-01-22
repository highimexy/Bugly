import { createContext, useContext, useState, type ReactNode } from "react";

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
}

interface ProjectContextType {
  projects: Project[];
  bugs: Bug[]; // Nowa tablica błędów
  addProject: (name: string, color: string) => void;
  deleteProject: (id: string) => void;
  addBug: (projectId: string, title: string, priority: Bug["priority"]) => void; // Funkcja dodawania błędu
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]); // Stan dla błędów

  const addProject = (name: string, color: string) => {
    const newProject = { id: Date.now().toString(), name, color };
    setProjects((prev) => [...prev, newProject]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setBugs((prev) => prev.filter((b) => b.projectId !== id)); // Usuń też błędy tego projektu
  };

  const addBug = (
    projectId: string,
    title: string,
    priority: Bug["priority"],
  ) => {
    const newBug: Bug = {
      id: `BUG-${Math.floor(Math.random() * 1000)}`,
      projectId,
      title,
      priority,
      status: "Open",
      createdAt: new Date().toLocaleDateString(),
    };
    setBugs((prev) => [newBug, ...prev]);
  };

  return (
    <ProjectContext.Provider
      value={{ projects, bugs, addProject, deleteProject, addBug }}
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
