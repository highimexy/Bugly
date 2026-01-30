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
export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { projects } = useProjects();

  // 1. HISTORIA
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentProjects");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. LOGIKA AKTUALIZACJI HISTORII
  useEffect(() => {
    if (id) {
      setRecentIds((prev) => {
        const filtered = prev.filter((recentId) => recentId !== id);
        const updated = [id, ...filtered].slice(0, 10);
        localStorage.setItem("recentProjects", JSON.stringify(updated));
        return updated;
      });
    }
  }, [id]);

  // 3. TRANSFORMACJA DANYCH
  const recentProjects = recentIds
    .map((recentId) => projects.find((p) => p.id === recentId))
    .filter((p): p is any => p !== undefined);

  // NAGŁÓWEK
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
        {/* LOGO MARKI (Z EFEKTEM 3D I ANIMACJĄ) */}
        <Flex justify="center" mb="6">
          <style>
            {`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
            `}
          </style>

          <Box position="relative" display="inline-block">
            {/* PASEK PRZEKREŚLAJĄCY (Warstwa środkowa - zIndex 5) */}
            <Box
              position="absolute"
              top="50%"
              left="-5%"
              width="110%"
              height="6px" // Mniejsza grubość dla mniejszego logo
              borderRadius="full"
              pointerEvents="none"
              zIndex="5"
              boxShadow="0 0 10px rgba(0,0,0,0.2)"
              transform="translateY(-50%) rotate(-3deg)"
              opacity="0.9"
              style={{
                background: "linear-gradient(90deg, #3182ce, #e53e3e, #3182ce)",
                backgroundSize: "200% auto",
                animation: "gradientMove 3s linear infinite",
              }}
            />

            {/* TEKST (Rozbity na warstwy) */}
            <Text
              fontFamily={"archivo black"}
              fontSize="4xl"
              color="blue.500"
              position="relative"
            >
              {/* Warstwa spodnia (pod paskiem) */}
              <Box as="span" position="relative" zIndex="10">
                Bug
              </Box>

              {/* Warstwa wierzchnia (NAD PASKIEM) */}
              <Box as="span" position="relative" zIndex="1">
                l
              </Box>

              {/* Warstwa spodnia (pod paskiem) */}
              <Box as="span" position="relative" zIndex="10">
                y
              </Box>
            </Text>
          </Box>
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
              <Text px="3" fontSize="xs" color="gray.400" fontStyle="italic">
                No recent projects visited
              </Text>
            )}
          </Stack>
        </Box>

        <Spacer />
        {/* AKCJE STOPKI */}
        <NavItem
          icon={<LuLogOut />}
          label="Log out"
          color="red.500"
          onClick={() => {
            // Opcjonalnie: Tutaj możesz dodać czyszczenie tokena
            localStorage.removeItem("token");
            navigate("/auth");
          }}
        />
      </Box>

      {/* SEKCJA 2: GŁÓWNY OBSZAR ROBOCZY */}
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

          {/* KONTENER TREŚCI */}
          <Box
            flex="1"
            borderRadius="md"
            border="2px dashed"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
            display="flex"
            flexDirection="column"
            p="10"
            overflow="hidden"
          >
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}

// KOMPONENTY POMOCNICZE
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
