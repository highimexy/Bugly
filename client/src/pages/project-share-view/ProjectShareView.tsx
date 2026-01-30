import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // <--- 1. Importujemy axios do niezależnego zapytania
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
// WAŻNE: Importujemy TYLKO TYPY, nie 'useProjects'!
import type { Bug, Project } from "../../context/ProjectContext";
import { BugDetailsModal } from "../../components/BugDetailsModal";

// Definicja adresu API (taka sama jak w Context/Auth)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

export function ProjectShareView() {
  const { id } = useParams();

  // 2. LOKALNY STAN (Zamiast Globalnego Contextu)
  // Ten widok zarządza własnymi danymi.
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Stan dla modala i checkboxów
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [doneBugs, setDoneBugs] = useState<string[]>([]);

  // 3. POBIERANIE DANYCH (Izolowane)
  // Pobieramy tylko ten jeden projekt, o który prosi URL.
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        // Strzał do endpointu, który zwraca JEDEN projekt (stworzyliśmy go wcześniej w Go)
        const response = await axios.get(`${API_URL}/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

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
  if (!project || error)
    return (
      <Box p="10" textAlign="center">
        <Heading size="lg" color="red.500">
          Project Not Found
        </Heading>
        <Text mt="2">This project does not exist or the link is invalid.</Text>
      </Box>
    );

  // Helper: Backend zwraca błędy wewnątrz obiektu project (dzięki Preload)
  const projectBugs = project.bugs || [];

  return (
    <Container maxW="container.xl" py="10">
      {/* NAGŁÓWEK */}
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

      {/* TABELA */}
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
              <Table.ColumnHeader fontWeight="bold" textAlign="end">
                Status
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {projectBugs.map((bug) => {
              const isDone = doneBugs.includes(bug.id);

              return (
                <Table.Row
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)}
                  cursor="pointer"
                  opacity={isDone ? 0.5 : 1}
                  _hover={{ bg: { _light: "gray.50", _dark: "gray.800" } }}
                >
                  <Table.Cell
                    fontWeight="bold"
                    color="blue.600"
                    textDecoration={isDone ? "line-through" : "none"}
                  >
                    {bug.id}
                  </Table.Cell>
                  <Table.Cell
                    fontWeight="medium"
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

                  {/* CHECKBOX "DONE" */}
                  <Table.Cell
                    textAlign="end"
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

      <BugDetailsModal bug={selectedBug} onClose={() => setSelectedBug(null)} />
    </Container>
  );
}
