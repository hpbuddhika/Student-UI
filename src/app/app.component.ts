import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, Subscription,Subject } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './edit.service';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-root',
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {
  public view: Observable<GridDataResult>;

  public showLoader = false;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  public formGroup: FormGroup;

  private editService: EditService;
  private editedRowIndex: number;

  private students:any[];

  public subject;
  showTitle:boolean = false;


  constructor(
    @Inject(EditService) editServiceFactory: any,private socket: Socket) {
    this.editService = editServiceFactory()
    this.subject = new Subject<string>()

    this.subject.subscribe(
      {
        next:function(value){
          console.log("value------" + value)
        },
        error:function(err){
          console.log("err___"+ err)
        }
      }
    )

  }

  public ngOnInit(): void {

    this.showLoader = true;
    this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    this.editService.read();

    this.socket.on('connect', function() {
      console.log('Connected');
    });

    this.socket.on('jobStatus',this.callback(this.subject))

  }

  callback(subject) {
    return function() {
      subject.next("found student")
      console.log("call back")
      this.showTitle = true;
    }
  }

  public onStateChange(state: State) {
    this.gridState = state;

    this.editService.read();
  }


  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      'id' : new FormControl(dataItem.id),
      'name': new FormControl(dataItem.name),
      'email': new FormControl(dataItem.email, Validators.required),
      'dataofBirth': new FormControl(dataItem.dataofBirth),
      'age': new FormControl(dataItem.age)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const product: Product = formGroup.value;
  //  console.log("saving--------"+ JSON.stringify(product) + "is new value: "+ isNew)

    this.editService.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    this.editService.remove(dataItem);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
