import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
// import { daneTestowe } from '';
import { WORKER } from '../.././WORKER';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataService } from '../data.service';
import { findIndex, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TASKS } from '../../TASKS';

@Component({
  selector: 'app-workers',
  // standalone: false,
  // imports: [CommonModule],
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css'],
  providers: [],
})
export class WorkersComponent implements OnInit, OnDestroy {
  message;
  subscription: Subscription;
  otwartyDialog;
  daneTestoweIndex;
  zakonczoneZadania = 0;
  searchWorker = [];
  zadanieIndex;

  selectedWorkerName;
  selectedWorkerLastName;

  constructor(public dialog: MatDialog, private _data: DataService) {}

  openDialogWithTemplateRef(
    templateRef: TemplateRef<any>,
    i: any,
    selectedTask?: any
  ) {
    this.otwartyDialog = this.dialog.open(templateRef);
    this.daneTestoweIndex = i;
    this.zadanieIndex = selectedTask;
    if (selectedTask) {
      this.searchWorker = [];
      this.selectedWorkerName = null;
      this.selectedWorkerLastName = null;
      // this.searchWorker.push(...this.daneTestowe);
      this.searchWorker = this.daneTestowe.filter(
        (x) =>
          x.firstName !== this.daneTestoweIndex.firstName &&
          x.lastName !== this.daneTestoweIndex.lastName
      );
    }
  }
  ngOnInit() {
    this.subscription = this._data.currentMessage.subscribe((message) => {
      this.message = message;
      if (message) {
        console.log(message);
        this.addWorker();
      }
    });
    if (JSON.parse(localStorage.getItem('lista')) !== null)
      this.daneTestowe = JSON.parse(localStorage.getItem('lista'));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addWorker() {
    this.daneTestowe.push(this.message);
    console.log('2');
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
  }
  deleteWorker(dane) {
    this.daneTestowe.splice(dane, 1);
    // delete this.daneTestowe[dane];
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
    // for (var i = 0; i <= this.daneTestowe.length; i++) {
    //   if (
    //     this.daneTestowe[i] === undefined &&
    //     this.daneTestowe[i + 1] !== undefined
    //   ) {
    //     this.daneTestowe[i] = this.daneTestowe[i + 1];
    //     delete this.daneTestowe[i + 1];
    //   }
    // }
  }
  close() {
    this.otwartyDialog.close();
  }

  dodajZadanieFunction(dane) {
    var noweZadanie: TASKS[] = [
      {
        tresc: dane,
        status: 'W toku',
        checked: false,
      },
    ];
    this.dialog.closeAll();
    if (dane === '') {
      return;
    }
    // console.log(dane);
    this.daneTestoweIndex.zadania.push(noweZadanie[0]);
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
  }
  checkChange(zaznaczone, index) {
    let zadanieIndex = this.daneTestoweIndex.zadania[index];
    if (zaznaczone.target.checked === true) {
      console.log('on');
      zadanieIndex.checked = true;
    } else {
      console.log('off');
      zadanieIndex.checked = false;
    }
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
  }
  ustawIndex(dane) {
    this.zadanieIndex = dane;
  }
  deleteTasks() {
    let tempTable = [];
    tempTable.push(...this.daneTestoweIndex.zadania);
    //foreach jak for tylko index schowany
    tempTable.forEach((x) => {
      if (x.checked === true) {
        const index = this.daneTestoweIndex.zadania.findIndex(
          (y) =>
            y.status === x.status &&
            y.tresc === x.tresc &&
            y.checked === x.checked
        );

        if (index > -1) {
          if (this.daneTestoweIndex.zadania[index].status === 'Zakonczone')
            this.daneTestoweIndex.zadaniaZakonczone -= 1;
          this.daneTestoweIndex.zadania.splice(index, 1);
        }
      }
    });
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
    // this.daneTestoweIndex = tempTable;
  }
  zmienStatus(
    wybranaOpcja: any,
    statusZadania: any //'W toku' | 'Zakonczone'
  ) {
    // console.log(wybranaOpcja)
    // console.log(statusZadania)
    if (wybranaOpcja === 'W toku') statusZadania.status = 'W toku';
    else if (wybranaOpcja === 'Zakonczone') {
      statusZadania.status = 'Zakonczone';
      // this.daneTekstoweIndex.zadaniaZakonczone.push(statusZadania)
      // console.log(statusZadania)
      // console.log(this.daneTekstoweIndex)
    }
    //statusZadania.status = wybranaOpcja;
    this.zakonczoneZadania = 0;
    for (var i = 0; i < this.daneTestoweIndex.zadania.length; i++) {
      if (this.daneTestoweIndex.zadania[i].status === 'Zakonczone')
        this.zakonczoneZadania += 1;
    }
    this.daneTestoweIndex.zadaniaZakonczone = this.zakonczoneZadania;
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
  }
  przeliczWykonane() {
    for (var i = 0; i < this.daneTestowe.length; i++) {
      this.zakonczoneZadania = 0;
      for (var j = 0; j < this.daneTestowe[i].zadania.length; j++) {
        if (this.daneTestowe[i].zadania[j].status === 'Zakonczone') {
          this.zakonczoneZadania += 1;
        }
      }
      this.daneTestowe[i].zadaniaZakonczone = this.zakonczoneZadania;
    }
    this._data.saveData('lista', JSON.stringify(this.daneTestowe));
  }
  selectWorker(dane) {
    this.selectedWorkerName = dane.firstName;
    this.selectedWorkerLastName = dane.lastName;
  }
  przeniesZadanie(_tresc, _status) {
    if (
      this.selectedWorkerName !== null &&
      this.selectedWorkerLastName !== null
    ) {
      let przenoszoneZadanie: TASKS[] = [
        {
          tresc: _tresc + " (przekazane od " + this.daneTestoweIndex.firstName + " " + this.daneTestoweIndex.lastName + ")",
          status: _status,
          checked: false,
        },
      ];

      // console.log(this.zadanieIndex);
      let _index = this.daneTestoweIndex.zadania.findIndex(
        (x) => x.tresc === _tresc
      );
      console.log(_index);
      this.daneTestoweIndex.zadania.splice(_index, 1);

      let y = this.daneTestowe.filter(
        (x) =>
          x.firstName === this.selectedWorkerName &&
          x.lastName === this.selectedWorkerLastName
      );
      y[0].zadania.push(przenoszoneZadanie[0]);
      this.przeliczWykonane();
      this.dialog.closeAll();
      this._data.saveData('lista', JSON.stringify(this.daneTestowe));
      // this.openDialogWithTemplateRef(templateRef, this.daneTestoweIndex);
    }
  }

  searchText = '';

  tr = null;
  ChangeColor(dane) {
    console.log(dane);
    if (this.tr !== null) this.tr.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this.tr = document.getElementById('tr' + dane);
    this.tr.style.backgroundColor = 'yellow';
  }
  searchFunction() {}

  daneTestowe: WORKER[] = [
    {
      firstName: 'Jan',
      lastName: 'Kowalski',
      zadania: [
        {
          tresc: 'zadanie pierwsze',
          status: 'W toku',
          checked: false,
        },
        {
          tresc: 'zadanie drugie',
          status: 'W toku',
          checked: false,
        },
        {
          tresc: 'zadanie drugie',
          status: 'W toku',
          checked: false,
        },
      ],
      zadaniaZakonczone: 0,
    },
    {
      firstName: 'szlips',
      lastName: 'biznesman',
      zadania: [
        {
          tresc: 'zadanie pierwsze',
          status: 'W toku',
          checked: false,
        },
        {
          tresc: 'zadanie drugie',
          status: 'W toku',
          checked: false,
        },
        {
          tresc: 'zadanie trzecie',
          status: 'W toku',
          checked: false,
        },
      ],
      zadaniaZakonczone: 0,
    },
  ];
}
