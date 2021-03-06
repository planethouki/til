<?php


class MySampleClass {

    /***
     * Computes the result of a point addition and returns the resulting point as an Array.
     *
     * @param Array $pt
     * @return Array Point
     * @throws \Exception
     */
    public static function doublePoint(Array $pt, $a, $p)
    {
        $gcd = gmp_strval(gmp_gcd(gmp_mod(gmp_mul(gmp_init(2, 10), $pt['y']), $p),$p));
        if($gcd != '1')
        {
            throw new \Exception('This library doesn\'t yet supports point at infinity. See https://github.com/BitcoinPHP/BitcoinECDSA.php/issues/9');
        }

        // SLOPE = (3 * ptX^2 + a )/( 2*ptY )
        // Equals (3 * ptX^2 + a ) * ( 2*ptY )^-1
        $slope = gmp_mod(
                         gmp_mul(
                                 gmp_invert(
                                            gmp_mod(
                                                    gmp_mul(
                                                            gmp_init(2, 10),
                                                            $pt['y']
                                                    ),
                                                    $p
                                            ),
                                            $p
                                 ),
                                 gmp_add(
                                         gmp_mul(
                                                 gmp_init(3, 10),
                                                 gmp_pow($pt['x'], 2)
                                         ),
                                         $a
                                 )
                         ),
                         $p
                );

        // nPtX = slope^2 - 2 * ptX
        // Equals slope^2 - ptX - ptX
        $nPt = array();
        $nPt['x'] = gmp_mod(
                            gmp_sub(
                                    gmp_sub(
                                            gmp_pow($slope, 2),
                                            $pt['x']
                                    ),
                                    $pt['x']
                            ),
                            $p
                    );

        // nPtY = slope * (ptX - nPtx) - ptY
        $nPt['y'] = gmp_mod(
                            gmp_sub(
                                    gmp_mul(
                                            $slope,
                                            gmp_sub(
                                                    $pt['x'],
                                                    $nPt['x']
                                            )
                                    ),
                                    $pt['y']
                            ),
                            $p
                    );

        return $nPt;
    }

    /***
     * Computes the result of a point addition and returns the resulting point as an Array.
     *
     * @param Array $pt1
     * @param Array $pt2
     * @return Array Point
     * @throws \Exception
     */
    public static function addPoints(Array $pt1, Array $pt2, $a, $p)
    {
        if(gmp_cmp($pt1['x'], $pt2['x']) == 0  && gmp_cmp($pt1['y'], $pt2['y']) == 0) //if identical
        {
            return self::doublePoint($pt1, $a, $p);
        }

        $gcd = gmp_strval(gmp_gcd(gmp_sub($pt1['x'], $pt2['x']), $p));
        if($gcd != '1')
        {
            throw new \Exception('This library doesn\'t yet supports point at infinity. See https://github.com/BitcoinPHP/BitcoinECDSA.php/issues/9');
        }

        // SLOPE = (pt1Y - pt2Y)/( pt1X - pt2X )
        // Equals (pt1Y - pt2Y) * ( pt1X - pt2X )^-1
        $slope      = gmp_mod(
                              gmp_mul(
                                      gmp_sub(
                                              $pt1['y'],
                                              $pt2['y']
                                      ),
                                      gmp_invert(
                                                 gmp_sub(
                                                         $pt1['x'],
                                                         $pt2['x']
                                                 ),
                                                 $p
                                      )
                              ),
                              $p
                      );

        // nPtX = slope^2 - ptX1 - ptX2
        $nPt = array();
        $nPt['x']   = gmp_mod(
                              gmp_sub(
                                      gmp_sub(
                                              gmp_pow($slope, 2),
                                              $pt1['x']
                                      ),
                                      $pt2['x']
                              ),
                              $p
                      );

        // nPtX = slope * (ptX1 - nPtX) - ptY1
        $nPt['y']   = gmp_mod(
                              gmp_sub(
                                      gmp_mul(
                                              $slope,
                                              gmp_sub(
                                                      $pt1['x'],
                                                      $nPt['x']
                                              )
                                      ),
                                      $pt1['y']
                              ),
                              $p
                      );

        return $nPt;
    }

    /***
     * Computes the result of a point multiplication and returns the resulting point as an Array.
     *
     * @param String Hex $k
     * @param Array $pG (GMP, GMP)
     * @param $base (INT)
     * @throws \Exception
     * @return Array Point (GMP, GMP)
     */
    public static function mulPoint($k, Array $pG, $a, $b, $p, $base = null)
    {
        //in order to calculate k*G
        if($base == 16 || $base == null || is_resource($base))
            $k = gmp_init($k, 16);
        if($base == 10)
            $k = gmp_init($k, 10);
        $kBin = gmp_strval($k, 2);

        $lastPoint = $pG;
        for($i = 1; $i < strlen($kBin); $i++)
        {
            if(substr($kBin, $i, 1) == 1 )
            {
                $dPt = self::doublePoint($lastPoint, $a, $p);
                $lastPoint = self::addPoints($dPt, $pG, $a, $p);
            }
            else
            {
                $lastPoint = self::doublePoint($lastPoint, $a, $p);
            }
        }
        if(!self::validatePoint(gmp_strval($lastPoint['x'], 16), gmp_strval($lastPoint['y'], 16), $a, $b, $p)){
            throw new \Exception('The resulting point is not on the curve.');
		}
        return $lastPoint;
    }

    /***
     * Calculates the square root of $a mod p and returns the 2 solutions as an array.
     *
     * @param $a
     * @return array|null
     * @throws \Exception
     */
    public static function sqrt($a, $p)
    {
        if(gmp_legendre($a, $p) != 1)
        {
            //no result
            return null;
        }

        if(gmp_strval(gmp_mod($p, gmp_init(4, 10)), 10) == 3)
        {
            $sqrt1 = gmp_powm(
                            $a,
                            gmp_div_q(
                                gmp_add($p, gmp_init(1, 10)),
                                gmp_init(4, 10)
                            ),
                            $p
                    );
            // there are always 2 results for a square root
            // In an infinite number field you have -2^2 = 2^2 = 4
            // In a finite number field you have a^2 = (p-a)^2
            $sqrt2 = gmp_mod(gmp_sub($p, $sqrt1), $p);
            return array($sqrt1, $sqrt2);
        }
        else
        {
            throw new \Exception('P % 4 != 3 , this isn\'t supported yet.');
        }
    }

    /***
     * Calculate the Y coordinates for a given X coordinate.
     *
     * @param $x
     * @param null $derEvenOrOddCode
     * @return array|null|String
     */
    public static function calculateYWithX($x, $a, $b, $p, $derEvenOrOddCode = null)
    {
        $x  = gmp_init($x, 16);
        $y2 = gmp_mod(
                      gmp_add(
                              gmp_add(
                                      gmp_powm($x, gmp_init(3, 10), $p),
                                      gmp_mul($a, $x)
                              ),
                              $b
                      ),
                      $p
              );

        $y = self::sqrt($y2, $p);

        if(!$y) //if there is no result
        {
            return null;
        }

        if(!$derEvenOrOddCode)
        {
            return $y;
        }

        else if($derEvenOrOddCode == '02') // even
        {
            $resY = null;
            if(false == gmp_strval(gmp_mod($y[0], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[0], 16);
            if(false == gmp_strval(gmp_mod($y[1], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[1], 16);
            if($resY)
            {
                while(strlen($resY) < 64)
                {
                    $resY = '0' . $resY;
                }
            }
            return $resY;
        }
        else if($derEvenOrOddCode == '03') // odd
        {
            $resY = null;
            if(true == gmp_strval(gmp_mod($y[0], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[0], 16);
            if(true == gmp_strval(gmp_mod($y[1], gmp_init(2, 10)), 10))
                $resY = gmp_strval($y[1], 16);
            if($resY)
            {
                while(strlen($resY) < 64)
                {
                    $resY = '0' . $resY;
                }
            }
            return $resY;
        }

        return null;
    }

    /***
     * Returns true if the point is on the curve and false if it isn't.
     *
     * @param $x
     * @param $y
     * @return bool
     */
    public static function validatePoint($x, $y, $a, $b, $p)
    {
        $x  = gmp_init($x, 16);
        $y2 = gmp_mod(
                        gmp_add(
                            gmp_add(
                                gmp_powm($x, gmp_init(3, 10), $p),
                                gmp_mul($a, $x)
                            ),
                            $b
                        ),
                        $p
                    );
        $y = gmp_mod(gmp_pow(gmp_init($y, 16), 2), $p);

        if(gmp_cmp($y2, $y) == 0)
            return true;
        else
            return false;
    }

    /***
     * Returns Negated Point (Y).
     *
     * @param $point Array(GMP, GMP)
     * @return Array(GMP, GMP)
     */
	public static function negatePoint($point) { 
		return array('x' => $point['x'], 'y' => gmp_neg($point['y'])); 
	}

	// These 2 function don't really belong here.

	// Checks is the given number (DEC String) is even
	public static function isEvenNumber($number) {
		return (((int)$number[strlen($number)-1]) & 1) == 0;
	}
	// Converts BIN to GMP
	public static function bin2gmp($binStr) {
		$v = gmp_init('0');

		for ($i = 0; $i < strlen($binStr); $i++) {
			$v = gmp_add(gmp_mul($v, 256), ord($binStr[$i]));
		}

		return $v;
    }
    
    public static function getSignatureHashPoints($hash, $k, $nonce = null)
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
    
        $rPt = self::mulPoint($nonce, $G, $a, $b, $p);
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

}


$private = "5a417658f111880a9a453b50c59d6067060dc5a65dfe9838fb26e213d8650d14";

$random = "4445446b452d1211d3869c52c20e28924984da14f5764f8dfe4026e80f60fcb4";

$nonce = "fbf71c1fe284a8de6d6ca9c3be4499c60341c2b797feb1c91704bbd6420b1da0";

$sig = MySampleClass::getSignatureHashPoints($random, $private, $nonce);

?>

<p><?php echo $private ?></p>
<p><?php echo $random ?></p>
<p><?php var_dump($sig) ?></p>