import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';

@Component({
  selector: 'app-select-clases',
  templateUrl: './select-clases.component.html',
  styleUrls: ['./select-clases.component.scss']
})
export class SelectClasesComponent implements OnInit {

  public clases = [];
  public asignaturas = [];

  constructor(private bbdd: BbbddService, private router: Router) {

  }

  async ngOnInit(){
    this.guardarClases();
  }

  public async guardarClases(){
    this.bbdd.getClases().subscribe(clases => {
      console.log('Clases', clases);
      this.clases = clases;
    })
  }

}
