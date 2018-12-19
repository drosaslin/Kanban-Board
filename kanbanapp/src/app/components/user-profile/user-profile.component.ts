import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private firstName: string;
  private lastName: string;
  private userName: string;
  private email: string;
  private password: string;
  private editButtonText: string;
  private isEditProfileEnabled: boolean;

  constructor() {
  }

  ngOnInit() {
    this.firstName = 'David';
    this.lastName = 'Rosas';
    this.userName = 'Cuyo';
    this.email = 'cuy@cuy.com';
    this.password = '**********';
    this.editButtonText = 'Edit';
    this.isEditProfileEnabled = false;
  }

  public editProfileClick(): void {
    this.isEditProfileEnabled = !this.isEditProfileEnabled;

    this.editButtonText = (this.isEditProfileEnabled) ? 'Save' : 'Edit';
  }
}
