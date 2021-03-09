import { Apollo } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';

import { AppComponent } from './app.component';
import { EditService } from './edit.service';
import { GraphQLModule } from './graphql.module';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:4000', options: {}};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        HttpClientJsonpModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        GridModule,
        GraphQLModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [
        {
            deps: [HttpClient,Apollo],
            provide: EditService,
            useFactory: (jsonp: HttpClient,apollo:Apollo) => () => new EditService(jsonp,apollo)
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
