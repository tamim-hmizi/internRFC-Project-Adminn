import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Link from 'next/link';

type DomaineType = 'Data center & Cloud formation' | 'Network & Security' | 'Business Application' | 'Identity & Modern Workplace';

const prefixMap: Record<DomaineType, string> = {
  'Data center & Cloud formation': 'DS',
  'Network & Security': 'NS',
  'Business Application': 'BA',
  'Identity & Modern Workplace': 'IN',
};

function NewProjet() {
  const router = useRouter();
  const { Domaine } = router.query;

  const [Ref, setRef] = useState('#');
  const [Sujet, setSujet] = useState('');
  const [Description, setDescription] = useState('');
  const [Objectifs, setObjectifs] = useState(['']);
  const [Prerequis, setPrerequis] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof Domaine === 'string') {
      const prefix = prefixMap[Domaine as DomaineType];
      if (prefix) {
        setRef(`#${prefix}`);
      } 
    }
  }, [Domaine]);
  

  const handleAddPrerequis = () => {
    setPrerequis([...Prerequis, '']);
  };

  const handlePrerequisChange = (index: number, value: string) => {
    const newPrerequis = [...Prerequis];
    newPrerequis[index] = value;
    setPrerequis(newPrerequis);
  };

  const handleAddObjectifs = () => {
    setObjectifs([...Objectifs, '']);
  };

  const handleObjectifsChange = (index: number, value: string) => {
    const newObjectifs = [...Objectifs];
    newObjectifs[index] = value;
    setObjectifs(newObjectifs);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/newProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Ref, Domaine, Sujet, Description, Prerequis, Objectifs }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du projet');
      }

      const result = await response.json();
      console.log(result.message); 
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Box maxW='3xl' w='full' mx='auto' borderWidth='3px' borderRadius='lg' p={8}>
      <form onSubmit={handleSubmit}>
        <FormControl id='Ref' isRequired>
          <FormLabel>Référence</FormLabel>
          <Box display="flex">
            <Input type='text' value={Ref} readOnly w="auto" />
            <Input 
              type='text' 
              placeholder='0000'
              maxLength={4}
              w="full"
              //value={Ref.slice(3)}
              onChange={(e) => setRef(`${prefixMap[Domaine as DomaineType] || ''}${e.target.value}`)}

            />
          </Box>
        </FormControl>
        
        <FormControl id='Domaine' isRequired mt={4}>
          <FormLabel>Domaine</FormLabel>
          <Input type='text' value={Domaine || ''} readOnly />
        </FormControl>

        <FormControl id='Sujet' isRequired mt={4}>
          <FormLabel>Sujet</FormLabel>
          <Input type='text' value={Sujet} onChange={(e) => setSujet(e.target.value)} />
        </FormControl>

        <FormControl id='Description' isRequired mt={4}>
          <FormLabel>Description</FormLabel>
          <Textarea value={Description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>

        <FormControl id='Prerequis' mt={4}>
          <FormLabel>Prérequis</FormLabel>
          {Prerequis.map((prerequi, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <Input 
                type='text'
                value={prerequi || ''}
                onChange={(e) => handlePrerequisChange(index, e.target.value)}
                placeholder={`Prérequis ${index + 1}`}
                flex="1"
              />
              {index === Prerequis.length - 1 && (
                <IconButton
                  aria-label="Ajouter un prérequis"
                  icon={<AddIcon />}
                  ml={2}
                  onClick={handleAddPrerequis}
                />
              )}
            </Box>
          ))}
        </FormControl>

        <FormControl id='Objectifs' isRequired mt={4}>
          <FormLabel>Objectifs</FormLabel>
          {Objectifs.map((objectif, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              <Input 
                type='text'
                value={objectif || ''}
                onChange={(e) => handleObjectifsChange(index, e.target.value)}
                placeholder={`Objectif ${index + 1}`}
                flex="1"
              />
              {index === Objectifs.length - 1 && (
                <IconButton 
                  aria-label='Ajouter un objectif'
                  icon={<AddIcon />}
                  ml={2}
                  onClick={handleAddObjectifs}
                />
              )}
            </Box>
          ))}
        </FormControl>

        <Button mt={4} colorScheme='teal' type='submit'>
          Soumettre
        </Button>
      </form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajout avec succès</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Le projet a été ajouté avec succès !</p>
          </ModalBody>
          <ModalFooter>
            <Link href="/">
              <Button colorScheme="teal" mr={3}>
                OK
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default NewProjet;
