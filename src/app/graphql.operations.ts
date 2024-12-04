import { gql } from 'apollo-angular';

// Consultas para obtener datos
export const GET_OWNERS = gql`
  query GetOwners {
    getOwners {
      _id
      name
      gender
      phone
      email
      pets {
        name
      }
    }
  }
`;

export const GET_OWNER_BY_ID = gql`
  query GetOwnerById($id: ID!) {
    getOwnerById(_id: $id) {
      _id
      name
      gender
      phone
      email
      pets {
        _id
        name
        species
      }
    }
  }
`;

export const GET_PETS = gql`
  query GetPets {
    getPets {
      _id
      name
      species
      race
      date_of_birth
      appointments {
        _id
        date_time
        reason
      }
    }
  }
`;

export const GET_PET_BY_ID = gql`
  query GetPetById($id: ID!) {
    getPetById(_id: $id) {
      _id
      name
      species
      race
      date_of_birth
      appointments {
        _id
        date_time
        reason
      }
    }
  }
`;

export const GET_APPOINTMENTS = gql`
  query GetAppointments {
    getAppointments {
      _id
      date_time
      reason
      status
      notes
      pet_id{
        name
      }
    }
  }
`;

export const GET_APPOINTMENT_BY_ID = gql`
  query GetAppointmentById($id: ID!) {
    getAppointmentById(_id: $id) {
      _id
      date_time
      reason
      status
      notes
    }
  }
`;

// Mutaciones para modificar datos
export const CREATE_OWNER = gql`
  mutation CreateOwner($name: String!, $gender: String!, $phone: Int!, $email: String!) {
    createOwner(name: $name, gender: $gender, phone: $phone, email: $email) {
      _id
      name
      gender
      phone
      email
    }
  }
`;

export const CREATE_PET = gql`
  mutation CreatePet($name: String!, $species: String!, $race: String!, $date_of_birth: String!) {
    createPet(name: $name, species: $species, race: $race, date_of_birth: $date_of_birth) {
      _id
      name
      species
      race
      date_of_birth
    }
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($pet_id: ID!, $date_time: String!, $reason: String!) {
    createAppointment(pet_id: $pet_id, date_time: $date_time, reason: $reason) {
      _id
      date_time
      reason
    }
  }
`;

export const UPDATE_OWNER = gql`
  mutation UpdateOwner(
    $id: ID!, $name: String, $phone: Int, $email: String, $pets: [ID]
  ) {
    updateOwner(_id: $id, name: $name, phone: $phone, email: $email, pets: $pets) {
      _id
      name
      gender
      phone
      email
    }
  }
`;

export const UPDATE_PET = gql`
  mutation UpdatePet(
    $id: ID!, $name: String, $species: String, $race: String, $date_of_birth: String
  ) {
    updatePet(_id: $id, name: $name, species: $species, race: $race, date_of_birth: $date_of_birth) {
      _id
      name
      species
      race
      date_of_birth
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment(
    $id: ID!, $date_time: String, $reason: String, $status: String, $notes: String
  ) {
    updateAppointment(
      _id: $id, date_time: $date_time, reason: $reason, status: $status, notes: $notes
    ) {
      _id
      date_time
      reason
      status
      notes
    }
  }
`;

export const DELETE_OWNER_BY_ID = gql`
  mutation DeleteOwnerById($id: ID!) {
    deleteOwnerById(_id: $id) {
      message
      success
    }
  }
`;

export const DELETE_PET_BY_ID = gql`
  mutation DeletePetById($id: ID!) {
    deletePetById(_id: $id) {
      message
      success
    }
  }
`;

export const DELETE_APPOINTMENT_BY_ID = gql`
  mutation DeleteAppointmentById($id: ID!) {
    deleteAppointmentById(_id: $id) {
      message
      success
    }
  }
`;
