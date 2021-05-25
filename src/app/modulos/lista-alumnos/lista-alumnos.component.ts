import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { BbbddService } from '../../servicios/bbbdd.service';
import { MailerService } from '../../servicios/mailer.service';

import { Usuario } from '../../models/usuario.interface';
import { Mail } from '../../models/mail.interface';
import { Falta } from '../../models/falta.interface';
import * as firebase from 'firebase';

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
  public cursosProfesor = [];
  public clases = [];

  public selectClase = '';
  public selectCurso = '';

  constructor(private bbdd: BbbddService, private mailer: MailerService, private router: Router) { }

  async ngOnInit() {
    firebase.default.auth().onAuthStateChanged((user) =>{
      if (user) {
        this.user$.subscribe(a =>{
          this.obtenerProfesor(a.uid);
        });
      } 
      else {
        this.redirigir();
      }
    });
    this.obtenerUsuarioAsignatura();
  }

  public async obtenerProfesor(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      if(usuario.role == 'Alumno'){
        this.redirigir();
      }
      else{
        this.profesor = usuario;
        this.asignaturasProfesor = usuario.asignaturas;
        this.cursosProfesor = usuario.cursos;
        this.filterCurso = this.cursosProfesor[0];
        //hace que el filtro empiece siempre por la primera asignatura del profesor
        this.filterAsignatura = this.asignaturasProfesor[0];
      }
    });
  }

  public obtenerUsuarioAsignatura(){
    this.bbdd.getUsuarios().subscribe(usuarios => {
      this.alumnos = usuarios;
      this.ordenarAlumnos();
    })
  }

  public ordenarAlumnos(){
    this.alumnos.sort(function (a, b) {
      if (a.displayName > b.displayName) {
        return -1;
      }
      if (a.displayName < b.displayName) {
        return 1;
      }
      return 0;
    });
  }

  public ponerFalta(alumno: Usuario){
    let f = new Date;
    let min = f.getMinutes();
    let minS =  this.fechaCorrecta(min);

    let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear() + ' ' + f.getHours() + ':' + minS;

    this.redactarMail(alumno, fecha);
    this.setFalta(alumno, fecha);
  }

  private fechaCorrecta(min: number){
    var minS;
    if(min < 10){
      minS = '';
      minS = 0 + '' + min
      return minS;
    }
    else{
      return min;
    }
  }

  public redactarMail(alumno: Usuario, fecha: string){
    const mail: Mail = {
      from: this.profesor.displayName,                   
      emailDestinatario: alumno.email,   
      asunto: 'Falta',                
      mensaje: 'Has faltado a ' + this.selectClase + ' del curso ' + this.selectCurso + ' en la fecha ' + fecha,
      tieneArchivo: 'N'
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

  public incluyeAmbos(asignaturas: string[], cursos: string[]){
    if(asignaturas.includes(this.selectClase) && cursos.includes(this.selectCurso)){
      return true;
    }
    else{
      return false;
    }
  }

  onChangeClase(deviceValue) {
    this.selectClase = deviceValue;
  }

  onChangeCurso(deviceValue) {
    this.selectCurso = deviceValue;
  }

  public redirigir(){
    this.router.navigate(['/home']);
  }

}
