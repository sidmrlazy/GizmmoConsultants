<?php
require 'connection.php';




// Create connection
$con = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);
 
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
} 

//Set TimeZone
date_default_timezone_set("ASIA/KOLKATA");
$date = time();

$json = json_decode(file_get_contents('php://input'), true);
// $json = file_get_contents('php://input');
// print_r($json);                

            $uploaddir = "propertyimages/";
           
            $front_image = $uploaddir . time() . $_FILES['front_image']['name'];
            $left_image = $uploaddir . time() . $_FILES['left_image']['name'];
            $right_image = $uploaddir . time() . $_FILES['right_image']['name'];
            $opposite_image = $uploaddir . time() . $_FILES['opposite_image']['name'];
            $front_image_temp = $_FILES['front_image']['tmp_name'];
            $left_image_temp = $_FILES['left_image']['tmp_name'];
            $right_image_temp = $_FILES['right_image']['tmp_name'];
            $opposite_image_temp = $_FILES['opposite_image']['tmp_name'];
            move_uploaded_file($front_image_temp, $front_image);
            move_uploaded_file($left_image_temp, $left_image);
            move_uploaded_file($right_image_temp, $right_image);
            move_uploaded_file($opposite_image_temp, $opposite_image);
            $front_image1=compressImage($front_image_temp,$front_image,60);
            $left_image1=compressImageleft($left_image_temp,$left_image,60);
            $right_image1=compressImageright($right_image_temp,$right_image,60);
            $opposite_image1=compressImageopp($opposite_image_temp,$opposite_image,60);
            //   if(move_uploaded_file($front_image_temp, $front_image) && move_uploaded_file($left_image_temp, $left_image) && move_uploaded_file($right_image_temp, $right_image) && move_uploaded_file($opposite_image_temp, $opposite_image))
            //   {
            $query = "INSERT INTO `property`(`upload_by`,
            `front_image`,
             `left_image`,
             `right_image`,
             `opposite_image`,
             `owner_name`,
             `address`,
             `city`,
             `state`,
             `pincode`,
             `carpet_area`,
             `frontage`,
             `floor`,
             `price`,
             `latitude`,
             `longitude`,
             `broker_name`,
             `owner_contact_name`,
             `broker_contact_name`,
             `created_date`) VALUES (
                 '" .$_POST['upload_by'] . "',
                 '$front_image1',
                 '$left_image1',
                 '$right_image1',
                 '$opposite_image1',
                 '" . $json['owner_name'] . "',
                 '" . $_POST['address'] . "',
                 '" . $_POST['city'] . "',
                 '" . $_POST['state'] . "',
                 '" . $_POST['pincode'] . "',
                 '" . $_POST['carpet_area'] . "',
                 '" . $_POST['frontage'] . "',
                 '" . $_POST['floor'] . "',
                 '" . $_POST['price'] . "',
                 '" . $_POST['latitude'] . "',
                 '" . $_POST['longitude'] . "',
                 '" . $_POST['broker_name'] . "',
                 '" . $_POST['owner_contact_name'] . "',
                 '" . $_POST['broker_contact_name'] . "',
                 '$date')";

            $result = mysqli_query($con, $query);
            if ($result) {
                $Response = array(
                    "error" => 1,
                    "status" => "success",
                    "msg" => "Property Details Inserted!!!"
                );
                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Property Details Not Inserted!"
                );
                echo json_encode($Response);
            }


function compressImage($source, $destination, $quality) {

                 $info = getimagesize($source);
               
                 if ($info['mime'] == 'image/jpeg') {
                   $image = imagecreatefromjpeg($source);
                   imagejpeg($image, $destination,$quality);
                 }
                 elseif ($info['mime'] == 'image/png'){ 
                   $image = imagecreatefrompng($source);
                 imagejpeg($image, $destination, $quality);
                 }
                 return $destination;
               }
               
               //left image
                function compressImageleft($source, $destination, $quality) {

                 $info = getimagesize($source);
               
                 if ($info['mime'] == 'image/jpeg') {
                   $image = imagecreatefromjpeg($source);
                   imagejpeg($image, $destination,$quality);
                 }
                 elseif ($info['mime'] == 'image/png'){ 
                   $image = imagecreatefrompng($source);
                 imagejpeg($image, $destination, $quality);
                 }
                 return $destination;
               }
                // ==right image
                 function compressImageright($source, $destination, $quality) {

                 $info = getimagesize($source);
               
                 if ($info['mime'] == 'image/jpeg') {
                   $image = imagecreatefromjpeg($source);
                   imagejpeg($image, $destination,$quality);
                 }
                 elseif ($info['mime'] == 'image/png'){ 
                   $image = imagecreatefrompng($source);
                 imagejpeg($image, $destination, $quality);
                 }
                 return $destination;
               }
            //   opp image=========
               function compressImageopp($source, $destination, $quality) {

                 $info = getimagesize($source);
               
                 if ($info['mime'] == 'image/jpeg') {
                   $image = imagecreatefromjpeg($source);
                   imagejpeg($image, $destination,$quality);
                 }
                 elseif ($info['mime'] == 'image/png'){ 
                   $image = imagecreatefrompng($source);
                 imagejpeg($image, $destination, $quality);
                 }
                 return $destination;
               }
     

?>