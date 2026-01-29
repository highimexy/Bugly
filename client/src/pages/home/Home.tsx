import { Stack, Text, Button, SimpleGrid, Circle, Box } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import noProjectsImg from "/empty-state/no-projects.webp";
import projectsBgImg from "/home-with-projects/final-bug-for-website.webp";

// KOMPONENT STRONY GŁÓWNEJ (DASHBOARD)
// Główny punkt wejścia dla użytkownika po zalogowaniu.
// Wyświetla siatkę dostępnych projektów lub ekran powitalny, jeśli brak danych.
export function Home() {
  const navigate = useNavigate();

  // 1. DOSTĘP DO DANYCH
  // Pobieramy listę projektów z globalnego kontekstu.
  const { projects } = useProjects();

  // 2. WIDOK POWITALNY (EMPTY STATE)
  // Wyświetlany warunkowo, gdy użytkownik nie posiada jeszcze żadnych projektów.
  // Zawiera grafikę tła oraz przycisk Call-to-Action (CTA) zachęcający do utworzenia pierwszego zasobu.
  if (projects.length === 0) {
    return (
      <Stack
        gap="4"
        flex="1"
        justify="center"
        align="center"
        textAlign="center"
        borderRadius="2xl"
        position="relative"
        overflow="hidden"
        // Warstwa tła z grafiką (zmniejszona przezroczystość dla lepszej czytelności tekstu)
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgImage: `url(${noProjectsImg})`,
          bgSize: "cover",
          filter: "grayscale(100%)",
          opacity: "0.2",
          zIndex: 0,
        }}
      >
        <Text textStyle="4xl" color="gray.400" zIndex={1}>
          NO PROJECTS?
        </Text>
        <Button
          zIndex={1}
          onClick={() => navigate("/create-project")}
          bg="black"
          color="white"
          _hover={{ bg: "gray.800" }}
          _dark={{ bg: "white", color: "black", _hover: { bg: "gray.200" } }}
          h="12"
          fontWeight="medium"
          borderRadius="md"
        >
          Create First Project <LuPlus style={{ marginLeft: "8px" }} />
        </Button>
      </Stack>
    );
  }

  // 3. WIDOK LISTY PROJEKTÓW (GRID)
  // Jeśli projekty istnieją, wyświetlamy je w scrollowalnym kontenerze.
  return (
    <Box
      position="relative"
      flex="1"
      p="1"
      // KONFIGURACJA SCROLLA
      // 'overflowY="auto"' w połączeniu z 'maxH' zapewnia, że scrolluje się tylko obszar projektów,
      // a nagłówek aplikacji pozostaje widoczny. Wysokość jest kalkulowana dynamicznie (viewport - header).
      overflowY="auto"
      maxH="calc(100vh - 260px)"
      pr="2"
      // Stylizacja paska przewijania (Webkit) dla spójności z designem aplikacji
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--chakra-colors-gray-300)",
          borderRadius: "full",
        },
        _dark: {
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-gray-700)",
          },
        },
      }}
      // Tło z efektem 'fixed' (paralaksa) - nie przesuwa się podczas scrollowania kart
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage: `url(${projectsBgImg})`,
        bgSize: "cover",
        bgAttachment: "fixed",
        filter: "grayscale(100%)",
        opacity: "0.15",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* 4. SIATKA RESPONSYWNA (GRID SYSTEM) */}
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 5 }} // 1 kolumna na mobile, 5 na dużych ekranach
        gap="6"
        position="relative"
        zIndex={1}
        pb="10"
      >
        {projects.map((project) => (
          // KARTA PROJEKTU
          // Interaktywny element przenoszący do szczegółów projektu po kliknięciu.
          <Box
            key={project.id}
            as="button"
            onClick={() => navigate(`/project/${project.id}`)}
            p="5"
            bg={{ _light: "white", _dark: "gray.900" }}
            borderRadius="md"
            borderWidth="1px"
            borderColor={{ _light: "gray.200", _dark: "gray.800" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            // Efekty hover: lekkie uniesienie karty i cień
            _hover={{
              bg: "gray.50",
              _dark: { bg: "gray.800" },
              transform: "translateY(-4px)",
              boxShadow: "md",
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            gap="3"
            boxShadow="sm"
          >
            {/* Wizualny identyfikator projektu (pierwsza litera na kolorowym tle) */}
            <Circle size="16" bg={project.color} color="white">
              <Text fontSize="2xl" fontWeight="bold">
                {project.name.charAt(0).toUpperCase()}
              </Text>
            </Circle>
            <Text fontWeight="semibold" truncate maxW="full">
              {project.name}
            </Text>
          </Box>
        ))}

        {/* KARTA 'DODAJ NOWY' */}
        {/* Specjalny element na końcu siatki, służący jako skrót do tworzenia kolejnego projektu */}
        <Box
          as="button"
          onClick={() => navigate("/create-project")}
          border="2px dashed"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600" }}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          minH="150px"
          _hover={{
            bg: "white",
            borderColor: "blue.500",
            _dark: { bg: "gray.800", borderColor: "blue.400" },
          }}
          transition="all 0.2s ease-in-out"
        >
          <LuPlus size="32px" color="gray" />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
