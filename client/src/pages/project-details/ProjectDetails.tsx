import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Stack,
  Input,
  Flex,
  Badge,
  Table,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogActionTrigger,
  DialogBackdrop,
  DialogPositioner,
  DialogTrigger,
} from "@chakra-ui/react";
import { useProjects, type Bug } from "../../context/ProjectContext";
import { LuArrowLeft, LuTrash2, LuSearch } from "react-icons/lu";
import { CreateBugModal } from "../../components/CreateBugModal";
import { BugDetailsModal } from "../../components/BugDetailsModal";
import { toaster } from "@/components/ui/toaster";

// KOMPONENT SZCZEGÓŁÓW PROJEKTU (ADMIN VIEW)
// Centralny widok zarządczy dla konkretnego projektu. Umożliwia przeglądanie listy zgłoszeń,
// dodawanie nowych błędów, usuwanie ich oraz zarządzanie samym projektem (usuwanie/udostępnianie).
export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. ZARZĄDZANIE STANEM I DANYMI GLOBALNYMI
  // Pobieramy funkcje CRUD oraz listy danych z kontekstu aplikacji.
  const { projects, deleteProject, bugs, deleteBug } = useProjects();

  // 2. LOKALNY STAN INTERFEJSU
  // 'searchTerm': Obsługa filtrowania tabeli w czasie rzeczywistym.
  // 'confirmDelete': Stan inputa weryfikującego intencję usunięcia projektu (wymaga wpisania "DELETE").
  // 'selectedBug': Kontroluje wyświetlanie modala ze szczegółami zgłoszenia.
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  // STANY DLA OPERACJI KRYTYCZNYCH (USUWANIE)
  const [bugToDelete, setBugToDelete] = useState<Bug | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isDeletingBug, setIsDeletingBug] = useState(false);

  // 3. LOGIKA FILTROWANIA DANYCH
  // Znajdujemy aktualny projekt i filtrujemy listę wszystkich błędów,
  // aby pokazać tylko te przypisane do bieżącego widoku.
  const project = projects.find((p) => p.id === id);
  const projectBugs = bugs.filter((b) => b.projectId === id);

  // Zastosowanie filtra wyszukiwania po tytule (case-insensitive)
  const filteredBugs = projectBugs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ZABEZPIECZENIE: Obsługa przypadku, gdy projekt nie istnieje (np. błędny URL)
  if (!project)
    return (
      <Box p="10">
        <Text>Project not found</Text>
      </Box>
    );

  // OBSŁUGA USUWANIA PROJEKTU
  // Operacja nieodwracalna usuwająca projekt i kaskadowo powiązane błędy.
  // Po sukcesie następuje przekierowanie do Dashboardu.
  const handleDeleteProject = async () => {
    setIsDeletingProject(true);
    try {
      await deleteProject(project.id);
      toaster.create({
        title: "Project deleted",
        description: `Successfully removed ${project.name}`,
        type: "success",
      });
      navigate("/home");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to delete project",
        type: "error",
      });
    } finally {
      setIsDeletingProject(false);
    }
  };

  // OBSŁUGA USUWANIA POJEDYNCZEGO ZGŁOSZENIA
  const handleDeleteBug = async () => {
    if (!bugToDelete || !project.id) return;

    setIsDeletingBug(true);
    try {
      await deleteBug(bugToDelete.id, project.id);

      toaster.create({
        title: "Bug deleted",
        description: `Removed ${bugToDelete.id} from the list`,
        type: "success",
      });
      setBugToDelete(null);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to delete bug",
        type: "error",
      });
    } finally {
      setIsDeletingBug(false);
    }
  };

  // FUNKCJA UDOSTĘPNIANIA (SHARE)
  // Generuje link do widoku klienta (read-only) i kopiuje go do schowka systemowego.
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    toaster.create({
      title: "Link copied!",
      description: "You can now send this link to your client.",
      type: "success",
    });
  };

  return (
    <Box>
      {/* 1. HEADER: SEKCYJNA NAWIGACJA I AKCJE GŁÓWNE */}
      <Flex justify="space-between" align="center" mb="8">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          <LuArrowLeft /> Back to Projects
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare}>
          Share with Client
        </Button>

        {/* DIALOG POTWIERDZENIA USUNIĘCIA PROJEKTU (STREFA NIEBEZPIECZNA) */}
        <DialogRoot role="alertdialog" placement="center">
          <DialogTrigger asChild>
            <Button colorPalette="red" variant="ghost">
              <LuTrash2 />
            </Button>
          </DialogTrigger>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap="4">
                  <Text>
                    Type <strong>DELETE</strong> to confirm removal of{" "}
                    {project.name}. This action is irreversible.
                  </Text>
                  <Input
                    placeholder="DELETE"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                  />
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette="red"
                  loading={isDeletingProject}
                  disabled={confirmDelete !== "DELETE" || isDeletingProject}
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Flex>

      {/* 2. TOOLBAR: PASEK NARZĘDZIOWY */}
      {/* Zawiera: Przycisk dodawania (Modal), licznik błędów oraz wyszukiwarkę */}
      <Flex
        gap="0"
        mb="8"
        p="2"
        bg={{ _light: "gray.50", _dark: "gray.900" }}
        borderRadius="md"
        align="center"
        borderWidth="1px"
        borderColor={{ _light: "gray.200", _dark: "gray.800" }}
      >
        <Box px="6" py="3" borderColor="gray.200">
          <CreateBugModal projectId={project.id} />
        </Box>

        <Box
          px="6"
          py="3"
          borderLeftWidth="1px"
          borderRightWidth="1px"
          borderColor={{ _light: "gray.200", _dark: "gray.600" }}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
          >
            Issues
          </Text>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="red.600"
            textAlign="center"
          >
            {projectBugs.length}
          </Text>
        </Box>

        <Box position="relative" flex="1" px="6">
          <Input
            placeholder="Search by bug title..."
            variant="subtle"
            bg="white"
            _dark={{ bg: "black" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            paddingLeft="10"
            h="10"
          />
          <Box
            position="absolute"
            left="9"
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          >
            <LuSearch />
          </Box>
        </Box>
      </Flex>

      {/* 3. TABELA DANYCH (DATA GRID) */}
      <Box
        border="1px solid"
        borderColor={{ _light: "gray.200", _dark: "gray.800" }}
        borderRadius="md"
        overflow="hidden"
        bg={{ _light: "white", _dark: "gray.900" }}
      >
        {/* Kontener scrollowalny z dynamiczną wysokością */}
        <Box
          overflowY="auto"
          maxH="calc(100vh - 445px)"
          minH="100px"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "var(--chakra-colors-gray-400)",
              borderRadius: "full",
            },
            _dark: {
              "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-gray-700)",
              },
            },
          }}
        >
          <Table.Root variant="line" size="md" stickyHeader interactive>
            <Table.Header zIndex="1">
              <Table.Row bg={{ _light: "gray.50", _dark: "gray.900" }}>
                <Table.ColumnHeader bg="inherit" fontWeight="bold">
                  ID
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="inherit" fontWeight="bold">
                  Title
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="inherit" fontWeight="bold">
                  Priority
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="inherit" fontWeight="bold">
                  Device
                </Table.ColumnHeader>
                <Table.ColumnHeader bg="inherit" fontWeight="bold">
                  Created At
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  bg="inherit"
                  fontWeight="bold"
                  textAlign="end"
                >
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body bg="inherit">
              {filteredBugs.length > 0 ? (
                filteredBugs.map((bug) => (
                  <Table.Row
                    key={`${bug.projectId}-${bug.id}`}
                    onClick={() => setSelectedBug(bug)}
                    cursor="pointer"
                    _hover={{ bg: "blue.50", _dark: { bg: "gray.900" } }}
                    transition="background 0.2s"
                  >
                    <Table.Cell
                      fontWeight="bold"
                      width="120px"
                      color="blue.700"
                      _dark={{ color: "blue.400" }}
                    >
                      {bug.id}
                    </Table.Cell>
                    <Table.Cell fontWeight="medium">{bug.title}</Table.Cell>
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
                        color="white"
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
                    <Table.Cell textAlign="end">
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={(e) => {
                          e.stopPropagation(); // Zapobiega otwarciu modala szczegółów
                          setBugToDelete(bug);
                        }}
                      >
                        <LuTrash2 />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                // STAN PUSTY (EMPTY STATE)
                <Table.Row>
                  <Table.Cell colSpan={6} p="0">
                    <Box p="20" textAlign="center" color="gray.500">
                      <Text>No bugs reported for this project yet.</Text>
                    </Box>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>

      {/* 4. MODAL SZCZEGÓŁÓW BŁĘDU (READ-ONLY VIEW) */}
      <BugDetailsModal bug={selectedBug} onClose={() => setSelectedBug(null)} />

      {/* 5. MODAL POTWIERDZENIA USUWANIA BŁĘDU */}
      <DialogRoot
        role="alertdialog"
        placement="center"
        open={!!bugToDelete}
        onOpenChange={(e) => {
          if (!e.open) setBugToDelete(null);
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Bug Report</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>
                Are you sure you want to delete bug{" "}
                <strong>{bugToDelete?.id}</strong>: "{bugToDelete?.title}"? This
                action cannot be undone.
              </Text>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBugToDelete(null)}
                disabled={isDeletingBug}
              >
                Cancel
              </Button>
              <Button
                colorPalette="red"
                loading={isDeletingBug}
                onClick={handleDeleteBug}
              >
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
