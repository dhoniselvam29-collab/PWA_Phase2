import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameoverscreenPage } from './gameoverscreen.page';

describe('GameoverscreenPage', () => {
  let component: GameoverscreenPage;
  let fixture: ComponentFixture<GameoverscreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameoverscreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
