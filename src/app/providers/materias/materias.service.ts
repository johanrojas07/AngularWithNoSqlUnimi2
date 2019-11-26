import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})

export class MateriasService {
  constructor(
    private firestore: AngularFirestore
  ) {}
  // Crea un nuevo usuario
  public createMaterias(data: any) {
    return this.firestore.collection('materias').add(data);
  }
  // Obtiene un usuario
  public getMateria(documentId: string) {
    return this.firestore.collection('materias').doc(documentId).snapshotChanges();
  }
  // Obtiene todos los usuarios
  public getMaterias() {
    return this.firestore.collection('materias').snapshotChanges();
  }
  // Actualiza un usuario
  public updateMaterias(documentId: string, data: any) {
    return this.firestore.collection('materias').doc(documentId).set(data);
  }

  public usersInMateria(documentId: string): Promise<any> {
      return new Promise((resolve, reject) => {
          this.firestore.collection('materias').doc(documentId).collection('2019', (ref) => ref.where('active', '==', true))
              .get().toPromise()
              .then((response) => {
                  resolve(response.size);
              })
              .catch((error) => {
                  reject(error);
              });
      });
  }

  public deleteMateria(documentId: string) {
    return this.firestore.collection('materias').doc(documentId).delete();
  }

  public updateUserSubject(userId: string, subjectId: any, data: any) {
    return new Promise((resolve, reject) => {
      this.firestore.collection('materias').doc(subjectId)
      .collection('2019').doc(userId).set(data)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
    });
  }

}
