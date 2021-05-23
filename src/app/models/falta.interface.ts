export interface Falta{
    id: string,
    profesor: string;
    alumno: string;
    alumnoUID: string;         //aqui se guarda el UID del alumno no el Nombre
    profesorUID: string;
    asignatura: string;
    fecha: string;
    mailProfesor: string;
    justificada?: boolean;
}