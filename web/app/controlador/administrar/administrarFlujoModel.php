<?phprequire __DIR__ . "/../../data/db.php";class administrarFlujoModel {    private $result;    private $primaryTable;    function __construct($active) {        $active ? true : die('ACCESS DENIED');        $this->dbo = new db();        $this->primaryTable = "flujo";    }    private $dbo;    public function consultar($P) {        if (isset($P['_conse']) && !is_numeric($P['_conse'])) {            $this->setResult('Error al consultar el registro', 'error');            return false;        }        $consulta = "";        switch ($P['tipo']) {            case "activo":                $consulta = "select id                        ,nombre                        ,grupo                                                "                        . "from $this->primaryTable "                        . "where estado <> 'I'                                                     ";                break;            case "formulario":                $consulta = "select * from $this->primaryTable where id=" . $P['_conse'];                break;            case "modulo_id":                $consulta = "select id, nombre as html from modulo where estado <> 'I'";                break;            case "ListaFlujos":                $consulta = $this->consultaFlujo($P);                break;        }        $this->dbo->conectar();        $res = $this->dbo->consultar($consulta);        $this->dbo->desconectar();                if ($this->dbo->getError() === null) {            $this->setResult($res, 'data');        } else {            $this->setResult("Ha ocurrido un error en la consulta", "error");            return false;        }        return true;    }    public function guardar($P) {        var_dump($P);        $consulta = "insert into $this->primaryTable(                                            nombre                                            ,grupo                                            ,fechaRegistro                                            ,estado                                            ,modulo_id                                            )                              values('" . $P["nombre"] . "',                                            '" . $P["grupo"] . "',                                            '" . date('Y-m-d H:i:s') . "',                                            'A',                                            '" . $P["modulo_id"] . "'                                                                                        )										                                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al guardar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'id');        }        $this->dbo->desconectar();        return true;    }    public function editar($P) {        if (!is_numeric($P['id'])) {            $this->setResult('No se encuentra identificador', 'error');            return false;        }        $consulta = "update $this->primaryTable set                             nombre = '" . $P['nombre'] . "'                            ,grupo = '" . $P['grupo'] . "'                            ,modulo_id = '" . $P['modulo_id'] . "'                            ,estado = '" . $P['estado'] . "'            where id= " . $P['id'] . "                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al editar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'ok');        }        $this->dbo->desconectar();        return true;    }    public function borrar($P) {        if (!is_numeric($P['id'])) {            $this->setResult('Error al borrar el registro', 'error');            return false;        }        $consulta = "update $this->primaryTable set estado = 'I'                                        where id= " . $P['id'] . "                    ";        $this->dbo->conectar();        if (!$this->dbo->ejecutar($consulta)) {            $this->setResult('Error al editar el registro', 'error');        } else {            $this->setResult($this->dbo->getInsertedID(), 'ok');        }        $this->dbo->desconectar();    }    public function setResult($output, $type = "message") {        $this->result = [            "type" => $type,            "output" => $output        ];        return true;    }    public function getResult() {        return $this->result;    }    private function consultaFlujo($p) {                $consulta = "select art.id, art.nombre, art.articulo_id, art2.nombre as articulo_padre from articulo art            left join articulo art2 on art.articulo_id=art2.id             where art.estado <> 'I'                        ";        return $consulta;    }}