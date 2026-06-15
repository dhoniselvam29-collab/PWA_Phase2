import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timerSubject = new BehaviorSubject<number>(0);

  timer$ = this.timerSubject.asObservable();

  setTimer(value: number) {
    this.timerSubject.next(value);
  }

  getTimer(): number {
    return this.timerSubject.value;
  }
}