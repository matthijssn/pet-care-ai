import { Router, Request, Response } from 'express';
import { Pet } from '../models/pet.model';

const router = Router();

router.get('/health', (_, res) => res.json({ ok: true, service: 'pet-service' }));


// GET all pets for the authenticated user
router.get('/', async (req: Request & { user?: { sub: string } }, res: Response) => {
  try {
    const pets = await Pet.find({ ownerId: req.user!.sub })
      .select('-__v')
      .sort({ createdAt: -1 });
    return res.status(200).json(pets);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to fetch pets' });
  }
});

// GET a single pet by ID
router.get('/:petId', async (req: Request & { user?: { sub: string } }, res: Response) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.petId,
      ownerId: req.user!.sub
    }).select('-__v');
    if (!pet) {
      return res.status(404).send({ error: 'Pet not found' });
    }
    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to fetch pet' });
  }
});

// CREATE a new pet
router.post('/', async (req: Request & { user?: { sub: string } }, res: Response) => {
  try {
    const { name, species, breed, birthday, weightKg, color, notes } = req.body;
    if (!name || !species) {
      return res.status(400).send({ error: 'Name and species are required' });
    }
    const newPet = new Pet({
      ownerId: req.user!.sub,
      name,
      species: species.toLowerCase(),
      breed,
      birthday,
      weightKg,
      color,
      notes
    });
    const savedPet = await newPet.save();
    return res.status(201).json(savedPet);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to create pet' });
  }
});

// UPDATE an existing pet
router.put('/:petId', async (req: Request & { user?: { sub: string } }, res: Response) => {
  try {
    const { name, species, breed, birthday, weightKg, color, notes } = req.body;
    const pet = await Pet.findOne({
      _id: req.params.petId,
      ownerId: req.user!.sub
    });
    if (!pet) {
      return res.status(404).send({ error: 'Pet not found' });
    }
    if (name) pet.name = name;
    if (species) pet.species = species.toLowerCase();
    if (breed) pet.breed = breed;
    if (birthday) pet.birthday = birthday;
    if (weightKg !== undefined) pet.weightKg = weightKg;
    if (color) pet.color = color;
    if (notes) pet.notes = notes;
    pet.updatedAt = new Date();
    const updatedPet = await pet.save();
    return res.status(200).json(updatedPet);
  } catch (error) {
    return res.status(500).send({ error: 'Failed to update pet' });
  }
});

// DELETE a pet
router.delete('/:petId', async (req: Request & { user?: { sub: string } }, res: Response) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.petId,
      ownerId: req.user!.sub
    });
    if (!pet) {
      return res.status(404).send({ error: 'Pet not found' });
    }
    return res.status(200).json({ message: 'Pet deleted successfully', petId: req.params.petId });
  } catch (error) {
    return res.status(500).send({ error: 'Failed to delete pet' });
  }
});

export default router;
