import {
  Button,
  Stack,
  Text,
  Box,
  HStack,
  Badge,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogActionTrigger,
  DialogBackdrop,
  DialogPositioner,
  Link,
  Circle,
} from "@chakra-ui/react";
import {
  LuExternalLink,
  LuMonitor,
  LuInfo,
  LuStepForward,
} from "react-icons/lu";
import { type Bug } from "../context/ProjectContext";

interface Props {
  bug: Bug | null;
  onClose: () => void;
}

export function BugDetailsModal({ bug, onClose }: Props) {
  if (!bug) return null;

  return (
    <DialogRoot
      open={!!bug}
      onOpenChange={onClose}
      size="lg"
      placement="center"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent
          borderRadius="2xl"
          border="1px solid"
          borderColor={{ _light: "gray.100", _dark: "gray.800" }}
          overflow="hidden"
        >
          <DialogHeader
            bg={{ _light: "gray.50", _dark: "gray.900" }}
            py="5"
            px="6"
          >
            <HStack justify="space-between" w="full" align="flex-start">
              <Stack gap="1">
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="bold"
                  fontFamily="mono"
                >
                  {bug.id}
                </Text>
                <DialogTitle fontSize="xl" fontWeight="bold">
                  {bug.title}
                </DialogTitle>
              </Stack>
              <Badge
                colorPalette={
                  bug.priority === "High"
                    ? "red"
                    : bug.priority === "Medium"
                      ? "orange"
                      : "blue"
                }
                size="lg"
                variant="solid"
                borderRadius="md"
                px="3"
                color="white"
              >
                {bug.priority}
              </Badge>
            </HStack>
          </DialogHeader>

          <DialogBody py="6" px="6">
            <Stack gap="8">
              {/* Sekcja Urządzenia i Daty */}
              <HStack gap="8" fontSize="sm" color="gray.600">
                <HStack gap="2">
                  <Circle size="8" bg="gray.100">
                    <LuMonitor size="14px" />
                  </Circle>
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize="xs"
                      color="gray.400"
                      textTransform="uppercase"
                    >
                      Device
                    </Text>
                    <Text fontWeight="medium">{bug.device || "---"}</Text>
                  </Box>
                </HStack>
                <HStack gap="2">
                  <Circle size="8" bg="gray.100">
                    <LuInfo size="14px" />
                  </Circle>
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize="xs"
                      color="gray.400"
                      textTransform="uppercase"
                    >
                      Reported
                    </Text>
                    <Text fontWeight="medium">
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                </HStack>
              </HStack>

              {/* Steps to Reproduce */}
              <Stack gap="2">
                <HStack gap="2" color="blue.600">
                  <LuStepForward size="16px" />
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Steps to Reproduce
                  </Text>
                </HStack>
                <Box
                  p="4"
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="xl"
                  fontSize="sm"
                  lineHeight="tall"
                  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                >
                  {bug.stepsToReproduce}
                </Box>
              </Stack>

              {/* Comparison Box */}
              <SimpleGrid columns={2} gap="4">
                <Stack gap="2">
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    color="red.600" // Czerwony tekst etykiety
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Actual Result
                  </Text>
                  <Box
                    p="4"
                    bg="white" // Spójne tło z resztą pól
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="xl"
                    fontSize="sm"
                    lineHeight="tall"
                    color="gray.800"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.700",
                      color: "gray.200",
                    }}
                  >
                    {bug.actualResult}
                  </Box>
                </Stack>

                <Stack gap="2">
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    color="green.600"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Expected Result
                  </Text>
                  <Box
                    p="4"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="xl"
                    fontSize="sm"
                    lineHeight="tall"
                    color="gray.800"
                    _dark={{
                      bg: "gray.800",
                      borderColor: "gray.700",
                      color: "gray.200",
                    }}
                  >
                    {bug.expectedResult}
                  </Box>
                </Stack>
              </SimpleGrid>

              {/* Screenshot Link */}
              {bug.screenshotUrl && (
                <Box pt="2">
                  <Link
                    href={bug.screenshotUrl}
                    target="_blank"
                    p="3"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="2"
                    bg="gray.100"
                    _hover={{ bg: "gray.200", textDecoration: "none" }}
                    borderRadius="xl"
                    fontSize="sm"
                    fontWeight="bold"
                    _dark={{ bg: "gray.800", _hover: { bg: "gray.700" } }}
                  >
                    <LuExternalLink /> View Screenshot Reference
                  </Link>
                </Box>
              )}
            </Stack>
          </DialogBody>

          <DialogFooter
            px="6"
            py="4"
            borderTopWidth="1px"
            borderColor="gray.100"
          >
            <DialogActionTrigger asChild>
              <Button variant="outline">Close Details</Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}

// Pomocniczy import dla układu (jeśli nie masz go w Chakra)
import { SimpleGrid } from "@chakra-ui/react";
