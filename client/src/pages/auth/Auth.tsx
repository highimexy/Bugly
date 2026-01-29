import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";

// KOMPONENT LOGOWANIA (AUTHENTICATION)
// Główny punkt wejścia do chronionej części aplikacji.
// Odpowiada za weryfikację tożsamości użytkownika i inicjalizację sesji.
export function Auth() {
  // 1. LOKALNY STAN FORMULARZA
  // Przechowuje dane uwierzytelniające wpisywane przez użytkownika.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 2. OBSŁUGA KOMUNIKACJI Z API (TANSTACK QUERY)
  // Wykorzystanie hooka useMutation do obsługi asynchronicznego zapytania POST.
  // Automatycznie zarządza stanami: isPending (ładowanie), isError, isSuccess.
  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:8081/api/login", {
        email,
        password,
      });
      return response.data;
    },
    // SCENARIUSZ POZYTYWNY (SUCCESS FLOW)
    onSuccess: (data) => {
      // UX: Czyścimy poprzednie komunikaty, aby nie zasłaniały widoku
      toaster.dismiss();

      // SECURITY: Zapisujemy token JWT (JSON Web Token) w localStorage.
      // Pozwoli to na autoryzację kolejnych zapytań do API w ramach sesji.
      localStorage.setItem("token", data.token);

      toaster.create({
        title: "Zalogowano pomyślnie",
        type: "success",
      });

      // Przekierowanie do głównego dashboardu aplikacji
      navigate("/home");
    },
    // SCENARIUSZ NEGATYWNY (ERROR FLOW)
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

  // HELPER: OBSŁUGA WYSYŁKI FORMULARZA
  // Zapobiega wielokrotnemu wysłaniu żądania, gdy poprzednie jest w toku.
  const handleLogin = () => {
    if (!loginMutation.isPending) {
      loginMutation.mutate();
    }
  };

  return (
    // 3. WARSTWA PREZENTACJI (UI)
    // Centrowany layout z brandingiem aplikacji i responsywnym formularzem.
    <Box minH="100vh" bg="mainBg" display="flex" flexDirection="column">
      <Center flex="1" p={4}>
        <Stack gap="8" width="full" maxW="400px">
          {/* SEKCJA BRANDINGU */}
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
                  // UX Improvement: Pozwala na zatwierdzenie enterem
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
                // Walidacja: Przycisk nieaktywny, jeśli pola są puste
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
