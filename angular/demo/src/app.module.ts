import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IlButtonModule, IlToggleButtonModule, IlButtonGroupModule } from 'ilib-ng';
import { MyButtonModule } from './button.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    IlButtonModule,
    IlToggleButtonModule,
    IlButtonGroupModule,
    MyButtonModule
  ],
  bootstrap: [AppComponent],
})
export class MyAppModule {}
