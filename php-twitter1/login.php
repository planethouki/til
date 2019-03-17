<?php
// https://marunouchi-tech.i-studio.co.jp/4372/

//login.php
define('TWITTER_API_KEY', 'アプリのAPIキー'); 　//Consumer Key (API Key)
define('TWITTER_API_SECRET', 'アプリのAPIシークレット');　　//Consumer Secret (API Secret)
define('CALLBACK_URL', 'http:// ・・サイトのドメイン・・ /callback.php');　 //Twitterから認証した時に飛ぶページ場所


//login.php
//TwitterOAuthのインスタンスを生成し、Twitterからリクエストトークンを取得する
$twitter_connect = new TwitterOAuth(TWITTER_API_KEY, TWITTER_API_SECRET);
$request_token = $twitter_connect->oauth('oauth/request_token', array('oauth_callback' => CALLBACK_URL));

//リクエストトークンはcallback.phpでも利用するのでセッションに保存する
$_SESSION['oauth_token'] = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

//Twitterの認証画面へリダイレクト
$url = $twitter_connect->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
header('Location: '.$url);
exit;