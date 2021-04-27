import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  registerForm = new FormGroup({
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    telefono: new FormControl(''),
    dni: new FormControl(''),
    rolSelect: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  constructor(private router: Router, private bbdd: BbbddService) { }

  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.bbdd.getRol(a.uid).subscribe((usuario: Usuario) => {
          let rol = usuario.role
          this.redirecUser(rol)
        })
      }
    });
  }

  async onRegister() {
    const { email, password } = this.registerForm.value;
    try {
      const user = await this.bbdd.register(email, password);
      if (user) {
        const { nombre, apellidos, rolSelect, dni, telefono } = this.registerForm.value;
        const usuario: Usuario = {
          email: user.email,
          displayName: nombre + ' ' + apellidos,
          dni: dni,
          telefono: telefono,
          role: rolSelect,
          uid: user.uid
        };
        this.bbdd.updateUserData(usuario)
        this.redirecUser(rolSelect);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirecUser(rol: String) {
    if (rol == 'Alumno') {
      this.router.navigate(['/selectClases']);
    } 
    else if (rol == 'Profesor'){
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/registro']);
    }
  }

}