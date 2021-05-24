import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';

import { BbbddService } from '../../servicios/bbbdd.service';
import { MailerService } from '../../servicios/mailer.service';
import { AngularFireStorage } from '@angular/fire/storage';

import { Usuario } from '../../models/usuario.interface';
import { Falta } from '../../models/falta.interface';
import { Clase } from '../../models/clase.interface';
import { Mail } from '../../models/mail.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;
  public uid;
  
  public usuario: Usuario;

  public faltas = [];
  public totalFaltas;

  public stadisticas = [];

  public usuarios = [];
  public cursos = [];

  public selectClase: string;
  public class: Clase;

  public profesorFaltas = [];
  public profesorFaltasTotal;

  public urlArchivo: Observable<string>;
  public urlArchivoFinal: string;
  public completed = false;
  public file: File;
  public subido = true;


  constructor(private bbdd: BbbddService, private mailer: MailerService, private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.uid = a.uid;
        this.obtenerUsuario(this.uid);
        this.guardarFaltas();

          this.guardarUsuarios();
          this.guardarCursos();

          this.guardarFaltasProfesor();
      }
    });
  }

  public async obtenerUsuario(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  public async guardarFaltas(){
    this.bbdd.getUsuariosFaltas(this.uid).subscribe(faltas => {
      this.faltas = faltas;
      this.ordenarFaltas();
      this.estadisticas();
      this.totalFaltas = this.faltas.length;
    })
  }

  public ordenarFaltas(){
    this.faltas.sort(function (a, b) {
      if (a.fecha > b.fecha) {
        return -1;
      }
      if (a.fecha < b.fecha) {
        return 1;
      }
      return 0;
    });
  }

  public estadisticas(){
    var faltasTipo: Falta[] = this.faltas;
    let i: Falta;

    for(let j = 0; j < this.usuario.asignaturas.length; j++){
      this.stadisticas[j] = 0
    }

   for(i of faltasTipo){
      for(let j = 0; j < this.usuario.asignaturas.length; j++){
          if(i.asignatura == this.usuario.asignaturas[j]){
            this.stadisticas[j] = this.stadisticas[j] + 1
          }
      }
   }
  }

  //Para subir archivos y enviarlo por correo

  public redactarMail(idFalta: string, mailProfesor: string){

    const mail: Mail = {
      from: this.usuario.displayName,                   
      emailDestinatario: 'jonatanaocv@gmail.com',   //cambiarlo por el mail del profesor que ha puesto la falta {{mailProfesor}}
      asunto: 'Justificante',                
      mensaje: 'Justificante ',
      archivo: this.urlArchivoFinal
    };

    this.mailer.sendMessage(mail).subscribe(() => {
      this.bbdd.justificarFalta(idFalta);
      this.subido = true;
      this.file = null;
    });
  }

  public enviarArchivo(files: FileList) {
    this.file = files.item(0);
    this.subirArchivo()
  }

  public subirArchivo() {
    this.completed = false;
    const filePath = 'Justificante' + Date.now() + '.pdf';
    const task = this.storage.upload(filePath, this.file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.completed = true;

        const ref = this.storage.ref(filePath);
        task.snapshotChanges().pipe(finalize(()=> this.urlArchivo = ref.getDownloadURL())).subscribe();
        this.subido = false;
      })
    )
    .subscribe();
  }

  public obtenerUrlArchivo(idFalta: string, mailProfesor: string){
    this.urlArchivo.subscribe(url => {
      this.urlArchivoFinal = url
      this.redactarMail(idFalta, mailProfesor)
    })
      
  }

  //Para el Profesor

  public async guardarFaltasProfesor(){
    this.bbdd.getProfesorFaltas(this.uid).subscribe(faltas => {
      this.profesorFaltas = faltas;
      this.ordenarFaltas();
      this.profesorFaltasTotal = this.profesorFaltas.length;
    })
  }

  public eliminarFalta(id: string){
    this.bbdd.eliminarFalta(id);
  }
  
  //Para el admin

  public guardarUsuarios(){
    this.bbdd.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  }

  public guardarCursos(){
    this.bbdd.getClases().subscribe(clases => {
      this.cursos = clases;
    })
  }

  public eliminarUsuario(uid: string){
    this.bbdd.eliminarUsuario(uid);
  }

  public eliminarClase(id: string){
    this.bbdd.eliminarClase(id);
  }

  public eliminarAsignatura(clase: Clase, indice: number){
    var asignaturasNuevas = clase.Asignaturas;
    asignaturasNuevas.splice(indice, 1);
    
    this.bbdd.actualizarClase(clase.id, asignaturasNuevas);
  }

  public anyadirClase(){
    var addCurso = <HTMLInputElement> document.getElementById('addCursoID');
    
    if(!this.comprobarSiEstaCurso(addCurso.value)){
      this.bbdd.addClase(addCurso.value);
    }
  }

  public anyadirAsignatura(){
    var addAsignatura = <HTMLInputElement> document.getElementById('addAsignaturaID');
    //console.log(addAsignatura.value)
    this.bbdd.getOneClase(this.selectClase).subscribe(clase => {
      if(clase?.Asignaturas != null){
        if(!this.comprobarSiEstaAsignatura(clase.Asignaturas, addAsignatura.value)){
          let asignaturas = clase.Asignaturas
          asignaturas.push(addAsignatura.value);
          this.bbdd.actualizarClase(this.selectClase, asignaturas);
        }
      }
    });

  }

  public comprobarSiEstaCurso(nombreCurso: String){
    let esta: Boolean = false
    var cursosA: Clase[] = this.cursos;
    let curso: Clase;

    for(curso of cursosA){
      if(curso.id == nombreCurso){
        esta = true
      }
    }

    return esta;
  }

  public comprobarSiEstaAsignatura(asignaturas: string[], asignatura: string){
    if(asignaturas.includes(asignatura)){
      return true
    }
    else{
      return false
    }
  }

  onChangeClase(deviceValue) {
    this.selectClase = deviceValue;
  }

}
