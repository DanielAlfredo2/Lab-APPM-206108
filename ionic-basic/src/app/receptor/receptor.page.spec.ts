import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceptorPage } from './receptor.page';

describe('ReceptorPage', () => {
  let component: ReceptorPage;
  let fixture: ComponentFixture<ReceptorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReceptorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
