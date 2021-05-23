import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  private isEmail = /\S+@\S+\.\S+/;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.isEmail)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  constructor(private bbdd: BbbddService, private router: Router) { }
  
  async ngOnInit() {
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user$.subscribe(a =>{
          this.redirigir();
        });
      }
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      let user = await this.bbdd.login(email, password);
      if(user){
        this.redirigir()
      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirigir() {
    this.router.navigate(['/home']);
  }

  isValidField(field: string): string {
    const validatedField = this.loginForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }
  
}