import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-drawer-lock-modal',
  templateUrl: './drawer-lock-modal.component.html',
  styleUrls: ['./drawer-lock-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DrawerLockModalComponent {

  constructor(private modalCtrl: ModalController, private gameService: GameService) {}

  clickSound = new Audio('../../../../assets/sounds/picker.mp3');

  // Current numbers
  lockValues = {
    red: 1,
    yellow: 1,
    green: 1,
    blue: 1
  };

  // Correct Pattern = 2245
  correctCode = {
    red: 2,
    yellow: 2,
    green: 4,
    blue: 5
  };

  wrongAttempt = false;

  cycle(color: 'red' | 'yellow' | 'green' | 'blue') {
    this.playClick2();
    this.lockValues[color] =
      this.lockValues[color] === 5
        ? 1
        : this.lockValues[color] + 1;
  }

  checkCode() {

    const isCorrect =
      this.lockValues.red === this.correctCode.red &&
      this.lockValues.yellow === this.correctCode.yellow &&
      this.lockValues.green === this.correctCode.green &&
      this.lockValues.blue === this.correctCode.blue;

    if (isCorrect) {
      this.modalCtrl.dismiss({ unlocked: true });
    } else {
      this.wrongAttempt = true;

      setTimeout(() => {
        this.wrongAttempt = false;
      }, 400);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
async  playClick2() {
  const soundEnabled =
    await this.gameService.getSoundSetting();

  if (!soundEnabled) {
    return;
  }
  
    this.clickSound.currentTime = 0;
    this.clickSound.volume = 0.8;
    this.clickSound.play();
  }
}
