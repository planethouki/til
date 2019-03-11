<?php
include './CryptoCurrencyPHP/Base58.class.php';
include './CryptoCurrencyPHP/SECp256k1.class.php';
include './CryptoCurrencyPHP/PointMathGMP.class.php';
include './CryptoCurrencyPHP/AddressCodec.class.php';
include './CryptoCurrencyPHP/PrivateKey.class.php';
include './CryptoCurrencyPHP/Wallet.class.php';
include './CryptoCurrencyPHP/Signature.class.php';

$private = new PrivateKey();

$random = new PrivateKey();

$sig = Signature::getSignatureHashPoints($random->getPrivateKey(), $private->getPrivateKey());

?>

<p><?php echo $private->getPrivateKey() ?></p>
<p><?php echo $random->getPrivateKey() ?></p>
<p><?php var_dump($sig) ?></p>