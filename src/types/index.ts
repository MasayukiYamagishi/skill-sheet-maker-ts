// Common type definitions

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description?: string;
}

export interface Qualification {
  id: string;
  name: string;
  organization: string;
  obtainedAt: Date;
  description?: string;
}

export interface MBTIResult {
  id: string;
  userId: string;
  type: string;
  description: string;
  createdAt: Date;
}

export interface CareerHistory {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}