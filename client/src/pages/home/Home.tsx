import { Stack, Text, Button, SimpleGrid, Circle, Box } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
// Import obrazka
import noProjectsImg from "/empty-state/no-projects.webp";

export function Home() {
  const navigate = useNavigate();
  const { projects } = useProjects(); // Pobierz listę projektów

  if (projects.length === 0) {
    return (
      <Stack
        gap="4"
        flex="1"
        justify="center"
        align="center"
        textAlign="center"
        borderRadius="2xl"
        position="relative" // Konieczne dla pozycjonowania tła pod spodem
        overflow="hidden" // Aby tło nie wystawało poza zaokrąglone rogi
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgImage: `url(${noProjectsImg})`,
          bgSize: "cover",
          // EFEKTY:
          filter: "grayscale(100%)", // Robi zdjęcie czarno-białym
          opacity: "0.2", // Zmniejsza widoczność zdjęcia (np. do 20%)
          zIndex: 0, // Kładzie tło pod spód
        }}
      >
        <Text textStyle="4xl" color="gray.400">
          NO PROJECTS?
        </Text>
        <Button
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

  return (
    <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} gap="6">
      {projects.map((project) => (
        <Box
          key={project.id}
          p="5"
          bg={{ _light: "white", _dark: "gray.900" }}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.700" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="3"
        >
          <Circle size="16" bg={project.color} color="white">
            <Text fontSize="2xl" fontWeight="bold">
              {project.name.charAt(0).toUpperCase()}
            </Text>
          </Circle>
          <Text fontWeight="semibold">{project.name}</Text>
        </Box>
      ))}

      {/* Przycisk dodawania nowej karty na końcu listy */}
      <Box
        as="button"
        onClick={() => navigate("/create-project")}
        border="2px dashed"
        borderColor="gray.100"
        _dark={{ borderColor: "gray.700" }}
        borderRadius="2xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        _hover={{ bg: "gray.50", _dark: { bg: "gray.800" } }}
        transition="background-color 0.2s ease-in-out"
      >
        <LuPlus size="24px" color="gray" />
      </Box>
    </SimpleGrid>
  );
}
