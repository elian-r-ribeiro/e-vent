import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventConfigPage } from './event-config.page';

describe('EventConfigPage', () => {
  let component: EventConfigPage;
  let fixture: ComponentFixture<EventConfigPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
