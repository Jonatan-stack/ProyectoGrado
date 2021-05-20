import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { BbbddService } from '../../servicios/bbbdd.service';
import { MailerService } from '../../servicios/mailer.service';

import { Usuario } from '../../models/usuario.interface';
import { Mail } from '../../models/mail.interface';
import { Falta } from '../../models/falta.interface';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  filterAsignatura = '';
  filterCurso = '';

  public profesor: Usuario;

  public alumnos = [];
  public asignaturasProfesor = [];
  public clases = [];

  public selectClase = '';
  public selectCurso = '';

  constructor(private bbdd: BbbddService, private mailer: MailerService) { }

  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.obtenerProfesor(a.uid);
      }
    });

    this.obtenerUsuarioAsignatura();
    this.obtenerClases();
  }

  public async obtenerProfesor(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      this.profesor = usuario;
      this.asignaturasProfesor = usuario.asignaturas;
      //hace que el filtro empiece siempre por la primera asignatura del profesor
      this.filterAsignatura = this.asignaturasProfesor[0];
      this.selectClase = this.asignaturasProfesor[0];
    });
  }

  public obtenerUsuarioAsignatura(){
    this.bbdd.getUsuarios().subscribe(usuarios => {
      this.alumnos = usuarios;
    })
  }

  public obtenerClases(){
    this.bbdd.getClases().subscribe(clases => {
      this.clases = clases;
      this.filterCurso = this.clases[0];
    })
  }

  public ponerFalta(alumno: Usuario){
    let f = new Date;
    let min = f.getMinutes();
    let minS = '';
    if(min <= 0){
      minS = '';
      minS = 0 + '' + min
    }
    
    let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' ' + f.getHours() + ':' + min;

    this.redactarMail(alumno, fecha);
    this.setFalta(alumno, fecha);
  }

  public redactarMail(alumno: Usuario, fecha: string){
    const mail: Mail = {
      from: this.profesor.displayName,                   
      emailDestinatario: alumno.email,   
      asunto: 'Falta',                
      mensaje: 'Has faltado a ' + this.selectClase + ' del curso ' + this.selectCurso + ' en la fecha ' + fecha,
    };

    this.mailer.sendMessage(mail).subscribe(() => {
      //swal("Formulario de contacto", "Mensaje enviado correctamente", 'success');
    });
  }

  public setFalta(alumno: Usuario, fecha: string){
    let idFalta = this.profesor.uid + Date.now();
    console.log(idFalta)
    const falta: Falta = {
      id: idFalta,
      profesor: this.profesor.displayName,
      alumno: alumno.displayName,
      alumnoUID: alumno.uid,       
      profesorUID: this.profesor.uid,  
      asignatura: this.selectClase,
      fecha: fecha,
      mailProfesor: this.profesor.email
    }

    this.bbdd.ponerFalta(idFalta, falta);
  }

  onChangeClase(deviceValue) {
    this.selectClase = deviceValue;
  }

  onChangeCurso(deviceValue) {
    this.selectCurso = deviceValue;
  }

}
