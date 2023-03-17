import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WORKER } from '../../../WORKER';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs';
import { WorkersComponent } from '../workers.component';

@Component({
  selector: 'app-dodaj-nowego',
  // standalone: false,
  // imports: [MaterialModule],
  templateUrl: './dodaj-nowego.component.html',
  styleUrls: ['./dodaj-nowego.component.css'],
  //animations: [BrowserAnimationsModule],
  // providers: []
})
export class DodajNowegoComponent implements OnInit, OnDestroy {
  @ViewChild(WorkersComponent, { static: false }) workers: WorkersComponent;
  otwartyDialog;
  constructor(private dialog: MatDialog, private data: DataService) {}

  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(
      (message) => (this.message = message)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  newMessage(dane) {
    this.data.changeMessage(dane);
  }

  message;
  subscription: Subscription;

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    // console.warn(templateRef);
    this.otwartyDialog = this.dialog.open(templateRef);
  }

  submit(dane) {
    var pracownik: WORKER[] = [
      {
        firstName: dane.imie,
        lastName: dane.nazwisko,
        zadania: [],
        zadaniaZakonczone: 0,
      },
    ];
    this.newMessage(pracownik[0]);
    console.log('1');
    this.close();
    // this.workers.addWorker();
  }
  close() {
    this.otwartyDialog.close();
  }
}

// openDialog(): void {
//   this.dialog.open(DialogAnimationsExampleDialog, {
//     width: '250px',
//   });
// }
//   // ngOnInit() {}
// }
// @Component({
//   selector: 'dialog-animations-example-dialog',
//   templateUrl: 'test.component.html',
// })
// export class DialogAnimationsExampleDialog {
//   constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
// }
