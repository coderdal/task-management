export type User = {
  id: string;
  username: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'incomplete' | 'completed';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignedUser: {
    id: string;
    username: string;
  };
  creator: {
    id: string;
    username: string;
  };
};

export type LoginCredentials = {
  tcid: string;
  password: string;
};

export type SignupCredentials = {
  username: string;
  tcid: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  status: 'incomplete' | 'completed';
  assignedTo: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type ApiError = {
  message: string;
}; 