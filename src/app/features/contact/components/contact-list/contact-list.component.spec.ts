import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../../../../core/services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Contact } from '../../../../core/models/contact.model';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let contactService: jasmine.SpyObj<ContactService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialog>>;
  let router: jasmine.SpyObj<Router>;

  const mockContacts: Contact[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: "1111111111" },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: "2222222222" },
  ];

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['getContacts', 'deleteContact']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    dialogRef = jasmine.createSpyObj<MatDialogRef<ConfirmationDialog>>('MatDialogRef', ['afterClosed']);
    dialog.open.and.returnValue(dialogRef);

    await TestBed.configureTestingModule({
      declarations: [ContactListComponent],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    contactService.getContacts.and.returnValue(of(mockContacts));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on init', () => {
    component.ngOnInit();
    expect(contactService.getContacts).toHaveBeenCalled();
    expect(component.contacts).toEqual(mockContacts);
    expect(component.filteredContacts).toEqual(mockContacts);
    expect(component.totalPages).toBe(1);
  });

  it('should filter contacts based on search term', () => {
    component.searchTerm = 'Jane';
    component.filterContacts();
    expect(component.filteredContacts.length).toBe(1);
    expect(component.filteredContacts[0].name).toBe('Jane Doe');
  });

  it('should paginate contacts correctly', () => {
    component.currentPage = 1;
    component.itemsPerPage = 1;
    expect(component.paginatedContacts.length).toBe(1);
    expect(component.paginatedContacts[0]).toEqual(mockContacts[0]);

    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.paginatedContacts[0]).toEqual(mockContacts[1]);

    component.previousPage();
    expect(component.currentPage).toBe(1);
    expect(component.paginatedContacts[0]).toEqual(mockContacts[0]);
  });

  it('should open confirmation dialog and delete contact', () => {
    dialogRef.afterClosed.and.returnValue(of(true)); // Simulate user confirming the dialog
    contactService.deleteContact.and.returnValue(of()); // Simulate successful deletion

    component.deleteContact(mockContacts[0]);

    expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialog, {
      data: { message: `Are you sure you want to delete ${mockContacts[0].name}?` }
    });
    expect(toastrService.success).toHaveBeenCalledWith('Contacts', 'Contact deleted successfully.');
    expect(contactService.deleteContact).toHaveBeenCalledWith(mockContacts[0].id);
    expect(contactService.getContacts).toHaveBeenCalled();
  });

  it('should navigate to edit contact', () => {
    component.editContact(mockContacts[0].id);
    expect(router.navigate).toHaveBeenCalledWith(['/contacts/edit', mockContacts[0].id]);
  });
});
