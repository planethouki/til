<?php
include './CryptoCurrencyPHP/Base58.class.php';
include './CryptoCurrencyPHP/SECp256k1.class.php';
include './CryptoCurrencyPHP/PointMathGMP.class.php';
include './CryptoCurrencyPHP/AddressCodec.class.php';
include './CryptoCurrencyPHP/PrivateKey.class.php';
include './CryptoCurrencyPHP/Wallet.class.php';
include './CryptoCurrencyPHP/Signature.class.php';

$private = "5a417658f111880a9a453b50c59d6067060dc5a65dfe9838fb26e213d8650d14";

$random = "4445446b452d1211d3869c52c20e28924984da14f5764f8dfe4026e80f60fcb4";

$nonce = "fbf71c1fe284a8de6d6ca9c3be4499c60341c2b797feb1c91704bbd6420b1da0";

$sig = Signature::getSignatureHashPoints($random, $private, $nonce);

?>

<p><?php echo $private ?></p>
<p><?php echo $random ?></p>
<p><?php var_dump($sig) ?></p>