import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Employee } from '../models/employee.model';

@Injectable({
	providedIn: 'root',
})
  
export class EmployeeService {
	private apiUrl = 'http://localhost:3000/employees'; // Your API URL
	
	constructor(private http: HttpClient) {}
	
	// Get all employees
	getEmployees(): Observable<Employee[]> {
		return this.http.get<Employee[]>(this.apiUrl).pipe(
			catchError(this.handleError)
		);
	}
	
	// Get a single employee by ID
	getEmployee(id: string): Observable<Employee> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.get<Employee>(url).pipe(
			catchError(this.handleError)
		);
	}
	
	// Create a new employee
	createEmployee(employee: Employee): Observable<Employee> {
		return this.http.post<Employee>(this.apiUrl, employee, this.httpOptions()).pipe(
			catchError(this.handleError)
		);
	}
	
	// Update an existing employee
	updateEmployee(id: string, employee: Employee): Observable<Employee> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.put<Employee>(url, employee, this.httpOptions()).pipe(
			catchError(this.handleError)
		);
	}
	
	// Delete an employee
	deleteEmployee(id: number): Observable<void> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.delete<void>(url).pipe(
			catchError(this.handleError)
		);
	}
	
	// Http Options for setting headers
	private httpOptions() {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
	}
	
	// Error handling
	private handleError(error: any) {
		console.error('An error occurred:', error);
		return throwError(() => new Error(error));
	}
}
