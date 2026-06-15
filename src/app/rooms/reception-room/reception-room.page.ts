import { Component } from '@angular/core';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { SoundService } from 'src/app/services/sound.service';
import { TimerService } from 'src/app/services/timer';


type View =
  | 'front'
  | 'back'
  | 'table'
  | 'centerTable'
  | 'penBox'
  | 'laptop'
  | 'flowerVase'
  | 'page'
  | 'telephone'
  | 'remote'
  | 'mRemote'
  | 'blackBox'
  | 'hexagonItem'
  | 'sideTable'
  | 'smallCupboard'
  | 'openCupboard';

@Component({
  selector: 'app-reception-room',
  standalone: true,
  templateUrl: './reception-room.page.html',
  styleUrls: ['./reception-room.page.scss'],
  imports: [CommonModule, IonContent, IonImg, SettingsComponent],
})
export class ReceptionRoomPage {
  constructor(private gameService: GameService,  private router: Router, private soundService: SoundService,public timerservice:TimerService) {}
timerSeconds = 0;
timerDisplay:any;
timerInterval: any;

async ionViewDidEnter() {
  // this.timerSeconds =
    // await this.gameService.getCurrentTime();
  this.startTimer();
}

ionViewWillLeave() {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}

  isLoading = true;
  loadingMessage =  'Verifying Visitor Access...';

  async ngOnInit() {
      await this.gameService.setCurrentRoom(
    'reception-room'
  );
  this.isLoading = true;
    this.timerservice.timer$.subscribe(value => {
      this.timerDisplay = value;
      console.log(this.timerDisplay,'timerservice...reception bay');
      
    });
  console.log('Reception Room Loaded');
   
  const data = await this.gameService.loadGame();

  if (data) {
  const room = data.rooms['reception-room'];
  this.inventory = room.inventory || [];

    // 🔥 restore collected items
    this.collectedTorch = this.inventory.includes('TORCH');
    this.collectedHexItem = this.inventory.includes('HEX');
    this.collectedKey = this.inventory.includes('KEY');
    this.collectedM = this.inventory.includes('M');
    this.collectedA = this.inventory.includes('A');
    this.collectedD = this.inventory.includes('D');

    this.doorLetters = room.doorLetters || {
      M: false,
      A: false,
      D: false
    };

    this.doorFullyUnlocked =
      room.doorFullyUnlocked || false;
      }

    if (this.doorFullyUnlocked) {
      this.images.back =
        'assets/images/reception-room/door-unlocked.png';
    }

     setTimeout(() => {
      this.isLoading = false;
    }, 800);


    // this.inventory = [...this.inventory, 'M', 'A', 'D'];

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
startTimer() {
 setInterval(() => {
      this.timerSeconds++;
      this.timerservice.setTimer(this.timerSeconds);
    }, 1000);
}
 soundEnabled = true;
  currentView: View = 'front';
  viewStack: View[] = [];
  imageLoaded = false;

  images: Record<View, string> = {
    front: 'assets/images/reception-room/frontt.png',
    back: 'assets/images/reception-room/backk.png',
    table: 'assets/images/reception-room/reception-tablee.png',
    centerTable: 'assets/images/reception-room/center-table.png',
    penBox: 'assets/images/reception-room/pen-box.png',
    laptop: 'assets/images/reception-room/laptop.png',
    flowerVase: 'assets/images/reception-room/flower-vasee.png',
    page: 'assets/images/reception-room/page.png',
    telephone: 'assets/images/reception-room/telephone.png',
    remote: 'assets/images/reception-room/remote.png',
    mRemote: 'assets/images/reception-room/M-remote.png',
    blackBox: 'assets/images/reception-room/black-box.png',
    hexagonItem: 'assets/images/reception-room/hexagon-item.png',
    sideTable: 'assets/images/reception-room/tablee.png',
    smallCupboard: 'assets/images/reception-room/small-cupboardd.png',
    openCupboard: 'assets/images/reception-room/open-cupboardd.png',
  };

  // ================= Sounds =================
  showSettings = false;
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

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

  // ==================================

  collectedTorch = false;
  animateTorch = false;

  collectTorch() {

  if (this.collectedTorch) return; 
  this.playTorch(); 
  this.animateTorch = true;

  setTimeout(() => {
    this.collectedTorch = true;
    // this.inventory.push('TORCH');
    this.addToInventory('TORCH');
    this.gameService.addItem('TORCH', 'reception-room');
    this.animateTorch = false;
  }, 700);
}

addToInventory(item: string) {

  if (!this.inventory.includes(item)) {

    this.inventory.push(item);

  }
}

  // ================
  code = [0, 0, 0, 0];
  showError = false;

  collectedM = false;
  animateM = false;
  codeLocked = false;

  inventory: string[] = [];
  onInventoryDragStart(event: DragEvent, item: string) {
    event.dataTransfer?.setData('item', item);
  }

  navigateTo(view: View) {
    this.activeHint = null;
    this.viewStack.push(this.currentView);
    this.currentView = view;
    this.imageLoaded = false; // reset

     if (view === 'sideTable') {
    this.resetGlassPuzzle();   // IMPORTANT
  }
  }

  goBack() {
     this.activeHint = null;
    this.playClick();
  // Special rule: from M-remote, always go to remote
  if (this.currentView === 'mRemote') {
    this.currentView = 'remote';
    return;
  }
   if (this.currentView === 'sideTable') {
    this.resetGlassPuzzle();
  }
  if (this.currentView === 'openCupboard') {
      this.resetColorPuzzle();   // 🔥 reset when leaving
    }

  const prev = this.viewStack.pop();
  if (prev) {
    this.currentView = prev;
  }
  else {
    // safety fallback
    this.currentView = 'back';
  }
}

    toggleRoom() {
      this.playClick();
      this.currentView = this.currentView === 'front' ? 'back' : 'front';
      this.imageLoaded = false;
    }

    changeDigit(index: number, delta: number) {
      this.playPicker();
    if (this.codeLocked) return;
    this.code[index] = (this.code[index] + delta + 10) % 10;

    // AUTO CHECK
    const entered = this.code.join('');
    if (entered === '8732') {
       this.codeLocked = true;

    //allow last digit to render
    setTimeout(() => {
      this.currentView = 'mRemote';

      setTimeout(() => {
        this.handleMRemoteEntry();
      }, 100);

      // reset ONLY after navigation
      this.code = [0, 0, 0, 0];
      this.codeLocked = false;
    }, 350);
  }
  }

  collectM() {
    if (this.collectedM) return;

    this.playLetter();

    this.animateM = true;
    setTimeout(() => {
      this.collectedM = true;
      this.addToInventory('M');
      this.gameService.addItem('M', 'reception-room');
      this.animateM = false;
    }, 900);
  }

  handleMRemoteEntry() {

  if (this.collectedM) {
    this.showTemporaryHint(
      'Nothing more remains here.',
      'puzzle1'
    );
  }
}

 // ================= PUZZLE 2 =================

hexStates = {
  red: 0,
  blue: 0,
  yellow: 0,
};

hexPatterns: Record<number, string[]> = {
  0: [],
  1: ['top'],
  2: ['middle'],
  3: ['bottom'],
  4: ['top', 'middle'],
  5: ['middle', 'bottom'],
  6: ['top', 'bottom'],
  7: ['top', 'middle', 'bottom'],
};

collectedA = false;
showHexPuzzle = false;
showLetterA = false;
animateA = false;
puzzle2Solved = false;

cycleHex(color: 'red' | 'blue' | 'yellow') {
  this.playSquare();
  if (this.puzzle2Solved) return;

  this.hexStates[color] = (this.hexStates[color] + 1) % 8;
  this.checkPuzzle2();
}

getActiveSlots(color: 'red' | 'blue' | 'yellow'): string[] {
  return this.hexPatterns[this.hexStates[color]];
}

checkPuzzle2() {
  if (this.puzzle2Solved) return;

  const red = this.getActiveSlots('red');
  const blue = this.getActiveSlots('blue');
  const yellow = this.getActiveSlots('yellow');

  const isRedCorrect =
    red.includes('top') &&
    red.includes('bottom') &&
    red.length === 2;

  const isBlueCorrect =
    blue.includes('middle') &&
    blue.length === 1;

  const isYellowCorrect =
    yellow.includes('bottom') &&
    yellow.length === 1;

  if (isRedCorrect && isBlueCorrect && isYellowCorrect) {

  this.puzzle2Solved = true;

  setTimeout(() => {

    this.showHexPuzzle = false;

    // If A not collected → show A
    if (!this.collectedA) {
      setTimeout(() => {
        this.showLetterA = true;
      }, 200);
    }
    // If A already collected → show message
    else {
      this.showTemporaryHint(
        'You’ve already taken what was hidden here.',
        'puzzle2'
      );
    }

  }, 350);
}
}

collectA() {
  this.animateA = true;

  this.playLetter();

  setTimeout(() => {
    this.collectedA = true;
    this.addToInventory('A');
    this.gameService.addItem('A', 'reception-room');
    this.showLetterA = false;
    this.animateA = false;
  }, 700);
}

enterBlackBox() {
  if (this.currentView !== 'blackBox') {
    this.viewStack.push(this.currentView);
  }

  this.currentView = 'blackBox';
  this.imageLoaded = false; // reset

  this.hexStates = {
    red: 0,
    blue: 0,
    yellow: 0
  };

  this.puzzle2Solved = false;
  this.showHexPuzzle = true;
  this.showLetterA = false;
}

 // ================= PUZZLE 3 =================

collectedHexItem = false;
animateHexItem = false;
hexPlaced = false; 

collectHexItem() {
  if (this.collectedHexItem) return;
  this.playKey();
  this.animateHexItem = true;

  setTimeout(() => {
    this.collectedHexItem = true;
     this.addToInventory('HEX');
    this.gameService.addItem('HEX', 'reception-room');
    this.animateHexItem = false;
  }, 700);
}

// ================= PUZZLE 3 (GLASS KEY) =================

romanValues = ['IV', 'VI', 'V', 'X', 'IX'];

glassBoxes = [-1, -1, -1]; // indexes for romanValues
showGlassPuzzle = false;
keyUnlocked = false;
collectedKey = false;
animateKeyRise = false;

toggleGlassPuzzle() {

  // If key already collected → show empty message
  if (this.collectedKey) {
    this.showTemporaryHint(
      'Empty. The key was the only thing inside.',
      'glass'
    );
    return;
  }

  // If unlocked but not collected → do nothing
  if (this.keyUnlocked) return;

  // Otherwise show roman puzzle
  this.showGlassPuzzle = !this.showGlassPuzzle;
}

cycleGlassBox(index: number) {
  if (this.keyUnlocked) return;

  this.playRoman();

   if (this.glassBoxes[index] === -1) {
    // First click → start from 0
    this.glassBoxes[index] = 0;
  } else {
    this.glassBoxes[index] =
      (this.glassBoxes[index] + 1) % this.romanValues.length;
  }

  this.checkGlassPuzzle();
}

checkGlassPuzzle() {
   if (this.glassBoxes.includes(-1)) return;

  const sequence = this.glassBoxes.map(i => this.romanValues[i]);

  const correct =
    sequence[0] === 'V' &&
    sequence[1] === 'IX' &&
    sequence[2] === 'IV';

  if (correct) {
    setTimeout(() => {
      this.keyUnlocked = true;
      this.showGlassPuzzle = false;
      this.animateKeyRise = true;
    }, 300);
  }
}

resetGlassPuzzle() {
  this.glassBoxes = [-1, -1, -1];
  this.showGlassPuzzle = false;
  this.keyUnlocked = false;
  this.animateKeyRise = false;
}

animateKeyFly = false;

handleKeyClick(event: Event) {
  event.stopPropagation();

  // If not unlocked → open puzzle
  if (!this.keyUnlocked) {
    this.showGlassPuzzle = true;
    return;
  }

  // If unlocked → collect key
  this.collectKey();
}

collectKey() {
  if (!this.keyUnlocked || this.collectedKey) return;

  this.playKey(); 
  this.animateKeyFly = true;

  setTimeout(() => {
    this.collectedKey = true;
    this.addToInventory('KEY');
    this.gameService.addItem('KEY', 'reception-room');
    this.animateKeyFly = false;
  }, 800);
}

// Small-cupboard

isDraggingKey = false;
drawerOpened = false;
isOpeningCupboard = false;
showOpenOverlay = false;

allowDrop(event: DragEvent) {
  event.preventDefault();
}

onKeyDrop(event: DragEvent) {
  event.preventDefault();

  const data = event.dataTransfer?.getData('item');

  if (data === 'KEY' && this.currentView === 'smallCupboard') {

  this.playCupboard(); 

  this.resetColorPuzzle();
  this.hexPlaced = false;   // RESET 
  this.showOpenOverlay = true;

  setTimeout(() => {
    this.navigateTo('openCupboard');
    this.showOpenOverlay = false;
  }, 1000);
}
}

onHexDrop(event: DragEvent) {
  event.preventDefault();

  const type = event.dataTransfer?.getData('item');

  // If D is visible and not collected → do nothing
  if (this.showLetterD && !this.collectedD) return;

  if (type === 'HEX' && this.collectedHexItem) {

    this.playHex();

    // 🔥 RESET COLOR PUZZLE EVERY TIME
    this.hexColorStates = {
      top: -1,
      bottom: -1,
      right: -1
    };

    this.isColorSolved = false;
    this.showLetterD = false;

    this.hexPlaced = true;
    this.showColorPuzzle = true;
  }
}

// ================= PUZZLE 3 - COLOR FILL =================

colorOptions = ['blue', 'silver', 'bronze', 'green', 'golden'];

hexColorStates = {
  top: -1,
  bottom: -1,
  right: -1
};

showColorPuzzle = false;
showLetterD = false;
collectedD = false;
animateD = false;
isColorSolved = false;

cycleColor(position: 'top' | 'bottom' | 'right') {

  if (this.showLetterD) return;

  this.playColor(); 

  this.hexColorStates[position] =
    (this.hexColorStates[position] + 1) % this.colorOptions.length;

  this.checkColorPuzzle();
}

checkColorPuzzle() {

  if (this.isColorSolved) return;

  const topColor =
    this.colorOptions[this.hexColorStates.top];

  const bottomColor =
    this.colorOptions[this.hexColorStates.bottom];

  const rightColor =
    this.colorOptions[this.hexColorStates.right];

  const correct =
    topColor === 'golden' &&
    bottomColor === 'bronze' &&
    rightColor === 'silver';

  if (correct) {

  this.isColorSolved = true;

  setTimeout(() => {

    this.showColorPuzzle = false;
    this.hexPlaced = false;

    // If D not collected → show D
    if (!this.collectedD) {
      this.showLetterD = true;
    }
    // If D already collected → show message
    else {
      this.showTemporaryHint(
        'The letter has already been collected.',
        'colorSolved'
      );
    }

  }, 500);
}
}

collectD() {
  if (this.collectedD) return;

  this.playLetter();

  this.animateD = true;

  setTimeout(() => {
    this.collectedD = true;
    this.addToInventory('D');
    this.gameService.addItem('D', 'reception-room');
    this.showLetterD = false;
    this.animateD = false;
  }, 800);
}

resetColorPuzzle() {
  this.hexPlaced = false;
  this.showColorPuzzle = false;
  this.showLetterD = false;
  this.isColorSolved = false;

  this.hexColorStates = {
    top: -1,
    bottom: -1,
    right: -1
  };
}

// ================= DOOR LETTER SYSTEM =================
isDoorUnlockAnimating = false;
doorFullyUnlocked = false;

doorLetters = {
  M: false,
  A: false,
  D: false
};

showDoorUnlocked = false;

onDoorLetterDrop(event: DragEvent) {
  event.preventDefault();

  const item = event.dataTransfer?.getData('item');

  if (!item) return;

  if (item === 'M' || item === 'A' || item === 'D') {
    this.doorLetters[item] = true;
    this.playMAD();
    this.gameService.updateRoomState(
      'reception-room',
      {
        doorLetters: this.doorLetters
      }
    );
  }

  // Check if all inserted
  if (
    !this.doorFullyUnlocked &&
    this.doorLetters.M &&
    this.doorLetters.A &&
    this.doorLetters.D
  ) {
    // Play final unlock sound
    this.playDoorUnlocked();

    // Small cinematic delay
    setTimeout(async () => {
      this.isDoorUnlockAnimating = true;
      this.doorFullyUnlocked = true;
      this.images.back = 'assets/images/reception-room/door-unlocked.png';
     await this.gameService.updateRoomState(
      'reception-room',
      {
        doorFullyUnlocked: true,
        doorLetters: this.doorLetters
      }
    );
    setTimeout(() => {
      this.isDoorUnlockAnimating = false;
    }, 1000);
    }, 600);
    }
}

// ================= HINT SYSTEM =================
hintMessage = '';
showHint = false;
hintFadingOut = false;
hintPosition: 'center' | 'cupboard' | 'hex' | 'glass' | 'colorSolved'  | 'puzzle2' | 'puzzle1' | 'trophy' | 'door' | 'laptop'| 'telephone' | 'lamp' | 'underTable' = 'center';

showTemporaryHint(
  message: string,
  position: 'center' | 'cupboard' | 'hex' | 'glass'  | 'colorSolved'  | 'puzzle2' | 'puzzle1' | 'trophy' | 'door' | 'laptop'| 'telephone' | 'lamp' | 'underTable' = 'center'
) {
  this.hintMessage = message;
  this.hintPosition = position;
  this.showHint = true;
  this.hintFadingOut = false;

  setTimeout(() => {
    this.hintFadingOut = true;

    setTimeout(() => {
      this.showHint = false;
      this.hintFadingOut = false;
    }, 400);

  }, 1600);
}

onKeyHoleClick(event: Event) {
  event.stopPropagation(); // prevent bubbling

  if (!this.collectedKey) {
    this.showTemporaryHint('The cupboard is locked.', 'cupboard');
  }
}

onFilledHexClick() {
  if (!this.hexPlaced) {
    this.showTemporaryHint(
      'Something seems to fit here...',
      'hex'
    );
  }
}

onDoorClick() {

  const insertedCount =
    (this.doorLetters.M ? 1 : 0) +
    (this.doorLetters.A ? 1 : 0) +
    (this.doorLetters.D ? 1 : 0);

  const remaining = 3 - insertedCount;

  if (remaining === 3) {
    this.showTemporaryHint(
      'Three empty slots! Something belongs here.',
      'door'
    );
  }

  else if (remaining === 2) {
    this.showTemporaryHint(
      'Two empty slots remain.',
      'door'
    );
  }

  else if (remaining === 1) {
    this.showTemporaryHint(
      'One empty slot remains.',
      'door'
    );
  }

}

isTransitioning = false;
// async goToOfficeBay() {

//   this.isTransitioning = true;
//   await this.gameService.setCurrentRoom(
//     'bay-area'
//   );
//   setTimeout(() => {
//     this.router.navigateByUrl('/office-bay');
//   }, 3000);
// }
async goToOfficeBay() {
 await this.gameService.achieveLevel(2);
  this.isTransitioning = true;

  await this.gameService.updateAchievements({

    receptionCompleted: true

  });

  await this.gameService.achieveLevel(2);

  await this.gameService.setCurrentRoom(
    'bay-area'
  );

  setTimeout(() => {

    this.router.navigateByUrl(
      '/office-bay'
    );

  }, 3000);
}

activeHint: string | null = null;

hintMessages: Record<string, string> = {

  remote:
    "Sometimes the key isn't in the numbers or colors, but in the form they take. Observe carefully.",

  blackBox:
    "Don't focus on a single move—watch what happens after each click. The sequence may reveal more than you expect.",

  openCupboard:
    "Not all trophies are created equal. Their order may reveal more than their appearance."

};

toggleHint(view: string) {
  this.activeHint =
    this.activeHint === view ? null : view;
}

closeHint() {
  this.activeHint = null;
}
}