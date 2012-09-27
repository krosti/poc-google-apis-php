<?php 

require_once 'HTTP/Request2.php';


if(isset($_GET['code'])) {
    // try to get an access token
    $code = $_GET['code'];
    $url = 'https://accounts.google.com/o/oauth2/token';
    $params = array(
        "code" => $code,
        "client_id" => "839403186376-i9cjktapu32p070sd8b22voccr36nsea@developer.gserviceaccount.com",
        "client_secret" => "jjZiO_E0JbuldQ8FcPCaD_27",
        "redirect_uri" => "http://localhost/k12/k12/asd.php",
        "grant_type" => "authorization_code"
    );
 
    $request = new HTTP_Request2($url);
    
    $request->setMethod(HTTP_Request2::METHOD_POST)
            ->setConfig(array(
                    'ssl_verify_peer'   => FALSE,
                    'ssl_verify_host'   => FALSE
                ))
            ->addPostParameter($params);
            #print_r($request);
    #$request->setPostFields($params);
    print_r($request);
    $response = $request->send();
    print_r($response);
    $responseObj = json_decode($request->getBody());
    echo "Access token: " . $responseObj->access_token;
} ?>