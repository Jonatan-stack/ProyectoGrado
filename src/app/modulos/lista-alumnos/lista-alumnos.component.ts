import { Component, OnInit } from '@angular/core';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  filterAsignatura = '';
  filterCurso = '';

  public usuarios = [];
  public alumnos = [];
  public asignaturasProfesor = [];
  public clases = [];

  constructor(private bbdd: BbbddService) { }

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
      this.asignaturasProfesor = usuario.asignaturas;
      //hace que el filtro empiece siempre por la primera asignatura del profesor
      this.filterAsignatura = this.asignaturasProfesor[0];
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

}
