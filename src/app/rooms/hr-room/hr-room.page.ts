import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { GameService } from '../../services/game.service';
import { IonicModule } from '@ionic/angular';
import { SoundService } from 'src/app/services/sound.service';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { TimerService } from 'src/app/services/timer';
import { Router } from '@angular/router';

type HrView =
  | 'main'
  | 'exit'
  | 'side' 
  | 'table1'
  | 'table2'
  | 'closedlocker' 
  | 'panel'
  | 'openedlocker' 
  | 'computer'
  | 'unplugged'
  | 'plugged'
  | 'bookshelf'      
  | 'bookshelf1'    
  | 'bookshelf2'         
  | 'bookshelf3' 
  | 'tray'
  | 'key'
  | 'idcard'
  | 'noticeboard'
  | 'yellowNote'
  | 'blueNote'
  | 'lockerPuzzle'
  | 'statistics'
  | 'clock'         
  | 'biometric'
  | 'dustbin'
  | 'unfoldedpaper'
  | 'bluebox'
  | 'openedbox'
  | 'mobilezoom'
  | 'table'
  | 'mobile' 
  | 'cupboard'
  | 'opencupboard'
  | 'openedBook'
  | 'zoomedlocker'
  | 'openedkeylocker'
  | 'zoomedtable2'
  | 'zoomedmonitor'
  | 'zoomedframe'
  | 'photoframe'
  | 'openedexit'
  | 'successscreen'
  

@Component({
  selector: 'app-hr-room',
  // standalone: true,
  templateUrl: './hr-room.page.html',
  styleUrls: ['./hr-room.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, SettingsComponent],
})
export class HrRoomPage {

  isLoading = true;
  loadingMessage = 'Connecting to HR Terminal...';
    
timerValue:any;
  constructor( private gameService: GameService , private soundService: SoundService,public timerservice:TimerService, private router: Router,) {}
  async ionViewDidEnter() {
await this.gameService.updateLevel(3);
}

async ionViewWillEnter() {

  await this.initializeMailClue();

}
async ngOnInit() {

  await this.gameService.setCurrentRoom(
    'hr-room'
  );
  this.isLoading = true;

   this.timerservice.timer$.subscribe(value => {
      this.timerValue = value;
      console.log(this.timerValue,'timerValue...office bay');
      
    });
 const result = await this.gameService.completeGame(
      localStorage.getItem('player_name') || 'Player',this.timerValue
    );
    console.log('Completed Time:', result);
  const data = await this.gameService.loadGame();

  if (!data) return;

  const room =
    data.rooms['hr-room'] || {};

  // ✅ inventory
  this.hrInventory =
    room.inventory || [];

    if (!this.hrInventory.includes('ID_CARD')) {

  this.hrInventory.push('ID_CARD');

  await this.gameService.addItem(
    'ID_CARD',
    'hr-room'
  );


}

  // ✅ restore collected items
  this.hasKey =
    room.hasKey || false;

  this.hasIdCard =
    room.hasIdCard || false;

  this.hasBattery =
    room.hasBattery || false;

  this.keyLockerOpened =
  room.keyLockerOpened || false;

  // ✅ restore puzzle states
  this.lockerUnlocked =
    room.lockerUnlocked || false;

  this.cupboardOpened =
    room.cupboardOpened || false;

  this.wallClockOn =
    room.wallClockOn || false;

  this.isComputerPowered =
    room.isComputerPowered || false;

  this.isWireConnected =
    room.isWireConnected || false;

  this.isMailApproved =
    room.isMailApproved || false;

  this.leftSwitchOn =
    room.leftSwitchOn || false;

  this.rightSwitchOn =
    room.rightSwitchOn || false;

  this.isCluesUnlocked =
  room.isCluesUnlocked || false;

  this.manualTimeSet =
  room.manualTimeSet || false;

  this.batteryInsertedInClock =
  room.batteryInsertedInClock || false;

  this.clockTime =
    room.clockTime || '';

  if (this.clockTime) {

  const [hh, mm] =
    this.clockTime.split(':').map(Number);

  this.displayHours = hh;
  this.displayMinutes = mm;

  this.mobileTime = this.clockTime;
}

  this.mailSentSuccessfully =
    room.mailSentSuccessfully || false;

  this.pendingPopup =
    room.pendingPopup || false;

  this.showComputerPopup =
    room.showComputerPopup || false;

  this.showWelcomeMessage =
  room.showWelcomeMessage || false;

this.showNextArrow =
  room.showNextArrow || false;

const isLaptopUnlocked =
  room.isLaptopUnlocked || false;

  if (isLaptopUnlocked) {
  this.showEmployeeData = false;

  // arrow not clicked yet
  if (this.showWelcomeMessage) {
    this.showLaptopWallpaper = false;
  }

  else {
    this.showLaptopWallpaper = true;
    this.isOnLaptopScreen = true;
  }
}

if (
  this.showWelcomeMessage &&
  !this.showNextArrow
) {

  setTimeout(() => {

    this.showNextArrow = true;

    this.gameService.updateRoomState(
      'hr-room',
      {
        showNextArrow: true
      }
    );

  }, 3000);
}
this.exitUnlocked =
  room.exitUnlocked || false;

  //  restore clock
  this.clockTime =
    room.clockTime || '';

  if (this.wallClockOn) {
    this.startWallClock();
  }

  setTimeout(() => {
      this.isLoading = false;
    }, 800);
  this.soundEnabled =
await this.gameService.getSoundSetting();

this.soundService.setSoundEnabled(
  this.soundEnabled
);

this.soundService.soundEnabled$
  .subscribe(value => {

    this.soundEnabled = value;

    if (!value) {
      // this.stopAllSounds();
    }

  });
}

  currentView: HrView = 'main';
  viewStack: HrView[] = [];
  imageLoaded = false;
  isWireConnected = false;
  isComputerPowered = false;
  hasKey = false;
  showEmployeeData = false;
  hrInventory: string[] = [];
  keyFlying = false;
  hasIdCard = false;
  lockerUnlocked = false;
enteredCode = '';
showMenuIcon = false;
showAppsRow = false;
keyLockerOpened = false;
emptyPasswordError = false;
errorState = false;

soundEnabled = true;

lockerTiles: number[] = [1, 1, 1]; // all start with color1
maxColor = 8;

correctSequence = [7, 2, 4];
activeLocker: 'groupA' | 'groupB' | 'groupC' | 'locker4' | null = null;
correctCode = 'ZI73';

generatedMailId = '';
generatedMailDigits = '';

  images: Record<HrView, string> = {
    main: 'assets/images/hr-room/main_view.png',
    exit: 'assets/images/hr-room/exit_view.png',
    side: 'assets/images/hr-room/side_view.png',
    table1: 'assets/images/hr-room/table_view1.png',
    table2: 'assets/images/hr-room/table_view2.png',
    closedlocker: 'assets/images/hr-room/closedlocker.png',
    panel: 'assets/images/hr-room/panelcode.png',
    openedlocker: 'assets/images/hr-room/openedlocker.png',
    computer: 'assets/images/hr-room/computer.png',
    unplugged: 'assets/images/hr-room/unplug.png',
    plugged: 'assets/images/hr-room/plugged.png',
    bookshelf: 'assets/images/hr-room/bookshelf.png',
    bookshelf1: 'assets/images/hr-room/bookshelf_1.png',
    bookshelf2: 'assets/images/hr-room/bookshelf_2.png',
    bookshelf3: 'assets/images/hr-room/bookshelf_3.png', 
    tray: 'assets/images/hr-room/tray.png',
    key: 'assets/images/reception-room/key.png',
    idcard: 'assets/images/hr-room/id_card.png',
    noticeboard: 'assets/images/hr-room/noticeboard.png',
    yellowNote: 'assets/images/hr-room/stickynote.png',
    blueNote: 'assets/images/hr-room/stickynote1.png',
    statistics: 'assets/images/hr-room/statistics.png',
    clock: 'assets/images/hr-room/clock.png',
    biometric: 'assets/images/hr-room/biometric.png',
    dustbin: 'assets/images/hr-room/dustbin.png',
    unfoldedpaper: 'assets/images/hr-room/unfoldedpaper.png',
    bluebox: 'assets/images/hr-room/box.png',
    openedbox: 'assets/images/hr-room/openedbox.png',
    mobilezoom: 'assets/images/hr-room/mobile_zoom.png',
    table: 'assets/images/hr-room/wooden_table.png',
    mobile: 'assets/images/hr-room/mobile.png',
    cupboard: 'assets/images/hr-room/cupboard.png',
    opencupboard: "assets/images/hr-room/opencupboard.png",
    openedBook: "assets/images/hr-room/openedbook.png",
    zoomedlocker: 'assets/images/hr-room/zoomedlocker.png',
    openedkeylocker: 'assets/images/hr-room/openedkeylocker.png',
    zoomedtable2: 'assets/images/hr-room/zoomedtable2.png',
    zoomedmonitor: 'assets/images/hr-room/zoomedmonitor.png',
    zoomedframe: 'assets/images/hr-room/zoomedframe.png',
    photoframe: 'assets/images/hr-room/photoframe.png',
    openedexit: 'assets/images/hr-room/openedexitview.png',
    lockerPuzzle: '',
    successscreen: 'assets/images/hr-room/successscreen.png',
    
  };

  clickSound = new Audio('assets/sounds/click.mp3');
  playClick() {

    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }

    this.clickSound.currentTime = 0;
    this.clickSound.play();
    this.clickSound.volume = 0.4;
  }

  playPicker() {

    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/picker.mp3');
    sound.volume = 0.6;
    sound.play();
  }

  playSquare() {

    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/square.mp3');
    sound.volume = 0.6;
    sound.play();
  }

  playColor() {

    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/color.mp3');
    sound.volume = 0.6;
    sound.play();
  }

  playRoman() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
  const sound = new Audio('assets/sounds/hex.mp3');
  sound.volume = 0.7;
  sound.play();
  }

  playKey() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/key.mp3');
    sound.volume = 0.7;
    sound.play();
  }

  playLetter() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/letters.mp3');
    sound.volume = 0.7;
    sound.play();
  }

  playMAD() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/mad.mp3');
    sound.volume = 0.7;
    sound.play();
  }

  playCupboard() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/cupboard.mp3');
    sound.volume = 0.7;
    sound.play();
  }

  playHex() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
    const sound = new Audio('assets/sounds/hex.mp3');
    sound.volume = 0.7;
    sound.play();
  }

  playTorch() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
  const sound = new Audio('assets/sounds/letters.mp3');
  sound.volume = 0.7;
  sound.play();
  }

  playDoorUnlocked() {
    if (
      !this.soundService.getSoundEnabled()
    ) {
      return;
    }
  const sound = new Audio('assets/sounds/door-unlocked.mp3');
  sound.volume = 0.8;
  sound.play();
  }

  // bgMusic = new Audio(
  //   'assets/audio/hr-room-bg.mp3'
  // );

  isDragging = false;
  dragItem: string | null = null;
dragX = 0;
dragY = 0;

  showUnlock = false;
  showPattern = false;
  unlockHiding = false;

  lockTime: string = '';
lockDate: string = '';
lockTimer: any;
  
  dots = Array(9).fill(0);

  activeHint: string | null = null;

  showLetterPopup = false;
  showPuzzlePopup: boolean = false;
  letterRows: string[][] = [
    ['A', 'A'], // row 1
    ['A', 'A'], // row 2
    ['A', 'A']  // row 3
  ];
  
  correctLetters = [
    ['F', 'E'],
    ['C', 'B'],
    ['F', 'C']
  ];

  patternDots = [1,2,3,4,5,6,7,8,9];
  drawing = false;
selectedDots: number[] = [];
drawingPattern = false;
svgPath = '';

showHrBg = false;
hrBgClicked = false;

exitUnlocked = false;

linePoints = '';
isDrawing = false;
isSuccess = false;
isError = false;

errorMessage: string = '';
showError: boolean = false;
errorTimer: any = null;
errorPositionClass : 'key' | 'computer' | 'Biometricdenied' | 'IDdenied' | 'activeclock' | 'exitdenied' | 'battery' | 'computerpower' | 'sequence' | 'computeroff' = 'key' ;
isBoxOpened = false;

showMobileApps = false;

isInternApproved = false;

patternSuccess = false;
patternError = false;
hidePatternUI = false;

showWelcomeMessage = false;
showNextArrow = false;
showCodeScreen = false;
employeeCodeInput = '';
codeError = false;
mailSentSuccessfully = false;
pendingPopup = false;

showComputerPopup = false;
showMessageScreen = false;
showApprovalScreen = false;
isOnLaptopScreen = false;
isMailApproved: boolean = false;

showMailClueCard = false;

hours: number = 14;
minutes: number = 30;

wallClockOn: boolean = false;
showWallpaper = false;
showLaptopWallpaper = false;

wallHours: number = 0;
wallMinutes: number = 0;

editMode = false;
mobileNavStack: string[] = [];

displayHours: number = 0;
displayMinutes: number = 0;

editHours: number = 0;
editMinutes: number = 0;

manualTimeSet: boolean = false;
batteryInsertedInClock = false;

biometricResult: 'granted' | 'denied' | null = null;

mailState: 'loading' | 'form' | 'success' | 'approved' = 'loading';
mailTo: string = '';
empId: string = '';

showMailError: boolean = false;

clockInterval: any = null;

clockTime: string = '';

correctPattern: number[] = [2, 4, 8, 6];
jumpMap: any = {
  '1-3': 2, '3-1': 2,
  '1-7': 4, '7-1': 4,
  '3-9': 6, '9-3': 6,
  '7-9': 8, '9-7': 8,
  '1-9': 5, '9-1': 5,
  '3-7': 5, '7-3': 5,
  '2-8': 5, '8-2': 5,
  '4-6': 5, '6-4': 5
};

currentTime: string = '';
editableTime: string = '';
editTime = false;

leftSwitchOn = false;
rightSwitchOn = false;
isCluesUnlocked = false;

showSettings = false;

mobileHours: number = 0;
mobileMinutes: number = 0;

mobileTime: string = '';

cupboardNumbers:any = ['','','','',''];

cupboardInput:number[] = [];

cupboardAnswer:number[] = [8,3,6,5,4];

cupboardDigits: string[] = ['', '', '', '', ''];
openSection: string | null = null;

cursorIndex = -1;

cupboardPassword = "83654";

blinkWrong = false;
showLockerPopup = false;

cupboardOpened = false;

inputStarted:boolean = false;

selectedPalette: number | null = null;

activeApp: 
  | 'apps' 
  | 'timer' 
  | 'native' 
  | 'react'
  | 'docs'
  | 'drive'
  | 'files'
  | 'mail'
  | 'zoom' 
  = 'apps';

hintText = '';
hintTimer: any;

clockPowered = false;
// clockTime = '';
clockTimer: any;

showIdCardPreview = false;
  
startDrag(item: string, event: MouseEvent) {

  event.preventDefault();

  const allowedItems = ['KEY', 'BATTERY', 'ID_CARD'];

  if (!allowedItems.includes(item)) {
    return;
  }

  this.isDragging = true;

  this.dragItem = item;

  this.dragX = event.clientX;
  this.dragY = event.clientY;
}


showInventoryItem(item: string) {

  if (item === 'ID_CARD') {
    this.showIdCardPreview = true;
  }

}

async initializeMailClue() {

  if (!this.gameService.getState()) {
    await this.gameService.loadGame();
  }

  const state = this.gameService.getState();

  const roomState =
    state?.rooms?.['hr-room'];

  if (roomState?.generatedMailDigits) {

    this.generatedMailDigits =
      roomState.generatedMailDigits;

  } else {

    this.generatedMailDigits =
      Math.floor(
        100 + Math.random() * 900
      ).toString();

    await this.gameService.updateRoomState(
      'hr-room',
      {
        generatedMailDigits:
          this.generatedMailDigits
      }
    );
  }

  this.generatedMailId =
    `hrmanagement${this.generatedMailDigits}@zi.com`;
}

  // startInventoryDrag(item: string, event: MouseEvent) {

  //   if (item !== 'KEY') return;
  
  //   event.preventDefault();
  
  //   this.isInventoryDragging = true;
  //   this.dragItem = item;
  
  //   this.inventoryDragX = event.clientX;
  //   this.inventoryDragY = event.clientY;
  
  // }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
  
    if (!this.isDragging) return;
  
    this.updateDragPosition(event);
  }

// stopAllSounds() {

//   this.bgMusic.pause();
//   this.bgMusic.currentTime = 0;
// }


hintMessages: Record<string, string> = {
  zoomedlocker:
    "Ignore the letters for a moment and focus on the sequence created by the colors. - safe pattern",

  closedlocker:
    "Art often hides more than it shows. - locker pattern",

  zoomedmonitor:
    "What seems thrown away might still hold value - system password"
};

toggleHint(view: string): void {
  this.activeHint =
    this.activeHint === view ? null : view;
}

closeHint(): void {
  this.activeHint = null;
}

useKeyOnBox() {

  if (!this.hrInventory.includes('KEY')) return;

  if (this.dragItem !== 'KEY') return;

  this.dragItem = null;
  this.isBoxOpened = true;
  this.currentView = 'openedbox';
  this.imageLoaded = false;

}

toggleSettings() {
  this.showSettings = !this.showSettings;
}

openSuccessScreen() {
this.gameService.timeupdate();

  this.playClick();

  this.viewStack.push(this.currentView);

  // this.currentView = 'successscreen';
// this.goToGameOver()
  this.imageLoaded = false;
}
//   goToGameOver() {
//   this.router.navigate(['/gameoverscreen']);
// }

handleComputerClick() {

  if (!this.isComputerPowered) {
    this.showGameError(
      'Turn on the Computer',
      'computer'
    );

    setTimeout(() => {
      return;
    }, 2000);
    return;
  }
}

handleBoxClick() {

  if (this.isBoxOpened) {
    return;
  }

  // Key missing
  if (!this.hrInventory.includes('KEY')) {

    this.showGameError(
      'The key is missing' ,
      'key'
    );

    setTimeout(() => {
      return;
    }, 2000);

    return;
  }

}

handleBiometricClick() {

  if (this.hrInventory.includes('ID_CARD')) {
    this.showGameError('Scan the ID Card',
    'IDdenied'
    );

    setTimeout(() => {
      return;
    }, 2000);
    return;
  }

}

handleClockClick() {

  if (!this.batteryInsertedInClock) {

    this.showGameError(
      'Insert the battery',
      'battery'
    );

    setTimeout(() => {
      return;
    }, 2000);

    return;
  }

  // Battery already inserted
  // this.currentView = 'clock';
  // this.imageLoaded = false;
}


showGameError(
  message: string,
  positionClass: 'key' | 'computer' | 'Biometricdenied' | 'IDdenied' | 'activeclock' | 'exitdenied' | 'computerpower' | 'sequence' | 'battery' | 'computeroff' = 'key'
) {

  if (this.errorTimer) {
    clearTimeout(this.errorTimer);
  }

  this.errorMessage = message;
  this.errorPositionClass = positionClass;
  this.showError = true;

  this.errorTimer = setTimeout(() => {
    this.showError = false;
    this.errorMessage = '';
    // this.errorPositionClass = '';
  }, 2000);
}

showUnpluggedView() {

  if (!this.isComputerPowered) {
    this.viewStack.push(this.currentView);
    this.currentView = 'unplugged';
    this.imageLoaded = false;
  }

}

cycleLetter(row: number, col: number) {
  this.playPicker();

  const current = this.letterRows[row][col];

  const nextChar =
    current === 'F'
      ? 'A'
      : String.fromCharCode(current.charCodeAt(0) + 1);

  this.letterRows[row][col] = nextChar;

  this.checkLetterPuzzle();
}


openLetterPopup() {
  this.showLetterPopup = true;
}


closeLetterPopup() {
  this.showLetterPopup = false;
}

checkLetterPuzzle() {

  const isCorrect = this.letterRows.every((row, i) =>
    row.every((val, j) => val === this.correctLetters[i][j])
  );

  if (isCorrect) {

    setTimeout(() => {
      this.showLetterPopup = false;

      this.keyLockerOpened = true;
      this.playCupboard();

      this.gameService.updateRoomState(
        'hr-room',
        {
          keyLockerOpened: true
        }
      );

      this.currentView = 'openedkeylocker'; 
      this.imageLoaded = false;

    }, 300);
  }
}
  
openSocketZoom() {
  console.log('clicked socket');
  if (this.currentView === 'table2') {
    this.viewStack.push(this.currentView);
    this.currentView = 'zoomedtable2';
    this.imageLoaded = false;
  }
}

toggleLeftSwitch() {

  this.leftSwitchOn = !this.leftSwitchOn;
  this.isComputerPowered = this.leftSwitchOn;

  if (this.isComputerPowered) {
    this.playKey();
    this.showEmployeeData = false;

    this.showHrBg = true;
    this.hrBgClicked = false;

    // ✅ KEY FIX
    if (this.mailSentSuccessfully) {

      if (this.isOnLaptopScreen) {
        this.triggerComputerPopup();
      } else {
        this.pendingPopup = true;
      }

    }

  } else {

    this.showEmployeeData = false;
    this.showHrBg = false;
    this.hrBgClicked = false;
  }

  this.gameService.updateRoomState(
  'hr-room',
  {
    leftSwitchOn: this.leftSwitchOn,
    isComputerPowered: this.isComputerPowered
  }
);

}

triggerComputerPopup() {

  setTimeout(() => {
    this.showComputerPopup = true;
     this.gameService.updateRoomState(
   'hr-room',
      {
        showComputerPopup: true
      }
    );

    this.mailSentSuccessfully = false;

  }, 1500);

}

toggleRightSwitch() {
  this.rightSwitchOn = !this.rightSwitchOn;
  this.gameService.updateRoomState(
  'hr-room',
  {
    rightSwitchOn: this.rightSwitchOn
  }
);
}

onHrBgClick() {

  if (!this.isComputerPowered) return;

  this.hrBgClicked = true;

  setTimeout(() => {
    this.showHrBg = false;
  }, 300);
}

@HostListener('document:mouseup', ['$event'])
async onMouseUp(event: MouseEvent) {


  if (this.dragItem === 'KEY' && this.currentView === 'bluebox') {

    const dropZone = document.querySelector('.box-drop-zone') as HTMLElement;

    if (dropZone) {

      const rect = dropZone.getBoundingClientRect();

      const inside =
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom;

      if (inside) {

        this.currentView = 'openedbox';
        this.imageLoaded = false;
      }
    }
  }
  

  if (this.dragItem === 'BATTERY' && this.currentView === 'exit') {

    const clock = document.querySelector('.clock-zone') as HTMLElement;
  
    if (clock) {
  
      const rect = clock.getBoundingClientRect();
  
      const insideClock =
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom;
  
      if (insideClock) {
  
        this.wallClockOn = true;
if (!this.manualTimeSet) {
const now = new Date();
const hh = now.getHours().toString().padStart(2,'0');
const mm = now.getMinutes().toString().padStart(2,'0');

this.clockTime = `${hh}:${mm}`;
}
this.startWallClock();

await this.gameService.updateRoomState(
  'hr-room',
  {
    wallClockOn: true,
    batteryInsertedInClock: true,
    clockTime: this.clockTime
  }
);
      }
    }
  }

if (this.dragItem === 'ID_CARD' && this.currentView === 'biometric') {

  const biometric = document.querySelector(
    '.biometric-drop-zone'
  ) as HTMLElement;

  if (biometric) {

    const rect = biometric.getBoundingClientRect();

    const inside =
      event.clientX > rect.left &&
      event.clientX < rect.right &&
      event.clientY > rect.top &&
      event.clientY < rect.bottom;

    if (inside) {

      this.dragItem = null;

      if (!this.isMailApproved) {

        this.biometricResult = 'denied';

        this.showGameError(
          '⛔ Access Restricted\nRole upgrade approval required' ,
          'Biometricdenied'
        );

        setTimeout(() => {
          this.biometricResult = null;
        }, 4000);

        return;
      }

      if (!this.wallClockOn) {

        this.biometricResult = 'denied';

        this.showGameError(
          '⌛ Time Verification Failed\nClock system is not active',
          'activeclock'
        );

        setTimeout(() => {
          this.biometricResult = null;
        }, 4000);

        return;
      }


      const hour = parseInt(this.clockTime.split(':')[0]);

      if (hour >= 18) {

        this.biometricResult = 'granted';
      
        // ✅ unlock exit
        this.exitUnlocked = true;
        this.playDoorUnlocked();

        await this.gameService.updateRoomState(
          'hr-room',
          {
            exitUnlocked: true
          }
        );
      
        // ✅ remove ID card from inventory permanently
        // this.hrInventory =
        //   this.hrInventory.filter(item => item !== 'ID_CARD');
      
        // this.hasIdCard = false;
      
        setTimeout(() => {
      
          
      
        }, 1200);
      
      } else {

        this.biometricResult = 'denied';

        this.showGameError(
          '🕕 Exit Locked\nAccess available after 18:00',
          'exitdenied'
        );

        setTimeout(() => {
          this.biometricResult = null;
        }, 4000);
      }
    }
  }
}
  /* ---------- WIRE DROP FOR COMPUTER ---------- */

  // if (this.dragItem === 'WIRE') {

  //   const socket = document.querySelector('.socket-zone') as HTMLElement;

  //   if (socket) {

  //     const rect = socket.getBoundingClientRect();

  //     const inside =
  //       event.clientX >= rect.left &&
  //       event.clientX <= rect.right &&
  //       event.clientY >= rect.top &&
  //       event.clientY <= rect.bottom;

  //     if (inside) {
  //       this.isWireConnected = true;
  //       this.isComputerPowered = true;
  //     }
  //   }
  // }

  // ✅ ALWAYS RESET AFTER CHECK
  this.isDragging = false;
  this.dragItem = null;

}
finalTime: string = '';
async completeGame(playerName: string) {

  const result = await this.gameService.completeGame(playerName,this.timerValue);

  const minutes = result.minutes;

  const seconds = result.seconds;

  this.finalTime = `${minutes}:${seconds.toString().padStart(2, '0')} mins`;

  console.log('Game Completed Time:', this.finalTime);

  return this.finalTime;
}
updateDragPosition(event: MouseEvent) {

  this.dragX = event.clientX;
  this.dragY = event.clientY;
}

  passwordInput = '';
  correctPassword = 'consistent';
  passwordError = false;
  passwordSuccess = false;

  hasBattery = false;

  // showMobileApps = true;
  showTimer = false;
  
  submitPassword() {

    if (!this.passwordInput || !this.passwordInput.trim()) {
  
      this.emptyPasswordError = true;
  
      this.passwordError = false;
  
      return;
    }
  
    this.emptyPasswordError = false;
  
    if (this.passwordInput.length < 10) {
  
      this.passwordError = true;
  
      return;
    }
  
    if (this.passwordInput.toLowerCase() === this.correctPassword) {
  
      this.passwordError = false;
      this.emptyPasswordError = false;
  
      this.showEmployeeData = false;
      this.showCodeScreen = false;
  
      this.showWelcomeMessage = true;
  
      this.gameService.updateRoomState(
        'hr-room',
        {
          isLaptopUnlocked: true,
          showWelcomeMessage: true,
          showNextArrow: false
        }
      );
  
      this.showNextArrow = false;
  
      setTimeout(() => {
  
        this.showNextArrow = true;
  
        this.gameService.updateRoomState(
          'hr-room',
          {
            showNextArrow: true
          }
        );
  
      }, 3000);
  
    } else {
  
      this.passwordError = true;
  
      this.emptyPasswordError = false;
  
    }
  }

  validatePasswordInput() {
    this.passwordError = false;  
    this.emptyPasswordError = false;
  }

  updateLockScreenTime() {

    const now = new Date();
  
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    const displayHours = hours % 12 || 12;
  
    this.lockTime = `${displayHours}:${minutes}`;
  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',  
      day: 'numeric',
      month: 'long'
    };
  
    this.lockDate = now.toLocaleDateString('en-US', options);
  }

  openUnlockScreen() {
    this.currentView = 'table'; 
    this.imageLoaded = false;

    this.showUnlock = true;
    this.showPattern = false;
  
    this.updateLockScreenTime();
  

    this.lockTimer = setInterval(() => {
      this.updateLockScreenTime();
    }, 1000);
  }

  hideUnlockScreen() {

    this.unlockHiding = true;

    if (this.lockTimer) {
      clearInterval(this.lockTimer);
    }
  
    setTimeout(() => {
      this.showUnlock = false;
      this.showPattern = true;
      this.unlockHiding = false;
    }, 300);
  }

  goToCodeScreen() {

    this.showWelcomeMessage = false;
    this.showNextArrow = false;
    this.gameService.updateRoomState(
        'hr-room',
        {
          showWelcomeMessage: false,
          showNextArrow: false
        }
      );
  
    this.showLaptopWallpaper = true;
    this.isOnLaptopScreen = true;
  
    if (this.pendingPopup && this.isComputerPowered) {
      this.pendingPopup = false;
      this.triggerComputerPopup();
    }
  }

  submitEmployeeCode() {

    if (this.employeeCodeInput.toUpperCase() === 'ZI73') {
  
      this.codeError = false;
  
      this.showCodeScreen = false;
      this.showWelcomeMessage = false;
      this.showNextArrow = false;

      this.showEmployeeData = true;
  
    } else {
  
      this.codeError = true;
  
      setTimeout(() => {
        this.codeError = false;
        this.employeeCodeInput = '';
      }, 1000);
    }
  }

  openMobileDevice() {

    this.viewStack.push(this.currentView);
  
    this.currentView = 'table';
    this.imageLoaded = false;
  
  }

  openMonitorZoom() {

    // ❌ IF COMPUTER NOT POWERED
    if (!this.isComputerPowered) {
  
      this.showGameError(
        '⚠️ Computer Power Offline\nTurn ON the switch board to access the monitor',
        'computerpower'
      );
  
      return;
    }
  
    if (this.currentView !== 'table2') return;
  
    this.viewStack.push(this.currentView);
  
    this.currentView = 'zoomedmonitor';
  
    this.imageLoaded = false;
  }

  // openMobileFromLocker() {
    
  //   this.viewStack.push(this.currentView);
  
  //   this.currentView = 'table'; 
  //   this.imageLoaded = false;
  
  // }

  formatTime(hours: number, minutes: number): string {

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
  
    return `${hh}:${mm}`;
  
  }

  openTable() {
    this.currentView = 'table1';
  }

  goRight() {
    if (this.currentView === 'table1') {
      this.currentView = 'table2';
    }
  }

  goLeft() {
    if (this.currentView === 'table2') {
      this.currentView = 'table1';
    }
  }

  // goBack() {
  //   this.currentView = 'main';
  // }

  getCurrentTime() {

    const now = new Date();
  
    const hours = now.getHours();
    const minutes = now.getMinutes();
  
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
  
    this.wallHours = hours;
    this.wallMinutes = minutes;
  
    this.clockTime = `${hh}:${mm}`;
  
  }
 
  insertBattery() {

    this.wallClockOn = true;
  
    this.updateCurrentTime();
  
    this.startClock();
    this.gameService.updateRoomState(
      'hr-room',
      {
        wallClockOn: true,
        clockTime: this.clockTime
      }
    );
  
  }

  toggleSection(section: string) {

    if (this.openSection === section) {
      this.openSection = null; 
    } else {
      this.openSection = section; 
    }
  
  }

  updateCurrentTime() {

    const now = new Date();
  
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
  
    this.clockTime = `${hours}:${minutes}`;
  
  }

  insertBatteryToWallClock() {

    this.wallClockOn = true;

    const now = new Date();
  
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
  
    this.clockTime = `${hh}:${mm}`;
 
    this.startWallClock();
  
  }

  onBatteryDroppedToClock() {

    this.wallClockOn = true;

    this.getCurrentTime();
  
    this.startWallClock();
  
  }

  showCurrentWallTime() {

    const now = new Date();
  
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
  
    this.wallHours = Number(hours);
    this.wallMinutes = Number(minutes);
  
    this.clockTime = `${hours}:${minutes}`;
  
  }

  powerWallClock() {

    this.wallClockOn = true;

    this.showCurrentWallTime(); 
  
    this.startWallClock();
  
  }

  startClock() {

  if (this.clockInterval) {
    clearInterval(this.clockInterval);
  }

  this.clockInterval = setInterval(() => {

    const now = new Date();

    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');

    this.clockTime = `${hours}:${minutes}`;

  }, 1000);

}

dropBatteryToClock() {

  this.insertBattery();

}

async setMobileTime() {

  const hh = this.mobileHours.toString().padStart(2,'0');
  const mm = this.mobileMinutes.toString().padStart(2,'0');

  const newTime = `${hh}:${mm}`;

  this.mobileTime = newTime;

  this.clockTime = newTime;

    await this.gameService.updateRoomState(
    'hr-room',
    {
      clockTime: this.clockTime,
      manualTimeSet: true
    }
  );

  this.manualTimeSet = true;

  if (this.clockInterval) {
    clearInterval(this.clockInterval);
    this.clockInterval = null;
  }

}

toggleTimeEdit() {

  if (!this.editMode) {

    this.editMode = true;

    this.editHours = this.displayHours;
    this.editMinutes = this.displayMinutes;

  } else {

    this.displayHours = this.editHours;
    this.displayMinutes = this.editMinutes;

    this.manualTimeSet = true;

    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }

    // format time
    const hh = this.displayHours.toString().padStart(2,'0');
    const mm = this.displayMinutes.toString().padStart(2,'0');

    // update MOBILE
    this.mobileTime = `${hh}:${mm}`;

    this.clockTime = `${hh}:${mm}`;

    // SAVE TO SUPABASE
    this.gameService.updateRoomState(
      'hr-room',
      {
        clockTime: this.clockTime,
        manualTimeSet: true
      }
    );
    this.editMode = false;
  }

}

  updateClockDisplay() {

    const h = String(this.displayHours).padStart(2, '0');
    const m = String(this.displayMinutes).padStart(2, '0');
  
    this.clockTime = `${h}:${m}`;
  
  }
  startWallClock() {

    if (this.clockInterval) return;
  
    this.clockInterval = setInterval(() => {
  
      if (!this.manualTimeSet && this.wallClockOn) {
  
        const now = new Date();
  
        const hh = now.getHours().toString().padStart(2,'0');
        const mm = now.getMinutes().toString().padStart(2,'0');
  
        this.clockTime = `${hh}:${mm}`;
      }
  
    }, 1000);
  
  }
  
  updateWallClock(){

    this.clockTime =
      this.displayHours + ':' + this.displayMinutes;
  
  }

  updateTime() {

    const now = new Date();
  
    const h = now.getHours().toString().padStart(2,'0');
    const m = now.getMinutes().toString().padStart(2,'0');
    const s = now.getSeconds().toString().padStart(2,'0');
  
    this.currentTime = `${h}:${m}:${s}`;
  
  }

  enableTimeEdit() {

    this.editableTime = this.currentTime;
    this.editTime = true;
  
  }

  saveManualTime() {

    if (this.editableTime) {
      this.currentTime = this.editableTime;
    }
  
    this.editTime = false;
  
  }

  increaseHour() {

    this.editHours++;
  
    if (this.editHours > 23) {
      this.editHours = 0;
    }
  
  }
  
  decreaseHour() {
  
    this.editHours--;
  
    if (this.editHours < 0) {
      this.editHours = 23;
    }
  
  }

  increaseMinute() {

    this.editMinutes++;
  
    if (this.editMinutes > 59) {
      this.editMinutes = 0;
    }
  
  }
  
  decreaseMinute() {
  
    this.editMinutes--;
  
    if (this.editMinutes < 0) {
      this.editMinutes = 59;
    }
  
  }

  openMailApp() {

    this.mobileNavStack.push(this.activeApp);
    this.activeApp = 'mail';

    if (this.isMailApproved) {
  
      this.mailState = 'loading';
  
      setTimeout(() => {
        this.mailState = 'approved';
      }, 2000);
  
      return;
    }
  
    this.mailState = 'loading';
  
    setTimeout(() => {
      this.mailState = 'form';
    }, 4000);
  }

  sendMail() {

    const validMail =
  this.mailTo.trim().toLowerCase() ===
  this.generatedMailId.toLowerCase();

    const validEmp = this.empId.toUpperCase() === 'ZI73';
  
    if (!validMail || !validEmp) {
  
      this.showMailError = true;
      return;
    }
  
    this.mailState = 'success';
 
    this.mailSentSuccessfully = true;
      this.gameService.updateRoomState(
        'hr-room',
        {
          mailSentSuccessfully: true
        }
      );
      
    this.isInternApproved = true;
  
    if (this.isComputerPowered) {
  
      if (this.isOnLaptopScreen) {
        this.triggerComputerPopup();
      } else {
        this.pendingPopup = true; 
        this.gameService.updateRoomState(
          'hr-room',
          {
            pendingPopup: true
          }
        );
      }
    }
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  openMessageRequest() {

    this.showComputerPopup = false;
    this.showMessageScreen = true;
  }

  approveRequest() {

    this.showMessageScreen = false;
    this.showApprovalScreen = true;
  
    this.activeApp = 'mail';
  
    this.mailState = 'loading';
  
    setTimeout(() => {
  
      this.mailState = 'success';
  
      this.isMailApproved = true;
      this.gameService.updateRoomState(
        'hr-room',
        {
          isMailApproved: true,
           pendingPopup: false,
            mailSentSuccessfully: false,
           showComputerPopup: false
        }
      );
  
      setTimeout(() => {
  
        this.showLaptopWallpaper = true;
        this.activeApp = 'apps';
        this.mobileNavStack = [];
  
      }, 3000); 
  
    }, 2000); 
  }

  closeApprovalPopup() {

    this.showApprovalScreen = false;
  
    this.showLaptopWallpaper = true;
  
    this.showMessageScreen = false;
  }

  openBook(){

    this.viewStack.push(this.currentView);
  
    this.currentView = 'openedBook';
  
    this.imageLoaded = false;
  
  }

  selectPalette(index:number){

    if(this.cursorIndex === -1 && index === 0){
  
      this.cursorIndex = 0;
  
    }
  
  }

  activateCupboardInput(event?: MouseEvent){

    if(this.currentView !== 'cupboard') return;
  
    if(!this.inputStarted){
  
      this.inputStarted = true;
  
      this.cursorIndex = 0;
  
      this.cupboardDigits = ['','','','',''];
  
    }
  
  }

  startCupboardInput(){

    this.inputStarted = true;
  
    this.cursorIndex = 0;
  
    this.cupboardDigits = ['','','','',''];
  
  }



  cupboardPress(num:number){

    if(this.cupboardInput.length >= 5) return;
  
    this.cupboardInput.push(num);
  
    this.cupboardNumbers[this.cupboardInput.length-1] = num;
  
    this.checkCupboardPuzzle();
  
  }

  checkCupboardPuzzle(){

    if(this.cupboardInput.length !== 5) return;
  
    const correct =
    JSON.stringify(this.cupboardInput) ===
    JSON.stringify(this.cupboardAnswer);
  
    if(correct){
  
      this.animateCupboardOpen();
  
    }
    else{
  
      setTimeout(()=>{
  
        alert("Wrong Code");
  
        this.cupboardInput=[];
        this.cupboardNumbers=['','','','',''];
  
      },400);
  
    }
  
  }

  animateCupboardOpen(){

    const img:any =
    document.querySelector(".scene-image");
  
    img.classList.add("cupboard-open");
  
    setTimeout(()=>{
  
      this.images.cupboard =
      "assets/images/hr-room/opencupboard.png";
  
    },700);
  
  }

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent){
  
    if(this.currentView !== 'cupboard' || this.cupboardOpened) return;
  
    if(this.cursorIndex === -1) return;

    if(/^[0-9]$/.test(event.key)){
  
      if(this.cursorIndex > 4) return;
      this.playPicker();
      this.cupboardDigits[this.cursorIndex] = event.key;
  
      this.cursorIndex++;
  
      this.checkCupboardCode();
  
    }
  

    if(event.key === "Backspace"){
  
      if(this.cursorIndex <= 0) return;
  
      this.cursorIndex--;
  
      this.cupboardDigits[this.cursorIndex] = '';
  
    }
  
  }

  checkCupboardCode(){

    if(this.cursorIndex < 5) return;
  
    const entered = this.cupboardDigits.join('');
  
    if(entered === this.cupboardPassword){
  
      this.openCupboard();
  
    }else{
  
      this.blinkWrong = true;
  
      setTimeout(()=>{
  
        this.blinkWrong = false;

        this.resetCupboard();
  
      },800);
  
    }
  
  }

  resetCupboard(){

    this.cupboardDigits = ['', '', '', '', ''];
  
    this.cursorIndex = -1;
  
  }

  openCupboard(){

    const img:any = document.querySelector(".scene-image");
  
    img.classList.add("open-animation");
  
    setTimeout(()=>{
      this.playCupboard();
      this.cupboardOpened = true;
      this.gameService.updateRoomState(
        'hr-room',
        {
          cupboardOpened: true
        }
      );
  
      this.currentView = 'opencupboard';
  
      this.resetCupboard();
  
      this.imageLoaded = false;
  
    },700);
  
  }

  openLocker(group: 'groupA' | 'groupB' | 'groupC' | 'locker4') {

    console.log('Locker Clicked:', group);

    this.activeLocker = group;
  
    this.lockerTiles = [1, 1, 1];
  
    this.viewStack.push(this.currentView);
    this.showPuzzlePopup = true;
  }

  cycleLockerTile(index: number) {
    this.playSquare();

    this.lockerTiles[index]++;
  
    if (this.lockerTiles[index] > this.maxColor) {
      this.lockerTiles[index] = 1;
    }
  
    this.checkLockerPuzzle();
  }

  checkLockerPuzzle() {

    const isCorrect = this.lockerTiles.every(
      (val, i) => val === this.correctSequence[i]
    );
  
    if (!isCorrect) return;
  
    if (this.activeLocker === 'locker4') {
  
      this.lockerUnlocked = true;
      this.gameService.updateRoomState(
        'hr-room',
        {
          lockerUnlocked: true
        }
      );
  
      setTimeout(() => {
        this.playCupboard();
        this.currentView = 'openedlocker';
        this.imageLoaded = false;
      }, 500);
  
    } else {
  
      this.showGameError(
        "Save the sequence and try it in a different locker",
        'sequence'
      );
  

      setTimeout(() => {
        this.goBack();
      }, 3000);
    } 
  }

  closeLockerPopup() {
    this.showLockerPopup = false;
  }
  
  handleLockerClick() {

    if (this.lockerUnlocked) {
      this.currentView = 'openedlocker';
    } else {
      this.currentView = 'closedlocker';
    }
  
  }

  openLetterFrame() {

    this.viewStack.push(this.currentView);
    this.currentView = 'zoomedframe';
    this.imageLoaded = false;
  }

  openPhotoFrame() {

    this.viewStack.push(this.currentView);
    this.currentView = 'photoframe';
    this.imageLoaded = false;
  }
  // openPinPanel() {
  //   if (this.currentView === 'closedlocker') {
  //     this.showPinPanel = true;
  //     this.enteredCode = '';
  //     this.errorState = false;
  //   }
  // }

  // pressKey(value: string) {
  //   if (this.enteredCode.length < 4) {
  //     this.enteredCode += value;
  //   }
  // }
  
  // clearCode() {
  //   this.enteredCode = '';
  // }

  submitCode() {

    if (this.enteredCode.toUpperCase() !== this.correctCode) {
      this.triggerError();
      return;
    }
  
    // if (this.selectedLockerGroup === 'locker4') {
  
    //   this.lockerUnlocked = true;
    //   this.enteredCode = '';
    //   this.errorState = false;
  
    //   this.showLockerPopup = false; // ✅ close popup
    //   this.currentView = 'openedlocker';
  
    // } else {
  
    //   this.triggerError();
    // }
  }

  openUnlock() {
    this.showUnlock = true;
    this.showPattern = false;
  }
  
  hideUnlock() {
  
    this.unlockHiding = true;
  
    setTimeout(() => {
      this.showUnlock = false;
      this.showPattern = true;
      this.unlockHiding = false;
    }, 300);
  }
  
  selectDot(index: number) {
    if (!this.isDrawing) return;
  
    if (!this.selectedDots.includes(index)) {
      this.selectedDots.push(index);
    }
  }

  startPattern(event: MouseEvent) {
    this.isDrawing = true;
    this.selectedDots = [];
    this.svgPath = '';
  
    this.detectDot(event);
  }
  
  movePattern(event: MouseEvent) {
    if (!this.isDrawing) return;
  
    const element = document.querySelector('.pattern-wrapper') as HTMLElement;
    const rect = element.getBoundingClientRect();
  
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    this.linePoints += `${x},${y} `;
  }

  // enterPoint(point: number) {
  //   if (!this.isDrawing) return;
  
  //   if (this.pattern.includes(point)) return;
  
  //   const last = this.pattern[this.pattern.length - 1];
  
  //   // ✅ Handle jump logic
  //   const key = `${last}-${point}`;
  //   const jump = this.jumpMap[key];
  
  //   if (jump && !this.pattern.includes(jump)) {
  //     this.pattern.push(jump);
  //   }
  
  //   this.pattern.push(point);
  // }
  
  endPattern() {
    this.isDrawing = false;
  
    console.log('Pattern:', this.selectedDots);
    if (this.selectedDots.join() === this.correctPattern.join()) {
      this.onSuccess();
    } else {
      this.onError();
    }
  
    setTimeout(() => {
      this.resetPattern();
    }, 800);
  }

  detectDot(event: MouseEvent) {

    const element = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
  
    const dot = element?.closest('.pattern-dot') as HTMLElement;
  
    if (!dot) return;
  
    const id = Number(dot.getAttribute('data-id'));
  
    if (!this.selectedDots.includes(id)) {
      this.selectedDots.push(id);
    }
  }

  

  handleMove(event: any) {

    const touch = event.touches ? event.touches[0] : event;
  
    const x = touch.clientX;
    const y = touch.clientY;
  
    const element = document.elementFromPoint(x, y);
  
    const dot = element?.closest('.pattern-dot') as HTMLElement;
  
    if (dot) {
  
      const id = Number(dot.getAttribute('data-id'));
  
      this.addDot(id);
    }
  
    this.drawLine(event);
  }

  addDot(id: number) {

    if (this.selectedDots.includes(id)) return;
  
    const last = this.selectedDots[this.selectedDots.length - 1];
  
    if (last) {
  
      const jump = this.jumpMap[`${last}-${id}`];
  
      if (jump && !this.selectedDots.includes(jump)) {
        this.selectedDots.push(jump);
      }
    }
  
    this.selectedDots.push(id);
  }

  drawLine(event: MouseEvent) {

    const grid = document.querySelector('.pattern-grid') as HTMLElement;
    if (!grid) return;
  
    const rect = grid.getBoundingClientRect();
  
    let points = '';
  
    this.selectedDots.forEach(id => {
  
      const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (!el) return;
  
      const r = el.getBoundingClientRect();
  
      const x = r.left - rect.left + r.width / 2;
      const y = r.top - rect.top + r.height / 2;
  
      points += `${x},${y} `;
    });
  
    const liveX = event.clientX - rect.left;
    const liveY = event.clientY - rect.top;
  
    points += `${liveX},${liveY}`;
  
    this.svgPath = points;
  }

  isCorrect(): boolean {

    if (this.selectedDots.length !== this.correctPattern.length) {
      return false;
    }
  
    return this.selectedDots.every((v, i) => v === this.correctPattern[i]);
  }  

  success() {

    this.patternError = false;
  
    this.hidePatternUI = true;
  
    setTimeout(() => {
      this.showPattern = false;
      this.showMobileApps = true;
    }, 400);
  }
  
  // ERROR
  error() {
  
    this.patternError = true;
  
    setTimeout(() => {
      this.patternError = false;
      this.resetPattern();
    }, 700);
  }
  
  // checkPattern(): boolean {
  //   if (this.pattern.length !== this.correctPattern.length) return false;
  
  //   return this.pattern.every((val, i) => val === this.correctPattern[i]);
  // }

  // updateLine(event: any) {
  //   const touch = event.touches ? event.touches[0] : event;
  
  //   this.currentLine = {
  //     x: touch.clientX,
  //     y: touch.clientY
  //   };
  // }

  getDotFromEvent(event: any): number | null {

    const touch = event.touches ? event.touches[0] : event;
  
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
  
    const dot = element?.closest('.pattern-dot') as HTMLElement;
  
    if (!dot) return null;
  
    const id = dot.getAttribute('data-id');
  
    return id ? +id : null;
  }

  addPatternDot(id: number) {

    if (this.selectedDots.includes(id)) return;
  
    const last = this.selectedDots[this.selectedDots.length - 1];
  
    if (last) {
      const jump = this.jumpMap[`${last}-${id}`];
  
      if (jump && !this.selectedDots.includes(jump)) {
        this.selectedDots.push(jump);
      }
    }
  
    this.selectedDots.push(id);
  
    this.updatePatternLine();
  }
  showErrorState() {

    this.patternError = true;
  
    setTimeout(() => {
      this.patternError = false;
      this.resetPattern();
    }, 1000);
  }

  activateDot(id: number) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.classList.add("active");
  }

  getJumpDot(from: number, to: number): number | null {

    const jumps: any = {
      "1-3": 2, "3-1": 2,
      "1-7": 4, "7-1": 4,
      "3-9": 6, "9-3": 6,
      "7-9": 8, "9-7": 8,
      "1-9": 5, "9-1": 5,
      "3-7": 5, "7-3": 5,
      "2-8": 5, "8-2": 5,
      "4-6": 5, "6-4": 5
    };
  
    return jumps[`${from}-${to}`] || null;
  }
  
  updatePatternLine(x?: number, y?: number) {

    const container = document.querySelector('.pattern-grid') as HTMLElement;
    if (!container) return;
  
    const rect = container.getBoundingClientRect();
  
    let points = '';
  
    this.selectedDots.forEach(id => {
  
      const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (!el) return;
  
      const r = el.getBoundingClientRect();
  
      const px = r.left - rect.left + r.width / 2;
      const py = r.top - rect.top + r.height / 2;
  
      points += `${px},${py} `;
    });
  
    if (this.drawingPattern && x !== undefined && y !== undefined) {
      const liveX = x - rect.left;
      const liveY = y - rect.top;
  
      points += `${liveX},${liveY}`;
    }
  
    this.svgPath = points.trim();
  }

 isPatternCorrect(): boolean {

  if (this.selectedDots.length !== this.correctPattern.length) {
    return false;
  }

  return this.selectedDots.every((v, i) => v === this.correctPattern[i]);
}
  
resetPattern() {
  this.selectedDots = [];
  this.svgPath = '';
}

onSuccess() {

  this.patternError = false;

  this.hidePatternUI = true;

  setTimeout(() => {
    this.showPattern = false;

    this.showMobileApps = true;
    this.showMenuIcon = true;
    this.showAppsRow = false;

    this.showWallpaper = true; 

  }, 500);
}

openMenuApps() {

  this.showMenuIcon = false;
  this.showAppsRow = true;
  this.showWallpaper = false;
  this.activeApp = 'apps';
  this.showMailError = false;
}

openDocsApp() {
  this.mobileNavStack.push(this.activeApp);
  this.activeApp = 'docs';
}

openDriveApp() {
  this.mobileNavStack.push(this.activeApp);
  this.activeApp = 'drive';
}

openFilesApp() {
  this.mobileNavStack.push(this.activeApp);
  this.activeApp = 'files';
}

openZoomApp() {
  this.mobileNavStack.push(this.activeApp);
  this.activeApp = 'zoom';
}

onError() {

  this.patternError = true;

  setTimeout(() => {
    this.patternError = false;
    this.resetPattern();
  }, 800);
}
  
onPatternMove(event: MouseEvent) {
  if (!this.isDrawing) return;

  this.detectDot(event);
  this.drawLine(event);
}

  onPatternTouchMove(event: TouchEvent) {

    if (!this.drawingPattern) return;
  
    const touch = event.touches[0];
  
    this.updatePatternLine(touch.clientX, touch.clientY);
  
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
  
    const dot = element?.closest('.pattern-dot') as HTMLElement;
  
    if (!dot) return;
  
    const id = dot.getAttribute('data-id');
  
    if (id) {
      this.addPatternDot(+id);
    }
  }

  onPatternMouseMove(event: MouseEvent) {

    if (!this.drawingPattern) return;
  
    const x = event.clientX;
    const y = event.clientY;
  
    this.updatePatternLine(x, y); // ✅ draw live line
  
    const element = document.elementFromPoint(x, y);
    const dot = element?.closest('.pattern-dot') as HTMLElement;
  
    if (!dot) return;
  
    const id = dot.getAttribute('data-id');
  
    if (id) {
      this.addPatternDot(+id);
    }
  }

  updateLiveLine(x: number, y: number) {

    const container = document.querySelector('.pattern-grid') as HTMLElement;
    if (!container) return;
  
    const rect = container.getBoundingClientRect();
  
    let points = '';
  
    this.selectedDots.forEach(id => {
      const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      const r = el.getBoundingClientRect();
  
      const px = r.left - rect.left + r.width / 2;
      const py = r.top - rect.top + r.height / 2;
  
      points += `${px},${py} `;
    });
  
    if (this.drawingPattern) {
      const liveX = x - rect.left;
      const liveY = y - rect.top;
  
      points += `${liveX},${liveY}`;
    }
  
    this.svgPath = points;
  }

  drawLiveLine(x: number, y: number) {

    const container = document.querySelector('.pattern-grid') as HTMLElement;
  
    if (!container || this.selectedDots.length === 0) return;
  
    const rect = container.getBoundingClientRect();
  
    let points = '';
  
    this.selectedDots.forEach(id => {
  
      const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      const r = el.getBoundingClientRect();
  
      const px = r.left - rect.left + r.width / 2;
      const py = r.top - rect.top + r.height / 2;
  
      points += `${px},${py} `;
    });
  
    const liveX = x - rect.left;
    const liveY = y - rect.top;
  
    points += `${liveX},${liveY}`;
  
    this.svgPath = points;
  }

  triggerError() {
    this.errorState = true;
  
    setTimeout(() => {
      this.errorState = false;
      this.enteredCode = '';
    }, 1000);
  }

  openNativeApp() {
    this.mobileNavStack.push(this.activeApp);
    this.activeApp = 'native';
  }
  
  openReactApp() {
    this.mobileNavStack.push(this.activeApp);
    this.activeApp = 'react'; 
  }
  
  openTimerApp() {
    this.mobileNavStack.push(this.activeApp);
    this.activeApp = 'timer';
  
    if (this.manualTimeSet) {

    const [hh, mm] =
      this.clockTime.split(':').map(Number);

    this.displayHours = hh;
    this.displayMinutes = mm;

  } else {

    const now = new Date();

    this.displayHours = now.getHours();
    this.displayMinutes = now.getMinutes();
  }

  this.mobileTime =
    this.formatTime(
      this.displayHours,
      this.displayMinutes
    );

  if (!this.manualTimeSet) {
    this.startWallClock();
  }
  
  }

  mobileBack() {

    this.showMailError = false;

    if (this.mobileNavStack.length > 0) {
      this.activeApp = this.mobileNavStack.pop() as any;
      return;
    }
  

    this.goToMobileHome();
  }

  goToMobileHome() {
    this.mobileNavStack = [];
    this.activeApp = 'apps';
    this.showAppsRow = false;
    this.showMenuIcon = true;
    this.showWallpaper = true;
    
  }
  
  closeMailError() {
    this.showMailError = false;
  }

  toggleMenu() {
    this.showMailError = false; 
  }

  closeApp() {
  
    this.activeApp = 'apps';
  
  }

  animateHint(text: string) {

    this.hintText = '';
    let i = 0;
  
    clearInterval(this.hintTimer);
  
    this.hintTimer = setInterval(() => {
  
      this.hintText += text.charAt(i);
      i++;
  
      if (i >= text.length) {
        clearInterval(this.hintTimer);
      }
  
    }, 40);
  
  }

  collectBattery() {

    if (this.hasBattery) return;
    this.playLetter();
  
    this.hasBattery = true;
  
    if (!this.hrInventory.includes('BATTERY')) {
      this.hrInventory.push('BATTERY');
      this.gameService.addItem(
        'BATTERY',
        'hr-room'
      );

      this.gameService.updateRoomState(
        'hr-room',
        {
          hasBattery: true
        }
      );
    }
  
  }

  // openClock() {
  //   this.viewStack.push(this.currentView);
  //   this.currentView = 'clock';
  //   this.imageLoaded = false;
  // }
  
  openBiometric() {

    this.viewStack.push(this.currentView);
  
    if (this.exitUnlocked) {
  
      this.currentView = 'openedexit';
  
    } else {
  
      this.currentView = 'biometric';
    }
  
    this.imageLoaded = false;
  }


  openStatistics() {
    this.viewStack.push(this.currentView);
    this.currentView = 'statistics';
    this.imageLoaded = false;
  }

  rotateLeft() {

    this.playClick();
    const order: HrView[] = ['main', 'side', 'exit'];
  
    const current =
      this.currentView === 'openedexit'
        ? 'exit'
        : this.currentView;
  
    const index = order.indexOf(current as HrView);
  
    if (index === -1) return;
  
    const newIndex =
      (index - 1 + order.length) % order.length;
  
    const nextView = order[newIndex];
  
    if (nextView === 'exit' && this.exitUnlocked) {
  
      this.currentView = 'openedexit';
  
    } else {
  
      this.currentView = nextView;
    }
  
    this.imageLoaded = false;
  }
  
  rotateRight() {

    this.playClick();

    const order: HrView[] = ['main', 'side', 'exit'];
  
    const current =
      this.currentView === 'openedexit'
        ? 'exit'
        : this.currentView;
  
    const index = order.indexOf(current as HrView);
  
    if (index === -1) return;
  
    const newIndex =
      (index + 1) % order.length;
  
    const nextView = order[newIndex];
  
    if (nextView === 'exit' && this.exitUnlocked) {
  
      this.currentView = 'openedexit';
  
    } else {
  
      this.currentView = nextView;
    }
  
    this.imageLoaded = false;
  }

  openDustbin() {
    this.viewStack.push(this.currentView);
    this.currentView = 'dustbin';
    this.imageLoaded = false;
  }

  openUnfoldedPaper() {
    this.currentView = 'unfoldedpaper';
    this.imageLoaded = false;
  }
  
  goToExit() {

    // ✅ IF EXIT UNLOCKED
    if (this.exitUnlocked) {
  
      this.currentView = 'openedexit';
  
    } else {
  
      this.currentView = 'exit';
  
    }
  
    this.viewStack = [];
  
    this.imageLoaded = false;
  }

  navigateTo(view: HrView) {

    this.playClick();

    this.viewStack.push(this.currentView);
  
    // if (view === 'zoomedlocker' && this.hasKey) {
    //   this.currentView = 'openedkeylocker';
    // }
    if (view === 'zoomedlocker') {

  if (this.keyLockerOpened) {

    this.currentView = 'openedkeylocker';

  } else {

    this.currentView = 'zoomedlocker';

  }

}
  
    // ✅ COMPUTER LOGIC
    else if (view === 'computer') {
      if (!this.isComputerPowered) {
        this.showGameError('Computer is OFF. Turn it ON in settings',
        'computeroff');
        return;
      }
      this.currentView = 'computer';
    }
  
    else if (view === 'cupboard') {

    if (this.cupboardOpened) {

      this.currentView = 'opencupboard';

    } else {

      this.currentView = 'cupboard';
    }

  }
  else {

    this.currentView = view;
  }
  
    this.imageLoaded = false;
  
    if(view === 'cupboard'){
      this.startCupboardInput();
    }
  }

  get shouldShowEmployeeData(): boolean {
    return this.currentView === 'table2' 
      && this.isComputerPowered 
      && this.showEmployeeData; 
  }

  collectIdCard() {

    if (this.hasIdCard) return;
  
    this.hasIdCard = true;
  
    if (!this.hrInventory.includes('ID_CARD')) {
      this.hrInventory.push('ID_CARD');
      this.gameService.addItem(
          'ID_CARD',
          'hr-room'
        );

        this.gameService.updateRoomState(
          'hr-room',
          {
            hasIdCard: true
          }
        );
    }
  }

  openBlueBox() {
    this.viewStack.push(this.currentView);
  
    if (this.hasBattery) {
      this.currentView = 'openedbox';
    } else {
      this.currentView = 'bluebox';
    }
  
    this.imageLoaded = false;
  }

  // startInventoryDrag(item: string, event: MouseEvent) {
  //   if (item !== 'KEY') return;
  
  //   event.preventDefault();
  
  //   this.isInventoryDragging = true;
  //   this.dragItem = item;
  //   this.inventoryDragX = event.clientX;
  //   this.inventoryDragY = event.clientY;
  // }
  
  // @HostListener('document:mousemove', ['$event'])
  // onInventoryMove(event: MouseEvent) {
  //   if (!this.isInventoryDragging) return;
  
  //   this.inventoryDragX = event.clientX - 30;
  //   this.inventoryDragY = event.clientY - 30;
  // }
  
  // @HostListener('document:mouseup', ['$event'])
  // onInventoryDrop(event: MouseEvent) {
  
  //   if (!this.isInventoryDragging) return;
  
  //   this.isInventoryDragging = false;
  
  //   if (this.currentView !== 'bluebox') return;
  
  //   const dropZone = document.querySelector('.box-drop-zone') as HTMLElement;
  //   if (!dropZone) return;
  
  //   const rect = dropZone.getBoundingClientRect();
  
  //   const inside =
  //     event.clientX > rect.left &&
  //     event.clientX < rect.right &&
  //     event.clientY > rect.top &&
  //     event.clientY < rect.bottom;
  
  //   if (inside && this.dragItem === 'KEY') {
  
  //     // Remove key from inventory
  //     this.hrInventory = this.hrInventory.filter(i => i !== 'KEY');
  
  //     // Open box
  //     this.currentView = 'openedbox';
  //     this.imageLoaded = false;
  //   }
  
  //   this.dragItem = null;
  // }
  
  collectKey() {

    if (this.keyFlying) return;
  
    this.keyFlying = true;
  
    setTimeout(() => {
      this.playLetter();
      this.keyFlying = false;
      this.hasKey = true;
  
      if (!this.hrInventory.includes('KEY')) {
        this.hrInventory.push('KEY');
        this.gameService.addItem(
          'KEY',
          'hr-room'
        );

        this.gameService.updateRoomState(
          'hr-room',
          {
            hasKey: true
          }
        );
      }
  

    }, 800);
  }

  openNoticeBoard() {
    this.viewStack.push(this.currentView);
    this.currentView = 'noticeboard';
    this.imageLoaded = false;
  }
  
  openYellowNote() {
    this.viewStack.push(this.currentView);
    this.currentView = 'yellowNote';
    this.imageLoaded = false;
  }
  
  openBlueNote() {
    this.viewStack.push(this.currentView);
    this.currentView = 'blueNote';
    this.imageLoaded = false;
  }

  goBack() {

    this.playClick();
    if (this.showPuzzlePopup) {
      this.showPuzzlePopup = false;
      return;
    }
  
 
    if (
      this.currentView === 'biometric' &&
      this.exitUnlocked
    ) {
  
      this.currentView = 'openedexit';
      this.imageLoaded = false;
  
      return;
    }
  
    const prev = this.viewStack.pop();
  
    this.currentView = prev ?? 'main';
  
    if (
      this.currentView === 'table2' &&
      this.isComputerPowered
    ) {
      this.showHrBg = true;
      this.hrBgClicked = false;
    }
  }

  showUnplugged() {
    this.goToMain();
  }

  goToMain() {
    this.playClick();
    this.currentView = 'main';
    this.viewStack = [];
    this.imageLoaded = false;
  }

  goBackFromPlugged() {
    this.playClick();
    // If powered → go to MAIN
    if (this.isComputerPowered) {
      this.goToMain();
      return;
    }
  
    this.currentView = 'computer';
  }

  async toggleClues(value: boolean) {

  this.isCluesUnlocked = value;

  await this.gameService.updateRoomState(
    'hr-room',
    {
      isCluesUnlocked: value
    }
  );
}

async goToSuccessScreen() {
this.gameService.timeupdate();

  this.playClick();
  await this.gameService.updateAchievements({

    hrAreaCompleted: true

  });

  await this.gameService.setCurrentRoom(
    'gameoverscreen'
  );

  this.router.navigateByUrl(
    '/gameoverscreen'
  );
}
}