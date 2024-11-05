import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

const routes: Routes = [
	{ path: '', component: ContactListComponent },
	{ path: 'create', component: ContactFormComponent },
	{ path: 'edit/:id', component: ContactFormComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ContactRoutingModule { }