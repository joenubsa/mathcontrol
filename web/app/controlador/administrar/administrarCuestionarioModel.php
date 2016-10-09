<?phprequire __DIR__ . "/../../data/db.php";class administrarCuestionarioModel {    private $result;    private $primaryTable;    function __construct($active) {        $active ? true : die('ACCESS DENIED');        $this->dbo = new db();        $this->primaryTable = "cuestionario";    }    private $dbo;    public function consultar($P) {        if (isset($P['_conse']) && !is_numeric($P['_conse'])) {            $this->setResult('Error al consultar el registro', 'error');            return false;        }        $consulta = "";                switch ($P['tipo']) {            case "activo":                $consulta = "select id                        ,descripcion                                                ,articulo_id                        "                        . "from $this->primaryTable "                        . "where estado <> 'I'                                                     ";                break;            case "formulario":                $consulta = "select * from $this->primaryTable where id=" . $P['_conse'];                break;            case "articulo_id":                $consulta = "select id, nombre as html from articulo where estado <> 'I'";                break;        }        $this->dbo->conectar();        $res = $this->dbo->consultar($consulta);        $this->dbo->desconectar();                if ($this->dbo->getError() === null) {            $this->setResult($res, 'data');        } else {            $this->setResult("Ha ocurrido un error en la consulta", "error");            return false;        }        return true;    }    public function guardar($P) {        $consulta = "insert into $this->primaryTable(                                            descripcion                                            ,cuerpo                                            ,articulo_id                                            ,fechaRegistro                                            ,estado                                            )                              values('" . $P["descripcion"] . "',                                            '" . $P["cuerpo"] . "',                                            '" . $P["articulo_id"] . "',                                            '" . date('Y-m-d H:i:s') . "',                                            'A'                                            )										                                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al guardar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'id');        }        $this->dbo->desconectar();        return true;    }    public function editar($P) {        if (!is_numeric($P['id'])) {            $this->setResult('No se encuentra identificador', 'error');            return false;        }        $consulta = "update $this->primaryTable set                             descripcion = '" . $P['descripcion'] . "'                            ,cuerpo = '" . $P['cuerpo'] . "'            where id= " . $P['id'] . "                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al editar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'ok');        }        $this->dbo->desconectar();        return true;    }    public function borrar($P) {        if (!is_numeric($P['id'])) {            $this->setResult('Error al borrar el registro', 'error');            return false;        }        $consulta = "update $this->primaryTable set estado = 'I'                                        where id= " . $P['id'] . "                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al editar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'ok');        }        $this->dbo->desconectar();    }    public function setResult($output, $type = "message") {        $this->result = [            "type" => $type,            "output" => $output        ];        return true;    }    public function getResult() {        return $this->result;    }}