import { useState } from "react";
import {
  Button,
  Input,
  Stack,
  Text,
  Box,
  HStack,
  Textarea,
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
import { LuPlus } from "react-icons/lu";
import { useProjects } from "../context/ProjectContext";

const initialBugState = {
  title: "",
  stepsToReproduce: "",
  actualResult: "",
  expectedResult: "",
  priority: "Medium" as const,
  device: "",
  screenshotUrl: "",
};

export function CreateBugModal({ projectId }: { projectId: string }) {
  const { addBug } = useProjects();
  const [newBug, setNewBug] = useState(initialBugState);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await addBug({ ...newBug, projectId });
    setIsSubmitting(false);
    setNewBug(initialBugState);
    setIsOpen(false);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      size="lg"
      placement="center"
    >
      <DialogTrigger asChild>
        <Button colorPalette="blue" size="sm">
          <LuPlus /> Report Bug
        </Button>
      </DialogTrigger>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report New Bug</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap="4">
              <Box>
                <Text mb="1" fontSize="sm" fontWeight="bold">
                  Title
                </Text>
                <Input
                  placeholder="e.g. App crashes on login"
                  value={newBug.title}
                  onChange={(e) =>
                    setNewBug({ ...newBug, title: e.target.value })
                  }
                />
              </Box>

              <HStack gap="4">
                <Box flex="1">
                  <Text mb="1" fontSize="sm" fontWeight="bold">
                    Device
                  </Text>
                  <Input
                    placeholder="iPhone 15, Chrome v120"
                    value={newBug.device}
                    onChange={(e) =>
                      setNewBug({ ...newBug, device: e.target.value })
                    }
                  />
                </Box>
                <Box w="140px">
                  <Text mb="1" fontSize="sm" fontWeight="bold">
                    Priority
                  </Text>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    value={newBug.priority}
                    onChange={(e) =>
                      setNewBug({ ...newBug, priority: e.target.value as any })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </Box>
              </HStack>

              <Box>
                <Text mb="1" fontSize="sm" fontWeight="bold">
                  Steps to Reproduce
                </Text>
                <Textarea
                  placeholder="1. Open app..."
                  value={newBug.stepsToReproduce}
                  onChange={(e) =>
                    setNewBug({ ...newBug, stepsToReproduce: e.target.value })
                  }
                />
              </Box>

              <HStack gap="4">
                <Box flex="1">
                  <Text mb="1" fontSize="sm" fontWeight="bold">
                    Actual
                  </Text>
                  <Input
                    value={newBug.actualResult}
                    onChange={(e) =>
                      setNewBug({ ...newBug, actualResult: e.target.value })
                    }
                  />
                </Box>
                <Box flex="1">
                  <Text mb="1" fontSize="sm" fontWeight="bold">
                    Expected
                  </Text>
                  <Input
                    value={newBug.expectedResult}
                    onChange={(e) =>
                      setNewBug({ ...newBug, expectedResult: e.target.value })
                    }
                  />
                </Box>
              </HStack>

              <Box>
                <Text mb="1" fontSize="sm" fontWeight="bold">
                  Screenshot URL
                </Text>
                <Input
                  placeholder="https://imgur.com/..."
                  value={newBug.screenshotUrl}
                  onChange={(e) =>
                    setNewBug({ ...newBug, screenshotUrl: e.target.value })
                  }
                />
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button
              colorPalette="blue"
              onClick={handleSave}
              loading={isSubmitting}
              disabled={!newBug.title || isSubmitting}
            >
              Save Bug
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
