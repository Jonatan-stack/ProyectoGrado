import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-select-clases',
  templateUrl: './select-clases.component.html',
  styleUrls: ['./select-clases.component.scss']
})
export class SelectClasesComponent implements OnInit {

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;
  public uid;

  public clases = [];
  public asignaturas = [];
  public curso;

  constructor(private bbdd: BbbddService, private router: Router) {
  }

  async ngOnInit(){
    this.user$.subscribe(a =>{
      if(this.user$){
        this.uid = a.uid;
        this.obtenerAsignaturasDelUsuario(this.uid);
      }
      else{
        this.router.navigate(['/login']);
      }
    });
    this.guardarClases();
  }

  public async guardarClases(){
    this.bbdd.getClases().subscribe(clases => {
      this.clases = clases;
    })
  }

  public obtenerAsignaturasDelUsuario(uid: string){
    this.bbdd.getOneUser(uid).subscribe(usuario => {
      this.uid = usuario.uid;
      this.curso = usuario.curso;
      this.asignaturas = usuario.asignaturas;
    });
  }

  public selectAsignatura(asignatura: string, claseID: string){
    if(this.contieneCurso(claseID) == false){
      this.bbdd.guardarCursoUsuario(this.uid, claseID);
      
      if(this.contieneEsa(asignatura) == false){
        this.asignaturas.push(asignatura);
        this.bbdd.guardarAsignaturaUsuario(this.uid, this.asignaturas)
      }
      else{
        console.log('Ya la tiene');
      }
    }
  }

  public contieneEsa(asignatura){
    return this.asignaturas.includes(asignatura)
  }

  public contieneCurso(claseID){
    if(this.curso != null && this.curso != claseID){
      //deberia haber un alert informando de si quieres cambiar el curso o no y si es Si borrar las asignaturas guardadas, cambiar el curso y guardar las nuevas asignaturas
      alert('Ya tiene curso')
      return true;
    }
    else{
      return false;
    }
  }

}
