import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ContactService } from '../../../../core/services/contact.service';
import { Contact } from '../../../../core/models/contact.model';

@Component({
	selector: 'app-contact-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './contact-form.component.html',
	styleUrl: './contact-form.component.scss'
})
	
export class ContactFormComponent {
	contactForm: FormGroup;
	contactId: number | null = null;

	constructor(
		private fb: FormBuilder,
		private contactService: ContactService,
		private router: Router,
		private route: ActivatedRoute,
		private toastr: ToastrService
	) {
		this.contactForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
		});
	}

	ngOnInit(): void {
		this.contactId = +this.route.snapshot.paramMap.get('id')!;
		console.log(this.contactId)
		if (this.contactId) {
			this.loadContact(this.contactId);
		}
	}

	private loadContact(id: number) {
		this.contactService.getContactByID(id).pipe(
			catchError((error) => {
				return of(null);
			})
		).subscribe((contact: Contact | null) => {
			console.log(contact)
			if (contact) {
				this.contactForm.patchValue(contact);
			}
		});
	}

	onSubmit(): void {
		if (this.contactForm.invalid) {
			this.contactForm.markAllAsTouched();
			return;
		}

		const contact = this.contactForm.value;
		if (this.contactId) {
			contact.id = this.contactId;

			this.toastr.success('Contacts', 'Contact updated successfully.');
			this.contactService.updateContact(contact).subscribe(() => this.router.navigate(['/contacts']));
		} else {
			this.toastr.success('Contacts', 'Contact created successfully.');
			this.contactService.addContact(contact).subscribe(() => this.router.navigate(['/contacts']));
		}
	}
}
