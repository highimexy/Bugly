import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

export function Auth() {
  return (
    <Box minH="100vh" bg="mainBg" display="flex" flexDirection="column">
      <Center flex="1" p={4}>
        <Stack gap="8" width="full" maxW="400px">
          {/* Logo */}
          <Stack gap="2" textAlign="center">
            <Heading
              size="6xl"
              fontFamily={"archivo black"}
              letterSpacing="tight"
              color={{ _light: "gray.900", _dark: "white" }}
            >
              Bugly
            </Heading>
          </Stack>

          {/* Karta Logowania */}
          <Box
            bg={{ _light: "white", _dark: "gray.800" }}
            p={{ base: "6", md: "10" }}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={{ _light: "gray.200", _dark: "gray.700" }}
            boxShadow="sm"
          >
            <Stack gap="6">
              <Field label="Email">
                <Input
                  placeholder="Enter your email"
                  variant="subtle"
                  size="lg"
                  h="12"
                />
              </Field>

              <Field label="Hasło">
                <Input
                  type="password"
                  placeholder="••••••••"
                  variant="subtle"
                  size="lg"
                  h="12"
                />
              </Field>

              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                _dark={{
                  bg: "white",
                  color: "black",
                  _hover: { bg: "gray.200" },
                }}
                size="lg"
                h="12"
                fontWeight="medium"
                borderRadius="xl"
              >
                Kontynuuj
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Center>

      {/* Footer */}
      <Box p="6" textAlign="center">
        <Text fontSize="xs" color="gray.400">
          © 2026 Bugly Inc.
        </Text>
      </Box>
    </Box>
  );
}
