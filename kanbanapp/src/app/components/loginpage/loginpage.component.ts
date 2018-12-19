import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService) { }

  ngOnInit() {
  }

  // Logs in
  loginClick(): void {
    this.authService.login(this.email, this.password)

      // Redirects to homepage if the log in was successful
      .then((res) => {
        this.router.navigate(['homepage']);
      })

      // Stays in the log in page if log in wasn't successful
      .catch((err) => {
        alert('Wrong e-mail or password. Please try again.');
        this.router.navigate(['']);
      });
  }
}
