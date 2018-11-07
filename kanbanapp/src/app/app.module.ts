import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { TableComponent } from './components/table/table.component';
import { CardComponent } from './components/card/card.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';

const appRoutes: Routes = [
  {
    path: 'login-page',
    component: LoginPageComponent,
    data: {
      title: 'User Authentication'
    }
  },
  {
    path: 'project-board',
    component: ProjectBoardComponent,
    data: {
      title: 'Project Board'
    }
  },
  {
    path: 'group-management',
    component: GroupManagementComponent,
    data: {
      title: 'Group Management'
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProjectBoardComponent,
    TableComponent,
    CardComponent,
    LoginPageComponent,
    SignupPageComponent,
    GroupManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
