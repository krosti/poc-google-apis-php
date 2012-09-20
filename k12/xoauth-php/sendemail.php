<?php 
require_once 'Zend/Loader.php';
require_once 'Zend/Mail/Transport/Smtp.php';
require_once 'Zend/Mail.php';

$config = array(
    'ssl' => 'tls',
    'port' => 587,
    'auth' => 'login',
    'username' => $_GET['user'],
    'password' => $_GET['password']
);
$transport = new Zend_Mail_Transport_Smtp('smtp.gmail.com', $config);
Zend_Mail::setDefaultTransport($transport);
$user_domain = preg_split("/[\s@]+/", $_GET['to']);

if( $_GET['domain'] == $user_domain[1] ){
	$mail = new Zend_Mail();
	$mail->setBodyText($_GET['body']);
	$mail->setFrom($_['user']);
	$mail->addTo($_GET['to']);
	$mail->setSubject($_GET['subject']);
	$mail->send($transport);
	$status = true;
	$status_msg = '<span style="color: green;">Your email has been sent</span>';
}else{
	$status = false;
	$status_msg = 'You are not able to send email for this recipient';
}
echo json_encode(array(
	'status'			=>	$status,
	'status_message'	=>	$status_msg
	),JSON_FORCE_OBJECT);
?>