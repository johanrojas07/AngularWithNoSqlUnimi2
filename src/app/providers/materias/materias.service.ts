import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})

export class MateriasService {
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
  public createMaterias(data: any) {
    return this.firestore.collection('materias').add(data);
  }
  public createMateriasApi (product): Observable<any> {
    console.log("createMateriasApi", product);
    return this.http.post(this.endpoint + 'createSubject', product).pipe(
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

  public addSubjectWithStudent (product): Observable<any> {
    console.log(product);
    return this.http.post<any>(this.endpoint + 'addSubjectWithStudent', product).pipe(
      tap((product) => console.log(`Agregado`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  public deleteSubjectWithStudent (product): Observable<any> {
    console.log("deleteSubjectWithStudent", product);
    return this.http.post<any>(this.endpoint + 'deleteSubjectWithStudentAsync', product).pipe(
      tap((product) => console.log(`Agregado`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }

  public deleteSubject(product): Observable<any> {
    console.log("deleteSubjectWithStudent", product);
    return this.http.post<any>(this.endpoint + 'deleteSubject', product).pipe(
      tap((product) => console.log(`Agregado`)),
      catchError(this.handleError<any>('addProduct'))
    );
  }
  // Obtiene un usuario
  public getMateria(documentId: string) {
    return this.firestore.collection('materias').doc(documentId).snapshotChanges();
  }
  // Obtiene todos los usuarios
  public getMaterias() {
    return this.firestore.collection('materias').snapshotChanges();
  }
  public getUsersApi(): Observable<any> {
    return this.http.get(this.endpoint + 'GetStudents').pipe(
      map(this.extractData));
  }

   private extractData(res: Response) {
    let body = res;
    return body || { };
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
