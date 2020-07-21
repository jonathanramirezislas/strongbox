import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MismovimientosPage } from './mismovimientos.page';

describe('MismovimientosPage', () => {
  let component: MismovimientosPage;
  let fixture: ComponentFixture<MismovimientosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MismovimientosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MismovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
