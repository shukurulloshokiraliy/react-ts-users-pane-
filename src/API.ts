// API.ts
import axios from 'axios';
import type { User, UsersResponse } from './types';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
});

const transformUser = (jsonUser: any): User => {
  const [firstName, ...lastNameParts] = jsonUser.name.split(' ');
  
  return {
    id: jsonUser.id,
    firstName: firstName || 'User',
    lastName: lastNameParts.join(' ') || 'Name',
    maidenName: '',
    age: 25 + (jsonUser.id % 40),
    gender: jsonUser.id % 2 === 0 ? 'male' : 'female',
    email: jsonUser.email,
    phone: jsonUser.phone,
    username: jsonUser.username,
    password: '',
    birthDate: '1990-01-01',
    image: `https://i.pravatar.cc/150?img=${jsonUser.id}`,
    bloodGroup: ['A+', 'B+', 'O+', 'AB+'][jsonUser.id % 4],
    height: 160 + (jsonUser.id % 30),
    weight: 60 + (jsonUser.id % 40),
    eyeColor: ['Blue', 'Brown', 'Green', 'Gray'][jsonUser.id % 4],
    hair: {
      color: ['Black', 'Brown', 'Blonde', 'Red'][jsonUser.id % 4],
      type: ['Straight', 'Curly', 'Wavy'][jsonUser.id % 3],
    },
    ip: '0.0.0.0',
    address: {
      address: jsonUser.address.street,
      city: jsonUser.address.city,
      state: jsonUser.address.suite,
      stateCode: jsonUser.address.zipcode.substring(0, 2),
      postalCode: jsonUser.address.zipcode,
      coordinates: {
        lat: parseFloat(jsonUser.address.geo.lat),
        lng: parseFloat(jsonUser.address.geo.lng),
      },
      country: 'USA',
    },
    macAddress: '',
    university: 'University of ' + jsonUser.address.city,
    bank: {
      cardExpire: '12/26',
      cardNumber: '****1234',
      cardType: 'Visa',
      currency: 'USD',
      iban: '',
    },
    company: {
      department: 'Engineering',
      name: jsonUser.company.name,
      title: 'Employee',
      address: {
        address: jsonUser.address.street,
        city: jsonUser.address.city,
        state: jsonUser.address.suite,
        stateCode: jsonUser.address.zipcode.substring(0, 2),
        postalCode: jsonUser.address.zipcode,
        coordinates: {
          lat: parseFloat(jsonUser.address.geo.lat),
          lng: parseFloat(jsonUser.address.geo.lng),
        },
        country: 'USA',
      },
    },
    ein: '',
    ssn: '',
    userAgent: '',
    crypto: { coin: 'Bitcoin', wallet: '', network: '' },
    role: 'user',
  };
};

export const fetchUsers = async (): Promise<UsersResponse> => {
  const { data } = await api.get('/users');
  const transformedUsers = data.map(transformUser);
  
  return {
    users: transformedUsers,
    total: transformedUsers.length,
    skip: 0,
    limit: transformedUsers.length,
  };
};

export const fetchUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return transformUser(data);
};