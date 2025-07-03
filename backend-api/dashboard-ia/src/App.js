import { Box, Heading, Text, Button } from '@chakra-ui/react';

function App() {
  return (
    <Box p={6}>
      <Heading mb={4}>Tableau de Bord IA - Senelec</Heading>
      <Text fontSize="lg" mb={4}>
        Bienvenue sur votre interface de suivi des réclamations clients.
      </Text>
      <Button colorScheme="teal">Voir les données</Button>
    </Box>
  );
}

export default App;
