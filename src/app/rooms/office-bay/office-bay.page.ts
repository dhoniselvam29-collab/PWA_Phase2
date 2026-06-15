import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CupboardlockModalComponent }
from './cupboardlock-modal/cupboardlock-modal.component';
import { Router } from '@angular/router';
import { DrawerLockModalComponent }
from './drawer-lock-modal/drawer-lock-modal.component';
import { GameService } from '../../services/game.service';
import { SoundService } from 'src/app/services/sound.service';


import { TimerService } from 'src/app/services/timer';
@Component({
  selector: 'app-office-bay',
  templateUrl: 'office-bay.page.html',
  styleUrls: ['office-bay.page.scss'],
  standalone:false,
})
export class OfficeBayPage {

  constructor(private modalCtrl: ModalController, private gameService: GameService,  private router: Router, private soundService:SoundService, private TimerService: TimerService) {}


  isLoading = true;
  loadingMessage = 'Accessing Employee Workspace...';

  @ViewChild('eraseCanvas') eraseCanvas!: ElementRef<HTMLCanvasElement>;
timerValue:any;
  currentIndex = 0;
  isCupboardUnlocked = false;
  isLaptopZoomOpen = false;
  isLaptopInitialized = false;
  chargerCollectedInDrawer = false;
  hasIdCard = false;
  idCardCollectedInDrawer = false;
  hasCharger = false;
  hasChargerConnected = false;
  laptopBooting = false;
  inventory: string[] = [];
  isDrawerZoomOpen = false;
  isDrawerUnlocked = false;
  isExcelOpen = false;
  isReportFileOpen = false;
isFinanceFileOpen = false;
  isDeskZoomOpen = false;
  isEraserZoomOpen = false;
  hasEraser = false;
  selectedItem: string | null = null;
  isErasing = false;
  isHrDoorZoomOpen = false;
isAccessMachineZoomOpen = false;
accessStatus: 'granted' | 'denied' | null = null;
isHrDoorUnlocked = false;
cupboardAttempts = 0;
maxCupboardAttempts = 3;
isLaptopUnlocked = false;

showLaptopPassword = false;

loginError = false;

isTorchZoomOpen = false;
hasTorch = false;
scribbleCleared = false;
eraseCount = 0;
isEnvelopeZoomOpen = false;
isEnvelopeOpened = false;
hasEnvelope = false;
// ENVELOPE FLOW STATE
envelopeStep: 'open' | 'clue' = 'open';

instructionMessage: string = '';
showInstructionBox: boolean = false;

soundEnabled = true;
// instructionMessage = '';
// showInstructionBox = false;
instructionFadingOut = false;

// cupboard 2.0
isCupboardPuzzleSolved = false; // step 1
isGlassUnlocked = false;        // step 2

isPanelOpen = false;
selectedDoor = '';
enteredCode = '';
generatedCard: string | null = null;

showSettings = false;
// current off
powerOff = false;
isFlickering = false;

// current on
isPowerRestoring = false;

panelSpotlight = false;
panelRevealed = false;

cards = [
  { id: '324', top: 44, left: 31 },
];
correctCardId = '324';

// HR CABIN DYNAMIC CODE
hrCabinCode = '';

clickSound = new Audio('assets/sounds/click.mp3');
clickSound3 = new Audio('assets/sounds/hex.mp3');
drawerSound = new Audio('assets/sounds/cupboard.mp3');
squareSound = new Audio( 'assets/sounds/click.mp3');

activeHint: string | null = null;


  async ionViewDidEnter() {
await this.gameService.updateLevel(2);
}
// hint pop up message
// showInstruction(message: string) {

currentView = '';

hintMessages: Record<string, string> = {

  drawer:
    'The key might be hidden where colors and numbers meet. Observe the sequence closely',

  laptop:
    'When you are unsure where to go next, follow the trail leading to the Admins Workspace.',

  panel:
    'The next step is linked to the place where employee matters are handled.'

};


showTemporaryHint(
  message: string
) {

  this.instructionMessage = message;

  this.showInstructionBox = true;

  this.instructionFadingOut = false;

  setTimeout(() => {

    this.instructionFadingOut = true;

    setTimeout(() => {

      this.showInstructionBox = false;

      this.instructionFadingOut = false;

    }, 3000);

  }, 1300);

}

toggleHint(view: string) {

  console.log('Clicked:', view);
  console.log('Current View:', this.currentView);

  this.activeHint =
    this.activeHint === view
      ? null
      : view;

  console.log('Active Hint:', this.activeHint);

}

closeHint() {

  this.activeHint = null;

}





bootStage: 'off' | 'booting' | 'login' | 'desktop' = 'off';

passwordInput = '';

correctPassword = '';
dynamicPassword = '';
  angles = [

    {
    name:'hrDoor',
    image:'assets/level2/angle1.png',
    darkImage:'assets/level2/angle1-dark.png'
    },

    {
    name:'centerView',
    image:'assets/level2/angle2.png',
    darkImage:'assets/level2/angle2-dark.png'
    },

    {
    name:'cupboardView',
    image:'assets/level2/angle3.png',
    darkImage:'assets/level2/angle3-dark.png'
    }

    ];

    isElectricalPanelOpen = false;

switch1 = false;
switch2 = false;
switch3 = false;

switch1Angle = 0;
switch2Angle = 0;
switch3Angle = 0;

  hotspots = [
    {
      id: 'lock',
      top: 33,
      left: 18,
      width: 10,
      height: 25
    }
  ];


  get currentAngle() {
    return this.angles[this.currentIndex];
  }



  goNext() {
    this.playClick();
    this.currentIndex =
      (this.currentIndex + 1) % this.angles.length;
  }

  goPrev() {
    this.playClick();
    this.currentIndex =
      (this.currentIndex - 1 + this.angles.length) % this.angles.length;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }


  async openPuzzle() {
    const modal = await this.modalCtrl.create({
      component: CupboardlockModalComponent,
      cssClass: 'puzzle-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.unlocked) {
      this.isCupboardPuzzleSolved = true;

       await this.gameService.updateRoomState(
        'bay-area',
        {
          isCupboardPuzzleSolved: true
        }
      );

      // DO NOT open cupboard yet
      this.showTemporaryHint("The cupboard is secured with an additional lock.");
    }
  }

  // bookshelf zoom view
  isBookshelfZoomOpen = false;

  openBookshelfZoom() {

    if (this.powerOff) return;
    // If already used 3 attempts, don't even open
    if (this.cupboardAttempts >= this.maxCupboardAttempts) {
      return;
    }

    this.isBookshelfZoomOpen = true;
    // this.showTemporaryHint("cupboard is locked.");
  }
  closeBookshelfZoom() {
    this.isBookshelfZoomOpen = false;
  }


// segement 2 - laptop
openLaptopZoom() {
  this.currentView = 'laptop';

  if (this.powerOff) return;

  this.isLaptopZoomOpen = true;

  // setTimeout(() => {
  //   this.showTemporaryHint("Admin laptop.");
  // }, 200);

  if (!this.hasChargerConnected) {
    this.bootStage = 'off';
    return;
  }

  switch (this.bootStage) {

    case 'off':
      //  already unlocked previously
  if (this.isLaptopUnlocked) {

    this.bootStage = 'booting';

    setTimeout(() => {

      this.bootStage = 'desktop';

    }, 1800);

  }

  // normal first-time flow
  else {

    this.startBootSequence();

  }

      break;

    case 'booting':
      this.bootStage = 'login'; // recover state
      break;

    case 'login':
    case 'desktop':
      // do nothing → resume state
      break;
  }
}
  startBootSequence() {
    this.bootStage = 'booting';

    setTimeout(() => {
      this.bootStage = 'login';
      this.isLaptopInitialized = true;
    }, 2000);
  }

  openLaptopLogin() {
    this.currentView = 'laptop';
    this.activeHint = null;

    if (!this.hasChargerConnected) {
      return;
    }

    this.bootStage = 'login';

  }
  async checkPassword() {

    this.loginError = false;

    if (this.passwordInput === this.dynamicPassword) {

      this.isLaptopUnlocked = true;

      this.bootStage = 'desktop';

      await this.gameService.updateRoomState(
        'bay-area',
        {
          laptopUnlocked: true
        }
      );

    } else {

      this.loginError = true;

      this.passwordInput = '';

      setTimeout(() => {

        this.loginError = false;

      }, 3000);

    }

  }

  closeLaptopZoom() {
    this.isLaptopZoomOpen = false;
    // this.bootStage = 'off';   // Reset OS
  }


  // dynamic password

  generatePassword(username: string) {

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const seed = username
      .split('')
      .reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0
      );

    const firstLetter =
      letters[seed % 26];

    const secondLetter =
      letters[(seed * 3) % 26];

    const firstNumber =
      seed % 10;

    const secondNumber =
      (seed * 7) % 10;

    this.dynamicPassword =
      `john_${firstLetter}${secondLetter}${firstNumber}${secondNumber}`;

    this.correctPassword =
      this.dynamicPassword;

    console.log(
      'Generated Password:',
      this.dynamicPassword
    );
  }




// segment 3 drawer

openDrawerZoom() {

  this.currentView = 'drawer';

  if (this.powerOff) return;

  this.isDrawerZoomOpen = true;

}

closeDrawerZoom() {

  // if (!this.hasCharger || !this.hasIdCard) {
  //   this.showInstruction("You should collect all items first.");
  //   return;
  // }

  this.isDrawerZoomOpen = false;
}

async openDrawerLock() {
  const modal = await this.modalCtrl.create({
    component: DrawerLockModalComponent,
    cssClass: 'puzzle-modal'
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data?.unlocked) {

    if (
      this.soundService.getSoundEnabled()
    ) {
    this.drawerSound.currentTime = 0;
    this.drawerSound.volume = 0.7;
    this.drawerSound.play();
    }
    this.isDrawerUnlocked = true;

    await this.gameService.updateRoomState(
      'bay-area',
      {
        isDrawerUnlocked: true
      }
    );

  }

}
async collectIdCard() {

  if (this.hasIdCard) return;
  this.playinventory();

  this.hasIdCard = true;
   await this.gameService.updateRoomState(
    'bay-area',
    {
      hasIdCard: true,
      idCardCollectedInDrawer: true
    }
  );
  this.idCardCollectedInDrawer = true;

  this.inventory.push('id-card');

   await this.gameService.addItem(
      'id-card',
      'bay-area'
    );

  // this.showTemporaryHint("ID Card collected.");

  // If charger not yet taken → force it
  if (!this.hasCharger) {
    setTimeout(() => {
      this.showTemporaryHint("You should collect the charger too.");
    }, 800);
  } else {
    this.closeDrawerAfterCollection();
  }
}

async collectCharger() {

  if (this.hasCharger) return;
  this.playinventory();
  this.hasCharger = true;
  this.chargerCollectedInDrawer = true;
  this.inventory.push('charger');

    await  this.gameService.addItem(
    'charger',
    'bay-area'
  );
  await this.gameService.updateRoomState(
    'bay-area',
    {
      hasCharger: true,
      chargerCollectedInDrawer: true
    }
  );



  // If ID card not yet taken → force it
  if (!this.hasIdCard) {
    setTimeout(() => {
      this.showTemporaryHint("You should collect the ID card too.");
    }, 800);
  } else {
    this.closeDrawerAfterCollection();
  }
}

closeDrawerAfterCollection() {

  setTimeout(() => {
    this.isDrawerZoomOpen = false;
    this.currentIndex = 0;
  }, 500);
}

onDragStart(event: DragEvent, item: string) {
  event.dataTransfer?.setData('text/plain', item);
  this.selectedItem = item; // important
}

allowDrop(event: DragEvent) {
  event.preventDefault();
}

async onDrop(event: DragEvent) {

  event.preventDefault();
  const item = event.dataTransfer?.getData('text/plain');

  if (item === 'charger') {

    // Show connected charger image
    this.hasChargerConnected = true;
    await this.gameService.updateRoomState(
      'bay-area',
      {
        hasChargerConnected: true
      }
    );

    // Remove from inventory
    // this.inventory = this.inventory.filter(i => i !== 'charger');

    // Show loader on laptop screen
    this.laptopBooting = true;

    // After 4 seconds → go full screen login
    //  setTimeout(() => {
    //   this.laptopBooting = false;
    //   this.bootStage = 'login';
    //  }, 4000);
    this.laptopBooting = false;
  }

}

toggleLaptopPassword() {

  this.showLaptopPassword =
    !this.showLaptopPassword;

}



exitOS() {
  this.bootStage = 'off';   // reset stage
  this.passwordInput = '';
}

// dummy files
openReportFile() {
  this.isReportFileOpen = true;
}

closeReportFile() {
  this.isReportFileOpen = false;
}

openFinanceFile() {
  this.isFinanceFileOpen = true;
}

closeFinanceFile() {
  this.isFinanceFileOpen = false;
}

openExcel() {
  this.isExcelOpen = true;
}

closeExcel() {
  this.isExcelOpen = false;
}
logOff() {

  // Close Excel if open
  this.isExcelOpen = false;

  // Reset OS state
  this.bootStage = 'off';
  this.passwordInput = '';

  // Reset laptop boot state
  this.laptopBooting = false;
  // this.hasChargerConnected = false;

  // Close laptop zoom
  this.isLaptopZoomOpen = false;

  // Go back to HR door main view
  this.currentIndex = 0;

    // // ⚡ START POWER CUT SEQUENCE
    // if (!this.powerCutTriggered) {
    //   this.powerCutTriggered = true;
    //   this.startPowerCut();
    // }
    // Trigger only first time ever
if (!this.powerPuzzleCompleted) {

  this.startPowerCut();

}
}

initScribble() {



  const canvas = this.eraseCanvas.nativeElement;
  const ctx = canvas.getContext('2d')!;

  // Match canvas size to visible size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  console.log('scribbleCleared:', this.scribbleCleared);

  if (this.scribbleCleared) {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    return;
  }

  ctx.lineWidth = 25;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#222'; // dark scribble

  // Draw heavy zig-zag scribble
  for (let i = 0; i < 40; i++) {

    ctx.beginPath();
    ctx.moveTo(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );

    ctx.lineTo(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );

    ctx.stroke();
  }



  // --- ERASING LOGIC ---

canvas.addEventListener('mousedown', () => {
  if (this.selectedItem === 'eraser') {
    this.isErasing = true;
  }
});

canvas.addEventListener('mouseup', () => {
  this.isErasing = false;
});

canvas.addEventListener('mousemove', (e) => {

  if (!this.isErasing) return;
  if (this.selectedItem !== 'eraser') return;

  const rect = canvas.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';

  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);

  ctx.fill();

this.eraseCount++;

if (this.eraseCount > 50 && !this.scribbleCleared) {

  this.scribbleCleared = true;

  this.gameService.updateRoomState(
    'bay-area',
    {
      scribbleCleared: true
    }
  );

}

});

}
openDeskZoom() {



  if (this.powerOff) return;

  this.isDeskZoomOpen = true;

  setTimeout(() => {

    this.initScribble();

  }, 100);

}

closeDeskZoom() {
  this.isDeskZoomOpen = false;
}


openEraserZoom() {
  if (this.powerOff) return;
  this.isEraserZoomOpen = true;
}

closeEraserZoom() {
  this.isEraserZoomOpen = false;
}

async collectEraser() {

  this.hasEraser = true;
  this.playinventory();

  this.inventory.push('eraser');

    this.gameService.addItem(
    'eraser',
    'bay-area'
  );

  await this.gameService.updateRoomState(
    'bay-area',
    {
      hasEraser: true
    }
  );

  // 🔥 SHOW MESSAGE HERE (correct place)
  this.showTemporaryHint("eraser collected.");

  this.isEraserZoomOpen = false;
}

onEraserDrop(event: DragEvent) {

  event.preventDefault();

  const item = event.dataTransfer?.getData('text/plain');

  if (item === 'eraser') {

    this.selectedItem = 'eraser';

    // Change cursor
    document.body.classList.add('eraser-mode');
  }
}


openHrDoorZoom() {
  if (this.powerOff) return;
  this.isHrDoorZoomOpen = true;


}

closeHrDoorZoom() {
  this.isHrDoorZoomOpen = false;
  this.showInstructionBox = false;
}
openAccessMachineZoom() {
  this.accessStatus = null; // reset status
  this.isAccessMachineZoomOpen = true;

  this.showTemporaryHint("Need access card to open the HR cabin.");
}

closeAccessMachineZoom() {
  this.accessStatus = null; // reset
  this.isAccessMachineZoomOpen = false;
}
async collectCard(cardId: string) {

  // Stop if limit reached
  if (this.cupboardAttempts >= this.maxCupboardAttempts) {
    return;
  }

  if (!this.inventory.includes(cardId)) {

    this.inventory.push(cardId);

    this.gameService.addItem(
      cardId,
      'bay-area'
    );

    await this.gameService.updateRoomState(
      'bay-area',
      {
        collectedCards: this.inventory.filter(
          item =>
            item !== 'charger' &&
            item !== 'eraser' &&
            item !== 'torch' &&
            item !== 'envelope' &&
            item !== 'id-card'
        )
      }
    );
    this.cupboardAttempts++;

    // If reached max attempts → close cupboard
    if (this.cupboardAttempts >= this.maxCupboardAttempts) {

      setTimeout(() => {
        this.isBookshelfZoomOpen = false;
      }, 500);

    }
  }
}


async onAccessCardDrop(event: DragEvent) {

  event.preventDefault();

  const item = event.dataTransfer?.getData('text/plain');

  if (!item) return;

  // Ignore non-card items
  if (item === 'charger' || item === 'eraser') return;

  if (item === this.correctCardId) {

    this.accessStatus = 'granted';

    // Unlock door
    this.isHrDoorUnlocked = true;

    await this.gameService.updateRoomState(
      'bay-area',
      {
        isHrDoorUnlocked: true
      }
    );

    // Close machine after short delay
    setTimeout(() => {
      this.closeAccessMachineZoom();
    }, 1000);

  } else {

    this.accessStatus = 'denied';

  }

}


openTorchZoom() {
  this.isTorchZoomOpen = true;
}

closeTorchZoom() {
  this.isTorchZoomOpen = false;
}

async collectTorch() {

  this.hasTorch = true;

  // add to inventory
  this.inventory.push('torch');
    this.gameService.addItem(
    'torch',
    'bay-area'
  );

 await this.gameService.updateRoomState(
    'bay-area',
    {
      hasTorch: true
    }
  );

  // close zoom
  this.isTorchZoomOpen = false;

  this.showTemporaryHint("Torch collected.");
}

// poweroff mode
startPowerCut() {

  this.isFlickering = true;

  setTimeout(() => {

    this.isFlickering = false;
    this.powerOff = true;
    this.gameService.updateRoomState(
      'bay-area',
      {
        powerOff: true
      }
    );

    //  show instruction
    this.showTemporaryHint(
      "Power failure detected. One of the phases has been cut off. Try restoring the current."
    );

  }, 1500);

}

async onTorchSceneDrop(event: DragEvent) {

  event.preventDefault();

  const item = event.dataTransfer?.getData('text/plain');

  if (!item) return;

  // Torch only works when power is off AND player is at cupboardView
  if (
    item === 'torch' &&
    this.powerOff &&
    this.currentAngle.name === 'cupboardView'
  ) {

    this.panelRevealed = true;
   await this.gameService.updateRoomState(
      'bay-area',
      {
        panelRevealed: true
      }
    );

    this.showTemporaryHint(
      "The flashlight reveals an electrical panel."
    );

  }

}

getSceneImage() {

  const angle = this.angles[this.currentIndex];

  // PANEL REVEALED
  if (this.panelRevealed && angle.name === 'cupboardView') {

    if (this.hasEnvelope) {
      return 'assets/level2/angle3-panel.png';
    } else {
      return 'assets/level2/angle3-panel-envelope.png';
    }

  }

  // NEW CONDITION
  if (
    this.powerOff &&
    angle.name === 'cupboardView' &&
    this.hasEnvelope
  ) {

    return 'assets/level2/angle3-dark-no-envelope.png';

  }

  // NORMAL POWER OFF
  if (this.powerOff) {
    return angle.darkImage;
  }

  // NORMAL ENVELOPE COLLECTED
  if (
    angle.name === 'cupboardView' &&
    this.hasEnvelope
  ) {

    return 'assets/level2/angle3-no-envelope.png';

  }

  return angle.image;
}


openElectricalPanel(){
  this.isElectricalPanelOpen = true;
}

closeElectricalPanel(){
  this.isElectricalPanelOpen = false;
}

toggleSwitch(num:number){

  if(num === 1) this.switch1 = !this.switch1;
  if(num === 2) this.switch2 = !this.switch2;
  if(num === 3) this.switch3 = !this.switch3;

  this.checkPowerRestore();

}

// checkPowerRestore(){

//   if(this.switch1 === true && this.switch2 === false && this.switch3 === true){

//     this.showTemporaryHint("Power restored.");

//     this.restorePower();

//   }

// }
checkPowerRestore(){

  if(
    this.switch1 === true &&
    this.switch2 === false &&
    this.switch3 === true
  ){

    this.isPowerRestoring = true;

    setTimeout(() => {

      this.showTemporaryHint("Power restored.");

      this.restorePower();

      this.isPowerRestoring = false;

    }, 1500);

  }

}
async restorePower(){

  this.powerOff = false;
  this.panelRevealed = false;

  this.isElectricalPanelOpen = false;

   this.powerPuzzleCompleted = true;
 await this.gameService.updateRoomState(
  'bay-area',
  {
    powerOff: false,
    panelRevealed: false,
    visited: true,
    powerPuzzleCompleted: true
  }
);

}

rotateSwitch(num:number){

  if(num === 1){
    this.switch1Angle = (this.switch1Angle + 90) % 360;
  }

  if(num === 2){
    this.switch2Angle = (this.switch2Angle + 90) % 360;
  }

  if(num === 3){
    this.switch3Angle = (this.switch3Angle + 90) % 360;
  }

  this.checkElectricalPuzzle();

}

checkElectricalPuzzle() {

  if (
    this.switch1Angle === 90 &&   // South ↓
    this.switch2Angle === 180 &&  // West ←
    this.switch3Angle === 270     // North ↑
  ) {

    this.showTemporaryHint("Power restored ⚡");
    this.restorePower();

  }

}

// envelop
// ✉️ ENVELOPE LOGIC

openEnvelope() {
  this.isEnvelopeZoomOpen = true;
  this.envelopeStep = 'open'; // always start from open image
}

async openEnvelopeStep() {

  if (this.envelopeStep === 'open') {
    this.envelopeStep = 'clue';
  } else if (this.envelopeStep === 'clue') {

    // First time → add to inventory
    if (!this.hasEnvelope) {
      if (!this.inventory.includes('envelope')) {
       this.inventory.push('envelope');
      }
      this.gameService.addItem(
        'envelope',
        'bay-area'
      );

      await this.gameService.updateRoomState(
        'bay-area',
        {
          hasEnvelope: true
        }
      );

      this.hasEnvelope = true;

      // Force Angular to refresh image immediately
      this.currentIndex = this.currentIndex;

      this.showTemporaryHint("Envelope collected.");
    }

    // Close after showing clue
    this.isEnvelopeZoomOpen = false;
  }
}

closeEnvelope() {
  this.isEnvelopeZoomOpen = false;
}

onInventoryItemClick(item: string) {
  this.playinventory();

  if (item === 'envelope') {
    this.openEnvelope(); // reuse same flow
  }

}


// cupboard panel
openPanel() {

  this.currentView = 'panel';
  this.activeHint = null; // reset previous hint

  this.isPanelOpen = true;

  // Show only first time
  if (!this.generatedCard) {
    this.showTemporaryHint("Find the code for the required door. (Hint: Check with John (Admin) to find the correct code.)");
  }
}

closePanel() {


  this.activeHint = null;

  this.isPanelOpen = false;

  // ✅ ONLY go to open shelf if unlocked
  if (this.isGlassUnlocked) {
    this.isBookshelfZoomOpen = true;
  }
}

async submitPanel() {

  const map: any = {

    HR: {
      [this.hrCabinCode]: '324'
    }

  };
  const result = map[this.selectedDoor]?.[this.enteredCode];

  if (result) {

    // ✅ Show result
    this.generatedCard = result;

    // 🔥 IMPORTANT: unlock only here
    this.isGlassUnlocked = true;
    await this.gameService.updateRoomState(
      'bay-area',
      {
        isGlassUnlocked: true
      }
    );

    this.showTemporaryHint(`Access Card No: ${result}`);

  } else {

    this.generatedCard = null;

    this.showTemporaryHint("Invalid Access Code");
  }
}
confirmUnlock() {

  this.isGlassUnlocked = true;
  this.isPanelOpen = false;

  this.generatedCard = null;
  this.selectedDoor = '';
  this.enteredCode = '';
}

openGlassPanelFlow() {

  this.currentView = 'panel';

  this.activeHint = null;


  // Step 2: open panel
  this.isPanelOpen = true;

  // Step 3: show instruction
  this.showTemporaryHint('Find the code for the required door (Hint: Check with John (Admin).)');
}

powerPuzzleCompleted = false;

async ngOnInit() {
  await this.gameService.setCurrentRoom(
    'bay-area'
  );
this.isLoading = true;

  const player = JSON.parse(
    localStorage.getItem('player') || '{}'
  );
   this.TimerService.timer$.subscribe((value:number) => {
      this.timerValue = value;
      console.log(this.timerValue,'timerValue...office bay');

    });
  const data = await this.gameService.loadGame();


  console.log('Player:', player);
  this.hrCabinCode =
  player.player_id;

  this.generatePassword(
    player.username
  );

  if (!data) return;

  // restore inventory
  const room = data.rooms['bay-area'];
  this.inventory = room.inventory || [];

  this.hasTorch = room.hasTorch || false;
  this.hasEnvelope = room.hasEnvelope || false;
  this.hasEraser = room.hasEraser || false;
  this.hasIdCard = room.hasIdCard || false;
  this.hasCharger = room.hasCharger || false;
  this.hasChargerConnected = room.hasChargerConnected || false;
  this.isDrawerUnlocked = room.isDrawerUnlocked || false;
  this.chargerCollectedInDrawer = room.chargerCollectedInDrawer || false;
  this.idCardCollectedInDrawer = room.idCardCollectedInDrawer || false;

  this.powerPuzzleCompleted =
  room.powerPuzzleCompleted || false;

  this.isCupboardPuzzleSolved =
  room.isCupboardPuzzleSolved || false;

  this.isGlassUnlocked =
    room.isGlassUnlocked || false;

  this.bootStage = 'off';
  this.isLaptopUnlocked =
  room.laptopUnlocked || false;
  this.isLaptopZoomOpen = false;

  this.isHrDoorUnlocked =
    room.isHrDoorUnlocked || false;

  this.powerOff =
    room.powerOff || false;

  this.panelRevealed =
    room.panelRevealed || false;

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
    this.scribbleCleared =
  room.scribbleCleared || false;

}
// sounds
playClick() {
  if (
    !this.soundService.getSoundEnabled()
  ) {
    return;
  }
  this.clickSound.currentTime = 0;
  this.clickSound.volume = 0.4;
  this.clickSound.play();
}
playinventory() {
  if (
    !this.soundService.getSoundEnabled()
  ) {
    return;
  }
  this.clickSound3.currentTime = 0;
  this.clickSound3.volume = 0.8;
  this.clickSound3.play();
}

playSquareSound() {
  if (
    !this.soundService.getSoundEnabled()
  ) {
    return;
  }
  this.squareSound.currentTime = 0;
  this.squareSound.volume = 0.5;
  this.squareSound.play();

}

showTransition = false;
// async goToHrRoom() {
//   this.showTransition = true;

//   await this.gameService.setCurrentRoom(
//     'hr-room'
//   );

//   setTimeout(() => {
//     this.router.navigate(['/hr-room']);
//   }, 3000);

// }
async goToHrRoom() {
  this.showTransition = true;
  await this.gameService.updateAchievements({

    bayAreaCompleted: true

  });

  await this.gameService.achieveLevel(3);

  await this.gameService.setCurrentRoom(
    'hr-room'
  );

  setTimeout(() => {
    this.router.navigateByUrl('/hr-room');
  }, 1000);

}



}
