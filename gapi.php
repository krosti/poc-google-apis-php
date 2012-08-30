<?php
//fucntion to get unread emails taking username and password as parametes

$xmlString = file_get_contents("https://fernando.cea@globant.com:Cuadrilatero2@mail.google.com/mail/feed/atom");
$xml = new SimpleXMLElement($xmlString);
//$data = array('unread_emails' => $xml->fullcount);
echo json_encode($xml);

?>