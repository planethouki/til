<?php

require_once("./CopyOfPointMathGMP.class.php");

function getSignatureHashPoints($hash, $k, $nonce = null)
{
    $a = gmp_init('0', 10);
    $b = gmp_init('7', 10);
    $p = gmp_init('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16);
    $n = gmp_init('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
    $G = array('x' => gmp_init('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
                'y' => gmp_init('32670510020758816978083085130507043184471273380659243275938904335757337482424'));


    if(empty($k))
    {
        throw new \Exception('No Private Key was defined');
    }

    if(null == $nonce)
    {
        $random     = openssl_random_pseudo_bytes(256, $cStrong);
        $random     = $random . microtime(true).rand(100000000000, 1000000000000);
        $nonce      = gmp_strval(gmp_mod(gmp_init(hash('sha256',$random), 16), $n), 16);
    }

    //first part of the signature (R).

    $rPt = CopyOfPointMathGMP::mulPoint($nonce, $G, $a, $b, $p);
    $R	= gmp_strval($rPt ['x'], 16);

    while(strlen($R) < 64)
    {
        $R = '0' . $R;
    }

    //second part of the signature (S).
    //S = nonce^-1 (hash + privKey * R) mod p

    $S = gmp_strval(
                    gmp_mod(
                            gmp_mul(
                                    gmp_invert(
                                               gmp_init($nonce, 16),
                                               $n
                                    ),
                                    gmp_add(
                                            gmp_init($hash, 16),
                                            gmp_mul(
                                                    gmp_init($k, 16),
                                                    gmp_init($R, 16)
                                            )
                                    )
                            ),
                            $n
                    ),
                    16
         );

    if(strlen($S)%2)
    {
        $S = '0' . $S;
    }

    if(strlen($R)%2)
    {
        $R = '0' . $R;
    }

    return array('R' => $R, 'S' => $S);
}

$private = "5a417658f111880a9a453b50c59d6067060dc5a65dfe9838fb26e213d8650d14";

$random = "4445446b452d1211d3869c52c20e28924984da14f5764f8dfe4026e80f60fcb4";

$nonce = "fbf71c1fe284a8de6d6ca9c3be4499c60341c2b797feb1c91704bbd6420b1da0";

$sig = getSignatureHashPoints($random, $private, $nonce);

?>

<p><?php echo $private ?></p>
<p><?php echo $random ?></p>
<p><?php var_dump($sig) ?></p>