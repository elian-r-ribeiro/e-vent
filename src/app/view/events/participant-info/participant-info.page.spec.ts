import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantInfoPage } from './participant-info.page';

describe('ParticipantInfoPage', () => {
  let component: ParticipantInfoPage;
  let fixture: ComponentFixture<ParticipantInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParticipantInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
