import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
// Import kontekstu do odświeżania danych
import { useProjects } from "../../context/ProjectContext";

export function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Pobieramy funkcję do odświeżania danych
  const { refreshData } = useProjects();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8081/api";
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      toaster.dismiss();
      localStorage.setItem("token", data.token);
      toaster.create({ title: "Zalogowano pomyślnie", type: "success" });

      // KLUCZOWE: Czekamy na pobranie projektów przed zmianą strony
      await refreshData();

      navigate("/home");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error || "Błąd połączenia z serwerem";
      toaster.dismiss();
      toaster.create({
        title: "Błąd logowania",
        description: errorMessage,
        type: "error",
      });
    },
  });

  const handleLogin = () => {
    if (!loginMutation.isPending) {
      loginMutation.mutate();
    }
  };

  return (
    <Box minH="100vh" bg="mainBg" display="flex" flexDirection="column">
      {/* 1. Definicja animacji - wstawiamy globalnie dla tego komponentu */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>

      <Center flex="1" p={4}>
        <Stack gap="8" width="full" maxW="400px">
          <Stack gap="2" textAlign="center">
            {/* KONTENER LOGO */}
            <Box position="relative" display="inline-block" alignSelf="center">
              {/* PASEK (Warstwa środkowa - zIndex 5) */}
              {/* Znajduje się NAD 'Bug' i 'y', ale POD 'l' */}
              <Box
                position="absolute"
                top="50%"
                left="-5%"
                width="110%"
                height="8px"
                borderRadius="full"
                pointerEvents="none"
                zIndex="5"
                boxShadow="0 0 10px rgba(0,0,0,0.2)"
                transform="translateY(-50%) rotate(-3deg)"
                opacity="0.9"
                // Używamy natywnego style={{}} dla pewności animacji
                style={{
                  background:
                    "linear-gradient(90deg, #3182ce, #e53e3e, #3182ce)", // Niebieski -> Czerwony -> Niebieski
                  backgroundSize: "200% auto",
                  animation: "gradientMove 1s linear infinite",
                }}
              />

              {/* TEKST (Rozbity na warstwy) */}
              <Heading
                size="6xl"
                fontFamily={"archivo black"}
                letterSpacing="tight"
                color="blue.500"
                position="relative"
                // Usuwamy ogólny zIndex, bo teraz zarządzają nim litery
              >
                {/* Warstwa spodnia (pod paskiem) */}
                <Box as="span" position="relative" zIndex="10">
                  Bug
                </Box>

                {/* Warstwa wierzchnia (NAD PASKIEM) */}
                <Box as="span" position="relative" zIndex="1">
                  l
                </Box>

                {/* Warstwa spodnia (pod paskiem) */}
                <Box as="span" position="relative" zIndex="10">
                  y
                </Box>
              </Heading>
            </Box>
          </Stack>

          {/* KONTENER FORMULARZA */}
          <Box
            bg={{ _light: "white", _dark: "gray.900" }}
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
                  bg={{ _light: "gray.100", _dark: "black" }}
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
                  bg={{ _light: "gray.100", _dark: "black" }}
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
