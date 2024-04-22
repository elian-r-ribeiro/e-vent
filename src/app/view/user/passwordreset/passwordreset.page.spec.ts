import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordresetPage } from './passwordreset.page';

describe('PasswordresetPage', () => {
  let component: PasswordresetPage;
  let fixture: ComponentFixture<PasswordresetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasswordresetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
