<?php
	require_once 'Zend/Loader.php';
	Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
	Zend_Loader::loadClass('Zend_Gdata_Gapps');

	$client = Zend_Gdata_ClientLogin::getHttpClient('ceafernando@gmail.com', 'milestone33387445', Zend_Gdata_Gapps::AUTH_SERVICE_NAME);
	$client->retrieveAllGroups();
	
?>