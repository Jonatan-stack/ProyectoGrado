import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BbbddService } from '../../servicios/bbbdd.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;
  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  public rol;

  alumno = false

  constructor(public bbdd: BbbddService, private router: Router) { }

  ngOnInit(): void {
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user$.subscribe(a =>{
          this.bbdd.getOneUser(a.uid).subscribe(usuario =>{
            this.rol = usuario.role;
            console.log(this.rol)
          })
        });
      }
    });
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  async onLogout() {
    try {
      await this.bbdd.logout();
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
    }
  }

}
