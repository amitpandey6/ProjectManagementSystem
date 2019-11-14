
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManageTaskService } from 'src/app/ManageTask.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Project } from 'src/app/Projectinfo.model';
import { User } from 'src/app/User.model';
import { Task } from 'src/app/Task.model';

export class ProjectMockService {

    ProjectInfoList: Array<Project> = new Array<Project>();

    GetProjectList() {
        let ProjectInfoList: Array<Project> = new Array<Project>();
        for (var i = 1; i <= 10; i++) {
            let obj = new Project();
            obj.Project_ID = i;
            obj.Project = "Project - " + i;
            obj.Start_Date = new Date();
            obj.End_Date = new Date();
            obj.Priority = i + 1;
            obj.Userinfo = new User();
            obj.Userinfo.User_ID = i;
            obj.Userinfo.First_Name = "First Name - " + i;
            obj.Userinfo.Last_Name = "Last Name - " + i;
            obj.Userinfo.Employee_ID = "Emp - " + i;

            obj.User_ID = i;

            ProjectInfoList.push(obj);
        }
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }

    GetTasksList() {
        let TaskList: Array<Task> = new Array<Task>();
        for (var i = 1; i <= 10; i++) {
            let obj = new Task();
            obj.Task_ID = i;
            obj.Project_ID = i;
            TaskList.push(obj);
        }
        return of(TaskList);

    }

    AddUpdateProject(model: Project) {
        let ProjectInfoList = this.ProjectInfoList;
        if (model.Project_ID > 0) {
            let obj = ProjectInfoList.find(x => x.Project_ID == model.Project_ID)
            obj.Project = "Project - updated";
            obj.CompletedTask = 25;
            obj.Start_Date = new Date();
            obj.End_Date = new Date();
            obj.Priority = 4;
            obj.NoOfTask = 6;
        }
        else {
            ProjectInfoList.push(model);
        }
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }

    DeleteProject(id: number) {
        let ProjectInfoList = this.ProjectInfoList;
        let index = ProjectInfoList.findIndex(x => x.Project_ID == id)
        ProjectInfoList.splice(index, 1);
        this.ProjectInfoList = ProjectInfoList;
        return of(this.ProjectInfoList);
    }
}

describe('ProjectComponent', () => {
    let component: ProjectComponent;
    let fixture: ComponentFixture<ProjectComponent>;
    let MockService = new ProjectMockService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: 'view', component: ProjectComponent }])],
            providers: [{ provide: ManageTaskService, useValue: MockService }],
            declarations: [ProjectComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Project Create component', () => {
        expect(component).toBeTruthy();
    });

    it('Project Load Test', () => {
        component.LoadProjectList();
        expect(component.ProjectInfoList.length).toBe(10);
    });

    it('Project Add Test', () => {
        let obj = new Project();
        obj.Project_ID = 0;
        obj.Project = "Project - 11";
        obj.CompletedTask = 5;
        obj.Start_Date = new Date();
        obj.End_Date = new Date();
        obj.Priority = 6;
        obj.NoOfTask = 7;
        obj.Userinfo = new User();
        obj.Userinfo.User_ID = 6;
        obj.Userinfo.First_Name = "First Name - 6";
        obj.Userinfo.Last_Name = "Last Name - 6";
        obj.Userinfo.Employee_ID = "Emp - 6";
        obj.User_ID = 6;
        component.ProjectInfo = obj;
        component.OnAddUpdate();
        expect(component.MessageInfo).toContain("added");
    });

    it('Project Update Test', () => {
        let obj = new Project();
        obj.Project_ID = 5;
        obj.Project = "Project - 5";
        obj.CompletedTask = 5;
        obj.Start_Date = new Date();
        obj.End_Date = new Date();
        obj.Priority = 6;
        obj.NoOfTask = 7;
        obj.Userinfo = new User();
        obj.Userinfo.User_ID = 6;
        obj.Userinfo.First_Name = "First Name - 6";
        obj.Userinfo.Last_Name = "Last Name - 6";
        obj.Userinfo.Employee_ID = "Emp - 6";
        obj.User_ID = 6;
        component.ProjectInfo = obj;
        component.OnAddUpdate();
        expect(component.MessageInfo).toContain("Updated");
    });

    it('Project Delete Test', () => {
        component.OnDelete(1);
        expect(component.MessageInfo).toBe("Project Information Deleted sucessfully");
    });

    it('Project Reset Test', () => {
        component.OnResetInfo();
        expect(component.ProjectInfo.User_ID).toBe(undefined);
    });

    it('Project Search Test', () => {
        component.SearchValue = "Project - 1";
        component.OnSearchInfo();
        expect(component.ProjectInfoList[0].Project).toBe("Project - 1");
    });


});


