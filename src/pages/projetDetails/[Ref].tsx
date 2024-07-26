import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text, Button, Input, VStack, useDisclosure } from '@chakra-ui/react';

const ProjectDetails = () => {
  const router = useRouter();
  const { Ref } = router.query;
  const { isOpen, onOpen } = useDisclosure();
  const [project, setProject] = useState(null);
  const apiUrl = `/api/projet/${Ref}`;
      console.log('API URL:', apiUrl);
  useEffect(() => {
    if (Ref) {
      const apiUrl = `/api/projet/${Ref}`;
      console.log('API URL:', apiUrl);
  
      fetch(apiUrl)
        .then(response => {
          console.log('API response status:', response.status);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched project data:', data);
          setProject(data);
        })
        .catch(error => console.error('Error fetching project:', error));
    }
  }, [Ref]);
  

  const handleApplyClick = () => {
    onOpen();
  };

  return (
    <Box p={4} bg="#e0f7fa" borderRadius="md" boxShadow="md">
      <Heading mb={4}>Détails du projet</Heading>
      {project ? (
        <>
          <Text mb={2}><strong>ID du projet:</strong> {project.Ref}</Text>
          <Text mb={2}><strong>Sujet:</strong> {project.Sujet}</Text>
          <Text mb={2}><strong>Description:</strong> {project.Description}</Text>
          {/* Ajoutez d'autres détails du projet ici */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Button colorScheme='green' onClick={handleApplyClick}>Appliquer pour ce projet</Button>
            {isOpen && (
              <VStack spacing={4} align="start" mt={4}>
                <Input placeholder="Mail" />
                <Input placeholder="Nom et prénom" />
                <Input placeholder="Référence projet" value={project.Ref} isReadOnly />
                <Button colorScheme='blue'>Valider</Button>
              </VStack>
            )}
          </Box>
        </>
      ) : (
        <Text>Chargement des détails du projet...</Text>
      )}
    </Box>
  );
};

export default ProjectDetails;
