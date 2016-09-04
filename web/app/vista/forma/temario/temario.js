var Modulo = function () {
    var resultContainer = 'tblTemario';
    var formulario = $('#temario');
    var module = "temario";

    this.inicializarFormulario = function () {
        $('#id').hide();
        
        app.consultar();        
    };

    var inicializarEventos = function () {

    };

    this.getResultContainer = function () {
        return resultContainer;
    };

    this.getFormulario = function () {
        return formulario;
    };

    this.getModule = function () {
        return module;
    };

    this.cargarFormulario = function (r) {
        var valores = r;
        $('#id').val(valores[0]['id']);
        $('#nivel').val(valores[0]['nivel']);
        $('#ayudaPaginaWeb').val(valores[0]['ayudaPaginaWeb']);
        $('#ayudaVideos').val(valores[0]['ayudaVideos']);
        $('#ayudaPresentaciones').val(valores[0]['ayudaPresentaciones']);
        $('#ayudaLibros').val(valores[0]['ayudaLibros']);
        $('#ayudaApuntesClase').val(valores[0]['ayudaApuntesClase']);
        $('#ayudaOtros').val(valores[0]['ayudaOtros']);
        $('#ayudaCompas').val(valores[0]['ayudaCompas']);
        $('#ayudaProfesor').val(valores[0]['ayudaProfesor']);
        $('#ayudaFamiliares').val(valores[0]['ayudaFamiliares']);
        $('#ayudaAmigos').val(valores[0]['ayudaAmigos']);
        $('#dedicacionHoras').val(valores[0]['dedicacionHoras']);
        $('#dedicacionDias').val(valores[0]['dedicacionDias']);
    };

    this.onCargarFormulario = function (r) {

    };

    this.procesarConsulta = function (r, c) {

    };

    

    this.onCargaTabla = function (c) {
        
    };

    
    var app = new Application(this);

};
