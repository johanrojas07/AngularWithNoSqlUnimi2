import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})

export class StudentService {
  public endpoint = 'http://localhost:55350/api/values/';
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {}
  // Crea un nuevo usuario
  public createUser(data: any) {
    return this.firestore.collection('estudiantes').add(data)
    .then((docRef) => {
      data.hashkey = docRef.id;
      this.createUserApi(data);
    });
  }
  public createUserApi (product): Observable<any> {
    return this.http.post<any>(this.endpoint + 'createStudent', product).pipe(
      map((product) => console.log(`Agregado`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public deleteStudent(product): Observable<any> {
    return this.http.post<any>(this.endpoint + 'deleteStudent', product).pipe(
      tap((product) => console.log(`Agregado`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  // Obtiene un usuario
  public getUser(documentId: string) {
    return this.firestore.collection('estudiantes').doc(documentId).snapshotChanges();
  }
  // Obtiene todos los usuarios
  public getUsers() {
    return this.firestore.collection('estudiantes').snapshotChanges();
  }
  public getUsersApi(): Observable<any> {
    return this.http.get(this.endpoint + 'GetStudents').pipe(
      map(this.extractData));
  }

  public studentsInSubject (product: number): Observable<any> {
    console.log("studentsInSubject", product);
    return this.http.post<any>(this.endpoint + 'studentsInSubject', product);
  }




  private extractData(res: Response) {
    let body = res;
    return body || { };
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
