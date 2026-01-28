export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface Technology {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  url: string | null;
  githubUrl: string | null;
  imageUrls: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  Technologies?: Technology[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string | null;
  linkedIn: string | null;
  github: string | null;
  photoId: string | null;
  createdAt: string;
  updatedAt: string;
  photo?: Photo | null;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
