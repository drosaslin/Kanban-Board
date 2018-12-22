import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KanbanModel } from 'src/app/kanban-model/model';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})

export class LoginpageComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private model: KanbanModel) { }

  ngOnInit() {
  }

  // Logs in
  loginClick(): void {
    this.authService.login(this.email, this.password)

      // Redirects to homepage if the log in was successful
      .then((res) => {
        this.model.loadUserProfile();
        this.router.navigate(['homepage']);
      })

      // Stays in the log in page if log in wasn't successful
      .catch((err) => {
        alert('Wrong e-mail or password. Please try again.');
        this.router.navigate(['']);
      });
  }
}
