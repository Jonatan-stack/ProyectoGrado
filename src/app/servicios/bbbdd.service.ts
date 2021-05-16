import { Injectable, Query } from '@angular/core';

import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import  firebase  from 'firebase/app';

import { Clase } from '../models/clase.interface';
import { Usuario } from '../models/usuario.interface';
import { Falta } from '../models/falta.interface';
@Injectable({
  providedIn: 'root'
})
export class BbbddService {

  private usuariosCollection: AngularFirestoreCollection<Usuario>;
  private usuarioDoc: AngularFirestoreDocument<Usuario>;
  private usuarios: Observable<Usuario[]>;
  private usuario: Observable<Usuario>;

  private clasesCollection: AngularFirestoreCollection<Clase>;
  private clases: Observable<Clase[]>;

  private faltasCollection: AngularFirestoreCollection<Falta>;
  private faltas: Observable<Falta[]>;

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

  //No actualiza los datos del firebase.User perse, si no la base de datos FireStore
  public updateUserData(usuario: Usuario) {
    const userRef: AngularFirestoreDocument<Usuario> = this.afs.doc(`Usuarios/${usuario.uid}`);
    const userData: Usuario = {
      email: usuario.email,
      displayName: usuario.displayName,
      emailVerified: false,
      role: usuario.role,
      dni: usuario.dni,
      telefono: usuario.telefono,
      asignaturas: [],
      uid: usuario.uid,
    }
    //merger si el usuario ya existe le combina los dato nuevos
    return userRef.set(userData, { merge: true });
  }

  public getRol(uid: string){
    return this.afs.collection('Usuarios').doc(uid).valueChanges()
  }

  public getClases(){
    this.clasesCollection = this.afs.collection<Clase>('Clases',  ref => ref.where('Asignaturas', '!=', 'null'));
    return this.clases = this.clasesCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Clase;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  public getUsuarios(){
    this.usuariosCollection = this.afs.collection<Usuario>('Usuarios');
    return this.usuarios = this.usuariosCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Usuario;
          return data;
        })
      }))
  }

  //Con este metodo obtendras cualquier usuario que en el campo ASIGNATURAS que es un ARRAY tenga la asignatura seleccionada
  public getUsuariosAsignatura(asignaturas: string){
    this.usuariosCollection = this.afs.collection<Usuario>('Usuarios', ref => ref.where('asignaturas', 'array-contains-any', [asignaturas]));
    return this.usuarios = this.usuariosCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Usuario;
          return data;
        })
      }))
  }

  public getOneUser(uid: string) {
    this.usuarioDoc = this.afs.doc<Usuario>(`Usuarios/${uid}`);
    return this.usuario = this.usuarioDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Usuario;
        data.uid = action.payload.id;
        return data;
      }
    }));
  }

  public guardarAsignatura(uid: string, asignaturas: string[]){
    const userRef: AngularFirestoreDocument = this.afs.doc(`Usuarios/${uid}`);
    const data = {
      asignaturas: asignaturas
    }
    userRef.set(data, { merge: true });
  }

  public ponerFalta(falta: Falta){
    const faltaData: Falta = {
      profesor: falta.profesor,
      alumnoUID: falta.alumnoUID,         
      asignatura: falta.asignatura,
      fecha: falta.fecha
    }
    this.afs.collection('Faltas').add(faltaData)
  }

  public getUsuariosFaltas(alumnoUID: string){
    this.faltasCollection = this.afs.collection<Falta>('Faltas', ref => ref.where('alumnoUID', '==', alumnoUID));
    return this.faltas = this.faltasCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Falta;
          return data;
        })
      }))
  }

}
