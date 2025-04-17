import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecoDialogComponent } from './preco-dialog.component';

describe('PrecoDialogComponent', () => {
  let component: PrecoDialogComponent;
  let fixture: ComponentFixture<PrecoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
