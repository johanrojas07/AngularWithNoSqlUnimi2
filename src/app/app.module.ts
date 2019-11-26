import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MateriasComponent } from './pages/materias/materias.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentsComponent } from './pages/students/students.component';

import {DemoMaterialModule} from './material-module';
import { ComponentSnackBarComponent } from './components/ComponentSnackBar/ComponentSnackBar.component';
import { EnrollSubjectsPerStudentComponent } from './pages/enrollSubjectsPerStudent/enrollSubjectsPerStudent.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    MateriasComponent,
    EnrollSubjectsPerStudentComponent,
    ComponentSnackBarComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    DemoMaterialModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AgGridModule.withComponents(null),
    BrowserAnimationsModule
  ],
  entryComponents: [
    ComponentSnackBarComponent,
    EnrollSubjectsPerStudentComponent
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
