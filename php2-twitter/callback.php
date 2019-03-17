<?php
// https://marunouchi-tech.i-studio.co.jp/4372/

require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

require_once('token.php');

session_start();

//callback.php
//リクエストトークンを使い、アクセストークンを取得する
$twitter_connect = new TwitterOAuth(TWITTER_API_KEY, TWITTER_API_SECRET, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
$access_token = $twitter_connect->oauth('oauth/access_token', array('oauth_verifier' => $_GET['oauth_verifier'], 'oauth_token'=> $_GET['oauth_token']));

//callback.php
//アクセストークンからユーザの情報を取得する
$user_connect = new TwitterOAuth(TWITTER_API_KEY, TWITTER_API_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
$user_info = $user_connect->get('account/verify_credentials');//アカウントの有効性を確認するためのエンドポイント
//ユーザ情報が取得できればcomplete.html、それ以外はerror.htmlに移動する
if(isset($user_info->id_str)){
    $_SESSION['user_info'] = $user_info;
    header("Location:complete.html");
    exit;
}
else{
    header("Location:error.html");
    exit; 
}