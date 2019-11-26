import { StudentService } from './students.service';
import { MateriasService } from '../materias/materias.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})

export class StudentProvider {
  constructor(
    private studentService: StudentService,
    private materiasService: MateriasService,
  ) {}


  public addOrRemoveSubjectInStudent(noInscritas: any[], inscritas: any[], student: any) {
    return new Promise((resolve, reject) => {
      const arrayPromise: Array<Promise<any>> = [];
      noInscritas.forEach((subject: any) => {
        arrayPromise.push(this.studentService.validateIfEixstingSubjectInUser(student.id, subject.id));
      });
      Promise.all(arrayPromise)
      .then((inscritasInUser) => {
        const arrayPromiseStudents: Array<Promise<any>> = [];
        inscritasInUser.forEach((idValid, index) => {
          if (idValid) {
             arrayPromiseStudents.push(this.studentService.updateSubjectUser(student.id, noInscritas[index].id, {active: false}));
             arrayPromiseStudents.push(this.materiasService.updateUserSubject(student.id, noInscritas[index].id,  {active: false}));
          }
        });
        return Promise.all(arrayPromiseStudents);
      })
      .then(() => {
        const arrayPromiseInscritas: Array<Promise<any>> = [];
        inscritas.forEach((subject: any) => {
          arrayPromiseInscritas.push(this.studentService.updateSubjectUser(student.id, subject.id, {active: true}));
          arrayPromiseInscritas.push(this.materiasService.updateUserSubject(student.id, subject.id, {active: true}));
        });
        return Promise.all(arrayPromiseInscritas);
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
    });

  }


  public getUserWithSubject(): Promise<any> {
    return new Promise((resolve, reject) => {
      let estudents = [];
      this.studentService.getUsersSync().then((estudentsData: any) => {
        const arrayPromise: Array<Promise<any>> = [];
        estudents = estudentsData;
        estudents.forEach((student) => {
          arrayPromise.push(this.studentService.getMateriasUser(student.id));
        });
        Promise.all(arrayPromise)
        .then((materiaData) => {
          materiaData.forEach((materia, index) => {
            estudents[index].materias = materia;
          });
          resolve(estudents);
        })
        .catch((error) => {
          reject(error);
        });
      });
    });
  }

}
