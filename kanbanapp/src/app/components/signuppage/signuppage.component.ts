import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent implements OnInit {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password1: string;
  password2: string;

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private authService: AuthService) { }

  // Starts a database listener
  ngOnInit() {
    this.authService.getUsers();
  }

  // Calls the auth service method to create an account
  signUpClick(): void {
    if (this.password1 === this.password2) {
      this.authService.signup(this.firstName, this.lastName, this.email, this.username, this.password1);
    }
    // Still needs to add error msg if input is not correct
  }

}
