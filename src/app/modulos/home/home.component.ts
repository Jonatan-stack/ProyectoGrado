import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

import { BbbddService } from '../../servicios/bbbdd.service';

import { Usuario } from '../../models/usuario.interface';
import { Falta } from '../../models/falta.interface';

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

  constructor(private bbdd: BbbddService) {
  }

  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.uid = a.uid;
        this.obtenerUsuario(this.uid);
        this.guardarFaltas();
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

}
