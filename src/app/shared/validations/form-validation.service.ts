import { FormGroup } from "@angular/forms";
import { inject, Injectable } from "@angular/core";
import { SnackbarService } from "../services/snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {
    snackbarService = inject(SnackbarService);

    public validationMessage(form: FormGroup) {
        for (let [controlName, control] of Object.entries(form.controls)) {
            if (control.errors) {
                const controlText = this.convertToReadableString(controlName);
                this.snackbarService.openSnackBar({
                    message: control.errors['required']? `${controlText} is required`:`${controlText} is invalid`,
                    class: 'error'
                });
                control.markAsTouched();
                break;
            }
        }
    }

    private convertToReadableString(camelCaseString: string): string {
        return camelCaseString
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
}
