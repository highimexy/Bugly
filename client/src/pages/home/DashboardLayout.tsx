import {
  Box,
  Flex,
  Stack,
  Text,
  Link,
  Circle,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import { LuSettings, LuPlus, LuFolder, LuLogOut } from "react-icons/lu";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamiczne nagłówki zależne od ścieżki
  const getPageHeader = () => {
    switch (location.pathname) {
      case "/create-project":
        return { title: "New Project", subtitle: "Set up your workspace" };
      case "/home":
      default:
        return { title: "Projects", subtitle: "Create and manage projects" };
    }
  };

  const { title, subtitle } = getPageHeader();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <Flex minH="100vh" bg="mainBg">
      {/* SIDE PANEL */}
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
        <Flex justify="center" mb="6">
          <Text
            fontFamily={"archivo black"}
            fontSize="6xl"
            letterSpacing="tight"
          >
            Bugly
          </Text>
        </Flex>

        <Stack gap="1" mb="8">
          <NavItem
            icon={<LuFolder />}
            label="Projects"
            active={location.pathname === "/home"}
            onClick={() => navigate("/home")}
          />
          <NavItem icon={<LuSettings />} label="Settings" />
        </Stack>

        <Box mb="6">
          <Flex align="center" justify="space-between" mb="3" px="3">
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
            >
              Active Projects
            </Text>
            <LuPlus
              size="14px"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/create-project")}
            />
          </Flex>
          <Stack gap="1">
            <ProjectLink label="E-commerce App" color="blue.400" />
            <ProjectLink label="Marketing Site" color="purple.400" />
          </Stack>
        </Box>

        <Spacer />

        <Stack
          gap="4"
          pt="6"
          borderTopWidth="1px"
          borderColor={{ _light: "gray.50", _dark: "gray.800" }}
        >
          <Flex align="center" gap="3" px="3">
            <Circle size="8" bg="gray.100" _dark={{ bg: "gray.700" }}>
              <Text fontSize="xs" fontWeight="bold">
                U
              </Text>
            </Circle>
            <Box overflow="hidden">
              <Text fontSize="sm" fontWeight="medium">
                User
              </Text>
              <Text fontSize="xs" color="gray.500">
                User@email.com
              </Text>
            </Box>
          </Flex>
          <NavItem
            icon={<LuLogOut />}
            label="Log out"
            color="red.500"
            onClick={handleLogout}
          />
        </Stack>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box flex="1" p="10" display="flex" flexDirection="column" h="100vh">
        <Stack gap="6" flex="1">
          {/* Tytuł i opis ZAWSZE nad boxem */}
          <Box>
            <Heading size="3xl" fontWeight="semibold">
              {title}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {subtitle}
            </Text>
          </Box>

          {/* STAŁY BOX (Dashed) */}
          <Box
            flex="1"
            borderRadius="2xl"
            border="2px dashed"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
            display="flex"
            flexDirection="column"
            p="10"
          >
            <Outlet /> {/* Tutaj wpada Home lub CreateProject */}
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}

// Komponenty pomocnicze
function NavItem({ icon, label, active, color, onClick }: any) {
  return (
    <Link
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="2"
      borderRadius="xl"
      cursor="pointer"
      onClick={onClick}
      bg={active ? { _light: "gray.100", _dark: "gray.800" } : "transparent"}
      color={
        color || {
          _light: active ? "black" : "gray.600",
          _dark: active ? "white" : "gray.400",
        }
      }
      fontWeight={active ? "semibold" : "medium"}
      _hover={{
        bg: { _light: "gray.50", _dark: "gray.800" },
        textDecoration: "none",
      }}
    >
      {icon}
      <Text fontSize="sm">{label}</Text>
    </Link>
  );
}

function ProjectLink({ label, color }: any) {
  return (
    <Link
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="1.5"
      borderRadius="lg"
      fontSize="sm"
      color="gray.500"
      _hover={{
        color: "black",
        bg: "gray.50",
        _dark: { color: "white", bg: "gray.800" },
        textDecoration: "none",
      }}
    >
      <Box borderRadius="full" bg={color} w="8px" h="8px" />
      <Text>{label}</Text>
    </Link>
  );
}
