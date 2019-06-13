import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  message: string;

  post: {
    userName: string,
    message: string,
    createDate: any
  } = {
    userName: 'Taro Yamada',
    message: 'これはテストメッセージです',
    createDate: '10分前'
  };

  posts: { userName: string, message: string, createDate: any }[] = [
    {
      userName: 'Taro Yamada',
      message: 'これはテストメッセージです',
      createDate: '10分前'
    },
    {
      userName: 'Taro Yamada',
      message: 'これはテストメッセージです',
      createDate: '10分前'
    }
  ];

  constructor(private alertCtrl: AlertController) {}

  addPost() {
    this.post = {
      userName: 'Akira Yanagihara',
      message: this.message,
      createDate: '数秒前'
    };

    this.posts.push(this.post);
    this.message = '';
  }

  async presentPrompt(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'メッセージ編集',
      inputs: [
        {
          name: 'message',
          type: 'text',
          placeholder: 'メッセージ'
        }
      ],
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('キャンセルが選択されました');
          }
        },
        {
          text: '更新',
          handler: data => {
            console.log(data);
            this.posts[index].message = data.message;
          }
        }
      ]
    });
    await alert.present();
  }

  deletePost(index: number) {
    this.posts.splice(index, 1);
  }

}
