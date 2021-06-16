<?php
require 'connection.php';


// Create connection
$con = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);

if ($con->connect_error) {
    die("Connection Failed: " . $con->connect_error);
}

//Set TimeZone
date_default_timezone_set("ASIA/KOLKATA");
$date = time();

$json = json_decode(file_get_contents('php://input'), true);

if (isset($_REQUEST['flag'])) {
    $flag = $_REQUEST['flag'];
    switch ($flag) {
        case 'login':
            if (empty($json['user_mobile'])) {
                //Failure Response
                $Response = array(
                    "error" => 2,
                    "status" => "Failed",
                    "msg" => "Please Enter Your Registered Mobile Number!"
                );
                echo json_encode($Response);
            } elseif (empty($json['user_password'])) {
                $Response = array(
                    "error" => 3,
                    "status" => "Failed",
                    "msg" => "Please Enter Your Registered Password!"
                );
                echo json_encode($Response);
            } else {
                //Check User Mobile Number Registered or Not
                $partnerSearchNumberSQL = "SELECT * FROM `users_login` WHERE `user_mobile` = '" . $json['user_mobile'] . "' and `user_password`='" . $json['user_password'] . "'";
                $checkPartnerSearchNumberSQL = mysqli_query($con, $partnerSearchNumberSQL);
                if ($checkPartnerSearchNumberSQL->num_rows > 0) {
                    $partnerDetails = mysqli_fetch_array($checkPartnerSearchNumberSQL, MYSQLI_BOTH);
                    //Failure Response
                    $Response = array(
                        "error" => 0,
                        "status" => "Success",
                        "msg" => "Welcome!",
                        "user_name" => $partnerDetails['user_name'],
                        "user_mobile" => $partnerDetails['user_mobile'],

                    );
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 3,
                        "status" => "Failed",
                        "msg" => "This User Is Not Found!"
                    );
                    echo json_encode($Response);
                }
            }
            break;
        case 'upload_property':
            $date = time();
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
                 '" . $_POST['upload_by'] . "',
                 '$front_image',
                 '$left_image',
                 '$right_image',
                 '$opposite_image',
                 '" . $_POST['owner_name'] . "',
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


            break;
            //   ==================== view_property start================
        case 'view_property_new':
            if (empty($json['upload_by'])) {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Upload By Not Found!"
                );
                echo json_encode($Response);
            } else {
                $query = "SELECT * FROM `property` WHERE upload_by ='" . $json['upload_by'] . "'";
                $result = mysqli_query($con, $query);
                $url = 'https://gizmmoalchemy.com/api/consultancy/propertyimages/';
                if ($result->num_rows > 0) {
                    while ($row = mysqli_fetch_array($result, MYSQLI_BOTH)) {
                        $Property[] = array(
                            'property_id' => $row['property_id'],
                            'upload_by' => $row['upload_by'],
                            'front_image' => $url . $row['front_image'],
                            'left_image' => $url . $row['left_image'],
                            'right_image' => $url . $row['right_image'],
                            'opposite_image' => $url . $row['opposite_image'],
                            'owner_name' => $row['owner_name'],
                            'address' => $row['address'],
                            'city' => $row['city'],
                            'state' => $row['state'],
                            'pincode' => $row['pincode'],
                            'carpet_area' => $row['carpet_area'],
                            'frontage' => $row['frontage'],
                            'floor' => $row['floor'],
                            'price' => $row['price'],
                            'latitude' => $row['latitude'],
                            'longitude' => $row['longitude'],
                            'broker_name' => $row['broker_name'],
                            'owner_contact_name' => $row['owner_contact_name'],
                            'broker_contact_name' => $row['broker_contact_name'],
                            'created_date' => date('d-m-Y', $row['created_date']),

                        );
                    }
                    $Response = array(
                        "error" => 1,
                        "status" => "Success",
                        "msg" => "Property Details Found!",
                        'Property' => $Property
                    );
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed",
                        "msg" => "Property Details Not Found!"
                    );
                    echo json_encode($Response);
                }
            }
            break;
            //   ==================== view_property end================        
        default:
            $Response = array(
                "error" => 10,
                "status" => "Failed",
                "msg" => "Something Went Wrong"
            );
            echo json_encode($Response);
            break;
    }
}