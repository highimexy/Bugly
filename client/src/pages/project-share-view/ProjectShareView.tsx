import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Flex,
  Badge,
  Table,
  Heading,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { useProjects, type Bug } from "../../context/ProjectContext";
import { BugDetailsModal } from "../../components/BugDetailsModal";

// KOMPONENT WIDOKU DLA KLIENTA (READ-ONLY)
// Służy do udostępniania postępów prac osobom z zewnątrz (np. klientom),
// oferując uproszczony interfejs bez możliwości edycji czy usuwania danych.
export function ProjectShareView() {
  const { id } = useParams();

  // 1. INTEGRACJA Z GLOBALNYM STANEM APLIKACJI
  // Pobieramy pełną listę projektów i błędów z Context API.
  const { projects, bugs, isLoading } = useProjects();

  // 2. LOKALNY STAN WIDOKU
  // 'selectedBug': Kontroluje wyświetlanie modala ze szczegółami.
  // 'doneBugs': Przechowuje listę ID zadań "odfajkowanych" przez klienta w bieżącej sesji (zmiana wizualna).
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [doneBugs, setDoneBugs] = useState<string[]>([]);

  // 3. FILTROWANIE DANYCH
  // Wyodrębniamy dane specyficzne dla aktualnie przeglądanego projektu na podstawie URL ID.
  const project = projects.find((p) => p.id === id);
  const projectBugs = bugs.filter((b) => b.projectId === id);

  // LOGIKA BIZNESOWA: PRZEŁĄCZANIE STATUSU (LOCAL ONLY)
  // Funkcja dodaje lub usuwa ID błędu z tablicy 'doneBugs', co steruje przekreśleniem wiersza.
  const toggleDone = (bugId: string) => {
    setDoneBugs((prev) =>
      prev.includes(bugId)
        ? prev.filter((id) => id !== bugId)
        : [...prev, bugId],
    );
  };

  // OBSŁUGA STANU ŁADOWANIA
  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
        <Text ml="4">Loading client report...</Text>
      </Flex>
    );
  }

  // OBSŁUGA BŁĘDÓW (404)
  if (!project)
    return (
      <Box p="10">
        <Text>Project does not exist or the link has expired.</Text>
      </Box>
    );

  return (
    <Container maxW="container.xl" py="10">
      {/* SEKCJA NAGŁÓWKA */}
      {/* Wyświetla nazwę projektu oraz sumaryczną liczbę zgłoszonych problemów */}
      <Flex
        justify="space-between"
        align="center"
        mb="8"
        borderBottomWidth="1px"
        pb="6"
      >
        <Box>
          <Heading size="xl" mb="2">
            {project.name}
          </Heading>
          <Text color="gray.500">Public list of reported bugs</Text>
        </Box>
        <Badge colorPalette="blue" size="lg" variant="subtle">
          {projectBugs.length} Issues
        </Badge>
      </Flex>

      {/* SEKCJA GŁÓWNA: TABELA DANYCH */}
      <Box
        border="1px solid"
        borderColor={{ _light: "gray.200", _dark: "gray.800" }}
        borderRadius="lg"
        overflow="hidden"
        bg={{ _light: "white", _dark: "gray.900" }}
      >
        <Table.Root variant="line" size="md" interactive>
          <Table.Header>
            <Table.Row bg={{ _light: "gray.50", _dark: "gray.900" }}>
              <Table.ColumnHeader fontWeight="bold">ID</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold">Title</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold">
                Priority
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold">Device</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="bold">
                Created At
              </Table.ColumnHeader>
              {/* Kolumna akcji dla klienta (Status Checkbox) */}
              <Table.ColumnHeader fontWeight="bold" textAlign="end">
                Status
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {projectBugs.map((bug) => {
              // Sprawdzamy, czy dany wiersz ma być wygaszony/przekreślony
              const isDone = doneBugs.includes(bug.id);

              return (
                <Table.Row
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)}
                  cursor="pointer"
                  // Wizualny feedback: zmniejszona przezroczystość dla zadań wykonanych
                  opacity={isDone ? 0.5 : 1}
                  _hover={{ bg: { _light: "gray.50", _dark: "gray.800" } }}
                >
                  <Table.Cell
                    fontWeight="bold"
                    color="blue.600"
                    _dark={{ color: "blue.400" }}
                    // Przekreślenie ID, jeśli zadanie jest 'DONE'
                    textDecoration={isDone ? "line-through" : "none"}
                  >
                    {bug.id}
                  </Table.Cell>
                  <Table.Cell
                    fontWeight="medium"
                    // Przekreślenie tytułu dla spójności wizualnej
                    textDecoration={isDone ? "line-through" : "none"}
                  >
                    {bug.title}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        bug.priority === "High"
                          ? "red"
                          : bug.priority === "Medium"
                            ? "orange"
                            : "blue"
                      }
                      variant="solid"
                    >
                      {bug.priority}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.500">
                    {bug.device || "---"}
                  </Table.Cell>
                  <Table.Cell color="gray.500" fontSize="sm">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  {/* KOMÓRKA INTERAKTYWNA: CHECKBOX */}
                  <Table.Cell
                    textAlign="end"
                    // Zapobiegamy propagacji, aby kliknięcie w checkbox nie otwierało modala
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Flex align="center" justify="flex-end" gap="2">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color={isDone ? "green.500" : "gray.400"}
                      >
                        {isDone ? "DONE" : "TODO"}
                      </Text>
                      {/* Natywny input dla pewności stylowania accent-color */}
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleDone(bug.id)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "var(--chakra-colors-green-500)",
                        }}
                      />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>

        {/* STAN PUSTY: Wyświetlany, gdy lista błędów jest pusta */}
        {projectBugs.length === 0 && (
          <Box
            p="20"
            textAlign="center"
            color="gray.500"
            bg={{ _light: "white", _dark: "gray.900" }}
          >
            <Text>No bugs have been reported for this project yet.</Text>
          </Box>
        )}
      </Box>

      {/* MODAL SZCZEGÓŁÓW: Reużywalny komponent do wyświetlania pełnych informacji */}
      <BugDetailsModal bug={selectedBug} onClose={() => setSelectedBug(null)} />
    </Container>
  );
}
