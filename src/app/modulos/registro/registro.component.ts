import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';
import * as firebase from 'firebase';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  private isEmail = /\S+@\S+\.\S+/;
  
  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    telefono: new FormControl(''),
    dni: new FormControl('', [Validators.required]),
    rolSelect: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(this.isEmail)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  constructor(private router: Router, private bbdd: BbbddService) { }

  ngOnInit(): void {
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user$.subscribe(a =>{
          this.redirigir();
        });
      }
    });
  }

  async onRegister() {
    if(this.registerForm.valid){
      const { nombre, apellidos, rolSelect, dni, telefono, email, password } = this.registerForm.value;
      try {
        const user = await this.bbdd.register(email, password);
        if (user) {
          const usuario: Usuario = {
            email: user.email,
            displayName: nombre + ' ' + apellidos,
            dni: dni,
            telefono: telefono,
            role: rolSelect,
            uid: user.uid
          };
          this.bbdd.updateUserData(usuario)
          this.redirecUser();
        }
      } catch (error){
      }
    }
    else{
      console.log('asd')
    }
  }


  private redirigir(){
    this.router.navigate(['/home']);
  }

  private redirecUser() {
    this.router.navigate(['/selectClases']);
  }

  isValidField(field: string): string {
    const validatedField = this.registerForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }
}