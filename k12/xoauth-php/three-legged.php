<?php
/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
      * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

session_start();

require_once 'common.php';
require_once 'Zend/Oauth/Consumer.php';
require_once 'Zend/Crypt/Rsa/Key/Private.php'; 
require_once 'Zend/Mail/Protocol/Imap.php';
require_once 'Zend/Mail/Storage/Imap.php';

require_once 'Zend/Loader.php';
require_once 'Zend/Mail/Transport/Smtp.php';
require_once 'Zend/Mail.php';


function getCurrentUrl($includeQuery = true) {
  if (isset($_SERVER['https']) && $_SERVER['https'] == 'on') {
    $scheme = 'https';
  } else {
    $scheme = 'http';
  }
  $hostname = $_SERVER['SERVER_NAME'];
  $port = $_SERVER['SERVER_PORT'];

  if ($includeQuery) {
    $uri = $_SERVER['REQUEST_URI'];
  } else {
    $uri = $_SERVER['SCRIPT_NAME'];
  }
  if (($port == '80' && $scheme == 'http') ||
      ($port == '443' && $scheme == 'https')) {
      $url = $scheme . '://' . $hostname . $uri;
  } else {
      $url = $scheme . '://' . $hostname . ':' . $port . $uri;
  }
  return $url;
}

/**
 * If the e-mail address was just submitted via a
 * form POST, set it in the session.  Else if we
 * don't yet have an email address, prompt the user
 * for their address.
 */
if (array_key_exists('email_address', $_POST)) {
  $_SESSION['email_address'] = $_POST['email_address'];
  $email_address = $_SESSION['email_address'];
} else if (array_key_exists('email_address', $_SESSION)) {
  $email_address = $_SESSION['email_address'];
} else {
  include 'header.php';
?>
  <h1>Please enter your e-mail address</h1>
  <form method="POST">
    <input type="text" name="email_address" />
    <input type="submit" />
  </form>
<?php
  include 'footer.php';
  exit;
}

/**
 * Setup OAuth
 */
$options = array(
    'requestScheme' => Zend_Oauth::REQUEST_SCHEME_HEADER,
    'version' => '1.0',
    'consumerKey' => $THREE_LEGGED_CONSUMER_KEY,
    'callbackUrl' => getCurrentUrl(),
    'requestTokenUrl' => 'https://www.google.com/accounts/OAuthGetRequestToken',
    'userAuthorizationUrl' => 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'accessTokenUrl' => 'https://www.google.com/accounts/OAuthGetAccessToken'
);

if ($THREE_LEGGED_SIGNATURE_METHOD == 'RSA-SHA1') {
    $options['signatureMethod'] = 'RSA-SHA1';
    $options['consumerSecret'] = new Zend_Crypt_Rsa_Key_Private(
        file_get_contents(realpath($THREE_LEGGED_RSA_PRIVATE_KEY)));
} else {
    $options['signatureMethod'] = 'HMAC-SHA1';
    $options['consumerSecret'] = $THREE_LEGGED_CONSUMER_SECRET_HMAC;
}

$consumer = new Zend_Oauth_Consumer($options);

/**
 * When using HMAC-SHA1, you need to persist the request token in some way.
 * This is because you'll need the request token's token secret when upgrading
 * to an access token later on. The example below saves the token object 
 * as a session variable.
 */
if (!isset($_SESSION['ACCESS_TOKEN'])) {
  if (!isset($_SESSION['REQUEST_TOKEN'])) {
    // Get Request Token and redirect to Google
    $_SESSION['REQUEST_TOKEN'] = serialize($consumer->getRequestToken(array('scope' => implode(' ', $THREE_LEGGED_SCOPES))));
    $consumer->redirect();
  } else {
    // Have Request Token already, Get Access Token
    $_SESSION['ACCESS_TOKEN'] = serialize($consumer->getAccessToken($_GET, unserialize($_SESSION['REQUEST_TOKEN'])));
    header('Location: ' . getCurrentUrl(false));
    exit;
  } 
} elseif (isset($_GET['method'])) {
  // Retrieve mail using Access Token
  $accessToken = unserialize($_SESSION['ACCESS_TOKEN']);
  $config = new Zend_Oauth_Config();
  $config->setOptions($options);
  $config->setToken($accessToken);
  $config->setRequestMethod('GET');
  $url = 'https://mail.google.com/mail/b/' .
       $email_address . 
       '/imap/';
  $url_smtp = 'https://mail.google.com/mail/b/' .
       $email_address . 
       '/smtp/';

  $httpUtility = new Zend_Oauth_Http_Utility();
  /**
   * Get an unsorted array of oauth params,
   * including the signature based off those params.
   */
  $params = $httpUtility->assembleParams(
      $url, 
      $config);
  
  /**
   * Sort parameters based on their names, as required
   * by OAuth.
   */
  ksort($params);
  
  /**
   * Construct a comma-deliminated,ordered,quoted list of 
   * OAuth params as required by XOAUTH.
   * 
   * Example: oauth_param1="foo",oauth_param2="bar"
   */
  $first = true;
  $oauthParams = '';
  foreach ($params as $key => $value) {
    // only include standard oauth params
    if (strpos($key, 'oauth_') === 0) {
      if (!$first) {
        $oauthParams .= ',';
      }
      $oauthParams .= $key . '="' . urlencode($value) . '"';
      $first = false;
    }
  }
  
  /**
   * Generate SASL client request, using base64 encoded 
   * OAuth params
   */
  $initClientRequest = 'GET ' . $url . ' ' . $oauthParams;
  $initClientRequestEncoded = base64_encode($initClientRequest);

  /**
   * SMPT side
  */
  $initClientRequestSMTP = 'GET ' . $url_smtp . ' ' . $oauthParams;
  $initClientRequestEncodedSMTP = base64_encode($initClientRequestSMTP);
  
  /**
   * Make the IMAP connection and send the auth request
   */
  $imap = new Zend_Mail_Protocol_Imap('imap.gmail.com', '993', true);
  $authenticateParams = array('XOAUTH', $initClientRequestEncoded);
  $imap->requestAndResponse('AUTHENTICATE', $authenticateParams);
  
  /**
   * Print the INBOX message count and the subject of all messages
   * in the INBOX
   */
  $storage = new Zend_Mail_Storage_Imap($imap);
  //include 'header.php'; 
  //echo '<h1>Total messages: ' . $storage->countMessages() . "</h1>\n";

  /**
   * Retrieve first 5 messages.  If retrieving more, you'll want
   * to directly use Zend_Mail_Protocol_Imap and do a batch retrieval,
   * plus retrieve only the headers
   */
  //echo 'First five messages: <ul>';
  //for ($i = 1; $i <= $storage->countMessages() && $i <= 5; $i++ ){ 
  //  echo '<li>' . htmlentities($storage->getMessage($i)->subject) . "</li>\n";
  //}
  //echo '</ul>';
  //include 'footer.php'; 

  function total_messages($storage){
    return $storage->countMessages();
  }

  function all_messages($storage){
    $mails = array();
    $n = $storage->countMessages();
    
    for ($i = 0; $i <= $_GET['id']; $i++ ){ 
      $current = $storage->getMessage($n);
      array_push($mails, array(
          'id' => $n,
          'status' => $current->hasFlag(Zend_Mail_Storage::FLAG_SEEN),
          'date' => $current->date,
          'from' => $current->from,
          'subject' => $current->subject
        ));
      $n--;
    }
    return $mails;
  }

  function unread_messages($storage){
    $flag = "unread";
    $result = $storage->countMessages() - $storage->countMessages('\Seen');
    return $result;
  }

  function get_folders($storage){
    return $storage->getAllFolders();
  }

  function change_folder($storage){
    $storage->selectFolder($_GET['folder']);
    return all_messages($storage);
  }

  function send_email($XoauthClientRequest){

    // Ensure AUTH has not already been initiated.
    
    $authenticateParams = array('XOAUTH', $XoauthClientRequest); 

    $smtp = new Zend_Mail_Protocol_Smtp('smtp.gmail.com', 465, array("AUTH" => $authenticateParams, 'ssl' => 'tls')); 

    try {
       // Create a new mail object
       $mail = new Zend_Mail();

       $tr = new Zend_Mail_Transport_Smtp('smtp.gmail.com'); 

       $mail->setFrom($_GET['from']);
       $mail->addTo($_GET['to']);
       $mail->setSubject($_['subject']);

       $email = $_GET['message'];

       $mail->setBodyText($email);
       $mail->send($tr);
       return 'Your Message has been sent';
    } catch (Exception $e) {
       return "error sending email";
    }
  }

  function getGroupOfIamMemeber(){

    
    Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
    Zend_Loader::loadClass('Zend_Gdata_Gapps');
 
    $client = Zend_Gdata_ClientLogin::getHttpClient($_GET['usr'], $_GET['pw'], Zend_Gdata_Gapps::AUTH_SERVICE_NAME);
    print_r($client);
    return $client->retrieveGroup($memberId);
  }


  switch($_GET['method']){
    case 'total_messages': 
      echo json_encode(total_messages($storage),JSON_FORCE_OBJECT);
      break;
    case 'all_messages': 
      echo json_encode(all_messages($storage),JSON_FORCE_OBJECT);
      break;
    case 'unread_messages': 
      echo json_encode(unread_messages($storage),JSON_FORCE_OBJECT);
      break;
    case 'get_folders': 
      echo json_encode(get_folders($storage),JSON_FORCE_OBJECT);
      break;
    case 'get_groups': 
      echo json_encode(getGroupOfIamMemeber(),JSON_FORCE_OBJECT);
      break;
    case 'change_folder':
      echo json_encode(change_folder($storage),JSON_FORCE_OBJECT);
      break;
    case 'send_form':
       header('Location: '.'http://localhost:8888/k12/sendForm.php?to='.$_GET['to']);
      break;
    case 'send_email':
       echo send_email($initClientRequestEncodedSMTP);
      break;
    case 'test':
      echo json_encode(test($initClientRequestEncodedSMTP),JSON_FORCE_OBJECT);
      break;

  };
} else{
  echo 'Disconnect';
}
?>
