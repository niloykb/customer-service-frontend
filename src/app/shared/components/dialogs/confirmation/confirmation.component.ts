import { SharedModule } from '../../../shared.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../models/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {

  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

}
