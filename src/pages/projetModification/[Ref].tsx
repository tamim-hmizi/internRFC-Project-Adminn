// src/pages/projetModification/[Ref].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, IconButton, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Link from 'next/link';
export interface Projet{
  Sujet: string; 
  Ref: string; 
  Domaine: string; 
  Description: string;
  Objectifs: string[];
  Prerequis: string[];
}
const prefixMap = {
  'Data center & Cloud formation': 'DS',
  'Network & Security': 'NS',
  'Business Application': 'BA',
  'Identity & Modern Workplace': 'IN',
};

function ProjetModification() {
  const router = useRouter();
  const { Ref } = router.query;

  const [project, setProject] = useState<Projet | undefined>(undefined);
  const [Sujet, setSujet] = useState('');
  const [Description, setDescription] = useState('');
  const [Objectifs, setObjectifs] = useState<string[]>([]);
 const [Prerequis, setPrerequis] = useState<string[]>([]);

  useEffect(() => {
    if (Ref) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projetModif/${Ref}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProject(data);
          setSujet(data.Sujet);
          setDescription(data.Description);
          setObjectifs(data.Objectifs);
          setPrerequis(Array.isArray(data.Prerequis) ? data.Prerequis : Array.from(data.Prerequis));
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };

      fetchProject();
    }
  }, [Ref]);

  const handlePrerequisChange = (index:number, value:string) => {
    const newPrerequis = [...Prerequis];
    newPrerequis[index] = value;
    setPrerequis(newPrerequis);
  };

  const handleObjectifsChange = (index:number, value:string) => {
    const newObjectifs = [...Objectifs];
    newObjectifs[index] = value;
    setObjectifs(newObjectifs);
  };

  const handleAddPrerequis = () => {
    setPrerequis([...Prerequis, '']);
  };

  const handleAddObjectifs = () => {
    setObjectifs([...Objectifs, '']);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/projetModif/${Ref}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Sujet, Description, Prerequis, Objectifs }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du projet');
      }

      const result = await response.json();
      console.log(result.message);
      router.push('/');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Box maxW='3xl' w='full' mx='auto' borderWidth='3px' borderRadius='lg' p={8}>
      <form onSubmit={handleSubmit}>
        <FormControl id='Ref' isRequired>
          <FormLabel>Référence</FormLabel>
          <Input type='text' value={Ref} readOnly />
        </FormControl>

        <FormControl id='Domaine' isRequired mt={4}>
          <FormLabel>Domaine</FormLabel>
          <Input type='text' value={project?.Domaine || ''} readOnly />
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
    </Box>
  );
}

export default ProjetModification;
