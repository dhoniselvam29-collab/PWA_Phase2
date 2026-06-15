import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { SoundService } from '../../services/sound.service';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService }
from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  isLoading = false;
  showPassword = false;
  loginError = false;
showIntroVideo = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private gameService: GameService,
  private soundService: SoundService
  ) {}

  ngOnInit() {

    this.loginForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ]

    });

  }

  isFieldInvalid(field: string): boolean {

    const ctrl =
      this.loginForm.get(field);

    return !!(
      ctrl &&
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched)
    );

  }

  async onLogin() {
    this.loginError = false;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    try {

      const username =
        this.loginForm.value.username;

      const password =
        this.loginForm.value.password;

      const result =
        await this.authService.login(
          username,
          password
        );

      console.log(
        'Login Result:',
        result
      );

      if (result.error || !result.data) {

        this.loginError = true;
console.log('Login failed:', result.error); 
        return;

      }

      localStorage.setItem(
        'player',
        JSON.stringify(result.data)

   
      );

      console.log('Loginplayer',result.data);
      const gameState =
      await this.gameService.loadGame();

      if (!gameState) {

        await this.gameService.startNewGame();
      
        this.soundService.setSoundEnabled(
          true
        );
      
      } else {
      
        this.soundService.setSoundEnabled(
          gameState.soundEnabled ?? true
        );
      
      }

      console.log(
        'Login Success:',
        result.data
      );
      
      this.router.navigateByUrl(
        '/start-screen'
      );
     const playerId = result.data.player_id;
console.log('playerId', playerId);
const videoPlayed = localStorage.getItem(
  `intro_video_played_${playerId}`
);

if (videoPlayed) {

  this.router.navigateByUrl('/start-screen');

} else {

  this.showIntroVideo = true;

}

    } catch (err) {

      console.error(
        'Login failed',
        err
      );

    } finally {

      this.isLoading = false;

    }
    this.loginError = false;



  }
  
// onVideoEnded() {

//   const player = JSON.parse(
//     localStorage.getItem('player') || '{}'
//   );

//   const playerId = player.player_id;

//   localStorage.setItem(
//     `intro_video_played_${playerId}`,
//     'true'
//   );

//   this.router.navigateByUrl('/start-screen');

// }
  togglePassword() {

    this.showPassword =
      !this.showPassword;

  }

  goToSignup() {

    this.router.navigateByUrl(
      '/signup'
    );

  }

  ionViewWillEnter() {

    this.loginForm.reset();

    this.loginError = false;

    this.showPassword = false;

  }

}
