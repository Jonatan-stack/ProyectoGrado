import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-select-clases',
  templateUrl: './select-clases.component.html',
  styleUrls: ['./select-clases.component.scss']
})
export class SelectClasesComponent implements OnInit {
  public swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-outline-success sm ',
      cancelButton: ' btn btn-outline-danger sm'
    },
    buttonsStyling: false
  })

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
      this.ordenarClases();
    })
  }

  public ordenarClases(){
    this.clases.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
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
      console.log('entra')
      this.cursos.push(claseID);
      this.bbdd.guardarCursoUsuario(this.uid, this.cursos);
    }
    if(this.contieneEsa(asignatura) == false && this.contieneCurso(claseID) == true){
      this.asignaturas.push(asignatura);
      this.bbdd.guardarAsignaturaUsuario(this.uid, this.asignaturas)
    }
  }

  public contieneEsa(asignatura){
    return this.asignaturas.includes(asignatura);
  }

  public contieneCurso(claseID){
    if(claseID == '1DAM' && this.cursos.includes('1DAW') && this.usuarioRol == 'Alumno' || claseID == '1DAW' && this.cursos.includes('1DAM') && this.usuarioRol == 'Alumno'){
      if(claseID == '1DAM'){
        this.swalWithBootstrapButtons.fire({
          title: 'Perteneces a 1DAW',
          text: 'Quieres cambiar a 1DAM??',
          showCancelButton: true,
          confirmButtonText: 'Si, claro',
          cancelButtonText: 'No',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.swalWithBootstrapButtons.fire(
              'Listo'
            )
            //Aqui se cambia DAW por DAM
            const indice = this.cursos.indexOf('1DAW')
            if(indice != -1){
              this.cursos.splice(indice, 1, '1DAM');
              this.bbdd.guardarCursoUsuario(this.uid, this.cursos);
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.swalWithBootstrapButtons.fire(
              'Cancelado'
            )
          }
        })
      }

      if(claseID == '1DAW'){
        this.swalWithBootstrapButtons.fire({
          title: 'Perteneces a 1DAM',
          text: 'Quieres cambiar a 1DAW??',
          showCancelButton: true,
          confirmButtonText: 'Si, claro',
          cancelButtonText: 'No',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.swalWithBootstrapButtons.fire(
              'Listo'
            )
            //Aqui se cambia DAM por DAW
            const indice = this.cursos.indexOf('1DAM')

            if(indice != -1){
              this.cursos.splice(indice, 1, '1DAW');
              this.bbdd.guardarCursoUsuario(this.uid, this.cursos);
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.swalWithBootstrapButtons.fire(
              'Cancelado'
            )
          }
        })
      }
    }

    else if(this.cursos.includes(claseID)){
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
