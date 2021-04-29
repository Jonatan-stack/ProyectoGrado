import { Component, OnInit } from '@angular/core';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {

  public usuarios = [];

  constructor(private bbdd: BbbddService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  public async obtenerUsuarios(){
    this.bbdd.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  }

}
