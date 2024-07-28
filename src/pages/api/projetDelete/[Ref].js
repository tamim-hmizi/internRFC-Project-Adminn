import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { Ref } = req.query;

    const params = {
      TableName: 'PFEProjects',
      Key: {
        Ref: Ref,
      },
    };

    try {
      await dynamoDB.delete(params).promise();
      res.status(200).json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
