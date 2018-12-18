import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authenticateUser();
  }

  // Logout user and redirects it to login page
  public logoutClick(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }

  // Checks if user is logged in
  private authenticateUser(): void {
    this.authService.getUserStatus().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
        return;
      }

      this.isLoggedIn = false;
    });
  }
}
