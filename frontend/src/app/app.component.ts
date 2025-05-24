import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent,
    FormsModule
  ]
})
export class AppComponent {
  title = 'Corpomotriz Los Salias';
}
