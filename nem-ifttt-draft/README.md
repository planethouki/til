# nem-ifttt-draft

nemのアドレスを監視して、unconfirmedTransactionとquantityの変化を検知します。

検知したら、IFTTTにwebhookします。

## Heroku

[Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)でやります。

```
git clone https://github.com/planethouki/nem-ifttt.git
cd nem-ifttt
heroku create your-nem-ifttt
git push -u heroku master
```

### Config Variables
Config Variablesで、NEMアドレスとIFTTTの設定を記述。  
![Heroku Config Variables Screen](https://github.com/planethouki/images/blob/master/nem-ifttt/nem-ifttt06.png)

#### local
`heroku local web`するには、`.env`ファイルが必要。

```
IFTTT_KEY=<your_ifttt_webhook_key>
IFTTT_EVENT_NAME=<your_ifttt_event_name>
NEM_ADDRESS=<your_nem_address>
```

## IFTTT

### IFTTT Webhooks Key
Service > Webhooks > Documentation の先に書いてあります。  
<img alt="IFTTT Webhooks Key Screen" src="https://github.com/planethouki/images/blob/master/nem-ifttt/nem-ifttt08.PNG" width="199px">

### Event Name
HerokuからのWebhookを受け付けるアプレットを作るとき、Event Nameを記述します。  
<img alt="Event Name Screen" src="https://github.com/planethouki/images/blob/master/nem-ifttt/nem-ifttt07.PNG" width="198px">

### body
`value1`に格納されてます。
