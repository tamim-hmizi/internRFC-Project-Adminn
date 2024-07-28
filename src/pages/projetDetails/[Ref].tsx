import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text, Button, IconButton, List, ListItem, Flex } from '@chakra-ui/react';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

const ProjectDetails = () => {
  const router = useRouter();
  const { Ref } = router.query;
  const [project, setProject] = useState(null);

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

  return (
    <Flex p={4} bg="white" minH="100vh" alignItems="center">
      <Box p={4} bg="#e0f7fa" borderRadius="md" boxShadow="md" maxW="xl" mr={20} ml={60} position="relative">
        <IconButton
          icon={<AiFillEdit />}
          colorScheme="teal"
          position="absolute"
          top="10px"
          right="10px"
          size="sm"
          onClick={() => router.push(`/projetModification/${Ref}`)}
        />
        <Heading mb={4}>Détails du projet</Heading>
        {project ? (
          <>
            <Text mb={2}><strong>Référence du projet:</strong> #{project.Ref}</Text>
            <Text mb={2}><strong>Sujet:</strong> {project.Sujet}</Text>
            <Text mb={2}><strong>Description:</strong> {project.Description}</Text>
            <Text mb={2}><strong>Objectifs:</strong></Text>
            <List spacing={2} pl={4}>
              {project.Objectifs.map((objectif, index) => (
                <ListItem key={index}>- {objectif}</ListItem>
              ))}
            </List>
            <Text mb={2} mt={4}><strong>Prérequis:</strong></Text>
            <List spacing={2} pl={4}>
              {project.Prerequis.map((prerequi, index) => (
                <ListItem key={index}>- {prerequi}</ListItem>
              ))}
            </List>
          </>
        ) : (
          <Text>Chargement des détails du projet...</Text>
        )}
      </Box>
      <Box>
        <Link href={`/projetApplication/${project?.Ref}`} passHref>
          <Button colorScheme='green' mb={4}>Voir les applications</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default ProjectDetails;
