import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { tap, map } from 'rxjs/operators';
import { Apollo, Mutation } from "apollo-angular";
import gql from "graphql-tag";

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
  constructor(private http: HttpClient, private apollo: Apollo) {
    super([]);
  }

  private data: any[] = [];

  public read() {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.getAllStudents().subscribe(
      (res) => {
        let dataArray = res['data']['students']
        let clone = [...dataArray]
        let editedDateAray: any[] = [];

        for (let dbObj of clone) {
          let obj = { ...dbObj }
          obj.dataofBirth = new Date(obj.dataofBirth);
          editedDateAray.push(obj)
        }
        super.next(editedDateAray);
      }
    )


  }

  public save(data) {
    this.reset();
    this.updateStudent(data).subscribe(
      res => {
        this.read();
      },
      err => {
        this.read();
      }
    )


  }

  public remove(data: any) {

    this.reset();
    this.deleteStudent(data).subscribe(

      res => {
        this.read();
      },
      err => {
        this.read();
      }
    )


  }

  getAllStudents(): Observable<any[]> {
    const result = this.apollo
      .query<any>({
        query: gql`
        {
          students{
            id,
             name
              email,
              dataofBirth,
              age,

            }
        }
      `
      }).pipe(
        map(res => <any[]><unknown>res)
      )
    return result;
  }


  updateStudent(data): Observable<any> {
    const { id, name, email, dataofBirth, age } = data
    const UPDATE_STUDENT = gql`
   mutation updateStudent (
     $id : Float!,
     $name:String,
     $dataofBirth:DateTime,
     $age:Float!,
    ) {

    updateStudent(updateStudentData:{id:$id,name:$name,dataofBirth:$dataofBirth,age:$age}) {
      id,
      name,
      age,
      dataofBirth
    }

  }
    `;
    const result = this.apollo
      .mutate<any>({
        mutation: UPDATE_STUDENT,
        variables: {
          id: id,
          name: name,
          email: email,
          dataofBirth: dataofBirth,
          age: age
        }

      }).pipe(
        map(res => <any[]><unknown>res)
      )
    return result;
  }


  deleteStudent(data) {
    const studentId = data.id;

    const DELETE_STUDENT = gql`
   mutation deleteStudent (
     $id : Float!,
    ) {

      deleteStudent(deleteStudent:{id:$id}) {
      id,
      name,
      email,
      age,
      dataofBirth
    }

  }
    `;
    const result = this.apollo
      .mutate<any>({
        mutation: DELETE_STUDENT,
        variables: {
          id: studentId,
        },
        update: (store, mutationResult) => {
          let data = store.readQuery({
            query: getStudentsQuery
          });

          const cloneData = [...data['students']] as Array<any>
          let newData : any[] = cloneData.filter(student => {
            return student.id != mutationResult.data.deleteStudent.id
          })

          const studentsObj = {
            students:null
          }
          studentsObj.students = newData

          data = studentsObj

          store.writeQuery({
            query: getStudentsQuery,
            data
          });

          let data2 = store.readQuery({
            query: getStudentsQuery
          });
        }

      }).pipe(
        map(res => <any[]><unknown>res)
      )
    return result;
  }


  private reset() {
  this.data = [];
}

}


const getStudentsQuery = gql`
  {
    students{
      id,
       name
        email,
        dataofBirth,
        age,

      }
  }
`


