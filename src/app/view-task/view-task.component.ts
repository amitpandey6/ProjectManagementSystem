import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/Task.model'
import { ManageTaskService } from 'src/app/ManageTask.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/ProjectInfo.model'

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})

export class ViewTaskComponent implements OnInit {
    public taskinfo: Task[];
    public tskInfo: Task;
    public TaskinfoFromService: Task[];
    public ProjectInfoList: Project[];
    public TaskName: string;
    public ParentTask: string;
    public PriorityFrom: number;
    public PriorityTo: number;
    public StartDate: Date;
    public EndDate: Date;
    private SortBy = "";
    public SelectedProjectId: number;
    public ProjectName = "";
    @ViewChild('ProjectModel', { static: false }) ProjectModel;

    constructor(public service: ManageTaskService, public router: Router) { }

    ngOnInit() {
        this.LoadTask();
    }

    LoadTask() {
        this.service.GetTasksList().subscribe((data: any) => {
            this.TaskinfoFromService = data;
            this.taskinfo = data;
        });
    }
    deleteTask(tskid: number) {
        this.service.EndTask(tskid).subscribe((data: any) => { this.LoadTask(); });
    }
    editTask(id: number) {
        this.router.navigate([`./Add/${id}`]);
    }
    OnSort(SortBy: string) {
        this.SortBy = SortBy;
        this.SortTaskInfo();
    }
    SortTaskInfo() {
        if (this.SortBy == "StartDate") {
            this.taskinfo.sort((a, b) => {
                if (a.Start_Date > b.Start_Date) {
                    return 1;
                }
                else if (a.Start_Date < b.Start_Date) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

        } else if (this.SortBy == "EndDate") {
            this.taskinfo.sort((a, b) => {
                if (a.End_Date > b.End_Date) {
                    return 1;
                }
                else if (a.End_Date < b.End_Date) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

        } else if (this.SortBy == "Priority") {
            this.taskinfo.sort((a, b) => {
                if (a.Priority > b.Priority) {
                    return 1;
                }
                else if (a.Priority < b.Priority) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

        } else if (this.SortBy == "Completed") {
            this.taskinfo.sort((a, b) => {
                if (a.IsTaskEnded > b.IsTaskEnded) {
                    return 1;
                }
                else if (a.IsTaskEnded < b.IsTaskEnded) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

        }

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
            this.tskInfo = new Task();
            this.tskInfo.Project = this.ProjectInfoList.find(x => x.Project_ID == this.SelectedProjectId);
            this.tskInfo.Project_ID = this.SelectedProjectId;
            this.ProjectName = this.tskInfo.Project.Project;
            this.OnProjectSearchClose();
            this.SearchChange();
        }
    }
    SearchChange() {
        this.taskinfo = this.TaskinfoFromService;
        if (this.ProjectName != undefined && this.SelectedProjectId != undefined) {
            this.taskinfo = this.taskinfo.filter(x => x.Project_ID == this.SelectedProjectId);
        }
    }


}
