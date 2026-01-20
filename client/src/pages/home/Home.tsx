import { Stack, Text, Button } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Stack gap="4" flex="1" justify="center" align="center" textAlign="center">
      <Text color="gray.400">Here will be your projects</Text>
      <Button
        bg="black"
        color="white"
        _dark={{ bg: "white", color: "black" }}
        borderRadius="xl"
        onClick={() => navigate("/create-project")}
      >
        Create Project <LuPlus />
      </Button>
    </Stack>
  );
}
