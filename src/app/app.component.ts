import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';
import { ProjectComponent } from './project/project.component';
import { ViewTaskComponent } from './view-task/view-task.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const approutes: Routes = [
    { path: '', component: ViewTaskComponent },
    { path: 'Add/:id', component: TaskComponent },
    { path: 'view', component: ViewTaskComponent },
    { path: 'addUser', component: UserComponent },
    { path: 'addProject', component: ProjectComponent },

]
@NgModule({
  declarations: [
    AppComponent,
	HeaderComponent,
	UserComponent,
	TaskComponent,
	ProjectComponent,
	ViewTaskComponent
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
      RouterModule.forRoot(approutes),
      FormsModule,
      ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
