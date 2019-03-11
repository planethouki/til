<?php
include './CryptoCurrencyPHP/Base58.class.php';
include './CryptoCurrencyPHP/PointMathGMP.class.php';
include './CryptoCurrencyPHP/AddressCodec.class.php';


$derPublicKey = '04a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd5b8dec5235a0fa8722476c7709c02559e3aa73aa03918ba2d492eea75abea235';

$point = AddressCodec::Point($derPublicKey);

echo $point['x'];
echo $point['y'];