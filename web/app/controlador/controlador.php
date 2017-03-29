<?phpclass Controlador {    function __construct() {        date_default_timezone_set('America/Bogota');        session_start();    }    public function cargarPagina() {        $executeNoRender = null;        if (isset($_GET["modulo"])) {            $modulo = $_GET["modulo"];        } else {            $modulo = "inicio";        }        switch ($modulo) {            case "killsession":                $executeNoRender = $this->cerrarCesion();                break;            case "upload":                $executeNoRender = $this->cargadorArchivoAjax();                break;        }        if ($executeNoRender != null) {            return $executeNoRender;        }        if ($this->validarSesion($modulo)) {            echo $this->cargarHTML($modulo);        } else {            echo $this->cargarLogin('inicio');        }    }    private function validarSesion($modulo) {        $token = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null;        if (!$token || $token === '') {            return false;        }        return true;    }    private function cargarHTML($ms) {        $archivo = $ms;        $mod = $ms;        if (strpos($ms, '/')) {            $submodulo = substr($ms, strpos($ms, '/') + 1);            $archivo = substr($ms, 0, strpos($ms, '/'));            $archivo = 'modulo/' . $submodulo . '/' . substr($ms, strpos($ms, '/') + 1);            $mod = substr($ms, 0, strpos($ms, '/'));        }        $usuario = $_SESSION['usuario_id'];        $perfil = $_SESSION['perfil'];        $paginaMaestra = file_get_contents('app/vista/pagmaestra.html');        $modulo = file_get_contents('app/vista/forma/' . $mod . '/' . $archivo . '.html');        $menu = null;        if ($perfil === 'A') {            $menu = file_get_contents('app/vista/assets/general/menu.admin.html');        } elseif ($perfil === 'E') {            $menu = file_get_contents('app/vista/assets/general/menu.user.e.html');        } else {            $menu = file_get_contents('app/vista/assets/general/menu.user.c.html');        }        $paginaRender = str_replace([            '##MENUPRINCIPAL##',            '##CONTENIDOS##',            '##MODULO##',            '##MODULOJS##'                ], [            $menu,            $modulo,            $archivo,            $mod                ], $paginaMaestra);        return $paginaRender;    }    private function cargarLogin($ms) {        $archivo = $ms;        $mod = $ms;        if (strpos($ms, '/')) {            $submodulo = substr($ms, strpos($ms, '/') + 1);            $archivo = substr($ms, 0, strpos($ms, '/'));            $archivo = 'modulo/' . $submodulo . '/' . substr($ms, strpos($ms, '/') + 1);            $mod = substr($ms, 0, strpos($ms, '/'));        }        $paginaMaestra = file_get_contents('app/vista/pagmaestra.html');        $modulo = file_get_contents('app/vista/forma/inicio/login.html');        $paginaRender = str_replace([            '##MENUPRINCIPAL##',            '##CONTENIDOS##',            '##MODULO##',            '##MODULOJS##'                ], [            '',            $modulo,            $archivo,            $mod                ], $paginaMaestra);        return $paginaRender;    }    public function cerrarCesion() {        foreach ($_SESSION as $key => $value) {            unset($_SESSION[$key]);        }        header('Location: /');        return true;    }    public function ejecutar() {        $respuesta = true;        switch ($_POST['ejecucion']) {            case "cargarArchivo":                $respuesta = $this->cargadorArchivoAjax($_POST, $_FILES);                break;        }        return $respuesta;    }    private function cargadorArchivoAjax($P, $F) {        $uploaddir = $P["destino"];        $pfx = $P['pfx'];        $ext = explode('.', $F['userfile']['name']);        $extension = $ext[1];        $newname = $pfx . $ext[0];        $uploadfile = $uploaddir . '/' . $newname . '.' . $extension;        if (move_uploaded_file($F['userfile']['tmp_name'], $uploadfile)) {            echo $newname . '.' . $extension;        } else {            echo "error";        }                return true;    }}