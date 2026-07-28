import { Listing } from "@/types/listing";

export const mockListings: Listing[] = [
  {
    id: 1,
    title: "Modern Apartment in Westlands",
    location: "Westlands, Nairobi",
    monthlyRent: 45000,
    bedrooms: 2,
    bathrooms: 2,
    description:
      "A modern two-bedroom apartment close to shops, offices, and restaurants.",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    amenities: ["Parking", "Security", "Gym"],
  },
  {
    id: 2,
    title: "Family House in Kikuyu",
    location: "Kikuyu, Kiambu",
    monthlyRent: 60000,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "Spacious family home with a private compound and secure parking.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    amenities: ["Parking", "Garden", "Security"],
  },
];