import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrRoomPage } from './hr-room.page';

describe('HrRoomPage', () => {
  let component: HrRoomPage;
  let fixture: ComponentFixture<HrRoomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
