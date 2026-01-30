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
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { LuExternalLink, LuMonitor, LuInfo } from "react-icons/lu";
import { type Bug } from "../context/ProjectContext";

interface Props {
  bug: Bug | null;
  onClose: () => void;
}

export function BugDetailsModal({ bug, onClose }: Props) {
  if (!bug) return null;

  // 1. MAGICZNA FUNKCJA DO GOOGLE DRIVE
  // Zamienia link "podglądu" na link "bezpośredniego obrazka"
  const getProccesedUrl = (url: string) => {
    if (!url) return "";

    // Krok A: Naprawiamy brakujące https
    let finalUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      finalUrl = `https://${url}`;
    }

    // Krok B: Wykrywamy Google Drive
    if (
      finalUrl.includes("drive.google.com") &&
      finalUrl.includes("/file/d/")
    ) {
      // Wyciągamy ID pliku za pomocą wyrażenia regularnego (Regex)
      const match = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Zwracamy specjalny link Google do wyświetlania obrazka
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    return finalUrl;
  };

  const displayUrl = getProccesedUrl(bug.screenshotUrl || "");

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
          borderRadius="md"
          border="1px solid"
          borderColor={{ _light: "gray.100", _dark: "gray.800" }}
          overflow="hidden"
          maxW="800px"
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
              {/* Device & Date */}
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

              {/* Steps */}
              <Stack gap="2">
                <Text
                  fontWeight="bold"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="blue.600"
                >
                  Steps to Reproduce
                </Text>
                <Box
                  p="3"
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="md"
                  fontSize="sm"
                  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                >
                  {bug.stepsToReproduce}
                </Box>
              </Stack>

              {/* Result Comparison */}
              <SimpleGrid columns={2} gap="4">
                <Stack gap="2">
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    color="red.600"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Actual Result
                  </Text>
                  <Box
                    p="3"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="md"
                    fontSize="sm"
                    _dark={{ bg: "gray.800", borderColor: "gray.700" }}
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
                    p="3"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="md"
                    fontSize="sm"
                    _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                  >
                    {bug.expectedResult}
                  </Box>
                </Stack>
              </SimpleGrid>

              {/* SEKCJA SCREENSHOTA */}
              {displayUrl && (
                <Stack gap="3">
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="purple.600"
                  >
                    Screenshot Evidence
                  </Text>

                  <Box
                    borderRadius="lg"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="gray.50"
                    _dark={{ borderColor: "gray.700", bg: "gray.900" }}
                  >
                    <Image
                      src={displayUrl}
                      alt="Bug Screenshot"
                      objectFit="contain"
                      w="full"
                      maxH="500px"
                      // ZAMIAST fallbackSrc:
                      onError={(e) => {
                        // Zabezpieczenie przed pętlą, gdyby placeholder też nie działał
                        e.currentTarget.onerror = null;
                        // Podmiana źródła na obrazek zastępczy
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Image+Load+Error";
                      }}
                    />
                  </Box>

                  <Link
                    href={displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    p="2"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="2"
                    bg="gray.100"
                    _hover={{ bg: "gray.200", textDecoration: "none" }}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="bold"
                    _dark={{ bg: "gray.800", _hover: { bg: "gray.700" } }}
                  >
                    <LuExternalLink /> Open original image in new tab
                  </Link>
                </Stack>
              )}
            </Stack>
          </DialogBody>

          <DialogFooter
            px="6"
            py="4"
            borderTopWidth="1px"
            borderColor={{ _light: "gray.100", _dark: "gray.800" }}
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
