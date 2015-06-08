<?php
	if(isset($_POST['mail'])){
		if (!filter_var($_POST['mail'], FILTER_VALIDATE_EMAIL) === false) {
		  if(mail($_POST['mail'],"MW MAIL",base64_decode($_POST['msg']))){
		  	exit("good");
		  } else {
		  	exit("good");
		  }
		} else {
		  exit("error");
		}
	} else {
		exit("error");
	}
?>