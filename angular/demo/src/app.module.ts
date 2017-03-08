import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SlottedModule } from './sloted.component';
import {
  IlButtonModule,
  IlToggleButtonModule,
  IlButtonGroupModule,
  IlToggleButtonGroupModule,
  IlSizerModule
} from 'ilib-ng';
import { MyButtonModule } from './button.component';
import { HocExampleModule } from './hoc.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    SlottedModule,
    IlButtonModule,
    IlToggleButtonModule,
    IlButtonGroupModule,
    IlToggleButtonGroupModule,
    IlSizerModule,
    MyButtonModule,
    HocExampleModule
  ],
  bootstrap: [AppComponent],
})
export class MyAppModule {}
