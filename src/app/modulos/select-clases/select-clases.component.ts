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

  constructor(private bbdd: BbbddService, private router: Router) {
  }

  async ngOnInit(){
    this.user$.subscribe(a =>{
      if(this.user$){
        this.uid = a.uid;
      }
    });

    this.guardarClases();
  }

  public async guardarClases(){
    this.bbdd.getClases().subscribe(clases => {
      this.clases = clases;
    })
  }

  public selectAsignatura(asignatura){
    console.log(asignatura);
    this.bbdd.guardarAsignatura(this.uid, asignatura)
  }

}
