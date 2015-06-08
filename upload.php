<?php
function outputJSON($msg, $status = 'error'){
    header('Content-Type: application/json');
    die(json_encode(array(
        'data' => $msg,
        'status' => $status
    )));
}

if($_FILES['image']['error'] > 0){
    outputJSON('Erreur lors de l\'upload de l\'image.');
}

if(!getimagesize($_FILES['image']['tmp_name'])){
    outputJSON('Image invalide.');
}

if($_FILES['image']['type'] != 'image/png' && $_FILES['image']['type'] != 'image/jpeg'){
    outputJSON('L\'image doit etre au format PNG/JPEG.');
}

if($_FILES['image']['size'] > 500000){
    outputJSON('L\'image depasse la limite autorisé de 50Mo.');
}


if(!move_uploaded_file($_FILES['image']['tmp_name'], 'upload/' . $_FILES['image']['name'])){
    outputJSON('Erreur d\'ecriture.');
}

outputJSON( $_FILES['image']['name'],'good');