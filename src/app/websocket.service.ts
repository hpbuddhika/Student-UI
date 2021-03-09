// import { Subject, Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';


// @Injectable()
// export class WebsocketService {

//   public subject;
//   data:any;


//   constructor(private socket: Socket) {
//     this.subject = new Subject()
//   }

//   callback(subject) {
//     return function() {
//       subject.next({success:"found student"})
//     }
//   }

//   startClient(){

//     this.socket.on('connect', function() {
//       console.log('Connected');
//     });

//     this.socket.on('jobStatus',this.callback(this.subject))


//   }

// }
