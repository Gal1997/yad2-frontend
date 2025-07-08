export default interface House {
    _id: string;
    ownerId: string;
    street: string;
    number: number;
    city: string;
    rooms: number;
    size: number;
    price: number;
    phoneNumber: string;
    datePosted: Date;
    description?: string;
    images: string[];
    type: string;
}