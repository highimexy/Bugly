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

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { projects } = useProjects();

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
          <Text fontFamily={"archivo black"} fontSize="4xl" color="blue.500">
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
            {projects.map((project) => (
              <ProjectLink
                key={project.id}
                id={project.id}
                label={project.name}
                color={project.color}
                isActive={id === project.id}
              />
            ))}
          </Stack>
        </Box>

        <Spacer />
        <NavItem
          icon={<LuLogOut />}
          label="Log out"
          color="red.500"
          onClick={() => navigate("/auth")}
        />
      </Box>

      <Box flex="1" p="10" display="flex" flexDirection="column" h="100vh">
        <Stack gap="6" flex="1">
          <Box>
            <Heading size="3xl" fontWeight="semibold">
              {title}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {subtitle}
            </Text>
          </Box>
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
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}

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
      <Box borderRadius="full" bg={color} w="8px" h="8px" />
      <Text fontWeight={isActive ? "bold" : "normal"}>{label}</Text>
    </Link>
  );
}
