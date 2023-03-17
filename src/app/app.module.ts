import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MaterialModule } from '../app-shared.module';
import { AppComponent } from './app.component';
import { ListaPracownikowComponent } from './lista-pracownikow/lista-pracownikow.component';
import { DodajNowegoComponent } from './workers/dodaj-nowego/dodaj-nowego.component';
import { WorkersComponent } from './workers/workers.component';
import { CommonModule } from '@angular/common';
import { RouterModule,  } from '@angular/router';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { DataService } from './data.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from './search.pipe';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    BrowserModule,
    NoopAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    DodajNowegoComponent,
    WorkersComponent,
    ListaPracownikowComponent,
    SearchPipe
  ],
  exports: [
    MatDialogModule,
  ],
  bootstrap: [AppComponent],

  providers: [DataService],
  
})
export class AppModule {}

/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
