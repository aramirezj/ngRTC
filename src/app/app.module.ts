import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ServerRTCComponent } from './server-rtc/server-rtc.component';
import { ClientRTCComponent } from './client-rtc/client-rtc.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerRTCComponent,
    ClientRTCComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
