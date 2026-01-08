import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Link,
  Circle,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import { LuSettings, LuPlus, LuFolder, LuLogOut } from "react-icons/lu";

export function Home() {
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
        {/* Logo / App Name */}
        <Flex justify="center" mb="6">
          <Text
            fontFamily={"archivo black"}
            fontSize="6xl"
            letterSpacing="tight"
          >
            Bugly
          </Text>
        </Flex>

        {/* Main Navigation */}
        <Stack gap="1" mb="8">
          <NavItem icon={<LuFolder />} label="Projects" active />
          <NavItem icon={<LuSettings />} label="Settings" />
        </Stack>

        {/* Projects Section */}
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
            <LuPlus size="14px" style={{ cursor: "pointer" }} />
          </Flex>
          <Stack gap="1">
            <ProjectLink label="E-commerce App" color="blue.400" />
            <ProjectLink label="Marketing Site" color="purple.400" />
            <ProjectLink label="Mobile App" color="green.400" />
          </Stack>
        </Box>

        <Spacer />

        {/* User Info & Logout */}
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
          <NavItem icon={<LuLogOut />} label="Log out" color="red.500" />
        </Stack>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box flex="1" p="10" display="flex" flexDirection="column" h="100vh">
        <Stack gap="6" flex="1">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="3xl" fontWeight="semibold">
                Projects
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Create and menage projects
              </Text>
            </Box>
          </Flex>
          <Box
            flex="1"
            borderRadius="2xl"
            border="2px dashed"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Stack align="center" gap="4">
              <Text color="gray.400">Here will be your projects</Text>
              <Button
                bg="black"
                color="white"
                _dark={{ bg: "white", color: "black" }}
                borderRadius="xl"
              >
                Create Report
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}

function NavItem({
  icon,
  label,
  active,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  color?: string;
}) {
  return (
    <Link
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="2"
      borderRadius="xl"
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

function ProjectLink({ label, color }: { label: string; color: string }) {
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
