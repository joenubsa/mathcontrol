<?phpclass administrarArticuloController {    private $m;    private $post;    private $response;    private $validateMessage;    private $rootDir;    function __construct($active = FALSE, $accion) {        $this->rootDir = __DIR__ . "\\..\\..";        $active ? true : die('ACCESS DENIED');        $className = (string) __CLASS__;        $className = str_replace("Controller", "Model", $className);        $this->m = new $className(true);        $this->post = $_POST;        $this->$accion();            }    public function consultar() {        $this->m->consultar($this->post);        return $this->Response();    }    public function guardar() {        if (!$this->validar()) {            $this->response = $this->validateMessage;            return $this->Response();        }        $this->m->guardar($this->post);        return $this->Response();    }    public function editar() {        if (!$this->validar()) {            $this->response = $this->validateMessage;            return $this->Response();        }        $res = $this->m->editar($this->post);        return $this->Response();    }    public function borrar() {        $res = $this->m->borrar($this->post);        return $this->Response();    }    private function validar() {        $data = $this->post;        if (!isset($data['id'])) {            $this->validateMessage = "No se ha enviado el formulario";            return false;        }        if ($data['nombre'] === "") {            $this->validateMessage = "Debe asignar un nombre completo al usuario";            return false;        }        return true;    }    public function ejecutar() {        switch ($this->post['evento']) {            case "cargarImagen":                $this->cargarImagen();                break;        }        return $this->Response("data");    }    private function cargarImagen() {        $imageContentParts = explode(',', $this->post["imageContent"]);        $imageTypeParts = explode(';', $imageContentParts[0]);        $imageExtension = substr($imageTypeParts[0], strpos($imageTypeParts[0], "/") + 1);        $filename = "img." . microtime() . base64_encode(microtime()) . "." . $imageExtension;        $filePath = $this->rootDir . "\\..\\public\\images\\articulo";        $imagePath = $filePath . "\\" . $filename;        $image = fopen($imagePath, "w");        $imageData = str_replace(" ", "+", $imageContentParts[1]);        fwrite($image, base64_decode($imageData));        fclose($image);                $this->response = [            "type" => "cargarImagen",            "message" => "La imagen se cargo",            "link" => $filename,            "id" => $this->post["id"]        ];    }        private function eliminarImagen(){            }    private function Response($type = null) {        if (!$type) {            $type = $this->m->getResult()['type'];        }        if (!$this->response) {            $this->response = $this->m->getResult()['output'];        }        $response = [            "returned" => $type,            "content" => $this->response        ];        echo json_encode($response);    }}