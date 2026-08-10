interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

const users: User[] = [];

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  return users.find((user) => user.email === email);
};

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  const user = {
    id: users.length + 1,
    name,
    email,
    passwordHash
  };

  users.push(user);

  return user;
};