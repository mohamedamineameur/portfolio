export interface User {
  id: number;
  email: string;
  role?: string;
}

export interface Technology {
  id: number;
  name: string;
  icon: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  url: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  Technologies?: Technology[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
