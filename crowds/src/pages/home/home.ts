import { Component } from '@angular/core';
import { NavController, 
  AlertController, // To Add Button
  ActionSheetController // To delete
 } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from '@firebase/util';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: any;
  post : any;
  messageList: AngularFireList<any>;
  usuarioList: AngularFireList<string>;
  usuario: any;

  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afDatabase: AngularFireDatabase,
    public afAuth: AngularFireAuth) {
      this.post = afDatabase.list('post');
      this.messageList = this.post.valueChanges();
      this.usuario = afDatabase.list('users');
      this.usuarioList = this.usuario.valueChanges();
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null;
        return;
      }
      this.currentUser = {uid:user.uid, photoURL: user.photoURL};
    });

  }



  addMessage(){
    let prompt = this.alertCtrl.create({
      title: 'Message',
      message: "What are your thoughts?",
      inputs: [
        {
          name: 'post',
          placeholder: 'Message'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            const newMessage = this.post.push({});
            let likes : number = 0;
            let dislikes: number = 0;
            newMessage.set({
              id: newMessage.key,
              message: data.post,
              uid: this.currentUser.uid,
              likes: 0,
              dislikes: 0,
            });
          }
        }
      ]
    });
    prompt.present();
  }



  showOptions(Id, message, likes, dislikes) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Message',
          role: 'destructive',
          handler: () => {
            this.removeMessage(Id);
          }
        },{
          text: 'Update Post',
          handler: () => {
            this.updatePost(Id, message);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeMessage(Id: string){
    this.post.remove(Id);
  }

  updatePost(Id, post){
    let prompt = this.alertCtrl.create({
      title: 'New Message',
      message: "Update this message.",
      inputs: [
        {
          name: 'message',
          placeholder: 'New Message',
          value: post
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.post.update(Id, {
              message: data.message, lastUpdatedBy: this.currentUser.uid
            });
          }
        }
      ]
    });
    prompt.present();
  }
updateLikes(Id, likes){
  this.post.update(Id, {likes : likes + 1});
}
updateDislikes(Id, dislikes){
  this.post.update(Id, {dislikes : dislikes + 1});
}



  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((response)=>{
      console.log('resultado login google:', response);
      const userRef = this.afDatabase.list('users');
      userRef.update(response.user.uid, 
        {
          userId: response.user.uid, 
          displayName: response.user.displayName,
          photoURL: response.user.photoURL
        });
      //userRef.push({userId: xx.user.uid, displayName: xx.user.displayName}).then((xx)=>{

      //});
      
    });
  }

  loginWithEmail() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider()).then((xx)=>{

    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }


}
