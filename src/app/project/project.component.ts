import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from 'src/app/ProjectInfo.model'
import { ManageTaskService } from 'src/app/ManageTask.service';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/User.model'
import { Task } from 'src/app/Task.model'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

    public ProjectInfoList: Project[];

    public ProjectInfo: Project;

    public UserInfoList: User[];
    public ProjectInfoListFromService: Project[];
    public ActionText = "Add";
    public MessageInfo = "";
    public MessageType = "";
    public SortBy = "";
    public SearchValue = "";
    public SetDate = false;
    public UserName = "";

    @ViewChild('ManagerModel', { static: false }) ManagerModel;
    public SelectedUserId: number;

    constructor(public service: ManageTaskService, private router: Router) { }

    ngOnInit() {
        this.ProjectInfo = new Project();
        this.LoadProjectList();
    }
    OnAddUpdate() {
        if (this.ProjectInfo.Project == undefined || this.ProjectInfo.Project.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter project";
        }
        else if (this.ProjectInfo.Start_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Start Date";
        }
        else if (this.ProjectInfo.End_Date == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter End Date";
        }
        else if (this.ProjectInfo.User_ID == undefined) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Manager";
        }
        else {

            this.service.AddUpdateProject(this.ProjectInfo).subscribe((data: any) => {
                this.MessageType = "Sucesses";
                if (this.ProjectInfo.Project_ID > 0) {
                    this.MessageInfo = "Project Information Updated sucessfully";
                }
                else {
                    this.MessageInfo = "Project Information added sucessfully";
                }
                this.ProjectInfo = new Project();
                this.SetDate = false;
                this.SearchValue = "";
                this.SortBy = "";
                this.UserName = "";
                this.LoadProjectList();
            });
        }

    }
    OnResetInfo() {
        this.ActionText = "Add";
        this.MessageType = "";
        this.MessageInfo = "";
        this.ProjectInfo = new Project();
        this.SearchValue = "";
        this.SortBy = "";
        this.ProjectInfoList = this.ProjectInfoListFromService;
        this.SetDate = false;

    }
    OnManagerSearchOpen() {
        this.SelectedUserId = undefined;
        if (this.UserInfoList == undefined) {
            this.service.GetUserList().subscribe((data: any) => {
                this.UserInfoList = data;
            });
        }
        this.ManagerModel.nativeElement.className = 'modal show';
    }
    OnManagerSearchSave() {
        if (this.SelectedUserId != undefined) {
            this.ProjectInfo.Userinfo = this.UserInfoList.find(x => x.User_ID == this.SelectedUserId);
            this.ProjectInfo.User_ID = this.SelectedUserId;
            this.UserName = this.ProjectInfo.Userinfo.First_Name;
            this.OnManagerSearchClose();
        }
    }
    OnManagerSearchClose() {
        this.ManagerModel.nativeElement.className = 'modal hide';
    }


    LoadProjectList() {
        this.service.GetProjectList().subscribe((data: any) => {
            this.ProjectInfoListFromService = data;

            this.service.GetTasksList().subscribe((tskData: any) => {
                let tskList = tskData as Task[];
                this.ProjectInfoListFromService.forEach(proj => {
                    proj.NoOfTask = tskList.filter(x => x.Project_ID == proj.Project_ID).length;

                    proj.CompletedTask = tskList.filter(x => x.Project_ID == proj.Project_ID && x.IsTaskEnded == 1).length;
                });
                this.ProjectInfoList = this.ProjectInfoListFromService;
            });
        });
    }
    OnSort(SortBy: string) {
        this.MessageInfo = "";
        this.MessageType = "";
        this.SortBy = SortBy;
        this.SortProjectInfo();
    }
    OnSearchInfo() {
        if (this.SearchValue != undefined || this.SearchValue != "") {
            this.ProjectInfoList = this.ProjectInfoListFromService;
            this.ProjectInfoList = this.ProjectInfoList.filter(x => x.Project.startsWith(this.SearchValue)
            );
        }
    }
    OnEdit(id: number) {
        this.ActionText = "Update";
        this.ProjectInfo = this.ProjectInfoList.find(x => x.Project_ID == id);
        this.SetDate = this.ProjectInfo.Start_Date != undefined || this.ProjectInfo.End_Date != undefined;
    }

    OnDelete(id: number) {
        this.service.DeleteProject(id).subscribe((data: any) => { this.LoadProjectList(); });
        this.MessageInfo = "Project Information Deleted sucessfully";

    }
    OnSetDate() {
        if (!this.SetDate) {
            this.ProjectInfo.Start_Date = new Date();
            var EndDate = new Date();
            EndDate.setDate(EndDate.getDate() + 1);
            this.ProjectInfo.End_Date = EndDate;
        }
        else {
            this.ProjectInfo.Start_Date = null;
            this.ProjectInfo.End_Date = null;
        }
    }

    SortProjectInfo() {
        if (this.SortBy == "StartDate") {
            this.ProjectInfoList.sort((a, b) => {
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
            this.ProjectInfoList.sort((a, b) => {
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
            this.ProjectInfoList.sort((a, b) => {
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
        } else {
            this.ProjectInfoList.sort((a, b) => {
                if (a.CompletedTask > b.CompletedTask) {
                    return 1;
                }
                else if (a.CompletedTask < b.CompletedTask) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
    }
}
