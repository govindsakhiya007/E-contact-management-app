import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { ContactService } from '../../../../core/services/contact.service';
import { Contact } from '../../../../core/models/contact.model';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
	selector: 'app-contact-list',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule],
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.scss']
})

export class ContactListComponent implements OnInit {
	contacts: Contact[] = [];
	filteredContacts: Contact[] = [];
	searchTerm: string = '';
	currentPage: number = 1;
	itemsPerPage: number = 10;
	totalPages: number = 0;

	constructor(
		private contactService: ContactService,
		private router: Router,
		private toastr: ToastrService,
		private dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.loadContacts();
	}

	loadContacts(): void {
		this.contactService.getContacts().subscribe((data) => {
			this.contacts = data;
			this.filteredContacts = data;
			this.calculateTotalPages();
		});
	}

	calculateTotalPages(): void {
		this.totalPages = Math.ceil(this.filteredContacts.length / this.itemsPerPage);
	}

	filterContacts(): void {
		this.filteredContacts = this.contacts.filter(contact =>
			contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
			contact.email.toLowerCase().includes(this.searchTerm.toLowerCase())
		);
		this.currentPage = 1;
		this.calculateTotalPages();
	}

	get paginatedContacts(): Contact[] {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		return this.filteredContacts.slice(startIndex, startIndex + this.itemsPerPage);
	}

	nextPage(): void {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
		}
	}

	previousPage(): void {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}

	deleteContact(contact: Contact): void {
		const dialogRef = this.dialog.open(ConfirmationDialog, {
			data: { message: `Are you sure you want to delete ${contact.name}?` }
		});

		dialogRef.afterClosed().subscribe((confirmed) => {
			if (confirmed) {
				this.toastr.success('Contacts', 'Contact deleted successfully.');
				this.contactService.deleteContact(contact.id).subscribe(() => this.loadContacts());
			}
		});
	}

	editContact(id: number): void {
		this.router.navigate(['/contacts/edit', id]);
	}
}
