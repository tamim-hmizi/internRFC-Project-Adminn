import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Link, Input } from '@chakra-ui/react';
import NextLink from 'next/link';

export interface Application{
  id: string, 
  name: string,
  RefP: string
}
const ProjectApplications = () => {
  const router = useRouter();
  const { Ref } = router.query;
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (Ref) {
      const apiUrl = `/api/applications?Ref=${Ref}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => setApplications(data))
        .catch(error => console.error('Error fetching applications:', error));
    }
  }, [Ref]);

  const filteredApplications = applications.filter(application =>
    application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    application.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4}>
      <Heading mb={4}>Applications pour le projet #{Ref}</Heading>
      <Input
        placeholder="Rechercher par email ou nom"
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Mail</Th>
            <Th>Nom et prénom</Th>
            <Th>Référence du projet</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredApplications.map((application) => (
            <Tr key={application.id}>
              <Td>{application.id}</Td>
              <Td>{application.name}</Td>
              <Td>
                <NextLink href={`/projetDetails/${application.RefP}`} passHref>
                  <Link color="blue.500">{application.RefP}</Link>
                </NextLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectApplications;
