import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceptionRoomPage } from './reception-room.page';

describe('ReceptionRoomPage', () => {
  let component: ReceptionRoomPage;
  let fixture: ComponentFixture<ReceptionRoomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
