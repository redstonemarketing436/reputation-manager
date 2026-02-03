import { Property, Review, User } from './types';

export const MOCK_PROPERTIES: Property[] = [
    { id: 'prop-1', name: 'Sunset Apartments', address: '123 Sunset Blvd, CA' },
    { id: 'prop-2', name: 'Downtown Lofts', address: '456 Main St, NY' },
    { id: 'prop-3', name: 'Lakeside Villas', address: '789 Lake Dr, FL' },
];

export const MOCK_USERS: User[] = [
    {
        id: 'user-admin',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        assignedProperties: ['ALL'],
    },
    {
        id: 'user-manager',
        name: 'Manager User',
        email: 'manager@example.com',
        role: 'MANAGER',
        assignedProperties: ['prop-1', 'prop-2'],
    },
    {
        id: 'user-editor',
        name: 'Editor User',
        email: 'editor@example.com',
        role: 'EDITOR',
        assignedProperties: ['prop-1'],
    },
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'rev-1',
        propertyId: 'prop-1',
        author: 'John Doe',
        rating: 5,
        content: 'Amazing place to live! The amenities are top notch.',
        date: '2023-10-01T10:00:00Z',
        status: 'Replied',
    },
    {
        id: 'rev-2',
        propertyId: 'prop-1',
        author: 'Jane Smith',
        rating: 3,
        content: 'It is okay, but the noise level is high.',
        date: '2023-10-05T14:30:00Z',
        status: 'PENDING',
        isActionable: true,
        category: 'Maintenance'
    },
    {
        id: 'rev-3',
        propertyId: 'prop-2',
        author: 'Mike Johnson',
        rating: 4,
        content: 'Great location, close to everything.',
        date: '2023-10-10T09:15:00Z',
        status: 'Replied',
        isActionable: false,
    },
    {
        id: 'rev-4',
        propertyId: 'prop-3',
        author: 'Emily Davis',
        rating: 2,
        content: 'Management is unresponsive.',
        date: '2023-10-12T16:45:00Z',
        status: 'Flagged',
        isActionable: true,
        category: 'Staff'
    },
    {
        id: 'rev-5',
        propertyId: 'prop-1',
        author: 'Chris Wilson',
        rating: 5,
        content: 'Love the pool!',
        date: '2023-10-15T11:20:00Z',
        status: 'Replied',
        isActionable: false,
    },
];
