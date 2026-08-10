interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

const users: User[] = [];

export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

export const createUser = (
  name: string,
  email: string,
  passwordHash: string
) => {
  const user = {
    id: users.length + 1,
    name,
    email,
    passwordHash
  };

  users.push(user);

  return user;
};