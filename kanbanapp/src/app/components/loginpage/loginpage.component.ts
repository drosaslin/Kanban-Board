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

  loginClick(): void {
    this.authService.login(this.email, this.password)
      .then((res) => {
        this.router.navigate(['group-management']);
      })
      .catch((err) => {
        this.router.navigate(['']);
      });
  }
}
