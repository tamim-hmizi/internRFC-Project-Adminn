
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { Ref, Domaine, Sujet, Description, Prerequis, Objectifs } = req.body;
    if (!Ref || !Domaine || !Sujet || !Description || !Prerequis || !Objectifs) {
      return res.status(400).json({ message: 'Tous les champs sont requis et doivent être remplis.' });
    }
    // Filtrer les valeurs vides des tableaux Prerequis et Objectifs
    const filteredPrerequis = Prerequis.filter(prerequi => prerequi.trim() !== '');
    const filteredObjectifs = Objectifs.filter(objectif => objectif.trim() !== '');

    const params = {
      TableName: 'PFEProjects',
      Item: {
        Ref,
        Domaine,
        Sujet,
        Description,
        Prerequis: filteredPrerequis,
        Objectifs: filteredObjectifs 
      }
    };

    try {
      await dynamoDb.put(params).promise();
      res.status(200).json({ message: 'Projet ajouté avec succès' });
    } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du projet' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
