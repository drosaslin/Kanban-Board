import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private authService: AuthService) { 
  }

  ngOnInit() {
    this.authenticateUser();
  }

  private authenticateUser(): void {
    this.authService.getUserStatus().subscribe(auth => {
      if(auth) {
        this.isLoggedIn = true;
        return;
      }
      
      this.isLoggedIn = false;
    });
  }
}
