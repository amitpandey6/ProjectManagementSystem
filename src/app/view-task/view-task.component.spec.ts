import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskComponent } from './view-task.component';
import { ManageTaskService } from 'src/app/ManageTask.service';
import { Task } from 'src/app/Task.model';
import { Parenttask } from 'src/app/parenttask.model';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Project } from 'src/app/ProjectInfo.model'
import { User } from 'src/app/User.model';


describe('ViewTaskComponent', () => {
    let component: ViewTaskComponent;
    let fixture: ComponentFixture<ViewTaskComponent>;
    let service: ManageTaskService;
    let rout: Router;

    beforeEach(() => {
        service = new ManageTaskService(null);
        component = new ViewTaskComponent(service, rout);
    });

    it('should set task with task returned', () => {
        // Arrange
        let parenttask = new Parenttask();
        parenttask.Parent_ID = 1;
        parenttask.Parent_Task = "parent1";
        parenttask.ParentTaskType = "Parent";

        let userinfo = new User();
        userinfo.User_ID = 1;
        userinfo.First_Name = "Amit";
        userinfo.Last_Name = "Pandey";
        userinfo.Employee_ID = "1";

        let proj = new Project();
        proj.Project_ID = 1;
        proj.Project = "project1";
        proj.Start_Date = new Date("2019-11-14");
        proj.End_Date = new Date("2019-13-14");
        proj.Priority = 20;
        proj.User_ID = 1;
        proj.Userinfo = userinfo;
        proj.NoOfTask = 4;
        proj.CompletedTask = 3;

        const tasks: Task[] = [
            {
                Task_ID: 1,
                TaskName: "task1",
                Start_Date: new Date("2019-11-14"),
                End_Date: new Date("2021-01-01"),
                Priority: 20,
                ParentTaskType: "parent1",
                Parent_ID: 1,
                IsTaskEnded: 0,
                ParentTask: parenttask,
                Project: proj,
                Project_ID: 1
            },
            {
                Task_ID: 2,
                TaskName: "task2",
                Start_Date: new Date("2018-05-02"),
                End_Date: new Date("2019-05-02"),
                Priority: 27,
                ParentTaskType: "parent1",
                Parent_ID: 1,
                IsTaskEnded: 0,
                ParentTask: parenttask,
                Project: proj,
                Project_ID: 1
            }
        ];
        spyOn(service, "GetTasksList").and.callFake(() => {
            return from([tasks]);
        });
        // Act
        component.ngOnInit();

        //Assert
        expect(component.taskinfo).toEqual(tasks);
    });
});
