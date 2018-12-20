import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { SignuppageComponent } from './components/signuppage/signuppage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';
import { environment } from '../environments/environment';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { KanbanModel } from './kanban-model/model';

const routes: Routes = [
  {
    path: '',
    component: LoginpageComponent,
    canActivate: [LoginGuard],
    data: {
      title: 'Login'
    }
  },
  {
    path: 'userRegistration',
    component: SignuppageComponent,
    canActivate: [LoginGuard],
    data: {
      title: 'Sign up'
    }
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'groupManagement',
    component: GroupManagementComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Group Management'
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    UserProfileComponent,
    LoginpageComponent,
    SignuppageComponent,
    DashboardComponent,
    GroupManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(routes),
    DragulaModule.forRoot().ngModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    DragulaService,
    AngularFireAuth,
    AngularFireDatabase,
    AuthService,
    AuthGuard,
    LoginGuard,
    KanbanModel
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
