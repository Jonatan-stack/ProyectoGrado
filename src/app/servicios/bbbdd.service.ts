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
  private claseDoc: AngularFirestoreDocument<Clase>;
  private clases: Observable<Clase[]>;
  private clase: Observable<Clase>

  private faltasCollection: AngularFirestoreCollection<Falta>;
  private faltaDoc: AngularFirestoreDocument<Falta>;
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

  public getOneClase(id: string) {
    this.claseDoc = this.afs.doc<Clase>(`Clases/${id}`);
    return this.clase = this.claseDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Clase;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  public eliminarClase(id: string){
    this.claseDoc = this.afs.doc<Clase>(`Clases/${id}`);
    this.claseDoc.delete();
  }

  public actualizarClase(id: string, asignaturas: string[]){
    const claseRef: AngularFirestoreDocument = this.afs.doc(`Clases/${id}`);
    const data = {
      Asignaturas: asignaturas
    }
    claseRef.set(data, { merge: true });
  }

  public addClase(nombre: string){
    const claseRef: AngularFirestoreDocument<Clase> = this.afs.doc(`Clases/${nombre}`);
    const claseData: Clase = {
      Asignaturas: []
    }

    claseRef.set(claseData);
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

  public guardarAsignaturaUsuario(uid: string, asignaturas: string[]){
    const userRef: AngularFirestoreDocument = this.afs.doc(`Usuarios/${uid}`);
    const data = {
      asignaturas: asignaturas
    }
    userRef.set(data, { merge: true });
  }

  public eliminarUsuario(uid: string){
    this.usuarioDoc = this.afs.doc<Usuario>(`Usuarios/${uid}`);
    this.usuarioDoc.delete();
  }

  public ponerFalta(id: string, falta: Falta){
    const faltaRef: AngularFirestoreDocument<Falta> = this.afs.doc(`Faltas/${id}`);
    const faltaData: Falta = {
      id: falta.id,
      profesor: falta.profesor,
      alumno: falta.alumno,
      alumnoUID: falta.alumnoUID,
      profesorUID: falta.profesorUID,
      asignatura: falta.asignatura,
      fecha: falta.fecha
    }

    faltaRef.set(faltaData);
  }

  public eliminarFalta(id: string){
    this.faltaDoc = this.afs.doc<Falta>(`Faltas/${id}`);
    this.faltaDoc.delete();
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

  public getProfesorFaltas(profesorUID: string){
    this.faltasCollection = this.afs.collection<Falta>('Faltas', ref => ref.where('profesorUID', '==', profesorUID));
    return this.faltas = this.faltasCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Falta;
          return data;
        })
      }))
  }

}
