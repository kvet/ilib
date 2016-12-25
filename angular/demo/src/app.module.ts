import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IlButtonModule } from 'ilib-ng';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    IlButtonModule
  ],
  bootstrap: [AppComponent],
})
export class MyAppModule {}
