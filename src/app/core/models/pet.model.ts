export interface Pet {
    _id?: string
    name: string
    species: string
    race: string
    date_of_birth: Date
    appointments?: String[];
}