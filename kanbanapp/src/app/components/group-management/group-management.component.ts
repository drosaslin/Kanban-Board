import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  members: Member[];
  permissions: string[];

  constructor() {
  }

  deleteMember(name) {
    for (let n = 0; n < this.members.length; n++) {
      if (this.members[n].name === name) {
        this.members.splice(n, 1);
        break;
      }
    }
  }

  changeMemberPermission(name, permission) {
    for (let n = 0; n < this.members.length; n++) {
      if (this.members[n].name === name) {
        this.members[n].permission = permission;
        break;
      }
    }
  }

  ngOnInit() {
    this.members = [
      {
        name: '林大衛',
        permission: 'Member',
        hide: true
      },
      {
        name: '邱嘉香',
        permission: 'Admin',
        hide: true
      },
      {
        name: '陳立宭',
        permission: 'Member',
        hide: true
      },
      {
        name: '林育成',
        permission: 'Member',
        hide: true
      },
      {
        name: '王奕翔',
        permission: 'Member',
        hide: true
      }
    ];

    this.permissions = [
      'Member',
      'Admin'
    ];
  }
}

interface Member {
  name: string;
  permission: string;
  hide: boolean;
}
