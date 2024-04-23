import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditeventPage } from './editevent.page';

describe('EditeventPage', () => {
  let component: EditeventPage;
  let fixture: ComponentFixture<EditeventPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
