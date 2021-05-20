export interface Mail {
    from: string;                   //nombre del profesor del que viene el mail
    emailDestinatario: string;      //email del alumno
    asunto: string;                 //nombre de la asignatura
    mensaje: string;                //nombre del alumno + la fecha + el nombre de la asignatura
    archivo?: File;
  }