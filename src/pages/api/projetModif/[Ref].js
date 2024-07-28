// src/pages/api/projetModif/[Ref].js
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export default async function handler(req, res) {
  const { Ref } = req.query;

  if (req.method === 'GET') {
    try {
      const getParams = {
        TableName: 'PFEProjects',
        Key: marshall({ Ref })
      };

      const { Item } = await client.send(new GetItemCommand(getParams));
      const project = unmarshall(Item);

      // Convert Prerequis set string to array if necessary
      if (project.Prerequis && typeof project.Prerequis === 'object' && !Array.isArray(project.Prerequis)) {
        project.Prerequis = Array.from(project.Prerequis);
      }
       // Convert Prerequis set string to array if necessary
       if (project.Objectifs && typeof project.Objectifs === 'object' && !Array.isArray(project.Objectifs)) {
        project.Objectifs = Array.from(project.Objectifs);
      }

      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    const { Sujet, Description, Prerequis, Objectifs } = req.body;

    const updateParams = {
      TableName: 'PFEProjects',
      Key: marshall({ Ref }),
      UpdateExpression: 'SET Sujet = :s, Description = :d, Prerequis = :p, Objectifs = :o',
      ExpressionAttributeValues: marshall({
        ':s': Sujet,
        ':d': Description,
        ':p': new Set(Prerequis),
        ':o': new Set(Objectifs)
      })
    };

    try {
      await client.send(new UpdateItemCommand(updateParams));
      res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
