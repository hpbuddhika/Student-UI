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
        GraphQLModule
    ],
    providers: [
        {
            deps: [HttpClient,Apollo],
            provide: EditService,
            useFactory: (jsonp: HttpClient,apollo:Apollo) => () => new EditService(jsonp,apollo)
        } 
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
