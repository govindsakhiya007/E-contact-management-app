import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'app-confirmation-dialog',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule
	],
	templateUrl: './confirmation-dialog.component.html',
	styleUrl: './confirmation-dialog.component.scss'
})

export class ConfirmationDialog {
	constructor(
		public dialogRef: MatDialogRef<ConfirmationDialog>,
		@Inject(MAT_DIALOG_DATA) public data: { message: string }
	) { }
	
	onConfirm(): void {
		this.dialogRef.close(true);
	}

	onCancel(): void {
		this.dialogRef.close(false);
	}
}
