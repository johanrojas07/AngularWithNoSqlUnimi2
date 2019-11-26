import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})

export class StudentService {
  constructor(
    private firestore: AngularFirestore
  ) {}
  // Crea un nuevo usuario
  public createUser(data: {nombre: string, apellido: string}) {
    return this.firestore.collection('estudiantes').add(data);
  }
  // Obtiene un usuario
  public getUser(documentId: string) {
    return this.firestore.collection('estudiantes').doc(documentId).snapshotChanges();
  }
  // Obtiene todos los usuarios
  public getUsers() {
    return this.firestore.collection('estudiantes').snapshotChanges();
  }

  public getUsersSync(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('estudiantes').get().toPromise()
      .then((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
              users.push({
                id: doc.id,
                data: doc.data()
              });
          });
          resolve(users);
      })
      .catch((error) => {
          reject(error);
      });
    });
  }

  public getMateriasUser(documentId: string) {
    return new Promise((resolve, reject) => {
      this.firestore.collection('estudiantes').doc(documentId)
      .collection('2019', (data) => data.where('active', '==', true))
      .get().toPromise()
      .then((response) => {
          const materias = [];
          response.forEach((doc) => {
            materias.push({
                id: doc.id,
                data: doc.data()
              });
          });
          resolve(materias);
      })
      .catch((error) => {
          reject(error);
      });
    });
  }
  // Actualiza un usuario
  public updateUsers(documentId: string, data: any) {
    return this.firestore.collection('estudiantes').doc(documentId).set(data);
  }

  public deleteUser(documentId: string) {
    return this.firestore.collection('estudiantes').doc(documentId).delete();
  }

  public validateIfEixstingSubjectInUser(userId: string, subjectId: string) {
    console.log("validateIfEixstingSubjectInUser");
    return new Promise((resolve, reject) => {
      this.firestore.collection('estudiantes').doc(userId)
      .collection('2019').doc(subjectId).get().toPromise()
      .then((doc) => {
          resolve(doc.exists);
      })
      .catch(() => {
        reject(false);
      });
    });
  }

  public updateSubjectUser(userId: string, subjectId: any, data: any) {
    return new Promise((resolve, reject) => {
      this.firestore.collection('estudiantes').doc(userId)
      .collection('2019').doc(subjectId).set(data)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
    });
  }
  
}
