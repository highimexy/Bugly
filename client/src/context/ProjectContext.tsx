import { createContext, useContext, useState, type ReactNode } from "react";

interface Project {
  id: string;
  name: string;
  color: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (name: string, color: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (name: string, color: string) => {
    const newProject = { id: Date.now().toString(), name, color };
    setProjects((prev) => [...prev, newProject]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
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
