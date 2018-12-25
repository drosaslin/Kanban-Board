import { Component, OnInit, OnDestroy } from '@angular/core';
import { KanbanModel } from '../../kanban-model/model';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { User } from '../../kanban-model/classes/user';
import { Group } from '../../kanban-model/classes/group';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy, IObserver {
  private readonly editText = 'Edit';
  private readonly saveText = 'Save';

  private firstNameBackup: string;
  private lastNameBackup: string;
  private usernameBackup: string;
  private emailBackup: string;

  private firstName: string;
  private lastName: string;
  private username: string;
  private email: string;
  private initials: string;
  private password: string;
  private editButtonText: string;
  private isEditProfileEnabled: boolean;

  constructor(
    private model: KanbanModel
  ) { }

  ngOnInit() {
    this.password = '**********';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.initials = '';

    this.model.registerObserver(this);
    this.model.loadUserProfile();
    this.setDefaultState();
  }

  ngOnDestroy() {
    this.model.setModelDefaultState();
    console.log('user profile destroyed');
  }

  public editProfileClick(): void {
    if (this.isEditProfileEnabled) {
      this.saveProfileClick();
    }

    this.setDataBackup();
    this.isEditProfileEnabled = !this.isEditProfileEnabled;
    this.editButtonText = (this.isEditProfileEnabled) ? this.saveText : this.editText;
  }

  public saveProfileClick(): void {
    this.model.updateUserProfile(this.firstName, this.lastName, this.username);
  }

  public cancelButtonClick(): void {
    this.restoreData();
    this.disableEditProfile();
  }

  private disableEditProfile(): void {
    this.isEditProfileEnabled = false;
    this.editButtonText = this.editText;
  }

  private setDefaultState(): void {
    this.editButtonText = this.editText;
    this.isEditProfileEnabled = false;
  }

  private setDataBackup(): void {
    this.firstNameBackup = this.firstName;
    this.lastNameBackup = this.lastName;
    this.usernameBackup = this.username;
    this.emailBackup = this.email;
  }

  private restoreData(): void {
    this.firstName = this.firstNameBackup;
    this.lastName = this.lastNameBackup;
    this.username = this.usernameBackup;
    this.email = this.emailBackup;
  }

  public update(user: User, group: Array<Group>): void {
    this.firstName = this.model.getUser().getFirstName();
    this.lastName = this.model.getUser().getLastName();
    this.username = this.model.getUser().getUsername();
    this.email = this.model.getUser().getEmail();
    this.initials = this.firstName[0].toUpperCase() + this.lastName[0].toUpperCase();
  }
}
