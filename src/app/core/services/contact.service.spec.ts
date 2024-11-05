import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { Contact } from '../models/contact.model';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/contacts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve contacts from the API via GET', () => {
    const dummyContacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: "1111111111" },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: "2222222222" },
    ];

    service.getContacts().subscribe((contacts) => {
      expect(contacts.length).toBe(2);
      expect(contacts).toEqual(dummyContacts);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(dummyContacts);
  });

  it('should handle error on getContacts', () => {
    const errorMessage = '404 error';
    
    service.getContacts().subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.message).toContain('Something went wrong; please try again later.');
      },
    });

    const request = httpMock.expectOne(apiUrl);
    request.error(new ErrorEvent('Network error'), { status: 404, statusText: errorMessage });
  });

  it('should retrieve a contact by ID', () => {
    const dummyContact: Contact = { id: 1, name: 'John Doe', email: 'john@example.com', phone: "3333333333" };

    service.getContactByID(1).subscribe((contact) => {
      expect(contact).toEqual(dummyContact);
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyContact);
  });

  it('should handle error on getContactByID', () => {
    const errorMessage = '404 error';
    
    service.getContactByID(1).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.message).toContain('Something went wrong; please try again later.');
      },
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    request.error(new ErrorEvent('Network error'), { status: 404, statusText: errorMessage });
  });

  it('should add a contact via POST', () => {
    const newContact: Contact = { id: 3, name: 'Jim Doe', email: 'jim@example.com', phone: "4444444444" };

    service.addContact(newContact).subscribe((contact) => {
      expect(contact).toEqual(newContact);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newContact);
    request.flush(newContact);
  });

  it('should handle error on addContact', () => {
    const newContact: Contact = { id: 3, name: 'Jim Doe', email: 'jim@example.com', phone: "6666666666" };
    const errorMessage = '404 error';

    service.addContact(newContact).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.message).toContain('Something went wrong; please try again later.');
      },
    });

    const request = httpMock.expectOne(apiUrl);
    request.error(new ErrorEvent('Network error'), { status: 404, statusText: errorMessage });
  });

  it('should update a contact via PUT', () => {
    const updatedContact: Contact = { id: 1, name: 'John Doe Updated', email: 'john.updated@example.com', phone: "7777777777" };

    service.updateContact(updatedContact).subscribe((contact) => {
      expect(contact).toEqual(updatedContact);
    });

    const request = httpMock.expectOne(`${apiUrl}/${updatedContact.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedContact);
    request.flush(updatedContact);
  });

  it('should handle error on updateContact', () => {
    const updatedContact: Contact = { id: 1, name: 'John Doe Updated', email: 'john.updated@example.com', phone: "6666666666" };
    const errorMessage = '404 error';

    service.updateContact(updatedContact).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.message).toContain('Something went wrong; please try again later.');
      },
    });

    const request = httpMock.expectOne(`${apiUrl}/${updatedContact.id}`);
    request.error(new ErrorEvent('Network error'), { status: 404, statusText: errorMessage });
  });

  it('should delete a contact via DELETE', () => {
    const contactId = 1;

    service.deleteContact(contactId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne(`${apiUrl}/${contactId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should handle error on deleteContact', () => {
    const contactId = 1;
    const errorMessage = '404 error';

    service.deleteContact(contactId).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error) => {
        expect(error.message).toContain('Something went wrong; please try again later.');
      },
    });

    const request = httpMock.expectOne(`${apiUrl}/${contactId}`);
    request.error(new ErrorEvent('Network error'), { status: 404, statusText: errorMessage });
  });
});
