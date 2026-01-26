import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:8081/api/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Czyścimy ewentualne toastery błędów przed wejściem
      toaster.dismiss();
      localStorage.setItem("token", data.token);

      toaster.create({
        title: "Zalogowano pomyślnie",
        type: "success",
      });
      navigate("/home");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Błąd połączenia z serwerem";

      // Kluczowe: usuwa poprzednie toastery, żeby nie "spamować" ekranu
      toaster.dismiss();

      toaster.create({
        title: "Błąd logowania",
        description: errorMessage,
        type: "error",
      });
    },
  });

  // Funkcja pomocnicza, by nie powtarzać logiki przycisku i Entera
  const handleLogin = () => {
    if (!loginMutation.isPending) {
      loginMutation.mutate();
    }
  };

  return (
    <Box minH="100vh" bg="mainBg" display="flex" flexDirection="column">
      <Center flex="1" p={4}>
        <Stack gap="8" width="full" maxW="400px">
          <Stack gap="2" textAlign="center">
            <Heading
              size="6xl"
              fontFamily={"archivo black"}
              letterSpacing="tight"
              color="blue.500"
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
                  disabled={loginMutation.isPending}
                />
              </Field>

              <Field label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  variant="subtle"
                  size="lg"
                  h="12"
                  disabled={loginMutation.isPending}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </Field>

              <Button
                onClick={handleLogin}
                loading={loginMutation.isPending}
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
                disabled={!email || !password}
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
