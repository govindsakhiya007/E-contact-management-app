import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'contacts', loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule) },
	{ path: '', redirectTo: 'contacts', pathMatch: 'full' },
	{ path: '**', redirectTo: 'contacts' }
];