import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { SoundService } from '../services/sound.service';
import { GameService } from '../services/game.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})

export class SettingsComponent {

  soundEnabled: boolean = true;

  receptionCompleted = false;
bayAreaCompleted = false;
hrAreaCompleted = false;

playerAvatar: string = '👾';

  @Output() closePopup =
    new EventEmitter<void>();

    constructor(
      private soundService: SoundService,
      private gameService: GameService,
      private router: Router

      
    ) {}

async ngOnInit() {
  this.soundEnabled =
  await this.gameService.getSoundSetting();

        const player =
    JSON.parse(
      localStorage.getItem('player') || '{}'
    );

  this.playerName =
    player.username || 'Intern Player';

    this.playerAvatar =
    player.avatar || '👾';


  // this.playerId =
  //   player.player_id || 'ZI-73';

  const state =
    await this.gameService.loadGame();

    if (state) {

      this.currentLevel =
        state.currentLevel || 1;
    
      const totalLevels = 4;
    
      this.progressPercentage =
        (this.currentLevel / totalLevels) * 100;
    }

  if (
    state &&
    state.achievements
  ) {

    this.receptionCompleted =
      state.achievements.receptionCompleted;

    this.bayAreaCompleted =
      state.achievements.bayAreaCompleted;

    this.hrAreaCompleted =
      state.achievements.hrAreaCompleted;


      let completedCount = 0;

if (this.receptionCompleted) {
  completedCount++;
}

if (this.bayAreaCompleted) {
  completedCount++;
}

if (this.hrAreaCompleted) {
  completedCount++;
}

this.progressPercentage =
  (completedCount / 3) * 100;
  }
    }
  

  activeTab: string = 'player';

  selectedOption: string = 'player';

  soundVolume: number = 70;

  currentLevel: number = 1;

  puzzlesSolved: number = 18;

  roomsCleared: number = 7;

  currentRoom: string = 'HR Department';

  difficulty: string = 'Office Survivor';

  playerName: string = 'Intern Player';

  playerId: string = 'ZI-73';

  progressPercentage: number = 0;

  achievements = [
    'Puzzle Master',
    'Fast Escape',
    'HR Hacker',
    'Code Breaker'
  ];

  openLeaderboard() {
    console.log('Open Leaderboard');
  }




  async toggleSound(event: any) {

    this.soundEnabled =
      event.detail.checked;
  
    this.soundService.setSoundEnabled(
      this.soundEnabled
    );
  
    await this.gameService.updateSoundSetting(
      this.soundEnabled
    );
  }
 
  confirmLogout() {
  
    this.closePopup.emit();
  
    this.router.navigateByUrl('/login');
  }
  
  cancelLogout() {
  
    this.closeSettings();
  }

  closeSettings() {
    this.closePopup.emit();
  }

}