import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardlistPage } from './leaderboardlist.page';

describe('LeaderboardlistPage', () => {
  let component: LeaderboardlistPage;
  let fixture: ComponentFixture<LeaderboardlistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
