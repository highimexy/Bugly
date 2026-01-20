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
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  return (
    // Ustawiamy Flex na pełną wysokość i szerokość rodzica (ramki)
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      flex="1" // Wypełnia całą dostępną przestrzeń w ramce
      w="full"
    >
      <Stack gap="8" w="full" maxW="400px">
        {" "}
        {/* maxW ogranicza szerokość samego formularza */}
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
          disabled={!name}
          bg="black"
          color="white"
          _dark={{ bg: "white", color: "black" }}
          size="lg"
          h="12"
          borderRadius="xl"
          onClick={() => {
            console.log("Saving project:", { name, color: selectedColor });
            navigate("/home");
          }}
        >
          Save Project
        </Button>
      </Stack>
    </Box>
  );
}
