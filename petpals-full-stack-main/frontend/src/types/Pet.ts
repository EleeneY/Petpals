export type PetType = 'Cat' | 'Dog';
export type PetStatus = 'matched' | 'pending';

export interface PetData {
    picture: string;
    name: string;
    petId: string;
    type: PetType;
    age: number;
    gender: string;
    primaryBreed: string;
    healthCondition: string;
    fosterStartDate: string;
    fosterDuration: number;
    phoneNumber: string;
    pickupLocation: string;
    status: PetStatus;
    ownerId: string;
}