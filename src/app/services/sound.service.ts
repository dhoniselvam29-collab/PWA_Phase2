import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private soundEnabledSubject = new BehaviorSubject<boolean>(true);
  private soundEnabled = true;
  soundEnabled$ = this.soundEnabledSubject.asObservable();

  setSoundEnabled(
    enabled: boolean
  ) {
    this.soundEnabled = enabled;
  }

  getSoundEnabled() {
    return this.soundEnabled;
  }

}