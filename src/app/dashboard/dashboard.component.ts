import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const FeedQuery = gql`
      {
        users{
          id
          username
          email
          password
        }
      }
`;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {

  username = '';   //用户输入的用户名
  password = '';  //用户输入的密码
  bool = false;  //是否显示用户列表  如果存在用户输入的信息  则显示用户列表
  num: number;

  user: Observable<any>;

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    // 将user注释   ng server --open 跑起来  然后打开注释
    this.user = this.apollo
      .watchQuery({ query: FeedQuery })
      .valueChanges.pipe(map(({ data }) => data.users));
  }

  is_exist(): void {
    this.num = 0; //判断当前是否登录成功  成功以后++ 将bool变为true 将用户列表显示出来
    if (this.username && this.password) {
      // 这里循环请求过来的用户列表
      this.user.forEach(v => {
        v.forEach(k => {
          // 判断表单的用户名和密码 是否和请求回来的用户名密码匹配
          if (this.username === k.username && this.password === k.password) {
            this.num++;
          }

        });
        if (this.num === 1) {
          this.bool = true;
        } else {
          this.bool = false;
          alert('密码或用户名错误！！！');
        }
      });

    } else {
      alert('密码或用户名不能为空！！！');
    }
  }



}
