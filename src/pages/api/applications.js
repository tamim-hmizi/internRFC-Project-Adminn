import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default async function handler(req, res) {
  const { Ref } = req.query;

  if (!Ref) {
    return res.status(400).json({ error: 'Référence de projet requise' });
  }

  const params = {
    TableName: 'WorkDemand',
    FilterExpression: 'RefP = :ref',
    ExpressionAttributeValues: {
      ':ref': Ref,
    },
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des applications' });
  }
}
