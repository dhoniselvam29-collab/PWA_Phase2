import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService }
from '../../services/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})

export class SignupPage implements OnInit {

  signupForm!: FormGroup;

  isLoading = false;

  selectedAvatar = 0;

  avatars = [
    '🦊',
    '🐺',
    '🦁',
    '🐉',
    '👾',
    '🤖',
    '💀',
    '⚡'
  ];
  showIntroVideo = false;

  usernameExists = false;
  showPassword = false;
  accountCreated = false;
  playerDataError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.signupForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z0-9_]+$/)
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
      this.signupForm.get(field);

    return !!(
      ctrl &&
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched)
    );

  }

  selectAvatar(index: number) {

    this.selectedAvatar = index;

  }

  async onSignup() {

    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) return;

    this.isLoading = true;

    try {

      const username =
        this.signupForm.value.username;

      const password =
        this.signupForm.value.password;

      const avatar =
        this.avatars[this.selectedAvatar];

      const result =
        await this.authService.signup(
          username,
          password,
          avatar
        );

      console.log(
        'Signup Result:',
        result
      );

      if (result.error) {

        if (
          result.error.message ===
          'Username already exists'
        ) {

          this.usernameExists = true;

        }

        return;

      }
      if (!result.data) {

        this.playerDataError = true;

        return;

      }

      localStorage.setItem(
      'player',
       JSON.stringify(result.data[0])
      );
 console.log('Signupplayer',result.data[0]);
      this.accountCreated = true;

      this.signupForm.reset();

      this.selectedAvatar = 0;
  this.showIntroVideo = true;

      // setTimeout(() => {
      //   // this.router.navigateByUrl(
      //   //   '/login'
      //   // );

      // }, 2000);

    } catch (err) {

      console.error(
        'Signup failed',
        err
      );

    } finally {

      this.isLoading = false;

    }

  }
  togglePassword() {

    this.showPassword =
      !this.showPassword;

  }

  goToLogin() {

    this.router.navigateByUrl(
      '/login'
    );

  }

  onUsernameChange() {

    this.usernameExists = false;

  }
  ionViewWillEnter() {

    this.signupForm.reset();

    this.selectedAvatar = 0;

    this.usernameExists = false;

    this.accountCreated = false;

    this.playerDataError = false;

    this.showPassword = false;

  }


  onVideoEnded() {

  const player = JSON.parse(
    localStorage.getItem('player') || '{}'
  );

  const playerId = player.player_id;

  localStorage.setItem(
    `intro_video_played_${playerId}`,
    'true'
  );

  this.router.navigateByUrl('/start-screen');

}
}
