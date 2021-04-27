import { Injectable, Query } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Clase } from '../models/clase.interface';
import { Usuario } from '../models/usuario.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import  firebase  from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class BbbddService {

  private asignaturasCollection: AngularFirestoreCollection<Clase>;
  private clases: Observable<Clase[]>;

  constructor(public angularAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
  }

  async register(email: string, password: string){
    try {
      const { user } = await this.angularAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async login(email: string, password: string){
    try {
      const { user } = await this.angularAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      alert('Contrasenya o Email invalidos')
      console.log(error);
    }
  }

  async logout(){
    try {
      await this.angularAuth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  public obtenerUID(){
    const uid = firebase.auth().currentUser.uid;
    return uid;
  }

  //No actualiza los datos del firebase.User perse, si no la base de datos
  //Esto hay que cambiarlo para que solo reciba un parametro Usuario de tipo Usuario y trabajar con objetos
  public updateUserData(usuario: Usuario) {
    const userRef: AngularFirestoreDocument<Usuario> = this.afs.doc(`Usuarios/${usuario.uid}`);
    const userData: Usuario = {
      email: usuario.email,
      displayName: usuario.displayName,
      emailVerified: false,
      role: usuario.role,
      dni: usuario.dni,
      telefono: usuario.telefono,
      uid: usuario.uid,
    }
    //merger si el usuario ya existe le combina los dato nuevos
    return userRef.set(userData, { merge: true });
  }

  public getRol(uid: string){
    return this.afs.collection('Usuarios').doc(uid).valueChanges()
    //Prueba de obtener el rol
    /*this.afs.collection('Alumnos').doc(email).valueChanges().subscribe((usuario: Usuario) => {
      if(usuario.role != ''){
        if(usuario.role == 'Alumno'){
          console.log('Es alumno')
          rol = true
        }
        else{
          console.log('Es profesor')
        }
      }
      return rol;
    })*/
  }

  public getClases(){
    this.asignaturasCollection = this.afs.collection<Clase>('Clases');
    return this.clases = this.asignaturasCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Clase;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

}
