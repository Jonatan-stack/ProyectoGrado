import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  constructor(private bbdd: BbbddService, private router: Router) { }
  
  async ngOnInit() {
    this.user$.subscribe(a =>{
      if(a.uid != null){
        this.redirecUser()
      }
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      let user = await this.bbdd.login(email, password);
      if(user){
        this.redirecUser()
      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirecUser() {
    this.router.navigate(['/home']);
  }
  
}