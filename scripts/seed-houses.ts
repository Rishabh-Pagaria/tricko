import { addDoc, collection } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

const dummyHouses = [
  {
    title: "Kyle Field House",
    lat: 30.6102,
    lng: -96.3398,
    isActive: true,
    description: "Near Kyle Field Stadium",
    treatsAvailable: "Candy bars and chips",
    trickPersona: "Spooky Mascot",
    ownerUid: "FHLRW7Q6EKbnvVaqaRbFQp4s5cE3", // Using the same ownerUid as your example
    createdAt: Date.now()
  },
  {
    title: "Academic Plaza Haunted Spot",
    lat: 30.6168,
    lng: -96.3417,
    isActive: true,
    description: "By the Academic Plaza",
    treatsAvailable: "Halloween candy mix",
    trickPersona: "Century Tree Spirit",
    ownerUid: "FHLRW7Q6EKbnvVaqaRbFQp4s5cE3",
    createdAt: Date.now()
  },
  {
    title: "Northgate Treats",
    lat: 30.6227,
    lng: -96.3453,
    isActive: true,
    description: "Near Northgate district",
    treatsAvailable: "Premium chocolate bars",
    trickPersona: "Mysterious Merchant",
    ownerUid: "FHLRW7Q6EKbnvVaqaRbFQp4s5cE3",
    createdAt: Date.now()
  },
  {
    title: "MSC Spooky Spot",
    lat: 30.6124,
    lng: -96.3415,
    isActive: true,
    description: "By Memorial Student Center",
    treatsAvailable: "Full-size candy bars",
    trickPersona: "Reveille's Ghost",
    ownerUid: "FHLRW7Q6EKbnvVaqaRbFQp4s5cE3",
    createdAt: Date.now()
  }
];

async function seedHouses() {
  try {
    for (const house of dummyHouses) {
      await addDoc(collection(db, 'houses'), house);
      console.log(`Added house: ${house.title}`);
    }
    console.log('Successfully added all dummy houses!');
  } catch (error) {
    console.error('Error seeding houses:', error);
  }
}

seedHouses();