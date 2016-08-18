<?php

require __DIR__ . "/../../data/db.php";

class ventaModel {

    private $result;
    private $primaryTable;

    function __construct($active) {
        $active ? true : die('ACCESS DENIED');
        $this->dbo = new db();
        $this->primaryTable = "venta";
    }

    private $dbo;

    public function consultar($P) {
        if (isset($P['_conse']) && !is_numeric($P['_conse'])) {
            $this->setResult('Error al consultar el registro', 'error');
            return false;
        }
        $consulta = "";
        $params = null;
        if (isset($P['params'])) {
            $params = json_decode($P['params']);
        }
        switch ($P['tipo']) {
            case "activo":
                $consulta = "select pt.id, lg.nombre as liga, concat(eq1.nombre, '|', eq1.imagen) as equipo_local, concat(eq2.nombre, '|', eq2.imagen) as equipo_visita, pt.fechaCompromiso "
                        . "from partido pt "
                        . "inner join liga lg on pt.liga_id=lg.id "
                        . "inner join equipo eq1 on pt.equipo_local=eq1.id "
                        . "inner join equipo eq2 on pt.equipo_visita=eq2.id "
                        . "where pt.estado <> 'X' and pt.liga_id = " . $params->liga_id . " "
                        . "order by  pt.fechaCompromiso, lg.nombre";
                break;
            case "pais":
                $consulta = "select id, nombre as html, imagen from pais order by nombre";
                break;
            case "liga":
                $consulta = "select id, nombre as html, imagen from liga where pais_id= " . $params->pais_id . " and estado='A' order by nombre";
                break;
        }
        $this->dbo->conectar();
        $res = $this->dbo->consultar($consulta);
        $this->dbo->desconectar();
        if ($this->dbo->getError() === null) {
            $this->setResult($res, 'data');
        } else {
            $this->setResult("Ha ocurrido un error en la consulta", "error");
            return false;
        }
        return true;
    }

    public function guardar($P) {
        $consulta = "insert into $this->primaryTable(nombre
                                            ,imagen
                                            ,descripcion
                                            ,liga_id
                                            ,estado
                                            )
                              values('" . $P["nombre"] . "',
                                            '" . $P["imagen"] . "',
                                            '" . $P["descripcion"] . "' ,
                                            " . $P["liga_id"] . ",
                                            '" . $P["estado"] . "'
                                            )										
                                    ";
        $this->dbo->conectar();

        if (!$this->dbo->ejecutar($consulta)) {
            $this->setResult('Error al guardar el registro.', 'error');
        } else {
            $this->setResult($this->dbo->getInsertedID(), 'id');
        }
        $this->dbo->desconectar();
        return true;
    }

    public function editar($P) {
        if (!is_numeric($P['id'])) {
            $this->setResult('Error al editar el registro', 'error');
            return false;
        }
        $consulta = "update $this->primaryTable set nombre = '" . $P['nombre'] . "'
                            ,imagen = '" . $P['imagen'] . "'
                            ,descripcion = '" . $P['descripcion'] . "'
                            ,liga_id = '" . $P['liga_id'] . "'
                            ,estado = '" . $P['estado'] . "'  
            where id= " . $P['id'] . "
                    ";

        $this->dbo->conectar();
        if (!$this->dbo->ejecutar($consulta)) {
            $this->setResult('Error al editar el registro', 'error');
        } else {
            $this->setResult($this->dbo->getInsertedID(), 'ok');
        }
        $this->dbo->desconectar();
        return true;
    }

    public function borrar($P) {
        if (!is_numeric($P['id'])) {
            $this->setResult('Error al borrar el registro', 'error');
            return false;
        }
        $consulta = "update $this->primaryTable set estado = 'X'                            
            where id= " . $P['id'] . "
                    ";
        $this->dbo->conectar();
        if (!$this->dbo->ejecutar($consulta)) {
            $this->setResult('Error al borrar el registro', 'error');
        } else {
            $this->setResult($this->dbo->getInsertedID(), 'ok');
        }
        $this->dbo->desconectar();
    }

    public function setResult($output, $type = "message") {
        $this->result = [
            "type" => $type,
            "output" => $output
        ];
        return true;
    }

    public function getResult() {
        return $this->result;
    }

    public function consultarParametrosPartido($P) {
        $this->dbo->conectar();
        $consulta = "select id, parametro_nombre, valor_local, valor_visita, marca_local, marca_visita from parametro_partido where partido_id = " . $P['partido_id'];
        //echo $consulta;
        $res = $this->dbo->consultar($consulta);
        $this->dbo->desconectar();
        $this->setResult($res, 'data');
        return true;
    }

    public function generarTicket($P) {
        $this->dbo->conectar();
        $apuestaCuerpo = json_decode($P['apuestaCuerpo']);
        $valorApostar = $P['valorApostar'];
        $numeroTicketString = date('Ymdhis') . $valorApostar;
        $numeroTicket = hash("adler32", $numeroTicketString);
        $numeroTicket .= "-" . date('mdHi');
        $fechaRegistro = date('Y-m-d H:i:s');
        $newTicketQuery = "insert into ticket (
                fechaRegistro
                , taquilla_id
                , numero
                , totalApuesta
            ) values (
                '" . $fechaRegistro . "'
                , 2
                , '" . $numeroTicket . "'
                , " . (int) $valorApostar . "
            )";
        $this->dbo->ejecutar($newTicketQuery);
        $ticketId = $this->dbo->getInsertedID();
        foreach ($apuestaCuerpo as $partidos) {
            foreach ($partidos as $partido) {
                foreach ($partido as $partido_id => $parametro) {
                    foreach ($parametro as $parametro_id => $values) {
                        $equipoGanarStr = $values->ganador === 'L' ? 'equipo_local' : 'equipo_visita';
                $apuestaQuery = "insert into apuesta(
                    fechaRegistro
                    , ticket_id
                    , partido_id
                    , parametro_partido_id
                    , valorGanar
                    , equipo_id
                    , equipo_lugar
                    , parametro_valor
                ) values (
                    '" . $fechaRegistro . "'
                    , " . $ticketId . "
                            , " . $partido_id . "
                    , " . $parametro_id . "
                            , " . $values->valor . "
                            , (select eq.id from partido pa inner join equipo eq on pa.$equipoGanarStr = eq.id where pa.id = $partido_id)
                            , '" . $values->ganador . "'
                            , " . $values->factor . "
                )
                ";
                $this->dbo->ejecutar($apuestaQuery);
            }
        }
            }
        }
        

        $this->dbo->desconectar();
        $this->setResult($numeroTicket, 'data');
        return true;
    }

}
