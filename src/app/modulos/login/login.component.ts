import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable} from 'rxjs';

import { Router } from '@angular/router';

import { BbbddService } from '../../servicios/bbbdd.service';
import { Usuario } from '../../models/usuario.interface';

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
  
  ngOnInit(): void {
    this.user$.subscribe(a =>{
      if(this.user$){
        this.bbdd.getRol(a.email).subscribe((usuario: Usuario) => {
          let rol = usuario.role
          this.redirecUser(rol)
        })
      }
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      let user = await this.bbdd.login(email, password);
      if(user){
        let uid = this.bbdd.obtenerUID();
        console.log(uid);
        //Obtener el rol para saber donde redireccionarlo
        this.bbdd.getRol(email).subscribe((usuario: Usuario) => {
          let rol = usuario.role
          this.redirecUser(rol)
        })

      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirecUser(rol: String) {
    if (rol == 'Alumno') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/registro']);
    }
  }
  
}
//redirec si esta un usuario logueado y se redirecciona dependiendo del ROL
/*this.user$.subscribe(a =>{
      if(this.user$){
        this.bbdd.getRol(a.email).subscribe((usuario: Usuario) => {
          let rol = usuario.role
          this.redirecUser(rol)
        })
      }
    });*/