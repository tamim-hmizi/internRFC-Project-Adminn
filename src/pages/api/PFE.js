import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export default async function handler(req, res) {
  const { Domaine } = req.query;

  console.log('Received Domaine:', Domaine); // Log du paramètre reçu

  const params = {
    TableName: 'PFEProjects',
    FilterExpression: 'Domaine = :Domaine',
    ExpressionAttributeValues: {
      ':Domaine': Domaine,
    },
  };

  console.log('DynamoDB scan params:', params); // Log des paramètres du scan

  try {
    const data = await dynamoDB.scan(params).promise();
    console.log('DynamoDB scan result:', data); // Log des résultats de la requête
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching data:', error); // Log de l'erreur
    res.status(500).json({ error: 'Error fetching data' });
  }
}
