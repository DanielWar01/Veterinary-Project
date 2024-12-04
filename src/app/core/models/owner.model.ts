import { Pet } from "./pet.model"

export interface Owner{
    _id?: string
    name: string
    gender: string
    phone: number
    email: string
    pets: Pet[]
}