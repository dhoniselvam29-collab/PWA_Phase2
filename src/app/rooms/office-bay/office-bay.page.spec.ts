import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeBayPage } from './office-bay.page';

describe('OfficeBayPage', () => {
  let component: OfficeBayPage;
  let fixture: ComponentFixture<OfficeBayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeBayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
