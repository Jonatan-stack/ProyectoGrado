import { Component, OnInit } from '@angular/core';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  filterForm = new FormGroup({
    asignaturaSelect: new FormControl(''),
  });

  public usuarios = [];
  public alumnos = [];
  public asignaturasProfesor = [];
  public asignatura;

  constructor(private bbdd: BbbddService) { }

  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.obtenerProfesor(a.uid);
      }
    });
    //this.obtenerUsuarioAsignatura();
  }

  public async obtenerProfesor(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      this.asignaturasProfesor = usuario.asignaturas;
      console.log(usuario.asignaturas);
    });
  }

  public obtenerUsuarioAsignatura(){
    this.bbdd.getUsuariosAsignatura(this.asignatura).subscribe(usuarios => {
      this.alumnos = usuarios;
    })
  }

  //esto no funciona
  filtrarAlumnos(){
    this.asignatura = this.filterForm.value
    console.log(this.asignatura) 
    this.obtenerUsuarioAsignatura();
  }

}
