import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private supabase = createClient(
    'https://mwpdaktybatujiqclrru.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cGRha3R5YmF0dWppcWNscnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDM5NzUsImV4cCI6MjA4NTU3OTk3NX0.UadlRjAL8W41Z5sHVQ1oqw9ZfJLoCRAZsYyP6buHsRw',
    {
    auth: {
      persistSession: false   // disables lock issue
    }
    }
  );



  private state: any = null;
  sessionSeconds:any;
  private getUserId(): string {

    const player =
      JSON.parse(
        localStorage.getItem('player') || '{}'
      );
      console.log('player from user',player.player_id);

    return player.player_id || 'guest-user';

  }

  private getUsername(): string {

  const player =
    JSON.parse(
      localStorage.getItem('player') || '{}'
    );

  return player.username || '';

}

  async updateRoomState(room: string, roomData: any) {

  if (!this.state.rooms[room]) {
    this.state.rooms[room] = {};
  }

  this.state.rooms[room] = {
    ...this.state.rooms[room],
    ...roomData
  };

  await this.saveGame();
}

async updateSoundSetting(enabled: boolean) {

  if (!this.state) {
    await this.loadGame();
  }

  if (!this.state) {
    this.state = this.createNewGameState();
  }

  this.state.soundEnabled = enabled;

  await this.saveGame();
}

async getSoundSetting(): Promise<boolean> {

  if (!this.state) {
    await this.loadGame();
  }

  if (!this.state) {
    return true;
  }

  return this.state.soundEnabled;
}

async updateAchievements(data: any) {

  if (!this.state.achievements) {

    this.state.achievements = {
      receptionCompleted: false,
      bayAreaCompleted: false,
      hrAreaCompleted: false
    };

  }

  this.state.achievements = {
    ...this.state.achievements,
    ...data
  };

  await this.saveGame();
}

async achieveLevel(
  level: number
) {

  if (!this.state) {
    await this.loadGame();
  }

  this.state.currentLevel = level;

  await this.saveGame();
}

// UPDATE CURRENT ROOM
async setCurrentRoom(room: string) {

  this.state.currentRoom = room;

  await this.saveGame();
}

 // DEFAULT STATE
createNewGameState() {
  return {
    currentLevel: 1,
    soundEnabled: true,
    currentRoom: 'reception-room',

    achievements: {

      receptionCompleted: false,
  
      bayAreaCompleted: false,
  
      hrAreaCompleted: false
  
    },

    rooms: {
      // 🔹 RECEPTION ROOM
      'reception-room': {
        inventory: [],
        collectedItems: [],
        doorLetters: {
          M: false,
          A: false,
          D: false
        },
        doorFullyUnlocked: false,
        visited: true
      },

      // 🔹 BAY AREA
      'bay-area': {
        inventory: ['torch'],
        collectedItems: [],
        collectedCards: [],
        laptopUnlocked: false,
        hasTorch: false,
        hasEnvelope: false,
        hasEraser: false,
        hasIdCard: false,
        hasCharger: false,
        isHrDoorUnlocked: false,
        isDrawerUnlocked: false,
        chargerCollectedInDrawer: false,
        idCardCollectedInDrawer: false,
        isCupboardPuzzleSolved: false,
        isGlassUnlocked: false,
        powerPuzzleCompleted: false,
        powerOff: false,
        panelRevealed: false,
        hasChargerConnected: false,
        visited: false
      },

      // 🔹 HR ROOM
      'hr-room': {
      inventory: ['ID_CARD'],
      generatedMailDigits: '',
      hasKey: false,
      hasIdCard: false,
      hasBattery: false,
      lockerUnlocked: false,
      cupboardOpened: false,
      wallClockOn: false,
      isLaptopUnlocked: false,
      showWelcomeMessage: false,
      showNextArrow: false,
      isComputerPowered: false,
      isWireConnected: false,
      leftSwitchOn: false,
      rightSwitchOn: false,
      isCluesUnlocked: false,
      mailSentSuccessfully: false,
      pendingPopup: false,
      showComputerPopup: false,
      isMailApproved: false,
      clockTime: '',
      manualTimeSet: false,
      batteryInsertedInClock: false,
      visited: false
    }

    }
  };
}

  async timeupdate(){
    console.log('time update called');  
await this.supabase
  .from('level_timer')
  .update({
    end_date: new Date().toISOString()
    
  })
  
  .eq('user_id', this.getUserId())
  
}


  // START NEW GAME
  async startNewGame() {
    localStorage.setItem('gameStarted', 'true');
    this.state = this.createNewGameState();

    // await this.supabase
    //   .from('game_sessions')
    //   .upsert({
    //     user_id: this.getUserId(),
    //     username: this.getUsername(),
    //     game_data: this.state,
    //     updated_at: new Date().toISOString()
    //   },
    // {
    //   onConflict: 'user_id'   // FIX
    // });




    await this.supabase
  .from('game_sessions')
  .upsert(
    {
      user_id: this.getUserId(),
      username: this.getUsername(),
      game_data: this.state,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: 'user_id'
    }
  );



await this.supabase
  .from('level_timer')
  .upsert({
    user_id: this.getUserId(),
    level_no: 1,
    total_seconds: 0,
    last_started: new Date().toISOString(),
    is_running: true,
    start_date: new Date().toISOString(),
  });
}

  // LOAD GAME
  async loadGame() {
    const { data, error } = await this.supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', this.getUserId())
      .maybeSingle();
  console.log('user_id from gameservice', this.getUserId());
  
    if (error || !data) return null;

    this.state = data.game_data;
    if (this.state.soundEnabled === undefined) {
      this.state.soundEnabled = true;
    }

    return this.state;
  }

  // ✅ SAVE GAME
  async saveGame(completed: boolean = false) {
    if (!this.state) return;
 this.state.completed = completed;
    await this.supabase
      .from('game_sessions')
      .upsert({
        user_id: this.getUserId(),
        username: this.getUsername(),
        game_data: this.state,
        updated_at: new Date().toISOString()
      },
      {
      onConflict: 'user_id'   // FIX
      });
  }

      // ADD ITEM (MAIN FUNCTION)
      async addItem(item: string, room: string) {

      // Create room if not exists
      if (!this.state.rooms[room]) {
        this.state.rooms[room] = {};
      }

      // Create room inventory
      if (!this.state.rooms[room].inventory) {
        this.state.rooms[room].inventory = [];
      }

      // Add item only to room inventory
      if (!this.state.rooms[room].inventory.includes(item)) {
        this.state.rooms[room].inventory.push(item);
      }

      await this.saveGame();
    }

  // GET STATE
  getState() {
    return this.state;
  }

async getLeaderboard() {

  const { data, error } = await this.supabase
    .from('leaderboard')
    .select('*')
    .order('level_no', { ascending: false })
    .order('total_seconds', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}


// ================= TIMER METHODS =================

async startGameTimer() {

  const now = new Date().toISOString();

  const resetPayload = {
    user_id: this.getUserId(),
    level_no: 1,
    total_seconds: 0,
    total_seconds_timer: 0,
    total_minutes: 0,
    last_started: now,
    is_running: true,
    updated_at: now
  };

  await this.supabase
    .from('level_timer')
    .upsert(resetPayload, {
      onConflict: 'user_id'
    });
}

async pauseGameTimer() {

  const { data } = await this.supabase
    .from('level_timer')
    .select('*')
    .eq('user_id', this.getUserId())
    .maybeSingle();

  if (!data || !data.is_running) {
    return;
  }

  const elapsedSeconds = Math.floor(
    (Date.now() -
      new Date(data.last_started).getTime()) / 1000
  );

  await this.supabase
    .from('level_timer')
    .update({
      total_seconds: data.total_seconds + elapsedSeconds,
      is_running: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', data.id);
}

// async resumeGameTimer() {

//   await this.supabase
//     .from('level_timer')
//     .update({
//       last_started: new Date().toISOString(),
//       is_running: true,
//       updated_at: new Date().toISOString()
//     })
//     .eq('user_id', this.getUserId());
// }

async resumeGameTimer() {
  const { data } = await this.supabase
    .from('level_timer')
    .select('*')
    .eq('user_id', this.getUserId())
    .maybeSingle();

  if (!data || data.is_running) return;

  await this.supabase
    .from('level_timer')
    .update({
      last_started: new Date().toISOString(),
      is_running: true
    })
    .eq('id', data.id);
}

async updateLevel(levelNo: number) {

  await this.supabase
    .from('level_timer')
    .update({
      level_no: levelNo,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', this.getUserId());
}

async getCurrentTime(): Promise<number> {

  const { data } = await this.supabase
    .from('level_timer')
    .select('*')
    .eq('user_id', this.getUserId())
    .maybeSingle();

  if (!data) {
    return 0;
  }

  let totalSeconds = data.total_seconds;
console.log('gfgfgf', totalSeconds);

  if (data.is_running) {

    totalSeconds += Math.floor(
      (Date.now() -
        new Date(data.last_started).getTime()) / 1000
    );
  }

  return totalSeconds;
}

formatTime(seconds: number): string {

  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}


async saveLeaderboard(data: any) {
  return this.supabase
    .from('leaderboard')
    .insert([{
      player_name: data.player_name,
      total_seconds: data.total_seconds,
      completed_level: data.completed_level,
      is_running: data.completed
    }]);
}

private startTime: number = Date.now();
startGame() {
  this.startTime = Date.now();
}

getElapsedSeconds(): number {
  return Math.floor((Date.now() - this.startTime) / 1000);
}


async saveFinalCompletion(playerName: string) {
  const { data } = await this.supabase
    .from('level_timer')
    .select('*')
    .eq('user_id', this.getUserId())
    .maybeSingle();
  if (!data) return;
  let totalSeconds = data.total_seconds;
  if (data.is_running) {
    totalSeconds += Math.floor(
      (Date.now() -
        new Date(data.last_started).getTime()) / 1000
    );
  }

  await this.supabase
    .from('leaderboard')
    .upsert(
      {
        user_id: this.getUserId(),
        player_name: playerName,
        level_no: 3, // HR Room final level
        total_seconds: totalSeconds,
        is_running: true
      },
      {
        onConflict: 'user_id'
      }
    );
  return totalSeconds;
}


async completeGame(playerName: string,timerValue:any) {

  // 1. Fetch timer
  const { data, error } = await this.supabase
    .from('level_timer')
    .select('*')
    .eq('user_id', this.getUserId())
    .maybeSingle();

  if (error || !data) {
    console.log('Timer Error:', error);
    return { totalSeconds: 0, minutes: 0, seconds: 0 };
  }

  // 2. Existing seconds
  const existingSeconds = Number(data.total_seconds || 0);

  // 3. Session seconds
 if(data.is_running){
 this.sessionSeconds =data.total_seconds
  }else{
     this.sessionSeconds =data.total_seconds
  }

  // 4. Final total
  let totalSeconds = existingSeconds +this.sessionSeconds;
   console.log('total scobfs1',existingSeconds, this.sessionSeconds)
  const totalMinutes = Math.floor(totalSeconds / 60);

  console.log('Existing:', existingSeconds);
  console.log('Session:',this.sessionSeconds);
  console.log('Total:', totalSeconds);

    // totalSeconds= 123456;
  // 5. UPDATE TIMER TABLE (IMPORTANT)
  const { error: timerError } = await this.supabase
    .from('level_timer')
    .update({
      total_seconds: timerValue,
      total_seconds_timer: totalSeconds,
      total_minutes: totalMinutes,
      is_running: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', this.getUserId());

  if (timerError) {
    console.log('Timer Update Error:', timerError);
  }

  // 6. UPDATE LEADERBOARD
  const { error: leaderboardError } = await this.supabase
    .from('leaderboard')
    .upsert(
      {
        user_id: this.getUserId(),
        player_name: playerName,
        level_no: 3,
        total_seconds: totalSeconds
      },
      {
        onConflict: 'user_id'
      }
    );

  if (leaderboardError) {
    console.log('Leaderboard Error:', leaderboardError);
  }

  // 7. RETURN CLEAN RESULT
  return {
    totalSeconds,
    minutes: totalMinutes,
    seconds: totalSeconds % 60
  };
}


async getLeaderboardLive() {
  const { data, error } = await this.supabase
    .from('leaderboard_live')
    .select('*');
  if (error) {
    console.error('Leaderboard Live Error:', error);
    return [];
  }
  console.log('Leaderboard Live Data:', data);
  return data;
}
}