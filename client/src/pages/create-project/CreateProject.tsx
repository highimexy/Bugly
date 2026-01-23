import { useState } from "react";
import {
  Box,
  Button,
  Circle,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext.tsx";

const COLORS = [
  "blue.400",
  "purple.400",
  "green.400",
  "orange.400",
  "pink.400",
  "red.400",
];

export function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name) return;

    setIsSubmitting(true);
    try {
      // Czekamy na ID z backendu
      const newProjectId = await addProject(name, selectedColor);

      if (newProjectId) {
        // Przenosimy do nowo stworzonego projektu
        navigate(`/project/${newProjectId}`);
      } else {
        // Fallback do listy głównej
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flex="1"
      w="full"
    >
      <Stack gap="8" w="full" maxW="400px">
        <Stack gap="2">
          <Text fontWeight="medium" fontSize="sm">
            Project Name
          </Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Marketing Site"
            variant="subtle"
            size="lg"
            h="12"
            disabled={isSubmitting}
          />
        </Stack>
        <Stack gap="3">
          <Text fontWeight="medium" fontSize="sm">
            Identity Color
          </Text>
          <HStack gap="4" justify="center">
            {COLORS.map((color) => (
              <Circle
                key={color}
                size="10"
                bg={color}
                cursor="pointer"
                onClick={() => setSelectedColor(color)}
                border={selectedColor === color ? "3px solid" : "none"}
                borderColor={{ _light: "black", _dark: "white" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.1)" }}
              >
                {selectedColor === color && <LuCheck color="white" />}
              </Circle>
            ))}
          </HStack>
        </Stack>
        <Button
          loading={isSubmitting}
          disabled={!name || isSubmitting}
          bg="black"
          color="white"
          _dark={{ bg: "white", color: "black" }}
          size="lg"
          h="12"
          borderRadius="xl"
          onClick={handleSave}
        >
          Create project
        </Button>
      </Stack>
    </Box>
  );
}
