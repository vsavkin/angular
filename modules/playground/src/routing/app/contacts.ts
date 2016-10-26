import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacts',
  template: 'contacts works'
})
export class ContactsComponent {}

const routes = [
   {path: '', component: ContactsComponent}
];

@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ContactsModule { }
