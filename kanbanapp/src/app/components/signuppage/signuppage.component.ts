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

  ngOnInit() {
    this.authService.getUsers();
  }

  signUpClick(): void {
    if (this.password1 === this.password2) {
      this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password1)
        .then((res) => {
          this.router.navigate(['']);
        });
      this.authService.signup(this.firstName, this.lastName, this.email, this.username, this.password1);
    }

  }

}
