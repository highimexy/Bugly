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

export function ProjectShareView() {
  const { id } = useParams();
  const { projects, bugs, isLoading } = useProjects();

  // State to hold the bug selected by the client
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  // NOWE: Lokalny stan dla zaznaczonych błędów
  const [doneBugs, setDoneBugs] = useState<string[]>([]);

  const project = projects.find((p) => p.id === id);
  const projectBugs = bugs.filter((b) => b.projectId === id);

  // NOWE: Funkcja przełączania statusu
  const toggleDone = (bugId: string) => {
    setDoneBugs((prev) =>
      prev.includes(bugId)
        ? prev.filter((id) => id !== bugId)
        : [...prev, bugId],
    );
  };

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
        <Text ml="4">Loading client report...</Text>
      </Flex>
    );
  }

  if (!project)
    return (
      <Box p="10">
        <Text>Project does not exist or the link has expired.</Text>
      </Box>
    );

  return (
    <Container maxW="container.xl" py="10">
      {/* Header */}
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

      {/* Table */}
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
              {/* NOWE: Nagłówek dla statusu */}
              <Table.ColumnHeader fontWeight="bold" textAlign="end">
                Status
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {projectBugs.map((bug) => {
              const isDone = doneBugs.includes(bug.id); // Sprawdzamy czy zaznaczony

              return (
                <Table.Row
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)} // Opens details on click
                  cursor="pointer"
                  opacity={isDone ? 0.5 : 1} // Efekt wizualny
                  _hover={{ bg: { _light: "gray.50", _dark: "gray.800" } }}
                >
                  <Table.Cell
                    fontWeight="bold"
                    color="blue.600"
                    _dark={{ color: "blue.400" }}
                    textDecoration={isDone ? "line-through" : "none"} // Przekreślenie
                  >
                    {bug.id}
                  </Table.Cell>
                  <Table.Cell
                    fontWeight="medium"
                    textDecoration={isDone ? "line-through" : "none"} // Przekreślenie
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
                  {/* NOWE: Komórka z inputem */}
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

      {/* DETAILS MODAL - Reusing your existing component */}
      <BugDetailsModal bug={selectedBug} onClose={() => setSelectedBug(null)} />
    </Container>
  );
}
