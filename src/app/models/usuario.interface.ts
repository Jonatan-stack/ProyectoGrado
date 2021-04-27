
export type Roles = 'Alumno' | 'Profesor' | 'ADMIN';

export interface Usuario {
  email: string;
  displayName?: string;
  emailVerified: boolean;
  password?: string;
  role?: string;
  dni?: string;
  telefono?: number;
  clases?: {};
  uid: string;
}