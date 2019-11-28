import { Component, OnInit } from '@angular/core';
import { MateriasService } from 'src/app/providers/materias/materias.service';
import { StudentService } from 'src/app/providers/students/students.service';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import { ComponentSnackBarComponent } from 'src/app/components/ComponentSnackBar/ComponentSnackBar.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StudentProvider } from 'src/app/providers/students/students.provider';
import { MateriasComponent } from '../materias/materias.component';


@Component({
  selector: 'app-enrollSubjectsPerStudent',
  templateUrl: './enrollSubjectsPerStudent.component.html',
  styleUrls: ['./enrollSubjectsPerStudent.component.css']
})
export class EnrollSubjectsPerStudentComponent implements OnInit {

  objectSubjectsAll: any[] = [];
  objectSubjects: any[] = [];
  students: any[] = [];
  loading = false;
  updateLoading = false;
  myControl = new FormControl();
  studentSelect: any;
  // selectedCars: any[] = [];
  // selectedToAdd: any[] = [];
  // selectedToRemove: any[] = [];

  filteredOptions: Observable<any>;

  constructor(private materiasService: MateriasService,
              private studentService: StudentService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<EnrollSubjectsPerStudentComponent>,
              public studentProvider: StudentProvider,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllSubject();
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.getUsers().subscribe(
      (response) => {
        console.log("ESTUDIANTE", response);
        response.forEach((catData: any) => { // Recorre cada uno de los usuarios agregados
          this.students.push({
            id: catData.payload.doc.id,
            data: catData.payload.doc.data()
          });
        });
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      (error) => {
        this.snackBar.openFromComponent(ComponentSnackBarComponent, {
          duration: 2000,
          data: {text: 'Error Obteniendo Lista de Estudiantes, ' + error.error}
        });
      }
    )
  }

  private _filter(value: any): string[] {
    let filterValue = '';
    console.log("value", value);
    if (value && value.data) {
      // if (!this.studentSelect || (value.ID !== this.studentSelect.ID)) {
      this.studentSelect = value;
      this.getStudentWithSubjects();
      // }
      filterValue = value.data.nombre.toLowerCase();
    } else {
      filterValue = (value) ? value.toLowerCase() : '';
    }
    // tslint:disable-next-line:max-line-length
    console.log('This.students', this.students);
    return this.students.filter(option => option.data.nombre.toLowerCase().includes(filterValue) || option.data.identificacion.toLowerCase().includes(filterValue));
  }

  public getStudentWithSubjects() {
    this.loading = true;
    console.log('getStudentWithSubjects', this.studentSelect);
    this.studentService.getMateriasUser(this.studentSelect.id)
    .then((userSubjects: any[]) => {
      // let subjectNoUsers= [];
      // this.selectedCars = [];
      this.objectSubjects = [];
      // this.objectSubjectsAll.forEach((subjectGlobal) => {
      //   let exist = false;
      //   userSubjects.forEach((subjectUser) => {
      //     if (subjectGlobal.id === subjectUser.id) {
      //       // Si tiene la materia la agrega a las seleccioandas
      //       exist = true;
      //       console.log('PASOO AGREGAR ', subjectGlobal);
      //       this.selectedCars = this.selectedCars.concat(subjectGlobal);
      //     }
      //   });
      //   if (!exist) {
      //     // Si no tiene la materia la agrega para seleccionar.
      //     subjectNoUsers = subjectNoUsers.concat(subjectGlobal);
      //   }
      // });
      // if (userSubjects.length === 0) {
      //   this.objectSubjects = this.objectSubjectsAll;
      // } else {
      //   // Las que no son del usuario
      //   this.objectSubjects = subjectNoUsers;
      // }
      this.loading = false;
    })
    .catch((error) => {
      this.loading = false;
      this.snackBar.openFromComponent(ComponentSnackBarComponent, {
        duration: 2000,
        data: {text: 'Error Obteniendo Lista de Estudiantes, ' + error.error}
      });
    });
  }

  getAllSubject() {
    this.materiasService.getMaterias().subscribe((data) => {
      this.objectSubjects = [];
      data.forEach((materiasData: any) => {
        this.objectSubjectsAll.push({id: materiasData.payload.doc.id, data: materiasData.payload.doc.data()});
      });

    });
  }

  nuevaMateria() {
    console.log("nuevaMateria");
    const dialogRef = this.dialog.open(MateriasComponent, {
      width: '800px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDataMaterias();
      console.log('The dialog was closed');
    });
  }

  registrarMateriaAEstudiante() {

  }

  compareObjectSelect(data?: any) {
    return data ? ((data.data) ? data.data.nombre : undefined): undefined;
  }

  getDataMaterias() {

  }


  // chosenCars(objectSubjects) {
  //   this.selectedToAdd = objectSubjects;
  // }

  // chosenCarsToRemove(objectSubjects) {
  //   this.selectedToRemove = objectSubjects;
  // }

  // assigne() {
  //   this.selectedCars = this.selectedCars.concat(this.selectedToAdd);
  //   this.objectSubjects = this.objectSubjects.filter(car => {
  //     return this.selectedCars.indexOf(car) < 0;
  //   });

  //   this.selectedToAdd = [];
  // }

  // unassigne() {
  //   this.objectSubjects = this.objectSubjects.concat(this.selectedToRemove);
  //   this.selectedCars = this.selectedCars.filter(selectedCar => {
  //     return this.objectSubjects.indexOf(selectedCar) < 0;
  //   });
  //   this.selectedToRemove = [];
  // }

  close() {
    this.dialogRef.close();
  }

  updateStudent() {
    console.log("PASANDOO");
    this.updateLoading = true;
    this.studentProvider.addOrRemoveSubjectInStudent(this.objectSubjects, this.selectedCars, this.studentSelect)
    .then(() => {
      this.updateLoading = false;
      this.snackBar.openFromComponent(ComponentSnackBarComponent, {
        duration: 2000,
        data: {text: 'Se Actualizo Correctamente'}
      });
    })
    .catch((error) => {
      this.updateLoading = false;
      this.snackBar.openFromComponent(ComponentSnackBarComponent, {
        duration: 2000,
        data: {text: 'Error Obteniendo Lista de Estudiantes, ' + error.error}
      });
    });
  }
}
