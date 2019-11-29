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
    this.getUsersApi();
  }

  public getUsersApi() {
    this.userService.getUsersApi().subscribe((usersSnapshot) => { // Se subscribe para ver cambios en esa coleccion
      this.users = usersSnapshot;
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

  public deleteUser(codigo) {
    this.userService.deleteStudent({nrc: 0, codigo})
    .subscribe(() => {
      this.getUsersApi();
      this._snackBar.openFromComponent(ComponentSnackBarComponent, {
        duration: 2000,
        data: {text: 'Se elimino correctamente '}
      });
    }, (error) => {
      this._snackBar.openFromComponent(ComponentSnackBarComponent, {
        duration: 2000,
        data: {text: 'Ocurrio un error al eliminar ', error}
      });
    });

  }

  public newUser(form, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus === 1) {
      const data = {
        nombre: form.nombre + ' ' + form.apellido,
        codigo: parseInt(form.identificacion)
      };
      this.userService.createUserApi(data).subscribe(() => {
        this.getUsersApi();
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
        nombre: form.nombre + ' ' + form.apellido,
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
