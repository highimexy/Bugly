import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// MODELE DANYCH
// Definicje kształtu danych używanych w całej aplikacji.
// Interface 'Bug' reprezentuje pojedyncze zgłoszenie błędu.
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

// Interface 'Project' reprezentuje kontener dla zgłoszeń (projekt).
interface Project {
  id: string;
  name: string;
  color: string;
  bugs?: Bug[];
}

// KONTRAKT KONTEKSTU
// Definiuje metody i dane dostępne dla komponentów konsumujących ten kontekst.
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// GLOBALNY DOSTAWCA STANU (PROVIDER)
// Zarządza stanem projektów i błędów, oraz komunikacją z REST API.
// Otacza całą aplikację w App.tsx.
export function ProjectProvider({ children }: { children: ReactNode }) {
  // STAN APLIKACJI
  // 'projects': Lista wszystkich projektów.
  // 'bugs': Płaska lista wszystkich błędów (pochodna od projects, dla łatwiejszego dostępu).
  // 'isLoading': Flaga sterująca wyświetlaniem spinnerów ładowania.
  const [projects, setProjects] = useState<Project[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SYNCHRONIZACJA DANYCH
  // Pobiera pełną strukturę danych z backendu i aktualizuje stan lokalny.
  // Spłaszcza strukturę (flatMap), aby błędy były łatwo dostępne globalnie.
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

  // INICJALIZACJA
  // Pobranie danych przy pierwszym renderowaniu aplikacji (Mount).
  useEffect(() => {
    fetchAllData();
  }, []);

  // TWORZENIE PROJEKTU
  // Generuje unikalne ID po stronie klienta (format PRJ-XXXX),
  // wysyła dane do API i odświeża stan globalny.
  const addProject = async (name: string, color: string) => {
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

  // USUWANIE PROJEKTU
  // Usuwa zasób z serwera i synchronizuje widok.
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

  // TWORZENIE ZGŁOSZENIA (BUG)
  // Implementuje logikę sekwencyjnego ID (BUG-1, BUG-2) w obrębie projektu.
  // Oblicza następny numer na podstawie aktualnego stanu, a następnie wysyła do API.
  const addBug = async (bugData: Omit<Bug, "id" | "createdAt">) => {
    // Krok 1: Filtrujemy błędy tylko dla danego projektu
    const projectBugs = bugs.filter((b) => b.projectId === bugData.projectId);

    // Krok 2: Znajdujemy najwyższy numer ID, aby nadać kolejny (auto-increment logic)
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

  // USUWANIE BŁĘDU
  // Usuwa konkretne zgłoszenie w kontekście projektu (nested resource).
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

// CUSTOM HOOK
// Ułatwia dostęp do kontekstu w komponentach, zabezpieczając przed użyciem poza Providerem.
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProjects must be used within ProjectProvider");
  return context;
};
