var Modulo = function () {
    var resultContainer = 'tblUsuario';
    var formulario = $('#usuario');
    var module = "administrar_usuario";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);

    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar();
        new Archivero('txtArchivoMasivo', '/attachments/usuario', 'jpg') ;
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
        $('#nombre').val(valores[0]['nombre']);
        $('#apellido').val(valores[0]['apellido']);
        $('#identificacion').val(valores[0]['identificacion']);
        $('#email').val(valores[0]['email']);
        $('#perfil').val(valores[0]['perfil']);
        $('#estado').val(valores[0]['estado']);

    };

    this.procesarConsulta = function (r) {

    };

    var app = new Application(this);
    this.getApp = function () {
        return app;
    };
};

var ModuleFunctions = function (modulo) {
    

};

var ModuleEvents = function (modulo) {

};
