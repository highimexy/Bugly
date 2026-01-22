import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Circle,
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
  HStack,
} from "@chakra-ui/react";
import { useProjects } from "../../context/ProjectContext";
import { LuArrowLeft, LuTrash2, LuPlus, LuSearch } from "react-icons/lu";

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, deleteProject, bugs, addBug } = useProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const project = projects.find((p) => p.id === id);
  const projectBugs = bugs.filter((b) => b.projectId === id);

  // Filtrowanie błędów
  const filteredBugs = projectBugs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!project) return <Text>Project not found</Text>;

  const handleDelete = () => {
    deleteProject(project.id);
    navigate("/home");
  };

  return (
    <Box>
      {/* HEADER: Wróć i Akcje główne */}
      <Flex justify="space-between" align="center" mb="8">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          <LuArrowLeft /> Back to Projects
        </Button>

        <HStack gap="3">
          <DialogRoot
            role="alertdialog"
            placement="center"
            onExitComplete={() => setConfirmDelete("")}
          >
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
                      {project.name}.
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
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogPositioner>
          </DialogRoot>
        </HStack>
      </Flex>

      {/* PASEK STATYSTYKI I WYSZUKIWARKI */}
      <Flex
        gap="0"
        mb="8"
        p="2"
        bg={{ _light: "gray.50", _dark: "gray.900" }}
        borderRadius="2xl"
        align="center"
      >
        {/* Sekcja przycisku */}
        <Box px="6" py="3" borderRightWidth="1px" borderColor="gray.200">
          <Button
            colorPalette="blue"
            onClick={() => addBug(project.id, "New Issue", "Medium")}
            size="sm"
          >
            <LuPlus /> Report Bug
          </Button>
        </Box>

        {/* Sekcja statystyki */}
        <Box px="6" py="3" borderRightWidth="1px" borderColor="gray.200">
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="gray.500"
            textTransform="uppercase"
            lineHeight="shorter"
          >
            Total Issues
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="blue.500" lineHeight="1">
            {projectBugs.length}
          </Text>
        </Box>

        {/* Sekcja wyszukiwarki */}
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

      {/* TABELA BŁĘDÓW */}
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
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">
                Created At
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBugs.map((bug) => (
              <Table.Row
                key={bug.id}
                _hover={{ bg: "gray.50", _dark: { bg: "gray.800" } }}
              >
                <Table.Cell fontWeight="bold" width="100px">
                  {bug.id}
                </Table.Cell>
                <Table.Cell>{bug.title}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={bug.priority === "High" ? "red" : "blue"}
                    variant="solid"
                  >
                    {bug.priority}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="outline">{bug.status}</Badge>
                </Table.Cell>
                <Table.Cell textAlign="end" color="gray.500" fontSize="sm">
                  {bug.createdAt}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        {filteredBugs.length === 0 && (
          <Box p="10" textAlign="center" color="gray.500">
            No bugs found matching your search.
          </Box>
        )}
      </Box>
    </Box>
  );
}
