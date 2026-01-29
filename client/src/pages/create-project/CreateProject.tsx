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
import { toaster } from "@/components/ui/toaster";

// KONFIGURACJA UI
// Predefiniowana paleta kolorów używana do wizualnej identyfikacji projektów
// na listach oraz w elementach nawigacyjnych (np. kropki w sidebarze).
const COLORS = [
  "blue.400",
  "purple.400",
  "green.400",
  "orange.400",
  "pink.400",
  "red.400",
];

// WIDOK KREATORA PROJEKTU
// Prosty formularz służący do inicjalizacji nowego projektu.
// Skupia się na minimalizmie – wymaga jedynie nazwy i wyboru koloru.
export function CreateProject() {
  const navigate = useNavigate();

  // 1. DOSTĘP DO LOGIKI BIZNESOWEJ
  // Pobieramy funkcję 'addProject' z globalnego kontekstu aplikacji.
  const { addProject } = useProjects();

  // 2. LOKALNY STAN FORMULARZA
  // 'name': Przechowuje wpisywaną nazwę projektu.
  // 'selectedColor': Przechowuje wybrany identyfikator wizualny (domyślnie pierwszy z listy).
  // 'isSubmitting': Blokuje interfejs podczas komunikacji z API/bazą danych.
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. OBSŁUGA ZAPISU (SUBMIT)
  // Asynchroniczna funkcja tworząca zasób i obsługująca przekierowanie po sukcesie.
  const handleSave = async () => {
    // Walidacja podstawowa: nie pozwalamy na puste nazwy
    if (!name) return;

    setIsSubmitting(true);
    // Czyścimy stare powiadomienia przed nową akcją, aby uniknąć bałaganu na ekranie
    toaster.dismiss();

    try {
      // Wywołanie akcji tworzenia w kontekście (symulacja zapytania do API)
      const newProjectId = await addProject(name, selectedColor);

      if (newProjectId) {
        // SUKCES: Wyświetlamy powiadomienie toast
        toaster.create({
          title: "Project created",
          description: `Successfully created ${name}`,
          type: "success",
        });

        // PRZEKIEROWANIE: Od razu przenosimy użytkownika do widoku szczegółów nowego projektu
        navigate(`/project/${newProjectId}`);
      } else {
        // Fallback: Jeśli backend nie zwrócił ID, ale nie rzucił błędu, wracamy do listy
        navigate("/home");
      }
    } catch (error) {
      // BŁĄD: Wyświetlamy informację o niepowodzeniu
      toaster.create({
        title: "Failed to create project",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
      console.error("Failed to create project:", error);
    } finally {
      // Zawsze odblokowujemy formularz na końcu procesu (niezależnie od wyniku)
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
        {/* SEKCJA 1: NAZWA PROJEKTU */}
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
            // UX Improvement: Obsługa klawisza Enter do szybkiego zatwierdzania
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </Stack>

        {/* SEKCJA 2: WYBÓR KOLORU (COLOR PICKER) */}
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
                // Wizualne wyróżnienie aktywnego wyboru (obramowanie + ikona)
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

        {/* PRZYCISK ZATWIERDZENIA */}
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
          _hover={{ opacity: 0.8 }}
        >
          Create project
        </Button>
      </Stack>
    </Box>
  );
}
