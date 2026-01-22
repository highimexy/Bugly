import { useState } from "react"; // Dodaj import useState
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Circle,
  Stack,
  Input, // Dodaj import Input
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogTitle,
  DialogBackdrop,
  DialogPositioner,
  DialogTrigger,
} from "@chakra-ui/react";
import { useProjects } from "../../context/ProjectContext";
import { LuArrowLeft, LuTrash2 } from "react-icons/lu";

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();

  const [confirmText, setConfirmText] = useState("");

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <Stack align="center" justify="center" h="full" gap="4">
        <Text color="gray.500">Project not found</Text>
        <Button onClick={() => navigate("/home")} variant="outline">
          Back to Home
        </Button>
      </Stack>
    );
  }

  const handleDelete = () => {
    if (confirmText === "DELETE") {
      deleteProject(project.id);
      navigate("/home");
    }
  };

  return (
    <Box>
      <Stack direction="row" justify="space-between" align="center" mb="8">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          <LuArrowLeft /> Back to Projects
        </Button>

        <DialogRoot
          role="alertdialog"
          placement="center"
          onExitComplete={() => setConfirmText("")}
        >
          <DialogTrigger asChild>
            <Button colorPalette="red" variant="ghost">
              <LuTrash2 /> Delete Project
            </Button>
          </DialogTrigger>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Stack gap="4">
                  <Text>
                    This action cannot be undone. To confirm, please type{" "}
                    <strong>DELETE</strong> below.
                  </Text>
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    css={{ "--focus-color": "red" }}
                  />
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleDelete}
                  disabled={confirmText !== "DELETE"}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Stack>

      {/* Widok projektu */}
      <Stack direction="row" align="center" gap="6">
        <Circle size="20" bg={project.color} color="white">
          <Text fontSize="3xl" fontWeight="bold">
            {project.name.charAt(0).toUpperCase()}
          </Text>
        </Circle>
        <Box>
          <Heading size="3xl" letterSpacing="tight">
            {project.name}
          </Heading>
          <Text color="gray.500" fontSize="sm">
            ID: {project.id}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
