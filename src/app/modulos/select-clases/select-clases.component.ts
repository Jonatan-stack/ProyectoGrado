import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';
import * as firebase from 'firebase';


@Component({
  selector: 'app-select-clases',
  templateUrl: './select-clases.component.html',
  styleUrls: ['./select-clases.component.scss']
})
export class SelectClasesComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;
  public uid;
  public usuarioRol;

  public clases = [];
  public asignaturas = [];
  public cursos = [];

  constructor(private bbdd: BbbddService, private router: Router) { }

  async ngOnInit(){
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user$.subscribe(a =>{
          this.uid = a.uid;
          this.obtenerUsuario(this.uid);
          this.guardarClases();
        });
      } 
      else {
          this.redirigir();
      }
    });
  }

  public async guardarClases(){
    this.bbdd.getClases().subscribe(clases => {
      this.clases = clases;
    })
  }

  public obtenerUsuario(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      this.uid = usuario.uid;
      this.usuarioRol = usuario.role;
      this.cursos = usuario.cursos;
      this.asignaturas = usuario.asignaturas;
    });
  }

  public selectAsignatura(asignatura: string, claseID: string){
    if(this.contieneCurso(claseID) == false){
      this.cursos.push(claseID);
      this.bbdd.guardarCursoUsuario(this.uid, this.cursos);
      
    }
    if(this.contieneEsa(asignatura) == false){
      this.asignaturas.push(asignatura);
      this.bbdd.guardarAsignaturaUsuario(this.uid, this.asignaturas)
    }
    else{
      console.log('Ya la tiene');
    }
  }

  public contieneEsa(asignatura){
    return this.asignaturas.includes(asignatura);
  }

  public contieneCurso(claseID){
    if(claseID == '1DAM' && this.cursos.includes('1DAW') || claseID == '1DAW' && this.cursos.includes('1DAM') && this.usuarioRol == 'Alumno'){
      return true;
    }
    else if(this.cursos.includes(claseID)){
      //deberia haber un alert informando de si quieres cambiar el curso o no y si es Si borrar las asignaturas guardadas, cambiar el curso y guardar las nuevas asignaturas
      console.log('Ya tiene curso')
      return true;
    }
    else{
      return false;
    }
  }

  public redirigir(){
    this.router.navigate(['/login']);
  }

}
