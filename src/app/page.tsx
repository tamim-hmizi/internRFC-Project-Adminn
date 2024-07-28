"use client";
import { useState, useEffect } from 'react';
import { Stack, Button, Box, Image, Flex, SimpleGrid, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon, CloseIcon } from "@chakra-ui/icons";
import BeatLoader from 'react-spinners/BeatLoader';
import Link from 'next/link';

function ProjectCard({ project, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const property = {
    imageUrl: '/images/ProjectLOGO2.png',
    imageAlt: 'LOGO project'
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projetDelete/${project.Ref}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }

      onDelete(project.Ref);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Box maxW='xs' borderWidth='1px' borderRadius='lg' overflow='hidden' mb={4} position="relative">
      <IconButton
        icon={<CloseIcon />}
        aria-label="Supprimer"
        size="sm"
        colorScheme="red"
        position="absolute"
        top={2}
        left={2}
        variant="outline"
        onClick={onOpen}
      />
      <Image 
        src={property.imageUrl} 
        alt={property.imageAlt} 
        boxSize="200px" 
        objectFit="contain" 
        display="block" 
        margin="0 auto"
        mb={2}
      />
      
      <Box p='4'>
        <Box
          mt='0'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
          fontSize="small"
        >
          #{project.Ref}
        </Box>
        <Box
          mt='0'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={3}
          fontSize="small"
        >
          {project.Sujet}
        </Box>
        <Box>
          <Flex direction="row" justify="space-between" mt={2}>
            <Link href={`/projetApplication/${project.Ref}`} passHref>
              <Button colorScheme='green' size='sm'>Voir les applications</Button>
            </Link>
            <Link href={`/projetDetails/${project.Ref}`} passHref>
              <Button colorScheme='red' size='sm'>Voir les détails</Button>
            </Link>
          </Flex>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmer la suppression</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer ce projet ?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete} isLoading={isDeleting}>
              Supprimer
            </Button>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDomaine) {
      setLoading(true); 
      fetch(`/api/PFE?Domaine=${encodeURIComponent(selectedDomaine)}`)
        .then(response => response.json())
        .then(data => {
          setProjects(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
          setLoading(false);
        });
    }
  }, [selectedDomaine]);

  const handleButtonClick = (domaine) => {
    setSelectedDomaine(domaine);
  };

  const handleDelete = (projectRef) => {
    setProjects(prevProjects => prevProjects.filter(project => project.Ref !== projectRef));
  };

  return (
    <Flex direction="column" align="center" justify="center" height="100vh" width="100vw" p={4}>
      <Stack spacing={4} align='center' mb={4}>
        <Button rightIcon={<ChevronDownIcon />} colorScheme='teal' variant='outline' onClick={() => handleButtonClick('Data center & Cloud formation')}>
          Data center & Cloud formation
        </Button>
        {selectedDomaine === 'Data center & Cloud formation' && (
          <Box mt={4} width="full" p={4} borderWidth='1px' borderRadius='md'>
            {loading ? (
              <Flex justify="center" align="center" height="100px">
                <BeatLoader size={15} color='teal' />
              </Flex>
            ) : (
              projects.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} justify="center">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} onDelete={handleDelete} />
                  ))}
                </SimpleGrid>
              ) : (
                <p>Aucun projet disponible pour ce domaine.</p>
              )
            )}
            <Link href={`/NewProjet/page?Domaine=${encodeURIComponent(selectedDomaine)}`} passHref>
              <Button
                borderColor='teal'
                borderWidth='2px'
                borderStyle='dashed'
                color='teal'
                variant='outline'
                fontWeight='bold'
                size='md'
                leftIcon={<AddIcon />}
                _hover={{ bg: 'blue.50' }}
                _active={{ bg: 'blue.100' }}
              >
                Ajouter
              </Button>
            </Link>
          </Box>
        )}

        <Button rightIcon={<ChevronDownIcon />} colorScheme='teal' variant='outline' onClick={() => handleButtonClick('Network & Security')}>
          Network & Security
        </Button>
        {selectedDomaine === 'Network & Security' && (
          <Box mt={4} width="full" p={4} borderWidth='1px' borderRadius='md'>
            {loading ? (
              <Flex justify="center" align="center" height="100px">
                <BeatLoader size={15} color='teal' />
              </Flex>
            ) : (
              projects.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} justify="center">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} onDelete={handleDelete} />
                  ))}
                </SimpleGrid>
              ) : (
                <p>Aucun projet disponible pour ce domaine.</p>
              )
            )}
            <Link href={`/NewProjet/page?Domaine=${encodeURIComponent(selectedDomaine)}`} passHref>
              <Button
                borderColor='teal'
                borderWidth='2px'
                borderStyle='dashed'
                color='teal'
                variant='outline'
                fontWeight='bold'
                size='md'
                leftIcon={<AddIcon />}
                _hover={{ bg: 'blue.50' }}
                _active={{ bg: 'blue.100' }}
              >
                Ajouter
              </Button>
            </Link>
          </Box>
        )}

        <Button rightIcon={<ChevronDownIcon />} colorScheme='teal' variant='outline' onClick={() => handleButtonClick('Business Application')}>
          Business application
        </Button>
        {selectedDomaine === 'Business Application' && (
          <Box mt={4} width="full" p={4} borderWidth='1px' borderRadius='md'>
            {loading ? (
              <Flex justify="center" align="center" height="100px">
                <BeatLoader size={15} color='teal' />
              </Flex>
            ) : (
              projects.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} justify="center">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} onDelete={handleDelete} />
                  ))}
                </SimpleGrid>
              ) : (
                <p>Aucun projet disponible pour ce domaine.</p>
              )
            )}
            <Link href={`/NewProjet/page?Domaine=${encodeURIComponent(selectedDomaine)}`} passHref>
              <Button
                borderColor='teal'
                borderWidth='2px'
                borderStyle='dashed'
                color='teal'
                variant='outline'
                fontWeight='bold'
                size='md'
                leftIcon={<AddIcon />}
                _hover={{ bg: 'blue.50' }}
                _active={{ bg: 'blue.100' }}
              >
                Ajouter
              </Button>
            </Link>
          </Box>
        )}

        <Button rightIcon={<ChevronDownIcon />} colorScheme='teal' variant='outline' onClick={() => handleButtonClick('Identity & Modern Workplace')}>
          Identity & Modern Workplace
        </Button>
        {selectedDomaine === 'Identity & Modern Workplace' && (
          <Box mt={4} width="full" p={4} borderWidth='1px' borderRadius='md'>
            {loading ? (
              <Flex justify="center" align="center" height="100px">
                <BeatLoader size={15} color='teal' />
              </Flex>
            ) : (
              projects.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} justify="center">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} onDelete={handleDelete} />
                  ))}
                </SimpleGrid>
              ) : (
                <p>Aucun projet disponible pour ce domaine.</p>
              )
            )}
            <Link href={`/NewProjet/page?Domaine=${encodeURIComponent(selectedDomaine)}`} passHref>
              <Button
                borderColor='teal'
                borderWidth='2px'
                borderStyle='dashed'
                color='teal'
                variant='outline'
                fontWeight='bold'
                size='md'
                leftIcon={<AddIcon />}
                _hover={{ bg: 'blue.50' }}
                _active={{ bg: 'blue.100' }}
              >
                Ajouter
              </Button>
            </Link>
          </Box>
        )}
      </Stack>
    </Flex>
  );
}

export default Home;
