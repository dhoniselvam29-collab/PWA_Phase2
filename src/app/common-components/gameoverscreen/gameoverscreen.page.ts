import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';
import { LeaderboardlistPage } from 'src/app/leaderboardlist/leaderboardlist.page';
import { SettingsComponent } from 'src/app/settings/settings.component';

@Component({
  selector: 'app-gameoverscreen',
  templateUrl: './gameoverscreen.page.html',
  styleUrls: ['./gameoverscreen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    SettingsComponent
  ]
})
export class GameoverscreenPage implements OnInit {

  userRank: number | null = null;
  userName: string = '';
  showSettings = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private gameService: GameService
  ) {}

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  async ngOnInit() {
    await this.loadUserRank();

  
  const playerData = JSON.parse(localStorage.getItem('player') || '{}');

const currentPlayerId = playerData.player_id;

console.log('Current Player ID:', currentPlayerId);
  }

async loadUserRank() {
  try {
    const playerData = JSON.parse(
      localStorage.getItem('player') || '{}'
    );
    const currentPlayerId = playerData.player_id;
    console.log('Current Player ID:', currentPlayerId);
    const leaderboard = await this.gameService.getLeaderboardLive();
    const user = leaderboard.find(
      (item: any) => item.user_id === currentPlayerId
    );
    console.log('Matched User:', user);
    if (user) {
      this.userRank = user.rank;
      this.userName = user.username;
    }
  } catch (error) {
    console.error('Error loading rank:', error);
  }
}

  async goToLeaderboard() {
    const modal = await this.modalCtrl.create({
      component: LeaderboardlistPage,
      cssClass: 'leaderboard-modal'
    });

    await modal.present();
  }
}