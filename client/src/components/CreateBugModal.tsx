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
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useProjects } from "../context/ProjectContext";
import { toaster } from "@/components/ui/toaster";

const priorities = createListCollection({
  items: [
    { label: "Low", value: "Low", color: "blue.500" },
    { label: "Medium", value: "Medium", color: "orange.500" },
    { label: "High", value: "High", color: "red.500" },
  ],
});

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
    try {
      await addBug({ ...newBug, projectId });

      // DODAJ TO:
      toaster.create({
        title: "Bug reported",
        description: `Successfully added ${newBug.title}`,
        type: "success",
      });

      setNewBug(initialBugState);
      setIsOpen(false);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Failed to save the bug",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    placeholder="iPhone 15"
                    value={newBug.device}
                    onChange={(e) =>
                      setNewBug({ ...newBug, device: e.target.value })
                    }
                  />
                </Box>

                {/* TUTAJ NOWY SELECT ZGODNIE Z DOKUMENTACJĄ */}
                <Box w="140px">
                  <Select.Root
                    collection={priorities}
                    value={[newBug.priority]}
                    onValueChange={(details) =>
                      setNewBug({
                        ...newBug,
                        priority: details.value[0] as any,
                      })
                    }
                  >
                    <Select.Label fontSize="sm" fontWeight="bold">
                      Priority
                    </Select.Label>

                    <Select.Control>
                      <Select.Trigger cursor="pointer">
                        <HStack gap="2">
                          {/* Kropka koloru dla wybranej wartości */}
                          <Box
                            w="2"
                            h="2"
                            borderRadius="full"
                            bg={
                              priorities.items.find(
                                (i) => i.value === newBug.priority,
                              )?.color
                            }
                          />
                          <Select.ValueText placeholder="Select" />
                        </HStack>
                        <Select.Indicator />
                      </Select.Trigger>
                    </Select.Control>

                    <Select.Positioner zIndex="9999">
                      <Select.Content bg="white" _dark={{ bg: "gray.800" }}>
                        {priorities.items.map((priority) => (
                          <Select.Item
                            item={priority}
                            key={priority.value}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            cursor="pointer"
                            _hover={{
                              bg: "gray.100",
                              _dark: { bg: "gray.700" },
                            }}
                            _selected={{ fontWeight: "bold" }}
                          >
                            <HStack gap="2">
                              <Box
                                w="2"
                                h="2"
                                borderRadius="full"
                                bg={priority.color}
                              />
                              <Select.ItemText>
                                {priority.label}
                              </Select.ItemText>
                            </HStack>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Box>
              </HStack>

              <Box>
                <Text mb="1" fontSize="sm" fontWeight="bold" color="blue.600">
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
                  <Text mb="1" fontSize="sm" fontWeight="bold" color="red.600">
                    Actual Result
                  </Text>
                  <Textarea
                    value={newBug.actualResult}
                    onChange={(e) =>
                      setNewBug({ ...newBug, actualResult: e.target.value })
                    }
                  />
                </Box>
                <Box flex="1">
                  <Text
                    mb="1"
                    fontSize="sm"
                    fontWeight="bold"
                    color="green.600"
                  >
                    Expected Result
                  </Text>
                  <Textarea
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
                  placeholder="https://drive.google.com/..."
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
