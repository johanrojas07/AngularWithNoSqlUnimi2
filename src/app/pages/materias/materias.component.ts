import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MateriasService } from 'src/app/providers/materias/materias.service';
import { ComponentSnackBarComponent } from 'src/app/components/ComponentSnackBar/ComponentSnackBar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {

  public documentId = null;
  public currentStatus = 1;
  public subjects = [];
  public newSubjectsForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    nrc: new FormControl('', Validators.required),
    id: new FormControl('')
  });

  constructor( public dialogRef: MatDialogRef<MateriasComponent>,
               private materiasService: MateriasService,
               private _snackBar: MatSnackBar,
               @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.materiasService.getMaterias().subscribe((usersSnapshot) => { // Se subscribe para ver cambios en esa coleccion
      this.subjects = [];
      usersSnapshot.forEach((catData: any) => { // Recorre cada uno de los usuarios agregados
        this.subjects.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      });
    });
  }

  public editMateria(documentId) {
    const editSubscribe = this.materiasService.getMateria(documentId).subscribe((cat) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      const data: any = cat.payload.data();
      this.newSubjectsForm.setValue({
        id: documentId,
        nombre: data.nombre,
        nrc: data.nrc,
      });
      editSubscribe.unsubscribe();
    });
  }

  public deleteMateria(documentId) {
    let isvalid = false;
    this.materiasService.usersInMateria(documentId).then((numberStudents: number) => {
      let promise: Promise<any> = Promise.resolve();
      if (numberStudents > 0) {
        this._snackBar.openFromComponent(ComponentSnackBarComponent, {
          duration: 5000,
          data: {text: 'No es posible ya que existen estudiantes inscritos'}
        });
      } else {
        isvalid = true;
        promise = this.materiasService.deleteMateria(documentId);

      }
      return promise;
     })
     .then(() => {
       if (isvalid) {
        this._snackBar.openFromComponent(ComponentSnackBarComponent, {
          duration: 2000,
          data: {text: 'Se elimino correctamente '}
        });
       }
     })
     .catch((error) => {
      if (isvalid) {
        this._snackBar.openFromComponent(ComponentSnackBarComponent, {
          duration: 2000,
          data: {text: 'Ocurrio un error al eliminar ', error}
        });
       }
      console.error(error);
     })
  }

  public newMateria(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus === 1) {
      const data = {
        nombre: form.nombre,
        nrc: form.nrc
      };
      this.materiasService.createMaterias(data).then(() => {
        console.log('Documento creado exitósamente!');
        this.newSubjectsForm.setValue({
          nombre: '',
          nrc: '',
          id: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      const data = {
        nombre: form.nombre,
        nrc: form.nrc,
      };
      this.materiasService.updateMaterias(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newSubjectsForm.setValue({
          nombre: '',
          nrc: '',
          id: ''
        });
        console.log('Documento editado exitósamente');
      }, (error) => {
        console.log(error);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
