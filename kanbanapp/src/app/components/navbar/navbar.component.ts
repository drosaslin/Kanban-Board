import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { KanbanModel } from '../../kanban-model/model';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { User } from 'src/app/kanban-model/classes/user';
import { Group } from 'src/app/kanban-model/classes/group';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, IObserver {
  isLoggedIn: boolean;
  username: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private model: KanbanModel
  ) { }

  ngOnInit() {
    this.username = '';
    this.model.registerObserver(this);
    this.authenticateUser();
    this.model.loadUserProfile();
  }

  // Logout user and redirects it to login page
  public logoutClick(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.model.resetModel();
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

  public update(user: User, group: Array<Group>): void {
    this.username = user.getUsername();
  }
}
