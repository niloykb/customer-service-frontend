import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDialogComponent } from './customer-dialog.component';

describe('CustomerDialogComponent', () => {
  let component: CustomerDialogComponent;
  let fixture: ComponentFixture<CustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
