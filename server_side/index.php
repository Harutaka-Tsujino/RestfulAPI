<?php
require_once('user.php');
require_once('hex.php');

if (isset($_SERVER['HTTP_ORIGIN']))
{
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
{
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
    {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    }
    exit(0);
}

preg_match('|' . dirname($_SERVER['SCRIPT_NAME']) .
           '/([\w%/]*)|', $_SERVER['REQUEST_URI'],
           $matches);

$paths = explode('/', $matches[1]);

eval('$instance = new ' . $paths[0] . '();');

$id = isset($paths[1]) ? htmlspecialchars($paths[1]) : null;

$methodName = strtolower($_SERVER['REQUEST_METHOD']);
$param = file_get_contents('php://input');

eval('$instance->'.$methodName.'($id, $param);');
?>
