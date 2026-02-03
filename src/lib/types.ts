export type Role = 'ADMIN' | 'MANAGER' | 'EDITOR';

export interface Property {
  id: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  // If empty or contains 'ALL', user has access to all properties
  assignedProperties: string[];
}

export type ReviewStatus = 'PENDING' | 'Replied' | 'Flagged';

export interface Review {
  id: string;
  propertyId: string;
  author: string;
  rating: number;
  content: string;
  date: string; // ISO date string
  status: ReviewStatus;
  isActionable?: boolean;
  category?: 'Maintenance' | 'Staff' | 'Cleanliness' | 'Amenities' | 'Other';
}
