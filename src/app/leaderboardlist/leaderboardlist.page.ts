import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-leaderboardlist',
  templateUrl: './leaderboardlist.page.html',
  styleUrls: ['./leaderboardlist.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class LeaderboardlistPage implements OnInit {

   leaderboard: any[] = [];

currentUserId: string = '';
  constructor(
    private gameService: GameService,
    private modalCtrl: ModalController
  ) { }

//   async ngOnInit() {


//       const player = JSON.parse(localStorage.getItem('player') || '{}');
//   this.currentUserId = player.player_id;

//   this.leaderboard = await this.gameService.getLeaderboardLive();
//     console.log('Leaderboard:', this.leaderboard);

    
//     // await this.loadLeaderboard();

//   }


isLoading = true;
loadingMessage = 'Verifying Visitor Access...';

async ngOnInit() {
  this.isLoading = true;

  try {
    const player = JSON.parse(localStorage.getItem('player') || '{}');
    this.currentUserId = player.player_id;

    const data = await this.gameService.getLeaderboardLive();

  this.leaderboard = data
  .filter((item: any) => item.level_no === 3);

    console.log(' 3 Leaderboard:', this.leaderboard);

  } catch (error) {
    console.error('Error loading leaderboard:', error);
  } finally {
    this.isLoading = false;
  }
}

closeModal() {
  this.modalCtrl.dismiss();
}

  formatTime(seconds: number): string {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}m ${secs}s`;

  }
async ionViewWillEnter() {

  // this.leaderboard =

  //   await this.gameService.getLeaderboard();

}

  async loadLeaderboard() {

    this.leaderboard = await this.gameService.getLeaderboard();

  }


// formatTime(seconds: number): string {

//   return this.gameService.formatTime(seconds);

// }

}
