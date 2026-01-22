import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, Circle, Stack } from "@chakra-ui/react";
import { useProjects } from "../../context/ProjectContext";
import { LuArrowLeft } from "react-icons/lu";

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();

  // Znajdź projekt o pasującym ID
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <Stack align="center" justify="center" h="full">
        <Text>Project not found</Text>
        <Button onClick={() => navigate("/home")}>Back to Home</Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Button variant="ghost" mb="6" onClick={() => navigate("/home")}>
        Back to Projects <LuArrowLeft />
      </Button>

      <Stack direction="row" align="center" gap="6">
        <Circle size="20" bg={project.color} color="white">
          <Text fontSize="3xl" fontWeight="bold">
            {project.name.charAt(0).toUpperCase()}
          </Text>
        </Circle>
        <Box>
          <Heading size="2xl">{project.name}</Heading>
          <Text color="gray.500">Project ID: {project.id}</Text>
        </Box>
      </Stack>
    </Box>
  );
}
