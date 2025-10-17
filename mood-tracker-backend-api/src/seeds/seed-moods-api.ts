import axios from 'axios';
import { faker } from '@faker-js/faker';
import { State } from '../modules/v1/moods/enums/state.enum';
import { ActivityEnum } from '../modules/v1/activities/enums/activity.enum';

const API_URL = 'http://localhost:3000/api/v1/moods';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imt5YWIiLCJzdWIiOiIzYjAwM2IzYy01OWI2LTRiZDktOGI2OC1kYTIxOTI3MjcwYzMiLCJpYXQiOjE3NjA2OTU4MTYsImV4cCI6MTc2MDc4MjIxNn0.iY2bRXJEZMptooNXv3UFHf025yNJDJPi_qldu1LN0Vc'; // Remplace par ton JWT

const states = Object.values(State);
const activitiesList = Object.values(ActivityEnum);

// Définir la plage de dates
const startDate = new Date('2025-07-01');
const endDate = new Date('2025-10-17');

async function seedMoods() {
    for (let i = 0; i < 50; i++) {
        // Générer une date aléatoire dans la plage spécifiée
        const date = faker.date.between({ from: startDate, to: endDate });
        const dateStr = date.toISOString().split('T')[0];

        // Choisir un état aléatoire
        const state = faker.helpers.arrayElement(states);

        // Description optionnelle
        const description = faker.datatype.boolean() ? faker.lorem.sentence() : undefined;

        // 0 à 3 activités aléatoires
        const activitiesCount = faker.number.int({ min: 0, max: 3 });
        const activities = activitiesCount > 0
            ? faker.helpers.arrayElements(activitiesList, activitiesCount)
            : undefined;

        // Construire le payload
        const payload: any = { date: dateStr, state };
        if (description) payload.description = description;
        if (activities) payload.activities = activities;

        try {
            const response = await axios.post(API_URL, payload, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Mood ${i + 1} créé :`, response.data.mood.id);
        } catch (error: any) {
            console.error(`Erreur création mood ${i + 1}:`, error.response?.data || error.message);
        }
    }
}

seedMoods();
