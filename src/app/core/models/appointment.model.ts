export interface Appointment {
    _id?: string;
    pet_id: string; 
    date_time: string; 
    reason: string; 
    status: 'scheduled' | 'completed' | 'cancelled'; 
    notes?: string;
}