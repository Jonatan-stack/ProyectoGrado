import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BbbddService } from '../../servicios/bbbdd.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;
  public user$: Observable<Usuario> = this.bbdd.angularAuth.user;

  constructor(public bbdd: BbbddService, private router: Router) { }

  ngOnInit(): void {
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
