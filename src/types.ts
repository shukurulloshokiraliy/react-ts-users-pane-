// types.ts
export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UsersResponse {
  users: User[];
  total: number;
}