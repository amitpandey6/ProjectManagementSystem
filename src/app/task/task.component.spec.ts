
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { ManageTaskService } from 'src/app/ManageTask.service';
import { Task } from 'src/app/Task.model';
import { Parenttask } from 'src/app/parenttask.model';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { identifierName } from '@angular/compiler';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { convertToParamMap, ParamMap } from '@angular/router';
import { Project } from 'src/app/Projectinfo.model';
import { User } from 'src/app/User.model';

export class ActivatedRouteStub {

    //Observable that contains a map of the parameters

    private subjectParamMap = new BehaviorSubject(convertToParamMap(this.testParamMap));
    paramMap = this.subjectParamMap.asObservable();

    private _testParamMap: ParamMap;
    get testParamMap() {
        return this._testParamMap;
    }
    set testParamMap(params: {}) {
        this._testParamMap = convertToParamMap(params);
        this.subjectParamMap.next(this._testParamMap);
    }

}

export class TaskMockService {

    TaskList: Array<Task> = new Array<Task>();
    ParentTaskList: Array<Parenttask> = new Array<Parenttask>();
    tskObj: Task = new Task();

    getTask(Task_ID) {
        let obj = new Task();
        obj.Task_ID = Task_ID,
            obj.TaskName = "task 2",
            obj.Start_Date = new Date("2017-05-02"),
            obj.End_Date = new Date("2018-05-02"),
            obj.Priority = 20,
            obj.ParentTaskType = "parent1",
            obj.Parent_ID = 1,
            obj.IsTaskEnded = 0,
            obj.Project_ID = 1
        this.tskObj = obj;
        return of(this.tskObj);
    }

    GetParentTasksList() {
        let ParentTaskList: Array<Parenttask> = new Array<Parenttask>();
        for (var i = 1; i <= 4; i++) {
            let obj = new Parenttask();
            obj.Parent_ID = 1 + i,
                obj.Parent_Task = "Parent" + i.toString(),
                obj.ParentTaskType = "Parent"
            ParentTaskList.push(obj);
        }
        this.ParentTaskList = ParentTaskList;
        return of(this.ParentTaskList);
    }

    AddUpdateTask(model: Task) {
        let TaskList = this.TaskList;
        let i: number = 1;;
        if (model.Task_ID > 0) {
            let obj = TaskList.find(x => x.Task_ID == model.Task_ID)
            obj.TaskName = "Task - updated";
            obj.Start_Date = new Date("2017-05-02"),
                obj.End_Date = new Date("2018-05-02"),
                obj.Priority = 20,
                obj.ParentTaskType = "parent1",
                obj.Parent_ID = 1,
                obj.IsTaskEnded = 0,
                obj.Project_ID = 1
            TaskList.push(obj);
        }
        else {
            model.Task_ID = i;
            TaskList.push(model);
            i = i + 1;
        }
        this.TaskList = TaskList;
        return of(this.TaskList);
    }

}

describe('TaskComponent', () => {
    let component: TaskComponent;
    let fixture: ComponentFixture<TaskComponent>;
    let MockService = new TaskMockService();
    let _Activatedroute = new ActivatedRouteStub();
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [{ provide: ManageTaskService, useValue: MockService }],
            declarations: [TaskComponent]
        })
            .compileComponents();
    }));
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
            declarations: [TaskComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskComponent);
        component = fixture.componentInstance;
        _Activatedroute = fixture.debugElement.injector.get(ActivatedRoute) as any;
        _Activatedroute.testParamMap = { id: '1' };
        fixture.detectChanges();
    });
    it('Task Create component', () => {
        expect(component).toBeTruthy();
    });
    it('Get Parent Task List', () => {
        component.TaskID = 0;
        component.ngOnInit();
        expect(component.ListParentTask.length).toEqual(4);
    });
    it('Get Task', () => {
        component.TaskID = _Activatedroute.testParamMap;
        component.ngOnInit();
        expect(component.taskinfo.Task_ID).toBe(component.TaskID);
    });
    it('should Add the Task', () => {
        let obj = new Task();
        obj.Task_ID = 0,
            obj.TaskName = "task2",
            obj.Start_Date = new Date("2017-05-02"),
            obj.End_Date = new Date("2018-05-02"),
            obj.Priority = 25,
            obj.ParentTaskType = "parent1",
            obj.Parent_ID = 1,
            obj.IsTaskEnded = 0,
            obj.Project_ID = 1,
            obj.ParentTask = new Parenttask(),
            obj.ParentTask.Parent_ID = 1,
            obj.ParentTask.Parent_Task = "parent1",
            obj.ParentTask.ParentTaskType = "main",
            obj.Project = new Project(),
            obj.Project.Project_ID = 1,
            obj.Project.Project = "project1",
            obj.Project.Start_Date = new Date("2019-11-14"),
            obj.Project.End_Date = new Date("2019-12-14"),
            obj.Project.Priority = 20,
            obj.Project.User_ID = 1,
            obj.Project.Userinfo = new User(),
            obj.Project.Userinfo.User_ID = 1,
            obj.Project.Userinfo.First_Name = "Amit",
            obj.Project.Userinfo.Last_Name = "Pandey",
            obj.Project.Userinfo.Employee_ID = "1"

        component.taskinfo = obj;
        component.SaveTask();
        expect(MockService.TaskList.length).toEqual(1);
        let obj1 = new Task();
        obj1.Task_ID = 0,
            obj1.TaskName = "task3",
            obj1.Start_Date = new Date("2017-05-02"),
            obj1.End_Date = new Date("2018-05-02"),
            obj1.Priority = 25,
            obj1.ParentTaskType = "parent1",
            obj1.Parent_ID = 1,
            obj1.IsTaskEnded = 0,
            obj1.Project_ID = 1,
            obj1.ParentTask = new Parenttask(),
            obj1.ParentTask.Parent_ID = 1,
            obj1.ParentTask.Parent_Task = "parent1",
            obj1.ParentTask.ParentTaskType = "main",
            obj1.Project = new Project(),
            obj1.Project.Project_ID = 1,
            obj1.Project.Project = "project1",
            obj1.Project.Start_Date = new Date("2017-05-02"),
            obj1.Project.End_Date = new Date("2017-05-12"),
            obj1.Project.Priority = 20,
            obj1.Project.User_ID = 1,
            obj1.Project.Userinfo = new User(),
            obj1.Project.Userinfo.User_ID = 1,
            obj1.Project.Userinfo.First_Name = "Amit",
            obj1.Project.Userinfo.Last_Name = "Pandey",
            obj1.Project.Userinfo.Employee_ID = "1"
        component.taskinfo = obj1;
        component.SaveTask();
        expect(MockService.TaskList.length).toEqual(2);
    });
    it('Should Update Task', () => {
        let obj = new Task();
        obj.Task_ID = 1,
            obj.TaskName = "task2",
            obj.Start_Date = new Date("2017-05-02"),
            obj.End_Date = new Date("2018-05-02"),
            obj.Priority = 25,
            obj.ParentTaskType = "parent1",
            obj.Parent_ID = 1,
            obj.IsTaskEnded = 0,
            obj.Project_ID = 1,
            obj.ParentTask = new Parenttask(),
            obj.ParentTask.Parent_ID = 1,
            obj.ParentTask.Parent_Task = "parent1",
            obj.ParentTask.ParentTaskType = "main",
            obj.Project = new Project(),
            obj.Project.Project_ID = 1,
            obj.Project.Project = "project1",
            obj.Project.Start_Date = new Date("2017-05-02"),
            obj.Project.End_Date = new Date("2017-05-12"),
            obj.Project.Priority = 20,
            obj.Project.User_ID = 1,
            obj.Project.Userinfo = new User(),
            obj.Project.Userinfo.User_ID = 1,
            obj.Project.Userinfo.First_Name = "Amit",
            obj.Project.Userinfo.Last_Name = "Pandey",
            obj.Project.Userinfo.Employee_ID = "1"

        component.taskinfo = obj;
        component.SaveTask();
        let editobj = MockService.TaskList.find(x => x.Task_ID == component.taskinfo.Task_ID);
        console.log("TaskName-:" + editobj.TaskName);
        expect(editobj.TaskName).toContain("Task - updated");
    });
    it('Should Reset Task', () => {
        component.ResetTask();
        expect(component.TaskID).toBe(undefined);
    });

});

