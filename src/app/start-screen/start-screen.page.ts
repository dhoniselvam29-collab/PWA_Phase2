import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { createClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.page.html',
  styleUrls: ['./start-screen.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class StartScreenPage {
  ionViewWillEnter() {
  this.showTransition = false;
}

  constructor(
    private router: Router,
    private gameService: GameService
  ) {}
  
  showNoSavePopup = false;
  popupMessage = '';
  showTransition = false;

  private supabase = createClient(
    'https://mwpdaktybatujiqclrru.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cGRha3R5YmF0dWppcWNscnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDM5NzUsImV4cCI6MjA4NTU3OTk3NX0.UadlRjAL8W41Z5sHVQ1oqw9ZfJLoCRAZsYyP6buHsRw',
    {
    auth: {
      persistSession: false   // disables lock issue
    }
    }
  );
async newGame() {

  await this.gameService.startNewGame();

  await this.gameService.startGameTimer(); // reset timer to 0

  this.showTransition = true;

  setTimeout(() => {

    this.router.navigateByUrl('/reception-room');

  }, 2000);

}

async resumeGame() {
  localStorage.setItem('gameStarted', 'true');
  const data = await this.gameService.loadGame();

  console.log('Resume Data:', data);

  if ( !data || !data.currentRoom) {
  this.popupMessage = 'No saved game found';
  this.showNoSavePopup = true;
  return;
  }
  await this.gameService.resumeGameTimer();
  const room = data.currentRoom;
  const routes: any = {
    'reception-room': '/reception-room',
    'bay-area': '/office-bay',
    'hr-room': '/hr-room',
    'gameover': '/gameoverscreen'
  };

  this.router.navigateByUrl(routes[room] || '/reception-room');

}


  private getUserId(): string {

    const player =
      JSON.parse(
        localStorage.getItem('player') || '{}'
      );
console.log('player',player);
console.log('eeeeee',player[0].player_id);

    return player[0].player_id || 'guest-user';

  }
async startGameTimer() {
  const now = new Date().toISOString();
  await this.supabase
    .from('level_timer')
    .upsert(
      {
        user_id: this.getUserId(),
        level_no: 1,
        total_seconds: 0,
        last_started: now,
        is_running: true,
        updated_at: now
      },
      {
        onConflict: 'user_id'
      }
    );
  console.log('TIMER RESET TO 0');
}

}