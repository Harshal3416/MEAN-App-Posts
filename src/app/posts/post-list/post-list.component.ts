import { Component, OnInit, OnDestroy,  } from '@angular/core';
import { Post } from '../post.model';
import { PostServiceService } from '../../services/post-service.service';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[] = [];
 private postSub : Subscription;
  private authStatusSub: Subscription

  userIsAuthenticated: boolean
  showLoader: boolean;
  totalPosts = 0
  postPerPage = 2
  currentPage = 1
  pageSizeOptions =  [1,2,5,10]
  userId: string

  constructor(public postSer: PostServiceService, private authService: AuthService){}

  ngOnInit(){
    this.showLoader = true
    this.postSer.getPost(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId()
    this.postSer.getPostUpdateListner()
    .subscribe((postData: {posts: Post[], postCount: number})=>{
      this.showLoader = false
      this.totalPosts = postData.postCount
      this.posts=postData.posts
    });

    this.userIsAuthenticated = this.authService.getIsAuth()

   this.authStatusSub = this.authService
   .getAuthStatusListner()
   .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
      this.userId = this.authService.getUserId()
   })
  }

  onDelete(postId : string){
    this.showLoader = true
    console.log("pid", postId)
    this.postSer.deletePost(postId).subscribe(()=>{
    this.postSer.getPost(this.postPerPage, this.currentPage);
    }, ()=>{
      this.showLoader = false
    })
  }

  ngOnDestroy() {
    // this.postSub.unsubscribe();
    // this.authStatusSub.unsubscribe()
  }

  onChanged(pageData: PageEvent){
    this.showLoader = true
    this.currentPage = pageData.pageIndex +1
    this.postPerPage = pageData.pageSize
    this.postSer.getPost(this.postPerPage, this.currentPage);
  }
}
