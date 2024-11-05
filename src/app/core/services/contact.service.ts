import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Contact } from '../models/contact.model';

@Injectable({
	providedIn: 'root',
})
	
export class ContactService {
	private apiUrl = 'http://localhost:3000/contacts';
	private nextId = 1;

	constructor(private http: HttpClient) {}

	getContacts(): Observable<Contact[]> {
		return this.http.get<Contact[]>(this.apiUrl).pipe(
			catchError(this.handleError)
		);
	}

	getContactByID(id: number): Observable<Contact> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.get<Contact>(url).pipe(
			catchError(this.handleError)
		);
	}

	addContact(contact: Contact): Observable<Contact> {
		contact.id = this.generateNextId();
		return this.http.post<Contact>(this.apiUrl, contact).pipe(
			catchError(this.handleError)
		);
	}

	updateContact(contact: Contact): Observable<Contact> {
		return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, contact).pipe(
			catchError(this.handleError)
		);
	}

	deleteContact(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
			catchError(this.handleError)
		);
	}

	private handleError(error: HttpErrorResponse): Observable<never> {
		console.error('An error occurred:', error.error.message);
		return throwError(() => new Error('Something went wrong; please try again later.'));
	}

	private generateNextId(): number {
		return this.nextId++;
	}
}
