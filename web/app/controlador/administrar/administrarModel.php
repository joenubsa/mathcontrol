<?php

require __DIR__ . "/../../data/db.php";

class administrarModel {

    private $result;
    private $primaryTable;

    function __construct($active) {
        $active ? true : die('ACCESS DENIED');
        //$this->dbo = new db();
        
    }    

}
