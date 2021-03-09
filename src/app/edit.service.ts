import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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

    this.fetch()
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        console.log("eidted array____: "+ JSON.stringify(data))
        let dataArray = data['data']['students']
        let clone = [...dataArray]
        let editedDateAray: any[] = [];

        for (let dbObj of clone) {
          let obj = { ...dbObj }
          obj.dataofBirth = new Date(obj.dataofBirth);
          editedDateAray.push(obj)
        }
        super.next(editedDateAray);
      });
  }

  public save(data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public remove(data: any) {

    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public resetItem(dataItem: any) {
    if (!dataItem) { return; }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action: string = '', data?: any): Observable<any[]> {

    if (action == '') {
      console.log("querying student -------")
      const result = this.apollo
        .query<any>({
          query: gql`
            {
              students{
                id,
                 name
                  email,
                  age,
                  dataofBirth
                }
            }
          `
        }).pipe(
          map(res => <any[]><unknown>res)
        )
      console.log("saving resutl___: "+ JSON.stringify(result));
      return result;

    } else if (action == 'update') {
      console.log("updating userj------")
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
      console.log("doing update");
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

    } else if (action == 'destroy') {
      console.log("destroying student---------")
      const studentId = data.id;

      const DELETE_STUDENT = gql`
     mutation deleteStudent (
       $id : Float!,
      ) {

        deleteStudent(deleteStudent:{id:$id}) {
        id,
        name,
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
          }

        }).pipe(
          map(res => <any[]><unknown>res)
        )
      return result;

    }



  }


  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify([data])}` : '';
  }
}
