// API.ts
import type { User, UsersResponse, TodosResponse } from './types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';


const fetchWithTimeout = async (url: string, timeout: number = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};


const fetchAPI = async (url: string, retries: number = 2): Promise<Response> => {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`HTTP xatolik: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Noma\'lum xatolik');
      
      if (i === retries) {
        throw lastError;
      }

      const delay = Math.min(1000 * Math.pow(2, i), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Fetch muvaffaqiyatsiz');
};


const transformUser = (jsonUser: any): User => {
  const nameParts = jsonUser.name.split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || 'Name';

  return {
    id: jsonUser.id,
    firstName: firstName,
    lastName: lastName,
    maidenName: '',
    age: 25 + (jsonUser.id % 40), // Mock age
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
    crypto: {
      coin: 'Bitcoin',
      wallet: '',
      network: '',
    },
    role: 'user',
  };
};

export const fetchUsers = async (
  limit: number = 100,
  skip: number = 0
): Promise<UsersResponse> => {
  const response = await fetchAPI(`${BASE_URL}/users`);
  const data = await response.json();
  const transformedUsers = data.map(transformUser);
  
  return {
    users: transformedUsers,
    total: transformedUsers.length,
    skip: 0,
    limit: transformedUsers.length,
  };
};


export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetchAPI(`${BASE_URL}/users/${id}`);
  const data = await response.json();
  return transformUser(data);
};


export const searchUsers = async (query: string): Promise<UsersResponse> => {
  const response = await fetchAPI(`${BASE_URL}/users`);
  const data = await response.json();
  const filtered = data.filter((user: any) =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );
  const transformedUsers = filtered.map(transformUser);
  
  return {
    users: transformedUsers,
    total: transformedUsers.length,
    skip: 0,
    limit: transformedUsers.length,
  };
};


export const fetchUserTodos = async (userId: number): Promise<TodosResponse> => {
  const response = await fetchAPI(`${BASE_URL}/users/${userId}/todos`);
  const data = await response.json();
  const transformedTodos = data.map((todo: any) => ({
    id: todo.id,
    todo: todo.title,
    completed: todo.completed,
    userId: todo.userId,
  }));
  
  return {
    todos: transformedTodos,
    total: transformedTodos.length,
    skip: 0,
    limit: transformedTodos.length,
  };
};


export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const getUserFullAddress = (user: User): string => {
  const { address, city, state, postalCode, country } = user.address;
  return `${address}, ${city}, ${state} ${postalCode}, ${country}`;
};

export const formatUserData = (user: User) => {
  return {
    id: user.id,
    ism: getUserFullName(user),
    yosh: user.age,
    email: user.email,
    telefon: user.phone,
    manzil: getUserFullAddress(user),
    jins: user.gender === 'male' ? 'Erkak' : 'Ayol',
    tug_kun: new Date(user.birthDate).toLocaleDateString('uz-UZ'),
    soch: `${user.hair.color} (${user.hair.type})`,
    qonGuruhi: user.bloodGroup,
    kompaniya: user.company.name,
    lavozim: user.company.title,
    universitet: user.university,
  };
};