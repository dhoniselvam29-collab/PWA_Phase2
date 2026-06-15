import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import {
  CommonModule,
  NgClass,
  NgFor,
  NgIf
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  IonicModule,
  ModalController
} from '@ionic/angular';



interface Book {
  color: string;
  type: 'vertical' | 'horizontal';
}

interface Slot {
  id: string;
  books: Book[];
  clickCount: number;
  mode: 'vertical' | 'horizontal';
}

@Component({
  selector: 'app-cupboardlock-modal',
  templateUrl: './cupboardlock-modal.component.html',
  styleUrls: ['./cupboardlock-modal.component.scss'],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgClass,
    NgFor,
    NgIf
  ]
})


export class CupboardlockModalComponent {

  constructor(
    private modalCtrl: ModalController , private gameService: GameService
  ) {}

  squareSound = new Audio('assets/sounds/click.mp3');
  clickSound3 = new Audio('assets/sounds/hex.mp3');

  colorOrder = [
    'blue',
    'green',
    'red'
  ];

  maxBooksPerSlot = 8;

  isUnlocked = false;

  correctPattern: { [key: string]: Book[] } = {

    A1: [
      { color: 'green', type: 'vertical' },
      { color: 'blue', type: 'vertical' },
      { color: 'red', type: 'vertical' },
      { color: 'blue', type: 'vertical' }
    ],

    A2: [
      { color: 'blue', type: 'vertical' },
      { color: 'red', type: 'vertical' },
      { color: 'blue', type: 'vertical' }
    ],

    A3: [
      { color: 'blue', type: 'horizontal' },
      { color: 'green', type: 'horizontal' },
      { color: 'red', type: 'horizontal' },
      { color: 'blue', type: 'horizontal' }
    ],

    A4: [
      { color: 'blue', type: 'vertical' },
      { color: 'blue', type: 'vertical' },
      { color: 'red', type: 'vertical' }
    ],

    A5: [
      { color: 'green', type: 'vertical' }
    ],

    A6: [
      { color: 'red', type: 'horizontal' },
      { color: 'blue', type: 'horizontal' }
    ]
  };

  slots: Slot[] = [

    {
      id: 'A1',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    },

    {
      id: 'A2',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    },

    {
      id: 'A3',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    },

    {
      id: 'A4',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    },

    {
      id: 'A5',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    },

    {
      id: 'A6',
      books: [],
      clickCount: 0,
      mode: 'vertical'
    }
  ];

  addBook(slot: Slot) {
    this.playSquareSound();


    if (slot.clickCount === 4) {

      slot.books = [];

      slot.clickCount = 0;

      slot.mode =
        slot.mode === 'vertical'
          ? 'horizontal'
          : 'vertical';
    }

    slot.books.push({
      color: 'blue',
      type: slot.mode
    });

    slot.clickCount++;

    this.checkUnlock();
  }

  changeColor(
    slot: Slot,
    index: number
  ) {
    this.playhex();

    const current =
      slot.books[index].color;

    const nextIndex =
      (
        this.colorOrder.indexOf(current) + 1
      ) % this.colorOrder.length;

    slot.books[index].color =
      this.colorOrder[nextIndex];

    this.checkUnlock();
  }

  checkUnlock() {

    const solved =
      this.slots.every(slot => {

      const correct =
        this.correctPattern[slot.id];

      if (!correct) return false;

      if (
        slot.books.length !== correct.length
      ) {
        return false;
      }

      return slot.books.every(
        (book, index) =>

        book.color === correct[index].color &&
        book.type === correct[index].type
      );
    });

    if (solved) {

      this.isUnlocked = true;



        this.modalCtrl.dismiss({
          unlocked: true
        });


    }
  }

  closeModal() {

    this.modalCtrl.dismiss();
  }

 async playSquareSound() {
    const soundEnabled =
    await this.gameService.getSoundSetting();

  if (!soundEnabled) {
    return;
  }
    this.squareSound.currentTime = 0;
    this.squareSound.volume = 0.5;
    this.squareSound.play();

  }

 async playhex() {
    const soundEnabled =
  await  this.gameService.getSoundSetting();

  if (!soundEnabled) {
    return;
  }

    this.clickSound3.currentTime = 0;
    this.clickSound3.volume = 0.8;
    this.clickSound3.play();
  }
}