import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/home");
    },
    onError: (error: any) => {
      // Tutaj możesz dodać powiadomienie o błędzie (Toast)
      alert(error.response?.data?.error || "Błąd połączenia z serwerem");
    },
  });

  return (
    <Box minH="100vh" bg="mainBg" display="flex" flexDirection="column">
      <Center flex="1" p={4}>
        <Stack gap="8" width="full" maxW="400px">
          <Stack gap="2" textAlign="center">
            <Heading
              size="6xl"
              fontFamily={"archivo black"}
              letterSpacing="tight"
            >
              Bugly
            </Heading>
          </Stack>

          <Box
            bg={{ _light: "white", _dark: "gray.800" }}
            p={{ base: "6", md: "10" }}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={{ _light: "gray.200", _dark: "gray.700" }}
            boxShadow="sm"
          >
            <Stack gap="6">
              <Field label="Email">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  variant="subtle"
                  size="lg"
                  h="12"
                />
              </Field>

              <Field label="Hasło">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  variant="subtle"
                  size="lg"
                  h="12"
                />
              </Field>

              <Button
                onClick={() => loginMutation.mutate()}
                loading={loginMutation.isPending} // Chakra UI v3 obsłuży spinner
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                _dark={{
                  bg: "white",
                  color: "black",
                  _hover: { bg: "gray.200" },
                }}
                size="lg"
                h="12"
                fontWeight="medium"
                borderRadius="xl"
              >
                Kontynuuj
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Center>
    </Box>
  );
}
