/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JjComponent } from './jj.component';

describe('JjComponent', () => {
  let component: JjComponent;
  let fixture: ComponentFixture<JjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
