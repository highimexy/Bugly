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
} from "@chakra-ui/react";
import { LuExternalLink, LuMonitor, LuInfo } from "react-icons/lu";
import { type Bug } from "../context/ProjectContext";

// DEFINICJA PROPSÓW
// Komponent przyjmuje obiekt błędu (lub null, jeśli żaden nie jest wybrany)
// oraz funkcję zamykającą modal.
interface Props {
  bug: Bug | null;
  onClose: () => void;
}

// KOMPONENT SZCZEGÓŁÓW ZGŁOSZENIA
// Prezentuje pełne informacje o błędzie w formie modala (okna dialogowego).
// Jest komponentem "głupim" (presentational) - wyświetla dane przekazane przez propsy,
// dzięki czemu może być używany zarówno w panelu admina, jak i w widoku klienta.
export function BugDetailsModal({ bug, onClose }: Props) {
  // GUARD CLAUSE: Jeśli nie wybrano błędu, nie renderujemy nic (modal jest ukryty).
  if (!bug) return null;

  // FUNKCJA POMOCNICZA: NAPRAWIANIE LINKÓW
  // Jeśli link nie zaczyna się od http/https, dodajemy https:// na początku.
  // Dzięki temu przeglądarka wie, że to zewnętrzna strona.
  const getValidUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    // KONTROLER MODALA
    // 'open={!!bug}' konwertuje obiekt na boolean -> true jeśli bug istnieje.
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
        >
          {/* 1. NAGŁÓWEK: KLUCZOWE INFORMACJE */}
          {/* Zawiera ID, Tytuł oraz kolorowy Badge priorytetu dla szybkiej identyfikacji wagi problemu. */}
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
              {/* Dynamiczne kolorowanie Badge w zależności od priorytetu */}
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
              {/* 2. SEKCJA METADANYCH (Device & Date) */}
              {/* Wykorzystuje ikony w okręgach (Circle) jako kotwice wizualne. */}
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

              {/* 3. KROKI REPRODUKCJI (STEPS TO REPRODUCE) */}
              {/* Tekst w osobnym kontenerze dla lepszej czytelności instrukcji. */}
              <Stack gap="2">
                <HStack gap="2">
                  <Text
                    fontWeight="bold"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="blue.600"
                  >
                    Steps to Reproduce
                  </Text>
                </HStack>
                <Box
                  p="3"
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="md"
                  fontSize="sm"
                  lineHeight="tall"
                  _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                >
                  {bug.stepsToReproduce}
                </Box>
              </Stack>

              {/* 4. PORÓWNANIE WYNIKÓW (ACTUAL VS EXPECTED) */}
              {/* Układ Grid 2-kolumnowy pozwalający na łatwe zestawienie różnic. */}
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
                    p="3"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.100"
                    borderRadius="md"
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

              {/* 5. SEKCJA ZAŁĄCZNIKÓW */}
              {/* Renderowana warunkowo - tylko jeśli URL screenshota istnieje. */}
              {bug.screenshotUrl && (
                <Box>
                  <Link
                    href={getValidUrl(bug.screenshotUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    p="3"
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
                    <LuExternalLink /> View Screenshot Reference
                  </Link>
                </Box>
              )}
            </Stack>
          </DialogBody>

          {/* STOPKA: PRZYCISK ZAMKNIĘCIA */}
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
