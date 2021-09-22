<?php
require '../connection.php';


// Create connection
$con = new mysqli($HostName, $HostUser, $HostPass, $DatabaseName);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

//Set TimeZone
date_default_timezone_set("ASIA/KOLKATA");
$date = time();
$today = strtotime("today");
$tomorrow = strtotime("tomorrow");
$json = json_decode(file_get_contents('php://input'), true);
$apiKey = 'AIzaSyDBpVun7zOunu5uqB2YCx0dPv-woCa27UA';
if (isset($_REQUEST['flag'])) {
    $flag = $_REQUEST['flag'];
    switch ($flag) {

        case 'login':
            if (!empty($json['customer_mobile'])) {
                $partnerSearchNumberSQL = "SELECT * FROM `pantryo_customer` WHERE `customer_mobile` = '" . $json['customer_mobile'] . "'";
                $checkPartnerSearchNumberSQL = mysqli_query($con, $partnerSearchNumberSQL);
                if ($checkPartnerSearchNumberSQL->num_rows > 0) {
                    $partnerDetails = mysqli_fetch_array($checkPartnerSearchNumberSQL, MYSQLI_BOTH);
                    //Failure Response
                    $Response = array(
                        "error" => 0,
                        "status" => "Success",
                        "msg" => "Welcome!",
                        "customer_id" => $partnerDetails['customer_id'],
                        "customer_mobile" => $partnerDetails['customer_mobile'],
                        "customer_name" => $partnerDetails['customer_name'],
                    );
                } else {
                    $Response = array(
                        "error" => 2,
                        "status" => "Failed",
                        "msg" => "We could not find this mobile number in our system!"
                    );
                }

                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 2,
                    "status" => "Failed",
                    "msg" => "There is something wrong!"
                );
                echo json_encode($Response);
            }
            break;
        case 'login1':
            if (!empty($json['customer_mobile']) && !empty($json['user_token'])) {
                $partnerSearchNumberSQL = "SELECT * FROM `pantryo_customer` WHERE `customer_mobile` = '" . $json['customer_mobile'] . "'";
                $checkPartnerSearchNumberSQL = mysqli_query($con, $partnerSearchNumberSQL);
                if ($checkPartnerSearchNumberSQL->num_rows > 0) {
                    ////Update User Token 
                    $updateSql = "UPDATE `pantryo_customer` SET `user_token`='" . $json['user_token'] . "' WHERE  `customer_mobile` = '" . $json['customer_mobile'] . "'";
                    $fireUpdateQuery = mysqli_query($con, $updateSql);

                    $partnerSearchNumberSQL1 = "SELECT * FROM `pantryo_customer` WHERE `customer_mobile` = '" . $json['customer_mobile'] . "'";
                    $checkPartnerSearchNumberSQL1 = mysqli_query($con, $partnerSearchNumberSQL1);
                    $partnerDetails = mysqli_fetch_array($checkPartnerSearchNumberSQL1, MYSQLI_BOTH);
                    //Failure Response
                    $Response = array(
                        "error" => 0,
                        "status" => "Success",
                        "msg" => "Welcome!",
                        "customer_id" => $partnerDetails['customer_id'],
                        "customer_mobile" => $partnerDetails['customer_mobile'],
                        "customer_name" => $partnerDetails['customer_name'],
                        "user_token" => $partnerDetails['user_token'],
                    );
                } else {
                    $Response = array(
                        "error" => 2,
                        "status" => "Failed",
                        "msg" => "We could not find this mobile number in our system!"
                    );
                }

                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 2,
                    "status" => "Failed",
                    "msg" => "There is something wrong!"
                );
                echo json_encode($Response);
            }
            break;

        case 'user_register':
            if (!empty($json['customer_name']) && !empty($json['customer_mobile'])) {
                $mobileverification = "SELECT * FROM `pantryo_customer` WHERE `customer_mobile` = '" . $json['customer_mobile'] . "'";
                $checkmobileverification = mysqli_query($con, $mobileverification);
                if ($checkmobileverification->num_rows > 0) {
                    ///Failure
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed",
                        "msg" => "Hey, we've found this mobile number in our system, just login!"
                    );

                    echo json_encode($Response);
                } else {
                    $mobile = $json['customer_mobile'];
                    $name = $json['customer_name'];
                    $otp = 123456;
                    // $otp = rand(111111,999999);
                    // $msg= "Your Pantryo OTP is $otp";
                    // $curl = curl_init();
                    // curl_setopt_array($curl, array(
                    //     CURLOPT_URL => "http://api.msg91.com/api/sendhttp.php?sender=LABADA&route=4&mobiles=$mobile&authkey=240434AJDFeUGV5f6883cbP1&message=$msg&unicode=1&route=4",
                    //     CURLOPT_RETURNTRANSFER => true,
                    //     CURLOPT_ENCODING => "",
                    //     CURLOPT_MAXREDIRS => 10,
                    //     CURLOPT_TIMEOUT => 30,
                    //     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    //     CURLOPT_CUSTOMREQUEST => "GET",
                    //     CURLOPT_SSL_VERIFYHOST => 0,
                    //     CURLOPT_SSL_VERIFYPEER => 0,
                    // ));

                    // $response = curl_exec($curl);
                    // $err = curl_error($curl);
                    // curl_close($curl);


                    // Failure Response
                    $Response = array(
                        "error" => 0,
                        "status" => "Success",
                        "msg" => "OTP Send on given number!",
                        "resend_otp" => $otp,
                        "customer_mobile" => $mobile,
                        "customer_name" => $name,
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 2,
                    "status" => "Failed",
                    "msg" => "Please Enter your name and mobile number!!"
                );

                echo json_encode($Response);
            }
            break;
        case 'user_otp_verifiction':
            if (!empty($json['customer_name']) && !empty($json['customer_mobile']) && !empty($json['resend_otp']) && !empty($json['entered_otp'])) {
                if ($json['entered_otp'] == $json['resend_otp']) {
                    $insertCustomer = "INSERT INTO `pantryo_customer`(`customer_name`,`customer_mobile`, `customer_status`,`user_token`) VALUES ('" . $json['customer_name'] . "','" . $json['customer_mobile'] . "','1','" . $json['user_token'] . "')";
                    $checkInsert = mysqli_query($con, $insertCustomer);
                    if ($checkInsert == true) {
                        //Success Response
                        // $Response = array(
                        //     "error" => 0,
                        //     "status"=>"Success",
                        //     "msg"=>"Otp Matched And User Inserted!",
                        // );
                        $partnerSearchNumberSQL = "SELECT * FROM `pantryo_customer` WHERE `customer_mobile` = '" . $json['customer_mobile'] . "'";
                        $checkPartnerSearchNumberSQL = mysqli_query($con, $partnerSearchNumberSQL);
                        if ($checkPartnerSearchNumberSQL->num_rows > 0) {
                            $partnerDetails = mysqli_fetch_array($checkPartnerSearchNumberSQL, MYSQLI_BOTH);
                            //Failure Response
                            $Response = array(
                                "error" => 0,
                                "status" => "Success",
                                "msg" => "Otp Matched And User Inserted!",
                                "customer_id" => $partnerDetails['customer_id'],
                                "customer_mobile" => $partnerDetails['customer_mobile'],
                                "customer_name" => $partnerDetails['customer_name'],
                                "user_token" => $partnerDetails['user_token'],
                            );
                        } else {
                            $Response = array(
                                "error" => 2,
                                "status" => "Failed",
                                "msg" => "Something went Worng!"
                            );
                        }
                    } else {
                        //Failure Response
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed",
                            "msg" => "Query Error User Not Inserted!!"
                        );
                    }
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed",
                        "msg" => "OTP Not Matched"
                    );

                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Customer Name or Mobile Number did not match"
                );

                echo json_encode($Response);
            }
            break;

            //  ================login api start ===============

        case 'resendOTP':
            if (empty($json['partner_contactNumber'])) {
                //Failure Response
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Mobile Number not Found!Please Login Again"
                );
                echo json_encode($Response);
            } else {
                $otp = rand(111111, 999999);
                $mobile = $json['partner_contactNumber'];
                $msg = "Your Pantryo OTP is $otp";
                $curl = curl_init();
                curl_setopt_array($curl, array(
                    CURLOPT_URL => "http://api.msg91.com/api/sendhttp.php?sender=LABADA&route=4&mobiles=$mobile&authkey=240434AJDFeUGV5f6883cbP1&message=$msg&unicode=1&route=4",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "GET",
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                ));

                $response = curl_exec($curl);
                $err = curl_error($curl);
                curl_close($curl);

                //Failure Response
                $Response = array(
                    "error" => 0,
                    "status" => "Success",
                    "msg" => "OTP Send on given number!",
                    "otp" => $otp,
                    "partner_contactNumber" => $json['partner_contactNumber'],
                );

                echo json_encode($Response);
            }
            break;

        case 'getAddressByLongitudeLatitude':

            if (empty($json['longitude']) && empty($json['latitude'])) {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Longitude Or Latitude Not Found!!"
                );
                echo json_encode($Response);
            } else {

                $longitude = $json['longitude'];
                $latitude = $json['latitude'];
                $address = null;
                $geoLocation = array();

                $geocode = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=false&key=$apiKey";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $geocode);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                $response = curl_exec($ch);
                curl_close($ch);
                $output = json_decode($response);
                $dataarray = get_object_vars($output);
                if ($dataarray['status'] != 'ZERO_RESULTS' && $dataarray['status'] != 'INVALID_REQUEST') {
                    if (isset($dataarray['results'][0]->formatted_address)) {

                        $address = $dataarray['results'][0]->formatted_address;
                    } else {
                        $address = 'Not Found';
                    }
                } else {
                    $address = 'Not Found';
                }

                // return $address;
                echo json_encode($address);
                // print_r($address);
            }
            break;
        case 'getPartnerListByLongitudeLatitude':

            if (empty($json['longitude']) && empty($json['latitude'])) {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Longitude Or Latitude Not Found!!"
                );
                echo json_encode($Response);
            } else {

                $longitude = $json['longitude'];
                $latitude = $json['latitude'];

                $geocodeFromLatlon = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true&key=$apiKey");
                $output2 = json_decode($geocodeFromLatlon);
                if (!empty($output2)) {
                    $addressComponents = $output2->results[0]->address_components;
                    foreach ($addressComponents as $addrComp) {
                        if ($addrComp->types[0] == 'postal_code') {
                            $address = $addrComp->long_name;
                        }
                    }
                }

                if (!empty($address)) {
                    $getpartnerquery = "SELECT * FROM `pantryo_partner` JOIN `partner_category` ON `pantryo_partner`.`partner_category` = `partner_category`.`partner_category_id` WHERE `partner_pincode` = '$address'";
                    $getpartnerdetalis = mysqli_query($con, $getpartnerquery);
                    if ($getpartnerdetalis->num_rows > 0) {
                        $sellerList = array();
                        while ($partnerDetails = mysqli_fetch_array($getpartnerdetalis, MYSQLI_BOTH)) {
                            $sellerList[] = array(
                                "partner_id" => $partnerDetails['partner_id'],
                                "partner_shopName" => $partnerDetails['partner_shopName'],
                                "partner_gstStatus" => $partnerDetails['partner_gstStatus'],
                                "partner_gstNumber" => $partnerDetails['partner_gstNumber'],
                                "partner_category" => $partnerDetails['partner_category'],
                                "partner_category_name" => $partnerDetails['partner_category_name'],
                                "partner_contactNumber" => $partnerDetails['partner_contactNumber'],
                                "partner_shopgpslocation" => $partnerDetails['partner_shopgpslocation'],
                                "partner_shopaddress" => $partnerDetails['partner_shopaddress'],
                                "partner_bankName" => $partnerDetails['partner_bankName'],
                                "partner_accountNumber" => $partnerDetails['partner_accountNumber'],
                                "partner_bankAccountHolderName" => $partnerDetails['partner_bankAccountHolderName'],
                                "partner_bankISFCCode" => $partnerDetails['partner_bankISFCCode'],
                                "partner_upiId" => $partnerDetails['partner_upiId'],
                                "partner_idType" => $partnerDetails['partner_idType'],
                                "partner_gstCertificate" => $partnerDetails['partner_gstCertificate'],
                                "partner_status" => $partnerDetails['partner_status'],
                            );
                        }
                        $Response = array(
                            "error" => 0,
                            "status" => "Success",
                            "msg" => "Partner Details Found!!",
                            "SellerList" => $sellerList,
                        );
                        echo json_encode($Response);
                    } else {
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed",
                            "msg" => "Partner Details Not Found!!",
                            "SellerList" => null,
                        );
                        echo json_encode($Response);
                    }
                }
            }
            break;

        case 'getPartnerListByAddress':
            if (!empty($json['searchAddress'])) {

                $zipcode = null;
                $formattedAddr = str_replace(' ', '+', $json['searchAddress']);

                $geocodeFromAddr = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddr . '&sensor=false&key=' . $apiKey);
                $output1 = json_decode($geocodeFromAddr);

                if ($output1->status == "ZERO_RESULTS") {
                    // echo json_encode(array("zipcode" => "Sorry, We are unable to find zipcode!2"));
                } else {

                    $latitude = $output1->results[0]->geometry->location->lat;
                    $longitude = $output1->results[0]->geometry->location->lng;
                    $geocodeFromLatlon = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=false&key=$apiKey");
                    $output2 = json_decode($geocodeFromLatlon);
                    if (!empty($output2)) {
                        $addressComponents = $output2->results[0]->address_components;
                        foreach ($addressComponents as $addrComp) {
                            if ($addrComp->types[0] == 'postal_code') {
                                $zipcode = $addrComp->long_name;
                            }
                        }
                        // print_r($zipcode);exit;
                    }
                }
                $getpartnerquery = "SELECT * FROM `pantryo_partner` JOIN `partner_category` ON `pantryo_partner`.`partner_category` = `partner_category`.`partner_category_id` WHERE  `partner_pincode` = '$zipcode'";

                $getpartnerdetalis = mysqli_query($con, $getpartnerquery);
                if ($getpartnerdetalis->num_rows > 0) {
                    $sellerList = array();
                    while ($partnerDetails = mysqli_fetch_array($getpartnerdetalis, MYSQLI_BOTH)) {
                        $sellerList[] = array(
                            "partner_id" => $partnerDetails['partner_id'],
                            "partner_shopName" => $partnerDetails['partner_shopName'],
                            "partner_gstStatus" => $partnerDetails['partner_gstStatus'],
                            "partner_gstNumber" => $partnerDetails['partner_gstNumber'],
                            "partner_category" => $partnerDetails['partner_category'],
                            "partner_category_name" => $partnerDetails['partner_category_name'],
                            "partner_contactNumber" => $partnerDetails['partner_contactNumber'],
                            "partner_shopgpslocation" => $partnerDetails['partner_shopgpslocation'],
                            "partner_shopaddress" => $partnerDetails['partner_shopaddress'],
                            "partner_bankName" => $partnerDetails['partner_bankName'],
                            "partner_accountNumber" => $partnerDetails['partner_accountNumber'],
                            "partner_bankAccountHolderName" => $partnerDetails['partner_bankAccountHolderName'],
                            "partner_bankISFCCode" => $partnerDetails['partner_bankISFCCode'],
                            "partner_upiId" => $partnerDetails['partner_upiId'],
                            "partner_idType" => $partnerDetails['partner_idType'],
                            "partner_gstCertificate" => $partnerDetails['partner_gstCertificate'],
                            "partner_status" => $partnerDetails['partner_status'],
                        );
                    }

                    $Response = array(
                        "error" => 0,
                        "status" => "Success",
                        "msg" => "Partner Details Found!!",
                        "SellerList" => $sellerList,
                    );
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed",
                        "msg" => "Partner Details Not Found!!",
                        "SellerList" => null,
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Address not Found!!",
                    "SellerList" => null,
                );
                echo json_encode($Response);
            }
            break;
            // ================get main catagory==========
        case 'getAllMainCategory':


            $searchMainCategory = "SELECT pantryo_main_category_id, partner_category_id, pantryo_main_category_name FROM pantryo_main_category GROUP BY(pantryo_main_category_name)
";
            $checkSearchMainCategory = mysqli_query($con, $searchMainCategory);
            if ($checkSearchMainCategory->num_rows > 0) {
                $allMainCategory = array();
                while ($row = mysqli_fetch_array($checkSearchMainCategory, MYSQLI_BOTH)) {
                    $allMainCategory[] = array(
                        'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                        'partner_category_id' => $row['partner_category_id'],
                        'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                    );
                }

                $Response = array(
                    'error' => 0,
                    'status' => 'Success!',
                    'msg' => 'Main Category Found!',
                    'AllMainCategory' => $allMainCategory,
                );
                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => "No Main Category Found!",
                );
                echo json_encode($Response);
            }

            break;
            // =================get main category end=====
            //============get all inventory from main category start=============
        case 'getInventoryFromInventoryData':
            if (empty($json['pantryo_main_category_id']) && empty($json['location'])) {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => " Main  Category Id or location Not Found!",
                );
                echo json_encode($Response);
            } else {

                $location = $json['location'];
                $zipcode = null;
                $formattedAddr = str_replace(' ', '+', $json['location']);
                $geocodeFromAddr = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddr . '&sensor=false&key=' . $apiKey);
                $output1 = json_decode($geocodeFromAddr);
                if ($output1->status == "ZERO_RESULTS") {
                    // echo json_encode(array("zipcode" => "Sorry, We are unable to find zipcode!2"));
                } else {
                    $latitude = $output1->results[0]->geometry->location->lat;
                    $longitude = $output1->results[0]->geometry->location->lng;
                    $geocodeFromLatlon = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=false&key=$apiKey");
                    $output2 = json_decode($geocodeFromLatlon);
                    if (!empty($output2)) {
                        $addressComponents = $output2->results[0]->address_components;
                        foreach ($addressComponents as $addrComp) {
                            if ($addrComp->types[0] == 'postal_code') {
                                $zipcode = $addrComp->long_name;
                            }
                        }
                        // print_r($zipcode);exit;
                    }
                }

                $searchMainCategory = "SELECT * FROM `partner_products` JOIN `pantryo_partner` ON `partner_products`.`partner_id`=`pantryo_partner`.`partner_id` JOIN `pantryo_main_category` ON `partner_products`.`pantryo_main_category_id`=`pantryo_main_category`.`pantryo_main_category_id` JOIN `partner_category` ON `partner_products`.`partner_category_id`=`partner_category`.`partner_category_id` WHERE `partner_products`.`pantryo_main_category_id` = '" . $json['pantryo_main_category_id'] . "' AND `pantryo_partner`.`partner_pincode` = '$zipcode'";
                $checkSearchMainCategory = mysqli_query($con, $searchMainCategory);
                if ($checkSearchMainCategory->num_rows > 0) {
                    $allMainCategory = array();
                    while ($row = mysqli_fetch_array($checkSearchMainCategory, MYSQLI_BOTH)) {
                        $partner_id = $row['partner_product_id'];
                        if (in_array($partner_id, array_column($allMainCategory, 'partner_product_id')) == true) {
                        } else {

                            $allMainCategory[] = array(
                                'partner_shopName' => $row['partner_shopName'],
                                'partner_product_id ' => $row['partner_product_id'],
                                'partner_category_id ' => $row['partner_category_id'],
                                'partner_category_name' => $row['partner_category_name'],
                                'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                'partner_product_brand' => $row['partner_product_brand'],
                                'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                                'partner_product_name' => $row['partner_product_name'],
                                'partner_product_price' => $row['partner_product_price'],
                                'partner_product_quantity' => $row['partner_product_quantity'],
                                'partner_product_unit' => $row['partner_product_unit'],
                                'partner_id' => $row['partner_id'],
                            );
                        }
                    }

                    $Response = array(
                        'error' => 0,
                        'status' => 'Success!',
                        'msg' => 'Main Category Found!',
                        'PantryoInventoryData' => $allMainCategory,

                    );
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed!",
                        "msg" => "No Inventory Found!",
                    );
                    echo json_encode($Response);
                }
            }
            break;
            //============get all inventory from main category end=============
            // =======serach  start==========
        case 'searchProductsdetails':
            if (!empty($json['searchkey']) && !empty($json['mainCatId']) && !empty($json['location'])) {
                $product = $json['searchkey'];
                $productCategory = $json['mainCatId'];
                $location = $json['location'];
                $zipcode = null;
                $formattedAddr = str_replace(' ', '+', $json['location']);
                $geocodeFromAddr = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddr . '&sensor=false&key=' . $apiKey);
                $output1 = json_decode($geocodeFromAddr);
                if ($output1->status == "ZERO_RESULTS") {
                    // echo json_encode(array("zipcode" => "Sorry, We are unable to find zipcode!2"));
                } else {
                    $latitude = $output1->results[0]->geometry->location->lat;
                    $longitude = $output1->results[0]->geometry->location->lng;
                    $geocodeFromLatlon = file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=false&key=$apiKey");
                    $output2 = json_decode($geocodeFromLatlon);
                    if (!empty($output2)) {
                        $addressComponents = $output2->results[0]->address_components;
                        foreach ($addressComponents as $addrComp) {
                            if ($addrComp->types[0] == 'postal_code') {
                                $zipcode = $addrComp->long_name;
                            }
                        }
                        // print_r($zipcode);exit;
                    }
                }

                if (!empty($product)) {
                    $searchMainCategory1 = "SELECT * FROM `pantryo_inventory` JOIN `pantryo_partner` ON `pantryo_inventory`.`partner_category_id`=`pantryo_partner`.`partner_category` JOIN `pantryo_main_category` ON `pantryo_inventory`.`pantryo_main_category_id` = `pantryo_main_category`.`pantryo_main_category_id` WHERE  `pantryo_inventory`.`pantryo_main_category_id` = '$productCategory' AND `pantryo_partner`.`partner_pincode` = '$zipcode' AND (`pantryo_inventory`.`pantryo_item_name` LIKE  '%$product%' || `pantryo_inventory`.`pantryo_brand_name` LIKE  '%$product%' || `pantryo_partner`.`partner_shopName` LIKE  '%$product%')";
                    $checkSearchMainCategory1 = mysqli_query($con, $searchMainCategory1);
                    // print_r($searchMainCategory1);exit;
                    if ($checkSearchMainCategory1->num_rows > 0) {
                        $allMainCategory = array();
                        while ($row = mysqli_fetch_array($checkSearchMainCategory1, MYSQLI_BOTH)) {
                            $partner_id = $row['pantryo_inventory_id'];
                            if (in_array($partner_id, array_column($allMainCategory, 'pantryo_inventory_id')) == true) {
                            } else {
                                $allMainCategory[] = array(
                                    'partner_shopName' => $row['partner_shopName'],
                                    'pantryo_inventory_id ' => $row['pantryo_inventory_id'],
                                    'partner_category_id ' => $row['partner_category_id'],
                                    'partner_category_name' => $row['partner_category_name'],
                                    'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                    'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                                    'partner_product_brand' => $row['pantryo_brand_name'],
                                    'partner_product_name' => $row['pantryo_item_name'],
                                    'partner_product_price' => $row['pantryo_item_price'],
                                    'partner_product_quantity' => $row['partner_product_quantity'],
                                    'partner_product_unit' => $row['pantryo_item_unit'],
                                    'partner_id' => $row['partner_id'],
                                );
                            }
                        }



                        $Response = array(
                            'error' => 0,
                            'status' => 'Success!',
                            'msg' => 'Product Details Found!',
                            'PantryoInventoryData' => $allMainCategory,

                        );
                        echo json_encode($Response);
                    } else {
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed!",
                            "msg" => "No Product Details Found!",
                        );
                        echo json_encode($Response);
                    }
                } //if brand
                else {
                    $Response = array(
                        "error" => 2,
                        "status" => "Failed!",
                        "msg" => "Search key not found!!!",
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 2,
                    "status" => "Failed!",
                    "msg" => "serach key Not Found!",
                );
                echo json_encode($Response);
            }
            break;
            // ===================search  end===============
            //======================categorywiseinventory start===========
        case 'getpartnercategory':
            if ($json['partner_id']) {
                $partnerCategory = "SELECT partner_category FROM pantryo_partner where partner_id='" . $json['partner_id'] . "'";
                $checkpartnerCategory = mysqli_query($con, $partnerCategory);
                if ($checkpartnerCategory->num_rows > 0) {

                    $datarow = mysqli_fetch_array($checkpartnerCategory, MYSQLI_BOTH);
                    $partner_category = $datarow['partner_category'];
                    if (!empty($partner_category)) {
                        $partnerallCategory = "SELECT * FROM  pantryo_main_category where partner_category_id='" . $partner_category . "'";
                        $checkpartnerallCategory = mysqli_query($con, $partnerallCategory);

                        $allCategory = array();
                        while ($row = mysqli_fetch_array($checkpartnerallCategory, MYSQLI_BOTH)) {

                            $pantryo_main_category_id = $row['pantryo_main_category_id'];

                            $checkpartnerproduct = "SELECT * FROM `partner_products` where pantryo_main_category_id='" . $pantryo_main_category_id . "' and partner_id='" . $json['partner_id'] . "'";
                            $checkpartnerproductresult = mysqli_query($con, $checkpartnerproduct);

                            if ($checkpartnerproductresult->num_rows > 0) {
                                $allCategory[] = array(
                                    'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                    'partner_category_id' => $row['partner_category_id'],
                                    'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                                    'categoryStatus' => 'Enable',
                                );
                            } else {
                                $allCategory[] = array(
                                    'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                    'partner_category_id' => $row['partner_category_id'],
                                    'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                                    'categoryStatus' => 'Disable',
                                );
                            }
                        }

                        $Response = array(
                            'error' => 0,
                            'status' => 'Success!',
                            'msg' => 'Main Category Found!',
                            'AllMainCategory' => $allCategory,
                        );
                        echo json_encode($Response);
                    } else {
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed!",
                            "msg" => "No Category Id Found!",
                        );
                        echo json_encode($Response);
                    }
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed!",
                        "msg" => "No Category Found!",
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => "Partner Id Not Found!",
                );
                echo json_encode($Response);
            }
            break;
            //======================categorywiseinventory end=============

            //======================get inventory category wise start===========
        case 'getinventoryfromcategory':
            if (!empty($json['pantryo_main_category_id']) && !empty($json['partner_id']) && !empty($json['customer_id'])) {
                $getinventory = "SELECT * FROM pantryo_inventory where pantryo_main_category_id='" . $json['pantryo_main_category_id'] . "'";
                $checkinventory = mysqli_query($con, $getinventory);
                if ($checkinventory->num_rows > 0) {

                    $allinventory = array();
                    while ($row = mysqli_fetch_array($checkinventory, MYSQLI_BOTH)) {
                        ////Product Status avaiable or not
                        $status;
                        $pantryo_inventory_id = $row['pantryo_inventory_id'];
                        $checkpartnerproduct = "SELECT * FROM `partner_products` where pantryo_inventory_id='" . $pantryo_inventory_id . "' AND `partner_id` = '" . $json['partner_id'] . "'";

                        $checkpartnerproductresult = mysqli_query($con, $checkpartnerproduct);
                        $stockdata = mysqli_fetch_array($checkpartnerproductresult, MYSQLI_BOTH);
                        if ($checkpartnerproductresult->num_rows > 0) {
                            //  $stockdata = mysqli_fetch_array($checkpartnerproductresult,MYSQLI_BOTH);

                            if ($stockdata['product_status'] == 1) {
                                $status = 'Stock In';
                                $productStatus = 'Available';
                            } else {
                                $status = 'Out Of Stock';
                                $productStatus = 'Unavailable';
                            }
                        } else {
                            $productStatus = 'Unavailable';
                            $status = 'Out of stock';
                        }

                        ////////item added or not
                        $addItem = 'Add';
                        $searchInCart  = "SELECT * FROM `pantryo_cart_product` WHERE `partnerId` = '" . $json['partner_id'] . "' AND `brandName` = '" . $row['pantryo_brand_name'] . "' AND `productName` = '" . $row['pantryo_item_name'] . "' AND `productQty` = '" . $row['pantryo_item_qty'] . "' AND `productUnit` = '" . $row['pantryo_item_unit'] . "' AND `productPrice` = '" . $stockdata['partner_product_price'] . "' AND `customerId` = '" . $json['customer_id'] . "' AND `billingStatus` = '1'";
                        $checksearchInCart  = mysqli_query($con, $searchInCart);
                        if ($checksearchInCart->num_rows > 0) {
                            $addItem = 'Added';
                        }
                        if (in_array($row['pantryo_inventory_id'], array_column($allinventory, 'pantryo_inventory_id')) == false) {


                            $allinventory[] = array(
                                'pantryo_inventory_id ' => $row['pantryo_inventory_id'],
                                'partner_category_id' => $row['partner_category_id'],
                                'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                'pantryo_item_name' => $row['pantryo_item_name'],
                                'pantryo_brand_name' => $row['pantryo_brand_name'],
                                'pantryo_item_qty' => $row['pantryo_item_qty'],
                                'pantryo_item_unit' => $row['pantryo_item_unit'],
                                'pantryo_item_price' => $stockdata['partner_product_price'],
                                'productStatus' => $productStatus,
                                'status' => $status,
                                'addItem' => $addItem,
                            );
                        }
                    }

                    $Response = array(
                        'error' => 0,
                        'status' => 'Success!',
                        'msg' => 'Inventory Found!',
                        'AllInventory' => $allinventory,
                    );
                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => "Failed!",
                        "msg" => "Inventory not Found!",
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => "Main category Id Not Found!",
                );
                echo json_encode($Response);
            }
            break;
            //======================get inventory category wiseend=============
            // =======multi keyword serach  start==========
        case 'multikeywordsearchproduct':
            if (!empty($json['searchkey']) && !empty($json['partner_id']) && !empty($json['pantryo_main_category_id'])) {

                $str = $json['searchkey'];
                $words = explode(" ", $str);

                $myword = array_filter($words);

                foreach ($myword as $product) {
                    $searchMainCategory = "SELECT * FROM `pantryo_inventory` JOIN `pantryo_partner` ON `pantryo_inventory`.`partner_category_id`=`pantryo_partner`.`partner_category` JOIN `pantryo_main_category` ON `pantryo_inventory`.`pantryo_main_category_id` = `pantryo_main_category`.`pantryo_main_category_id` WHERE `pantryo_inventory`.`pantryo_main_category_id` = '" . $json['pantryo_main_category_id'] . "' AND  (`pantryo_item_name` LIKE  '%$product%' || `pantryo_brand_name` LIKE  '%$product%' || `partner_shopName` LIKE  '%$product%') ";

                    $checkSearchMainCategory = mysqli_query($con, $searchMainCategory);
                    if ($checkSearchMainCategory->num_rows > 0) {
                        $allMainCategory = array();
                        while ($row = mysqli_fetch_array($checkSearchMainCategory, MYSQLI_BOTH)) {
                            $pantryo_inventory_id = $row['pantryo_inventory_id'];

                            if (in_array($pantryo_inventory_id, array_column($allMainCategory, 'pantryo_inventory_id')) == true) {
                            } else {

                                $status;
                                $checkpartnerproduct = "SELECT * FROM `partner_products` where pantryo_inventory_id='" . $pantryo_inventory_id . "' AND `partner_id` = '" . $json['partner_id'] . "'";
                                $checkpartnerproductresult = mysqli_query($con, $checkpartnerproduct);
                                if ($checkpartnerproductresult->num_rows > 0) {
                                    $stockdata = mysqli_fetch_array($checkpartnerproductresult, MYSQLI_BOTH);

                                    if ($stockdata['product_status'] == 1) {
                                        $status = 'Stock In';
                                        $productStatus = 'Available';
                                        $partner_product_price = $stockdata['partner_product_price'];
                                    } else {
                                        $status = 'Out Of Stock';
                                        $productStatus = 'Unavailable';
                                        $partner_product_price = $row['pantryo_item_price'];
                                    }
                                } else {
                                    $productStatus = 'Unavailable';
                                    $status = 'Out of stock';
                                    $partner_product_price = $row['pantryo_item_price'];
                                }
                                $allMainCategory[] = array(
                                    'pantryo_inventory_id' => $row['pantryo_inventory_id'],
                                    'partner_category_id' => $row['partner_category_id'],
                                    'pantryo_main_category_id' => $row['pantryo_main_category_id'],
                                    'pantryo_main_category_name' => $row['pantryo_main_category_name'],
                                    'pantryo_item_name' => $row['pantryo_item_name'],
                                    'pantryo_brand_name' => $row['pantryo_brand_name'],
                                    'pantryo_item_qty' => $row['pantryo_item_qty'],
                                    'pantryo_item_price' => $partner_product_price,
                                    'pantryo_item_unit' => $row['pantryo_item_unit'],
                                    'productStatus' => $productStatus,
                                    'status' => $status,
                                );
                            }
                        }

                        $Response = array(
                            'error' => 0,
                            'status' => 'Success!',
                            'msg' => 'Product Details Found!',
                            'PantryoInventoryData' => $allMainCategory,

                        );
                        echo json_encode($Response);
                        exit;
                    } else {
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed!",
                            "msg" => "No Product Details Found!",
                        );
                        echo json_encode($Response);
                    }
                }
            } else {
                $Response = array(
                    "error" => 2,
                    "status" => "Failed!",
                    "msg" => "serach key Not Found!",
                );
                echo json_encode($Response);
            }
            break;
            // ===================multi key wordsearch  end===============
            // =========================addProductToCart start==========
        case 'addProductToCart':
            if (!empty($json['customerId']) && !empty($json['partnerId'])  && !empty($json['customerDeliveryToName']) && !empty($json['customerMobileNumber']) && !empty($json['customerDeliveryAddress']) && !empty($json['shopName']) && !empty($json['productName']) && !empty($json['productQty']) && !empty($json['productUnit']) && !empty($json['productPrice'])) {
                $orderId = '';
                $checkorderstatus = "SELECT * FROM `pantryo_cart_product` where customerId='" . $json['customerId'] . "' and billingStatus='1' ORDER BY cart_id DESC LIMIT 1";
                $orderstatusresult = mysqli_query($con, $checkorderstatus);
                if ($orderstatusresult->num_rows > 0) {
                    $orderrow = mysqli_fetch_array($orderstatusresult, MYSQLI_BOTH);
                    $orderId = $orderrow['orderId'];
                } else {
                    $checkcarttableorder = "SELECT * FROM `pantryo_cart_product` ORDER BY cart_id DESC LIMIT 1";
                    $checkcarttableorderresult = mysqli_query($con, $checkcarttableorder);
                    if ($checkcarttableorderresult->num_rows > 0) {
                        $orderrowone = mysqli_fetch_array($checkcarttableorderresult, MYSQLI_BOTH);
                        $orderId = $orderrowone['orderId'] + 1;
                    } else {
                        $orderId = '1000';
                    }
                }

                $query = "INSERT INTO `pantryo_cart_product`(`customerId`,`orderId`,`partnerId`, `customerDeliveryToName`, `customerMobileNumber`, `customerDeliveryAddress`, `shopName`, `brandName`, `productName`, `productQty`, `productUnit`, `productPrice`) VALUES ('" . $json['customerId'] . "','" . $orderId . "','" . $json['partnerId'] . "','" . $json['customerDeliveryToName'] . "','" . $json['customerMobileNumber'] . "','" . $json['customerDeliveryAddress'] . "','" . $json['shopName'] . "','" . $json['brandName'] . "','" . $json['productName'] . "','" . $json['productQty'] . "','" . $json['productUnit'] . "','" . $json['productPrice'] . "')";

                $checkshop = "select * from pantryo_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1 order by cart_id desc limit 1";
                $resultshop = mysqli_query($con, $checkshop);
                if ($resultshop->num_rows > 0) {
                    $shoprow = mysqli_fetch_array($resultshop, MYSQLI_BOTH);
                    $customerId = $shoprow['customerId'];
                    $partnerId = $shoprow['partnerId'];

                    $customerIdjson = $json['customerId'];
                    $partnerIdjson = $json['partnerId'];

                    if (($partnerId != $partnerIdjson)) {
                        //   $Response = array(
                        //         "error" => 5,
                        //         "status"=>"Failed!",
                        //         "msg"=>"you are adding item from other shop!!",
                        //     );
                        //      echo json_encode($Response);

                        $orderId = '';
                        $checkorderstatus = "SELECT * FROM `pantryo_pending_cart_product` where customerId='" . $json['customerId'] . "' and billingStatus='1' ORDER BY cart_id DESC LIMIT 1";
                        $orderstatusresult = mysqli_query($con, $checkorderstatus);
                        if ($orderstatusresult->num_rows > 0) {
                            $checkshoppanding = "select * from pantryo_pending_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1 order by cart_id desc limit 1";

                            $resultshoppanding = mysqli_query($con, $checkshoppanding);
                            if ($resultshoppanding->num_rows > 0) {
                                $shoprowpanding = mysqli_fetch_array($resultshoppanding, MYSQLI_BOTH);
                                $customerIdpanding = $shoprowpanding['customerId'];
                                $partnerIdpanding = $shoprowpanding['partnerId'];

                                $customerIdjson = $json['customerId'];
                                $partnerIdjson = $json['partnerId'];

                                if (($partnerIdpanding == $partnerIdjson)) {
                                    $orderrow = mysqli_fetch_array($orderstatusresult, MYSQLI_BOTH);
                                    $orderId = $orderrow['orderId'];
                                } else {
                                    $orderId = $shoprowpanding['orderId'] + 1;
                                }
                            }
                        } else {
                            $checkcarttableorder = "SELECT * FROM `pantryo_pending_cart_product` ORDER BY cart_id DESC LIMIT 1";
                            $checkcarttableorderresult = mysqli_query($con, $checkcarttableorder);
                            if ($checkcarttableorderresult->num_rows > 0) {
                                $orderrowone = mysqli_fetch_array($checkcarttableorderresult, MYSQLI_BOTH);
                                $orderId = $orderrowone['orderId'] + 1;
                            } else {
                                $orderId = '100';
                            }
                        }

                        $query = "INSERT INTO `pantryo_pending_cart_product`(`customerId`,`orderId`,`partnerId`, `customerDeliveryToName`, `customerMobileNumber`, `customerDeliveryAddress`, `shopName`, `brandName`, `productName`, `productQty`, `productUnit`, `productPrice`) VALUES ('" . $json['customerId'] . "','" . $orderId . "','" . $json['partnerId'] . "','" . $json['customerDeliveryToName'] . "','" . $json['customerMobileNumber'] . "','" . $json['customerDeliveryAddress'] . "','" . $json['shopName'] . "','" . $json['brandName'] . "','" . $json['productName'] . "','" . $json['productQty'] . "','" . $json['productUnit'] . "','" . $json['productPrice'] . "')";
                        $result = mysqli_query($con, $query);
                        if ($result) {
                            $Response = array(
                                "error" => 0,
                                "status" => "Success!",
                                "msg" => "Pending Product added in Cart !!",
                            );
                            echo json_encode($Response);
                        } else {
                            $Response = array(
                                "error" => 1,
                                "status" => "Failed!",
                                "msg" => "pending Data not inserted!!!",
                            );
                            echo json_encode($Response);
                        }
                    } else {
                        $result = mysqli_query($con, $query);
                        if ($result) {
                            $Response = array(
                                "error" => 0,
                                "status" => "Success!",
                                "msg" => " Product added in Cart !!",
                            );
                            echo json_encode($Response);
                        } else {
                            $Response = array(
                                "error" => 1,
                                "status" => "Failed!",
                                "msg" => "Data not inserted!!!",
                            );
                            echo json_encode($Response);
                        }
                    }
                } else {
                    $result = mysqli_query($con, $query);
                    if ($result) {
                        $Response = array(
                            "error" => 0,
                            "status" => "Success!",
                            "msg" => "Product added in Cart !!",
                        );
                        echo json_encode($Response);
                    } else {
                        $Response = array(
                            "error" => 1,
                            "status" => "Failed!",
                            "msg" => "Data not inserted!!!",
                        );
                        echo json_encode($Response);
                    }
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => "variable not found",
                );
                echo json_encode($Response);
            }
            break;
            // =========================addProductToCart end==========

            // ============================getCustomerAddProduct start============
        case 'getCustomerAddProduct':
            if (!empty($json['customer_id']) && !empty($json['deliveryAddress'])) {
                $getcustomer = "SELECT * FROM `pantryo_cart_product` JOIN `pantryo_partner` ON `pantryo_cart_product`.`partnerId`=`pantryo_partner`.`partner_id` JOIN `partner_category` ON `pantryo_partner`.`partner_category`=`partner_category`.`partner_category_id` WHERE customerId='" . $json['customer_id'] . "' and billingStatus='1'";
                $checkgetcustomer = mysqli_query($con, $getcustomer);
                if ($checkgetcustomer->num_rows > 0) {
                    $totalproductPrice = 0;
                    while ($row = mysqli_fetch_array($checkgetcustomer, MYSQLI_BOTH)) {

                        $getcustomer = "SELECT * FROM `pantryo_cart_product` JOIN `pantryo_partner` ON `pantryo_cart_product`.`partnerId`=`pantryo_partner`.`partner_id` JOIN `partner_category` ON `pantryo_partner`.`partner_category`=`partner_category`.`partner_category_id` WHERE customerId='" . $json['customer_id'] . "' and billingStatus='1'";
                        $checkgetcustomer = mysqli_query($con, $getcustomer);
                        if ($checkgetcustomer->num_rows > 0) {

                            while ($row1 = mysqli_fetch_array($checkgetcustomer, MYSQLI_BOTH)) {
                                $partner_token = $row1['partner_token'];
                                $products[] = array(
                                    'cartId' => $row1['cart_id'],
                                    'shopName' => $row1['shopName'],
                                    'shopCategory' => $row1['partner_category_name'],
                                    'productName' => $row1['productName'],
                                    'shopAddress' => $row1['partner_shopaddress'],
                                    'productQty' => $row1['productQty'],
                                    'productUnit' => $row1['productUnit'],
                                    'productPrice' => $row1['productPrice'],
                                    'brandName' => $row1['brandName'],
                                    'numberOfProduct' => $row1['numberOfProduct'],
                                    'partner_token' => $row1['partner_token'],
                                );



                                $productPrice = $row1['productPrice'] * $row1['numberOfProduct'];
                                $totalproductPrice += $productPrice;
                            }
                        }


                        $shopAddProducts[] = array(
                            'shopName' => $row['shopName'],
                            'shopCategory' => $row['partner_category_name'],
                            'products' => $products,

                        );
                        $order_id = $row['orderId'];
                        $pantryo_taxs = "SELECT * FROM `pantryo_taxs`";
                        $checkpantryo_taxs = mysqli_query($con, $pantryo_taxs);
                        $rowamount = mysqli_fetch_array($checkpantryo_taxs);
                        $pantryo_tax_amount = $rowamount['pantryo_tax'];
                        $partner_shopgpslocation = $row['partner_shopgpslocation'];
                        $deliveryAddress = $json['deliveryAddress'];

                        ////////==============get km start============



                        // Change address format
                        $formattedAddrFrom    = str_replace(' ', '+', $partner_shopgpslocation);
                        $formattedAddrTo     = str_replace(' ', '+', $deliveryAddress);

                        // Geocoding API request with start address
                        $geocodeFrom = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddrFrom . '&sensor=false&key=' . $apiKey);
                        $outputFrom = json_decode($geocodeFrom);
                        if (!empty($outputFrom->error_message)) {
                            return $outputFrom->error_message;
                        }

                        // Geocoding API request with end address
                        $geocodeTo = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddrTo . '&sensor=false&key=' . $apiKey);
                        $outputTo = json_decode($geocodeTo);
                        if (!empty($outputTo->error_message)) {
                            return $outputTo->error_message;
                        }

                        // Get latitude and longitude from the geodata
                        $latitudeFrom    = $outputFrom->results[0]->geometry->location->lat;
                        $longitudeFrom    = $outputFrom->results[0]->geometry->location->lng;
                        $latitudeTo        = $outputTo->results[0]->geometry->location->lat;
                        $longitudeTo    = $outputTo->results[0]->geometry->location->lng;

                        // Calculate distance between latitude and longitude
                        $theta    = $longitudeFrom - $longitudeTo;
                        $dist    = sin(deg2rad($latitudeFrom)) * sin(deg2rad($latitudeTo)) +  cos(deg2rad($latitudeFrom)) * cos(deg2rad($latitudeTo)) * cos(deg2rad($theta));
                        $dist    = acos($dist);
                        $dist    = rad2deg($dist);

                        $miles    = $dist * 60 * 1.1515;
                        echo $km = round($miles * 1.609344, 2);   //km
                        exit;
                        if ($km < 1) {
                            $deliverycharges = '14';
                        } else {
                            $deliverycharges = $km * 7;
                        }


                        ////////==============get km end============
                    }



                    $Response = array(
                        'error' => 0,
                        'status' => 'Success!',
                        'msg' => 'Product Found!',
                        'order_id' => $order_id,
                        'shopAddProducts' => $allproduct,
                        'shopAddProducts' => $shopAddProducts,
                        'totalamount' => $totalproductPrice,
                        'partner_token' => $partner_token,
                        'comfortfees' => $pantryo_tax_amount,
                        'deliverycharges' => $deliverycharges,
                        'applicabletax' => '45',
                        'grandtotal' => $totalproductPrice + $pantryo_tax_amount + $deliverycharges + 45,

                    );

                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 2,
                        "status" => "Failed!",
                        "msg" => "Product Not Found!",
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed!",
                    "msg" => "Customer Id Not Found!",
                );
                echo json_encode($Response);
            }
            break;
            // ============================getCustomerAddProduct end==============
            // ============================setLongitudeLatitudeByAddress start ================
        case 'setLongitudeLatitudeByAddress':
            if (!empty($json['address'])) {

                $formattedAddr = str_replace(' ', '+', $json['address']);

                $geocodeFromAddr = file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address=' . $formattedAddr . '&sensor=true&key=' . $apiKey);
                $output1 = json_decode($geocodeFromAddr);
                // print_r($output1);exit;

                if ($output1->status == "ZERO_RESULTS") {

                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'lan and lat not found'
                    );
                    echo json_encode($Response);
                } else {
                    $latitude = $output1->results[0]->geometry->location->lat;
                    $longitude = $output1->results[0]->geometry->location->lng;

                    $Response = array(
                        'error' => 0,
                        "status" => 'Success',
                        "msg" => 'Latitude and Longitude found',
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                    );
                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Address Not Found'
                );
                echo json_encode($Response);
            }
            break;

            // ============================setLongitudeLatitudeByAddress end ==================//

            ///=========Update Number of Item on Cart Table Start===========////      
        case 'updateNumberOfItemInCart':
            if (empty($json['customer_id']) || empty($json['cart_id']) || empty($json['activity_type'])) {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Cart id Not Found'
                );

                echo json_encode($Response);
            } else {
                if ($json['activity_type'] == 'sum') {
                    $searchCartData  = "SELECT * FROM `pantryo_cart_product` WHERE `cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                    $checksearchCartData = mysqli_query($con, $searchCartData);
                    if ($checksearchCartData->num_rows > 0) {
                        $searchdata = mysqli_fetch_array($checksearchCartData, MYSQLI_BOTH);
                        $numberOfProduct = $searchdata['numberOfProduct'] + 1;
                        $updatedata = "UPDATE `pantryo_cart_product` SET `numberOfProduct` = '$numberOfProduct' WHERE `pantryo_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                        $checkupdatedata = mysqli_query($con, $updatedata);
                        if ($checkupdatedata) {
                            $Response = array(
                                "error" => 0,
                                "status" => 'success',
                                "msg" => 'Increase Number Of Item In Cart'
                            );

                            echo json_encode($Response);
                        } else {
                            $Response = array(
                                "error" => 1,
                                "status" => 'Failed',
                                "msg" => 'Increase  Number Of Item In Cart Failed'
                            );

                            echo json_encode($Response);
                        }
                    }
                } else if ($json['activity_type'] == 'sub') {
                    $searchCartData  = "SELECT * FROM `pantryo_cart_product` WHERE `cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                    $checksearchCartData = mysqli_query($con, $searchCartData);
                    if ($checksearchCartData->num_rows > 0) {
                        $searchdata = mysqli_fetch_array($checksearchCartData, MYSQLI_BOTH);
                        $numberOfProduct = $searchdata['numberOfProduct'] - 1;
                        if ($numberOfProduct !== 0) {
                            $updatedata = "UPDATE `pantryo_cart_product` SET `numberOfProduct` = '$numberOfProduct' WHERE `pantryo_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                            $checkupdatedata = mysqli_query($con, $updatedata);
                            if ($checkupdatedata) {
                                $Response = array(
                                    "error" => 0,
                                    "status" => 'success',
                                    "msg" => 'Decrease Number Of Item In Cart'
                                );

                                echo json_encode($Response);
                            } else {
                                $Response = array(
                                    "error" => 1,
                                    "status" => 'Failed',
                                    "msg" => 'Decrease  Number Of Item In Cart Failed'
                                );

                                echo json_encode($Response);
                            }
                        } else {
                            $deletedata = "DELETE FROM `pantryo_cart_product` WHERE `pantryo_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                            $checkdeletedata = mysqli_query($con, $deletedata);
                            if ($checkdeletedata) {
                                $Response = array(
                                    "error" => 0,
                                    "status" => 'success',
                                    "msg" => 'Item remove from Cart'
                                );

                                echo json_encode($Response);
                            } else {
                                $Response = array(
                                    "error" => 1,
                                    "status" => 'Failed',
                                    "msg" => 'Item not remove from Cart'
                                );

                                echo json_encode($Response);
                            }
                        }
                    }
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Known Activity'
                    );

                    echo json_encode($Response);
                }
            }
            break;
            ///=========Update Number of Item on Cart Table End===========////    
            //==============billing customer product item start===============
        case 'billingproductitem':
            if (!empty($json['customerId'])) {
                $totalproductPrice = 0;
                $billingdata = "SELECT * FROM `pantryo_cart_product` WHERE customerId='" . $json['customerId'] . "' and billingStatus='1'";
                $checkbillingdata = mysqli_query($con, $billingdata);
                while ($row = mysqli_fetch_array($checkbillingdata)) {
                    $productPrice = $row['productPrice'];
                    $totalproductPrice += $productPrice;
                }
                $pantryo_taxs = "SELECT * FROM `pantryo_taxs`";
                $checkpantryo_taxs = mysqli_query($con, $pantryo_taxs);
                $rowamount = mysqli_fetch_array($checkpantryo_taxs);
                $pantryo_tax_amount = $rowamount['pantryo_tax'];

                $Response = array(
                    "error" => 1,
                    "status" => 'success',
                    'totalamount' => $totalproductPrice,
                    'pantryo_taxs' => $pantryo_tax_amount,
                    'deliverycharges' => '',
                    'applicabletax' => '',
                    'grandtotal' => ''
                );

                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Customer Id Not Found'
                );

                echo json_encode($Response);
            }
            break;
            //==============billing customer product item end=================

            // ==========update cart address start===========
        case 'updateDeliveryAddress':
            if (!empty($json['customer_id']) && !empty($json['deliveryAddress'])) {
                $updatedata = "UPDATE `pantryo_cart_product` SET `customerDeliveryAddress` = '" . $json['deliveryAddress'] . "' WHERE `billingStatus` = '1' and  `customerId`='" . $json['customer_id'] . "'";
                $checkupdatedata = mysqli_query($con, $updatedata);
                if ($checkupdatedata) {
                    $Response = array(
                        "error" => 0,
                        "status" => 'success',
                        "msg" => 'Delivery Address updated!!'
                    );

                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Delivery Address Not updated!!'
                    );

                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Customer Id And Delivery Address Not Found'
                );

                echo json_encode($Response);
            }
            break;
            // ==========update cart address end=============


            // ==========update  customerDeliveryToName start===========
        case 'updateDeliveryName':
            if (!empty($json['customer_id']) && !empty($json['customerDeliveryToName'])) {
                $updatedata = "UPDATE `pantryo_cart_product` SET `customerDeliveryToName` = '" . $json['customerDeliveryToName'] . "' WHERE `billingStatus` = '1' and  `customerId`='" . $json['customer_id'] . "'";
                $checkupdatedata = mysqli_query($con, $updatedata);
                if ($checkupdatedata) {
                    $Response = array(
                        "error" => 0,
                        "status" => 'success',
                        "msg" => 'Delivery Name updated!!'
                    );

                    echo json_encode($Response);
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Delivery Name Not updated!!'
                    );

                    echo json_encode($Response);
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Customer Id And Delivery Name Not Found'
                );

                echo json_encode($Response);
            }
            break;
            // ==========update customerDeliveryToName end=============///

            ////========Get Item Count in Cart Start==================///
        case 'getCountItemInCart':
            if (empty($json['customer_id'])) {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Customer Id not Found',
                    "TotalCount" => 0,
                    "Totalpendingcount" => 0,
                );
            } else {
                $countSearchItem = "SELECT * FROM `pantryo_cart_product` WHERE `customerId` = '" . $json['customer_id'] . "' AND `billingStatus` = '1'";
                $checkCountSearchItem = mysqli_query($con, $countSearchItem);
                $countSearchItempending = "SELECT * FROM `pantryo_pending_cart_product` WHERE `customerId` = '" . $json['customer_id'] . "' AND `billingStatus` = '1'";
                $checkCountSearchItempending = mysqli_query($con, $countSearchItempending);

                if ($checkCountSearchItem->num_rows > 0 || $checkCountSearchItempending->num_rows > 0) {
                    $count = $checkCountSearchItem->num_rows;
                    $pandingcount = $checkCountSearchItempending->num_rows;

                    $Response = array(
                        "error" => 0,
                        "status" => 'Success',
                        "msg" => 'Item Add',
                        "TotalCount" => $count,
                        "Totalpendingcount" => $pandingcount,
                    );
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'No item Add',
                        "TotalCount" => 0,
                        "Totalpendingcount" => 0,
                    );
                }
            }

            echo json_encode($Response);
            break;
            ////========Get Item Count in Cart End==================////
            // ===========getall order start=========
        case 'getallorderstatus':
            if (!empty($json['order_id'])) {
                $allorder = "SELECT * FROM transaction JOIN `pantryo_cart_product` ON transaction.order_id= pantryo_cart_product.orderId  WHERE `transaction`.`order_id` = '" . $json['order_id'] . "'";

                $checkallorder = mysqli_query($con, $allorder);
                if ($checkallorder->num_rows > 0) {
                    $order = array();
                    $item = array();
                    $order = mysqli_fetch_array($checkallorder, MYSQLI_BOTH);

                    while ($orders = mysqli_fetch_array($checkallorder, MYSQLI_BOTH)) {

                        $deliverypartner = "select pantryo_delivery_partner.delivery_id,fullname,contactNumber from pantryo_delivery_partner JOIN partner_order_confirm on pantryo_delivery_partner.delivery_id=partner_order_confirm.delivery_id where partner_order_confirm.delivery_status='1' and partner_order_confirm.order_id='" . $orders['order_id'] . "'";
                        $checkdeliverypartner = mysqli_query($con, $deliverypartner);
                        if ($checkdeliverypartner->num_rows > 0) {
                            $dpartner = mysqli_fetch_array($checkdeliverypartner);
                            $delivery_id = $dpartner['delivery_id'];
                            $fullname = $dpartner['fullname'];
                            $contactNumber = $dpartner['contactNumber'];
                        } else {
                            $delivery_id = '';
                            $fullname = '';
                            $contactNumber = '';
                        }

                        $item[] = array(
                            'cart_id' => $orders['cart_id'],
                            'orderId' => $orders['orderId'],
                            'shopName' => $orders['shopName'],
                            'productName' => $orders['productName'],
                            'productQty' => $orders['productQty'],
                            'productUnit' => $orders['productUnit'],
                            'productPrice' => $orders['productPrice'],
                            'numberOfProduct' => $orders['numberOfProduct'],
                        );
                    }

                    $myorder[] = array(
                        'orderId' => $order['orderId'],
                        'shopName' => $order['shopName'],
                        'orderStatus' => $order['orderStatus'],
                        'payment_time' => date('d-m-Y h:i:s a', $order['payment_time']),
                        'item' => $item,
                        'delivery_id' => $delivery_id,
                        'fullname' => $fullname,
                        'contactNumber' => $contactNumber
                    );


                    $Response = array(
                        "error" => 0,
                        "status" => 'success',

                        'order' => $myorder,
                        "msg" => 'Order Found'
                    );
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Order not Found'
                    );
                }
                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Order Id not Found'
                );

                echo json_encode($Response);
            }
            break;
            // ===========getall order end=========
            // ================get order history start==========
        case 'getorderhistory':
            if (!empty($json['customer_id'])) {
                $orderhistory = "SELECT * FROM `transaction` join pantryo_cart_product on transaction.customer_id=pantryo_cart_product.customerId join pantryo_partner on  pantryo_cart_product.partnerId=pantryo_partner.partner_id where customer_id='" . $json['customer_id'] . "'";
                $checkorderhistory = mysqli_query($con, $orderhistory);
                $data = array();
                while ($row = mysqli_fetch_array($checkorderhistory)) {
                    $order_id = $row['order_id'];
                    if (in_array($order_id, array_column($data, 'order_id')) == true) {
                    } else {

                        $deliverypartner = "select pantryo_delivery_partner.delivery_id,fullname,contactNumber from pantryo_delivery_partner JOIN partner_order_confirm on pantryo_delivery_partner.delivery_id=partner_order_confirm.delivery_id where partner_order_confirm.delivery_status='1' and partner_order_confirm.order_id='" . $row['order_id'] . "'";
                        $checkdeliverypartner = mysqli_query($con, $deliverypartner);
                        if ($checkdeliverypartner->num_rows > 0) {
                            $dpartner = mysqli_fetch_array($checkdeliverypartner);
                            $delivery_id = $dpartner['delivery_id'];
                            $fullname = $dpartner['fullname'];
                            $contactNumber = $dpartner['contactNumber'];
                        } else {
                            $delivery_id = '';
                            $fullname = '';
                            $contactNumber = '';
                        }
                        $data[] = array(
                            'order_id' => $row['order_id'],
                            'payment_amount' => $row['payment_amount'],
                            'partner_shopgpslocation' => $row['partner_shopgpslocation'],
                            'shopName' => $row['shopName'],
                            'order_id' => $row['order_id'],
                            'orderstatus' => $row['orderStatus'],
                            'payment_time' => date('d-m-Y H:i:s a', $row['payment_time']),
                            'delivery_id' => $delivery_id,
                            'fullname' => $fullname,
                            'contactNumber' => $contactNumber
                        );
                    }
                }
                $Response = array(
                    "error" => 0,
                    "status" => 'success',
                    "details" => $data,

                );

                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Customer Id not Found'
                );

                echo json_encode($Response);
            }
            break;
            // ================get order history end==========///

            ///////========Send Notification Start===========/////////
        case 'sendNotification':
            if (!empty($json['title']) && !empty($json['body']) && !empty($json['user_token'])) {
                // "curl -X POST -H 'Authorization: Bearer  AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33' -H 'Content-Type: application/json' -d '{
                //     'message':{
                //   'notification':{
                //      'title':$json[title],
                //      'body':$json[body]
                //   },
                //   'token':'drfMLACgRj6UtRa7efyxBz:APA91bE_RtoJUkptIeZ8ueY5Jp0Ueor1jLKXx9lKWlTbq5ypIkekLkXbZ_-l2iE_XxOjKkG2n-dap54fN0HxQZDpvZx7v1gOGY1_lo2mL1esjw1pLWFtIMlrknCxAt2UUMmnwCuzM76w'
                // }
                // }' 
                // https://console.firebase.google.com/u/1/project/pantryo-36fd7/notification/compose'";
                $url = "https://fcm.googleapis.com/fcm/send";
                $token = $json['user_token'];
                // $token = 'fDMeLbTMQEqkn7KJuNIPOm:APA91bGrCV8WbKCK_-Mj5euiHg-dHlupSgqOml6mt30kRwGPrNo6dqcSCNEQEjFb_aRMH9MY5lgandOgz4Zzk57J19mT7aNFV7ujaMDii0vtfa-lO9ujEppn2Mdz5ZOTrwGZAn7jl6H9';
                $serverKey = 'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
                $title = $json['title'];
                $body = $json['body'];
                $notification = array('title' => $title, 'body' => $body, 'sound' => 'default', 'badge' => '1');
                $arrayToSend = array('to' => $token, 'notification' => $notification, 'priority' => 'high');
                $json = json_encode($arrayToSend);
                $headers = array();
                $headers[] = 'Content-Type: application/json';
                $headers[] = 'Authorization: key=' . $serverKey;
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                //Send the request
                $response = curl_exec($ch);
                //Close request
                if ($response === FALSE) {
                    die('FCM Send Error: ' . curl_error($ch));
                }
                curl_close($ch);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Send All Data"
                );
                echo json_encode($Response);
            }
            break;


            ///////========Send Notification End===========///////////
            //========================================pendding order api==================
        case 'customerPandingOrder':
            if (!empty($json['customerId']) && !empty($json['condition']) && !empty($json['customerId']) && !empty($json['partnerId'])  && !empty($json['customerDeliveryToName']) && !empty($json['customerMobileNumber']) && !empty($json['customerDeliveryAddress']) && !empty($json['shopName']) && !empty($json['productName']) && !empty($json['productQty']) && !empty($json['productUnit']) && !empty($json['productPrice'])) {

                // 1 for yes 
                if ($json['condition'] == 1) {
                    $checkshop = "select * from pantryo_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1";
                    $resultshop = mysqli_query($con, $checkshop);
                    if ($resultshop->num_rows > 0) {
                        while ($pandingorder = mysqli_fetch_array($resultshop)) {

                            $padingquery = "insert into pantryo_pending_cart_product(orderId,customerId,partnerId, customerMobileNumber,customerDeliveryToName, customerDeliveryAddress, shopName,brandName,productName,productQty,productUnit,productPrice,numberOfProduct, create_date) select orderId,customerId,partnerId, customerMobileNumber,customerDeliveryToName, customerDeliveryAddress, shopName,brandName,productName,productQty,productUnit,productPrice,numberOfProduct, create_date from pantryo_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1";
                            $pandingresult = mysqli_query($con, $padingquery);
                        }

                        $deleteorder = "delete from pantryo_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1";
                        $deleteorderresult = mysqli_query($con, $deleteorder);
                        if ($deleteorderresult == true) {

                            //     $Response = array(
                            //     "error" => 0,
                            //     "status"=>"success",
                            //     "msg"=>"Pending Order Registered and Old Order Deleted!!!"
                            // );
                            // echo json_encode($Response);   
                            $orderId = '';
                            $checkorderstatus = "SELECT * FROM `pantryo_cart_product` where customerId='" . $json['customerId'] . "' and billingStatus='1' ORDER BY cart_id DESC LIMIT 1";
                            $orderstatusresult = mysqli_query($con, $checkorderstatus);
                            if ($orderstatusresult->num_rows > 0) {
                                $orderrow = mysqli_fetch_array($orderstatusresult, MYSQLI_BOTH);
                                $orderId = $orderrow['orderId'];
                            } else {
                                $checkcarttableorder = "SELECT * FROM `pantryo_cart_product` ORDER BY cart_id DESC LIMIT 1";
                                $checkcarttableorderresult = mysqli_query($con, $checkcarttableorder);
                                if ($checkcarttableorderresult->num_rows > 0) {
                                    $orderrowone = mysqli_fetch_array($checkcarttableorderresult, MYSQLI_BOTH);
                                    $orderId = $orderrowone['orderId'] + 1;
                                } else {
                                    $orderId = '1000';
                                }
                            }

                            $query = "INSERT INTO `pantryo_cart_product`(`customerId`,`orderId`,`partnerId`, `customerDeliveryToName`, `customerMobileNumber`, `customerDeliveryAddress`, `shopName`, `brandName`, `productName`, `productQty`, `productUnit`, `productPrice`) VALUES ('" . $json['customerId'] . "','" . $orderId . "','" . $json['partnerId'] . "','" . $json['customerDeliveryToName'] . "','" . $json['customerMobileNumber'] . "','" . $json['customerDeliveryAddress'] . "','" . $json['shopName'] . "','" . $json['brandName'] . "','" . $json['productName'] . "','" . $json['productQty'] . "','" . $json['productUnit'] . "','" . $json['productPrice'] . "')";

                            $checkshop = "select * from pantryo_cart_product where customerId='" . $json['customerId'] . "' and billingStatus=1 order by cart_id desc limit 1";
                            $resultshop = mysqli_query($con, $checkshop);
                            if ($resultshop->num_rows > 0) {
                                $shoprow = mysqli_fetch_array($resultshop, MYSQLI_BOTH);
                                $customerId = $shoprow['customerId'];
                                $partnerId = $shoprow['partnerId'];

                                $customerIdjson = $json['customerId'];
                                $partnerIdjson = $json['partnerId'];

                                if (($partnerId != $partnerIdjson)) {
                                    $Response = array(
                                        "error" => 5,
                                        "status" => "Failed!",
                                        "msg" => "you are adding item from other shop!!",
                                    );
                                    echo json_encode($Response);
                                } else {
                                    $result = mysqli_query($con, $query);
                                    if ($result) {
                                        $Response = array(
                                            "error" => 0,
                                            "status" => "Success!",
                                            "msg" => "Product added in Cart !!",
                                        );
                                        echo json_encode($Response);
                                    } else {
                                        $Response = array(
                                            "error" => 1,
                                            "status" => "Failed!",
                                            "msg" => "Data not inserted!!!",
                                        );
                                        echo json_encode($Response);
                                    }
                                }
                            } else {
                                $result = mysqli_query($con, $query);
                                if ($result) {
                                    $Response = array(
                                        "error" => 0,
                                        "status" => "Success!",
                                        "msg" => "Product added in Cart !!",
                                    );
                                    echo json_encode($Response);
                                } else {
                                    $Response = array(
                                        "error" => 1,
                                        "status" => "Failed!",
                                        "msg" => "Data not inserted!!!",
                                    );
                                    echo json_encode($Response);
                                }
                            }
                        }
                    } else {
                        $Response = array(
                            "error" => 2,
                            "status" => "Failed",
                            "msg" => "Data Not Found"
                        );
                        echo json_encode($Response);
                    }
                }
                //2 for no
                else {
                }
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Send All Data"
                );
                echo json_encode($Response);
            }
            break;
        case 'getAllPendingOrder':
            if (!empty($json['customer_id'])) {
                $allorder = "SELECT * FROM pantryo_pending_cart_product where `customerId` = '" . $json['customer_id'] . "'";

                $checkallorder = mysqli_query($con, $allorder);
                if ($checkallorder->num_rows > 0) {

                    while ($orders = mysqli_fetch_array($checkallorder, MYSQLI_BOTH)) {
                        $item[] = array(
                            'cart_id' => $orders['cart_id'],
                            'orderId' => $orders['orderId'],
                            'shopName' => $orders['shopName'],
                            'productName' => $orders['productName'],
                            'productQty' => $orders['productQty'],
                            'productUnit' => $orders['productUnit'],
                            'productPrice' => $orders['productPrice'],
                            'numberOfProduct' => $orders['numberOfProduct'],
                        );
                    }


                    $Response = array(
                        "error" => 0,
                        "status" => 'success',
                        'pendingorder' => $item,
                        "msg" => 'Order Found'
                    );
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Order not Found'
                    );
                }
                echo json_encode($Response);
            } else {
                $Response = array(
                    "error" => 1,
                    "status" => "Failed",
                    "msg" => "Send All Data"
                );
                echo json_encode($Response);
            }
            break;

        case 'updatependingNumberOfItemInCart':
            if (empty($json['customer_id']) || empty($json['cart_id']) || empty($json['activity_type'])) {
                $Response = array(
                    "error" => 1,
                    "status" => 'Failed',
                    "msg" => 'Cart id Not Found'
                );

                echo json_encode($Response);
            } else {
                if ($json['activity_type'] == 'sum') {
                    $searchCartData  = "SELECT * FROM `pantryo_pending_cart_product` WHERE `cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                    $checksearchCartData = mysqli_query($con, $searchCartData);
                    if ($checksearchCartData->num_rows > 0) {
                        $searchdata = mysqli_fetch_array($checksearchCartData, MYSQLI_BOTH);
                        $numberOfProduct = $searchdata['numberOfProduct'] + 1;
                        $updatedata = "UPDATE `pantryo_pending_cart_product` SET `numberOfProduct` = '$numberOfProduct' WHERE `pantryo_pending_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                        $checkupdatedata = mysqli_query($con, $updatedata);
                        if ($checkupdatedata) {
                            $Response = array(
                                "error" => 0,
                                "status" => 'success',
                                "msg" => 'Increase Number Of Item In Cart'
                            );

                            echo json_encode($Response);
                        } else {
                            $Response = array(
                                "error" => 1,
                                "status" => 'Failed',
                                "msg" => 'Increase  Number Of Item In Cart Failed'
                            );

                            echo json_encode($Response);
                        }
                    }
                } else if ($json['activity_type'] == 'sub') {
                    $searchCartData  = "SELECT * FROM `pantryo_pending_cart_product` WHERE `cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                    $checksearchCartData = mysqli_query($con, $searchCartData);
                    if ($checksearchCartData->num_rows > 0) {
                        $searchdata = mysqli_fetch_array($checksearchCartData, MYSQLI_BOTH);
                        $numberOfProduct = $searchdata['numberOfProduct'] - 1;
                        if ($numberOfProduct !== 0) {
                            $updatedata = "UPDATE `pantryo_pending_cart_product` SET `numberOfProduct` = '$numberOfProduct' WHERE `pantryo_pending_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                            $checkupdatedata = mysqli_query($con, $updatedata);
                            if ($checkupdatedata) {
                                $Response = array(
                                    "error" => 0,
                                    "status" => 'success',
                                    "msg" => 'Decrease Number Of Item In Cart'
                                );

                                echo json_encode($Response);
                            } else {
                                $Response = array(
                                    "error" => 1,
                                    "status" => 'Failed',
                                    "msg" => 'Decrease  Number Of Item In Cart Failed'
                                );

                                echo json_encode($Response);
                            }
                        } else {
                            $deletedata = "DELETE FROM `pantryo_pending_cart_product` WHERE `pantryo_pending_cart_product`.`cart_id` = '" . $json['cart_id'] . "' and  `customerId`='" . $json['customer_id'] . "'";
                            $checkdeletedata = mysqli_query($con, $deletedata);
                            if ($checkdeletedata) {
                                $Response = array(
                                    "error" => 0,
                                    "status" => 'success',
                                    "msg" => 'Item remove from Cart'
                                );

                                echo json_encode($Response);
                            } else {
                                $Response = array(
                                    "error" => 1,
                                    "status" => 'Failed',
                                    "msg" => 'Item not remove from Cart'
                                );

                                echo json_encode($Response);
                            }
                        }
                    }
                } else {
                    $Response = array(
                        "error" => 1,
                        "status" => 'Failed',
                        "msg" => 'Known Activity'
                    );

                    echo json_encode($Response);
                }
            }
            break;
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
