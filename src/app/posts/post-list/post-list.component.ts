import { Component, OnInit, OnDestroy,  } from '@angular/core';
import { Post } from '../post.model';
import { PostServiceService } from '../../services/post-service.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[] = [];
 private postSub : Subscription;
  showLoader: boolean;

  constructor(public postSer: PostServiceService){}

  ngOnInit(){
    this.showLoader = true
    this.postSer.getPost();
    this.postSer.getPostUpdateListner()
    .subscribe((posts: Post[])=>{
      this.showLoader = false
      this.posts=posts
    });
  }

  onDelete(postId : string){
    console.log("pid", postId)
    this.postSer.deletePost(postId)
  }

  ngOnDestroy() {
    // this.postSub.unsubscribe();
  }
}
