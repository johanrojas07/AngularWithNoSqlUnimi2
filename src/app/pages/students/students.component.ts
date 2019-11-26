import { Component, OnInit, Inject } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService } from 'src/app/providers/students/students.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentSnackBarComponent } from 'src/app/components/ComponentSnackBar/ComponentSnackBar.component';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  public documentId = null;
  public currentStatus = 1;
  public users = [];
  public newUserForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    identificacion: new FormControl('', Validators.required),
    id: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<StudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: StudentService,
    private _snackBar: MatSnackBar,
  ) {
    this.newUserForm.setValue({
      id: '',
      nombre: '',
      apellido: '',
      identificacion: ''
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((usersSnapshot) => { // Se subscribe para ver cambios en esa coleccion
      this.users = [];
      usersSnapshot.forEach((catData: any) => { // Recorre cada uno de los usuarios agregados
        this.users.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      });
    });
  }

  public editUser(documentId) {
    const editSubscribe = this.userService.getUser(documentId).subscribe((cat) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      const data: any = cat.payload.data();
      this.newUserForm.setValue({
        id: documentId,
        nombre: data.nombre,
        identificacion: data.identificacion + '',
        apellido: data.apellido
      });
      editSubscribe.unsubscribe();
    });
  }

  public deleteUser(documentId) {
    let isvalid = false;
    this.userService.getMateriasUser(documentId).then((numberMaterias: Array<any>[]) => {
      let promise: Promise<any> = Promise.resolve();
      if (numberMaterias.length > 0) {
        this._snackBar.openFromComponent(ComponentSnackBarComponent, {
          duration: 5000,
          data: {text: 'No es posible ya que el estudiante tiene materias inscritas'}
        });
      } else {
        isvalid = true;
        promise = this.userService.deleteUser(documentId);
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
     });
  }

  public newUser(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus === 1) {
      const data = {
        nombre: form.nombre,
        apellido: form.apellido,
        identificacion: form.identificacion + ''
      };
      this.userService.createUser(data).then(() => {
        console.log('Documento creado exitósamente!');
        this.newUserForm.setValue({
          nombre: '',
          apellido: '',
          identificacion: '',
          id: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      const data = {
        nombre: form.nombre,
        apellido: form.apellido,
        identificacion: form.identificacion + '',
      };
      this.userService.updateUsers(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newUserForm.setValue({
          nombre: '',
          apellido: '',
          identificacion: '',
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
