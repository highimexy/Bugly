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

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Dodajemy deleteBug z contextu
  const { projects, deleteProject, bugs, deleteBug } = useProjects();

  // STANY
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  // LOGIKA DANYCH
  const project = projects.find((p) => p.id === id);
  const projectBugs = bugs.filter((b) => b.projectId === id);

  const filteredBugs = projectBugs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!project)
    return (
      <Box p="10">
        <Text>Project not found</Text>
      </Box>
    );

  const handleDeleteProject = async () => {
    await deleteProject(project.id);
    navigate("/home");
  };

  return (
    <Box>
      {/* 1. HEADER: Nawigacja i Usuwanie projektu */}
      <Flex justify="space-between" align="center" mb="8">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          <LuArrowLeft /> Back to Projects
        </Button>

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
                  disabled={confirmDelete !== "DELETE"}
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Flex>

      {/* 2. TOOLBAR: Raportowanie, Statystyki i Szukajka */}
      <Flex
        gap="0"
        mb="8"
        p="2"
        bg={{ _light: "gray.50", _dark: "gray.900" }}
        borderRadius="2xl"
        align="center"
        borderWidth="1px"
        borderColor="gray.100"
        _dark={{ borderColor: "gray.800" }}
      >
        <Box px="6" py="3" borderRightWidth="1px" borderColor="gray.200">
          <CreateBugModal projectId={project.id} />
        </Box>

        <Box px="6" py="3" borderRightWidth="1px" borderColor="gray.200">
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

      {/* 3. TABELA BŁĘDÓW */}
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="xl"
        overflow="hidden"
      >
        <Table.Root variant="line" size="md">
          <Table.Header bg="gray.50" _dark={{ bg: "gray.800" }}>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Priority</Table.ColumnHeader>
              <Table.ColumnHeader>Device</Table.ColumnHeader>
              <Table.ColumnHeader>Created At</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBugs.map((bug) => (
              <Table.Row
                key={bug.id}
                onClick={() => setSelectedBug(bug)}
                cursor="pointer"
                _hover={{ bg: "blue.50", _dark: { bg: "gray.800" } }}
                transition="background 0.2s"
              >
                <Table.Cell fontWeight="bold" width="120px">
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
                  >
                    {bug.priority}
                  </Badge>
                </Table.Cell>
                <Table.Cell color="gray.500">{bug.device || "---"}</Table.Cell>
                <Table.Cell color="gray.500" fontSize="sm">
                  {new Date(bug.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="red"
                    onClick={(e) => {
                      e.stopPropagation(); // Blokuje otwarcie szczegółów
                      if (
                        window.confirm(
                          "Are you sure you want to delete this bug?",
                        )
                      ) {
                        deleteBug(bug.id);
                      }
                    }}
                  >
                    <LuTrash2 />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {filteredBugs.length === 0 && (
          <Box p="20" textAlign="center" color="gray.500">
            <Text>No bugs reported for this project yet.</Text>
          </Box>
        )}
      </Box>

      {/* 4. MODAL SZCZEGÓŁÓW BŁĘDU */}
      <BugDetailsModal bug={selectedBug} onClose={() => setSelectedBug(null)} />
    </Box>
  );
}
