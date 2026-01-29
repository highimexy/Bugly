import {
  Box,
  Flex,
  Stack,
  Text,
  Link,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import { LuSettings, LuPlus, LuFolder, LuLogOut } from "react-icons/lu";
import { useNavigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useState, useEffect } from "react";

// GŁÓWNY LAYOUT APLIKACJI (DASHBOARD)
// Odpowiada za strukturę szkieletową widoków administracyjnych.
// Zawiera stały pasek boczny (Sidebar) oraz dynamiczny obszar roboczy (Content Area) renderowany przez <Outlet />.
export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { projects } = useProjects();

  // 1. ZARZĄDZANIE HISTORIĄ PRZEGLĄDANIA (PERSISTENCE)
  // Inicjalizacja stanu na podstawie danych z localStorage, co zapewnia zachowanie
  // listy "Ostatnich projektów" nawet po odświeżeniu strony lub restarcie przeglądarki.
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentProjects");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. LOGIKA AKTUALIZACJI HISTORII (FIFO QUEUE)
  // Efekt uruchamiany przy zmianie ID w URL. Implementuje logikę kolejki:
  // - Usuwa duplikaty (jeśli projekt był już na liście).
  // - Dodaje bieżący projekt na początek listy.
  // - Ogranicza historię do 10 ostatnich elementów.
  useEffect(() => {
    if (id) {
      setRecentIds((prev) => {
        // Usuwamy obecne ID z listy (jeśli istnieje), aby dodać je na sam początek
        const filtered = prev.filter((recentId) => recentId !== id);
        // Dodajemy nowe ID na start i ucinamy do 10 pozycji
        const updated = [id, ...filtered].slice(0, 10);

        localStorage.setItem("recentProjects", JSON.stringify(updated));
        return updated;
      });
    }
  }, [id]);

  // 3. TRANSFORMACJA DANYCH I BEZPIECZEŃSTWO
  // Mapowanie zapisanych ID na pełne obiekty projektów z Context API.
  // Filtrowanie (p !== undefined) zabezpiecza przed błędami renderowania w przypadku,
  // gdy projekt z historii został w międzyczasie usunięty z bazy danych.
  const recentProjects = recentIds
    .map((recentId) => projects.find((p) => p.id === recentId))
    .filter((p): p is any => p !== undefined);

  // DYNAMICZNY NAGŁÓWEK STRONY
  // Funkcja pomocnicza ustalająca tytuł i opis w zależności od aktywnej ścieżki routingu.
  const getPageHeader = () => {
    if (location.pathname.startsWith("/project/")) {
      const currentProject = projects.find((p) => p.id === id);
      return {
        title: currentProject ? currentProject.name : "Project Details",
        subtitle: "Manage bugs and issues for this project",
      };
    }

    switch (location.pathname) {
      case "/create-project":
        return { title: "New Project", subtitle: "Set up your workspace" };
      case "/home":
      default:
        return { title: "Projects", subtitle: "Create and manage projects" };
    }
  };

  const { title, subtitle } = getPageHeader();

  return (
    <Flex minH="100vh" bg="mainBg">
      {/* SEKCJA 1: PASEK BOCZNY (SIDEBAR) */}
      {/* Element pozycjonowany jako 'sticky', zapewniający stały dostęp do nawigacji. */}
      <Box
        as="nav"
        width="280px"
        bg={{ _light: "white", _dark: "gray.900" }}
        borderRightWidth="1px"
        borderColor={{ _light: "gray.100", _dark: "gray.800" }}
        p="6"
        display="flex"
        flexDirection="column"
        position="sticky"
        top="0"
        h="100vh"
      >
        {/* LOGO MARKI */}
        <Flex justify="center" mb="6">
          <Text fontFamily={"archivo black"} fontSize="4xl" color="blue.500">
            Bugly
          </Text>
        </Flex>

        {/* GŁÓWNA NAWIGACJA */}
        <Stack gap="1" mb="8">
          <NavItem
            icon={<LuFolder />}
            label="Projects"
            active={location.pathname === "/home"}
            onClick={() => navigate("/home")}
          />
          <NavItem icon={<LuSettings />} label="Settings" />
        </Stack>

        {/* SEKCJA OSTATNICH PROJEKTÓW */}
        {/* Wyświetla listę dynamicznie generowaną na podstawie historii użytkownika */}
        <Box mb="6" overflow="hidden">
          <Flex align="center" justify="space-between" mb="3" px="3">
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
            >
              Recent Projects
            </Text>
            <LuPlus
              size="14px"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/create-project")}
            />
          </Flex>

          <Stack gap="1">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <ProjectLink
                  key={project.id}
                  id={project.id}
                  label={project.name}
                  color={project.color}
                  isActive={id === project.id}
                />
              ))
            ) : (
              // Stan pusty dla historii
              <Text px="3" fontSize="xs" color="gray.400" fontStyle="italic">
                No recent projects visited
              </Text>
            )}
          </Stack>
        </Box>

        <Spacer />
        {/* AKCJE STOPKI (WYLOGOWANIE) */}
        <NavItem
          icon={<LuLogOut />}
          label="Log out"
          color="red.500"
          onClick={() => navigate("/auth")}
        />
      </Box>

      {/* SEKCJA 2: GŁÓWNY OBSZAR ROBOCZY (CONTENT AREA) */}
      <Box flex="1" p="10" display="flex" flexDirection="column" h="100vh">
        <Stack gap="6" flex="1">
          {/* NAGŁÓWEK WIDOKU */}
          <Box>
            <Heading size="3xl" fontWeight="semibold">
              {title}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {subtitle}
            </Text>
          </Box>

          {/* KONTENER TREŚCI (OUTLET) */}
          {/* Renderuje odpowiedni komponent podstrony (Home, ProjectDetails itp.) */}
          <Box
            flex="1"
            borderRadius="md"
            border="2px dashed"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
            display="flex"
            flexDirection="column"
            p="10"
            overflow="hidden" // Kluczowe dla niezależnego scrollowania wewnątrz widoków (np. Home Grid)
          >
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}

// KOMPONENT POMOCNICZY: ELEMENT NAWIGACJI
// Obsługuje stany aktywne i hover dla linków w pasku bocznym.
function NavItem({ icon, label, active, color, onClick }: any) {
  return (
    <Link
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="2"
      borderRadius="md"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s ease-in-out"
      bg={active ? { _light: "gray.100", _dark: "gray.800" } : "transparent"}
      color={
        color || {
          _light: active ? "black" : "gray.600",
          _dark: active ? "white" : "gray.400",
        }
      }
      _hover={{
        bg: { _light: "gray.50", _dark: "gray.800" },
        textDecoration: "none",
      }}
    >
      {icon}
      <Text fontSize="sm" fontWeight={active ? "semibold" : "medium"}>
        {label}
      </Text>
    </Link>
  );
}

// KOMPONENT POMOCNICZY: LINK PROJEKTU
// Dedykowany komponent dla listy projektów, zawierający wskaźnik koloru (kropka).
function ProjectLink({ label, color, id, isActive }: any) {
  const navigate = useNavigate();

  return (
    <Link
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="1.5"
      borderRadius="md"
      fontSize="sm"
      cursor="pointer"
      onClick={() => navigate(`/project/${id}`)}
      bg={isActive ? { _light: "gray.50", _dark: "gray.800" } : "transparent"}
      color={isActive ? { _light: "black", _dark: "white" } : "gray.500"}
      transition="all 0.2s ease-in-out"
      _hover={{
        color: "black",
        bg: "gray.50",
        _dark: { color: "white", bg: "gray.800" },
        textDecoration: "none",
      }}
    >
      <Box borderRadius="full" bg={color} w="8px" h="8px" flexShrink={0} />
      <Text fontWeight={isActive ? "bold" : "normal"} truncate>
        {label}
      </Text>
    </Link>
  );
}
