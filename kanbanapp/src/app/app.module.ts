import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { TableComponent } from './components/table/table.component';
import { CardComponent } from './components/card/card.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

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
  }
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProjectBoardComponent,
    TableComponent,
    CardComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
