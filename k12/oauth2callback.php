<?php if(isset($_GET['code'])) {
    // try to get an access token
    $code = $_GET['code'];
    $url = 'https://accounts.google.com/o/oauth2/token';
    $params = array(
        "code" => $code,
        "client_id" => "839403186376-i9cjktapu32p070sd8b22voccr36nsea.apps.googleusercontent.com",
        "client_secret" => "jjZiO_E0JbuldQ8FcPCaD_27",
        "redirect_uri" => "https://localhost/k12/k12/oauth2callback.php",
        "grant_type" => "authorization_code"
    );
 
    $request = new HttpRequest($url, HttpRequest::METH_POST);
    $request->setPostFields($params);
    $request->send();
    $responseObj = json_decode($request->getResponseBody());
    echo "Access token: " . $responseObj->access_token;
} ?>