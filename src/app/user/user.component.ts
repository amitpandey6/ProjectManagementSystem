import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/User.model'
import { ManageTaskService } from 'src/app/ManageTask.service';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
    public UserInfoList: User[];
    public UserInfo: User;
    public ActionText = "Add";
    public UserInfoListFromService: User[];
    public MessageInfo = "";
    public MessageType = "";
    public SortBy = "";
    public SearchValue = "";


    constructor(public service: ManageTaskService) { }

    ngOnInit() {
        this.UserInfo = new User();
        this.LoadUser();
    }
    AddUpdateUser() {
        if (this.UserInfo.First_Name == undefined || this.UserInfo.First_Name.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter First Name";
        }
        else if (this.UserInfo.Last_Name == undefined || this.UserInfo.Last_Name.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Last Name";
        }
        else if (this.UserInfo.Employee_ID == undefined || this.UserInfo.Employee_ID.length <= 0) {
            this.MessageType = "Error";
            this.MessageInfo = "please enter Employee Id";
        } else {
            this.service.AddUpdateUser(this.UserInfo).subscribe((data: any) => {
                this.MessageType = "Sucesses";
                if (this.UserInfo.User_ID > 0) {
                    this.MessageInfo = "User information Updated sucessfully";
                }
                else {
                    this.MessageInfo = "User information added sucessfully";
                }
                this.UserInfo = new User();
                this.SearchValue = "";
                this.SortBy = "";
                this.LoadUser();

            });
        }

    }
    LoadUser() {
        this.service.GetUserList().subscribe((data: any) => {
            this.UserInfoList = data;
            this.UserInfoListFromService = data;
        });

    }
    EditUser(id: number) {
        this.ActionText = "Update"
        this.UserInfo = this.UserInfoList.find(x => x.User_ID == id);

    }
    DeleteUser(id: number) {
        this.service.DeleteUser(id).subscribe((data: any) => {
            this.MessageInfo = "User information deleted sucessfully";
            this.LoadUser();
        });

    }
    SortUser(SortBy: string) {
        this.MessageInfo = "";
        this.MessageType = "";
        this.SortBy = SortBy;
        this.SortUserInfo();
    }
    SortUserInfo() {
        if (this.SortBy == "FirstName") {
            this.UserInfoList.sort((a, b) => {
                if (a.First_Name > b.First_Name) {
                    return 1;
                }
                else if (a.First_Name < b.First_Name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

        } else if (this.SortBy == "LastName") {
            this.UserInfoList.sort((a, b) => {
                if (a.Last_Name > b.Last_Name) {
                    return 1;
                }
                else if (a.Last_Name < b.Last_Name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        } else {
            this.UserInfoList.sort((a, b) => {
                if (a.User_ID > b.User_ID) {
                    return 1;
                }
                else if (a.User_ID < b.User_ID) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
    }
    SearchUser() {
        if (this.SearchValue != undefined || this.SearchValue != "") {
            this.UserInfoList = this.UserInfoListFromService;
            this.UserInfoList = this.UserInfoList.filter(x => x.First_Name.startsWith(this.SearchValue)
                || x.Last_Name.startsWith(this.SearchValue)
                || x.Employee_ID.startsWith(this.SearchValue)
            );
        }
    }
    ResetUser() {
        this.UserInfo.First_Name = null;
        this.UserInfo.Last_Name = null;
        this.UserInfo.Employee_ID = null;
    }

}