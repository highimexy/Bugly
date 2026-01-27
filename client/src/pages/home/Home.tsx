import { Stack, Text, Button, SimpleGrid, Circle, Box } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import noProjectsImg from "/empty-state/no-projects.webp";
import projectsBgImg from "/home-with-projects/final-bug-for-website.webp";

export function Home() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  // WIDOK: BRAK PROJEKTÓW (Bez zmian)
  if (projects.length === 0) {
    return (
      <Stack
        gap="4"
        flex="1"
        justify="center"
        align="center"
        textAlign="center"
        borderRadius="2xl"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgImage: `url(${noProjectsImg})`,
          bgSize: "cover",
          filter: "grayscale(100%)",
          opacity: "0.2",
          zIndex: 0,
        }}
      >
        <Text textStyle="4xl" color="gray.400" zIndex={1}>
          NO PROJECTS?
        </Text>
        <Button
          zIndex={1}
          onClick={() => navigate("/create-project")}
          bg="black"
          color="white"
          _hover={{ bg: "gray.800" }}
          _dark={{ bg: "white", color: "black", _hover: { bg: "gray.200" } }}
          h="12"
          fontWeight="medium"
          borderRadius="xl"
        >
          Create First Project <LuPlus style={{ marginLeft: "8px" }} />
        </Button>
      </Stack>
    );
  }

  // WIDOK: LISTA PROJEKTÓW
  return (
    <Box
      position="relative"
      flex="1"
      p="1"
      // --- KLUCZOWE ZMIANY DLA SCROLLOWANIA ---
      overflowY="auto"
      maxH="calc(100vh - 260px)" // Dostosuj 120px do wysokości Twojego Header/Paddingu
      pr="2" // Padding z prawej, żeby scrollbar nie nachodził na karty
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--chakra-colors-gray-300)",
          borderRadius: "full",
        },
        _dark: {
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-gray-700)",
          },
        },
      }}
      // ---------------------------------------
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage: `url(${projectsBgImg})`,
        bgSize: "cover",
        bgAttachment: "fixed", // Tło zostaje w miejscu podczas scrollowania
        filter: "grayscale(100%)",
        opacity: "0.15",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 5 }}
        gap="6"
        position="relative"
        zIndex={1}
        pb="10" // Dodatkowy padding na dole, żeby ostatni rząd nie dotykał krawędzi
      >
        {projects.map((project) => (
          <Box
            key={project.id}
            as="button"
            onClick={() => navigate(`/project/${project.id}`)}
            p="5"
            bg={{ _light: "white", _dark: "gray.900" }}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.100"
            _dark={{ borderColor: "gray.700" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            _hover={{
              bg: "gray.50",
              _dark: { bg: "gray.800" },
              transform: "translateY(-4px)", // Nieco mocniejszy efekt
              boxShadow: "md",
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            gap="3"
            boxShadow="sm"
          >
            <Circle size="16" bg={project.color} color="white">
              <Text fontSize="2xl" fontWeight="bold">
                {project.name.charAt(0).toUpperCase()}
              </Text>
            </Circle>
            <Text fontWeight="semibold" truncate maxW="full">
              {project.name}
            </Text>
          </Box>
        ))}

        {/* Przycisk dodawania kolejnego projektu */}
        <Box
          as="button"
          onClick={() => navigate("/create-project")}
          border="2px dashed"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600" }}
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          minH="150px"
          _hover={{
            bg: "white",
            borderColor: "blue.500",
            _dark: { bg: "gray.800", borderColor: "blue.400" },
          }}
          transition="all 0.2s ease-in-out"
        >
          <LuPlus size="32px" color="gray" />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
