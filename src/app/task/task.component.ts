import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/Task.model'
import { ManageTaskService } from 'src/app/ManageTask.service';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Parenttask } from 'src/app/parenttask.model';
import { Project } from 'src/app/ProjectInfo.model'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {
    public taskinfo: Task;
    public strjson: string;
    public TaskID: any;
    public ListParentTask: Parenttask[];
    public ProjectInfoList: Project[];
    public SelectedProjectId: number;
    public SelectedParentID: number;
    public ProjectName = "";
    public ParentName = "";
    public MessageInfo = "";
    public MessageType = "";
    public IsParentTask: false;
    @ViewChild('ProjectModel', { static: false }) ProjectModel;
    @ViewChild('ParentModel', { static: false }) ParentModel;
    constructor(public service: ManageTaskService, public _Activatedroute: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.TaskID = this._Activatedroute.snapshot.params['id'];
        if (this.TaskID == 0) {
            this.taskinfo = new Task();
        }
        else {
            this.service.getTask(this.TaskID).subscribe((data: any) => {
                this.taskinfo = data;
            });

        }
        this.service.GetParentTasksList().subscribe((data: any) => {
            this.ListParentTask = data;
        });

    }
    OnProjectSearchOpen() {
        this.SelectedProjectId = undefined;
        if (this.ProjectInfoList == undefined) {
            this.service.GetProjectList().subscribe((data: any) => {
                this.ProjectInfoList = data;
            });
        }
        this.ProjectModel.nativeElement.className = 'modal show';
    }
    OnProjectSearchClose() {
        this.ProjectModel.nativeElement.className = 'modal hide';
    }
    OnProjectSearchSave() {
        if (this.SelectedProjectId != undefined) {
            this.taskinfo.Project = this.ProjectInfoList.find(x => x.Project_ID == this.SelectedProjectId);
            this.taskinfo.Project_ID = this.SelectedProjectId;
            this.ProjectName = this.taskinfo.Project.Project;
            this.OnProjectSearchClose();
        }
    }
    OnParentSearchSave() {
        if (this.SelectedParentID != undefined) {
            this.taskinfo.ParentTask = this.ListParentTask.find(x => x.Parent_ID == this.SelectedParentID);
            this.taskinfo.Parent_ID = this.SelectedParentID;
            this.ParentName = this.taskinfo.ParentTask.Parent_Task;
            this.OnParentSearchClose();
        }
    }
    OnParentSearchOpen() {
        this.SelectedParentID = undefined;
        if (this.ListParentTask == undefined) {
            this.service.GetParentTasksList().subscribe((data: any) => {
                this.ListParentTask = data;
            });
        }
        this.ParentModel.nativeElement.className = 'modal show';
    }
    OnParentSearchClose() {
        this.ParentModel.nativeElement.className = 'modal hide';
    }
    OnIsParentTask() {
        if (!this.IsParentTask) {
            this.taskinfo.Priority = 0;
            this.taskinfo.Start_Date = null;
            this.taskinfo.End_Date = null;
            this.taskinfo.Parent_ID = null;
            this.taskinfo.ParentTask = new Parenttask();
        }

    }
    SaveTask() {
        if (this.taskinfo.Project == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter project";
        }
        else if (this.taskinfo.Start_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Start Date";
        }
        else if (this.taskinfo.End_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter End Date";
        }
        else if (this.taskinfo.TaskName == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Task";
        } else {
            if (this.IsParentTask) {
                let objParentTask = new Parenttask();
                objParentTask.Parent_ID = this.taskinfo.Task_ID;
                objParentTask.Parent_Task = this.taskinfo.TaskName;
                objParentTask.Project_ID = this.taskinfo.Project_ID;
                this.service.AddUpdateParentTask(objParentTask).subscribe((data: any) => {
                    this.router.navigate([`./view`]);
                });
            } else {
                this.service.AddUpdateTask(this.taskinfo).subscribe((data: any) => {
                    this.router.navigate([`./view`]);
                });
            }

        }

    }

    ResetTask() {
        this.taskinfo.TaskName = null;
        this.taskinfo.Priority = 0;
        this.taskinfo.Start_Date = null;
        this.taskinfo.End_Date = null;
        this.taskinfo.Parent_ID = 0;
    }


}
