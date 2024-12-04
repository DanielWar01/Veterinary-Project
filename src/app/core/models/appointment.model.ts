import { Pet } from "./pet.model";

export interface Appointment {
    _id?: string;
    pet_id: {
        name: string;
    }; 
    date_time: string; 
    reason: string; 
    status: 'scheduled' | 'completed' | 'cancelled'; 
    notes?: string;
}