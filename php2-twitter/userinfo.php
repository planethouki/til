<?php
session_start();
?>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
	<link rel="stylesheet" type="text/css" href="https://rawgit.com/outboxcraft/beauter/master/beauter.min.css"/>
</head>

<body>

<pre id="box"></pre>


<script src="https://rawgit.com/outboxcraft/beauter/master/beauter.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
<?php echo "const data = " . json_encode($_SESSION['user_info']); ?>

$("#box").text(JSON.stringify(data, null, "\t"));
</script>

</body>

</html>