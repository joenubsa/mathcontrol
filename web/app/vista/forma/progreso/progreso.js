var Modulo = function () {
    var resultContainer = 'tblProgreso';
    var formulario = $('#progreso');
    var module = "progreso";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);

    this.inicializarFormulario = function () {
        $('#id').hide();
        inicializarEventos();
        app.consultar();
    };

    var inicializarEventos = function () {

    };


    this.cargarFormulario = function (r) {
//        var valores = r;
//        $('#id').val(valores[0]['id']);
//        $('#nombre').val(valores[0]['nombre']);
//        $('#descripcion').val(valores[0]['descripcion']);
//        $('#modulo_id').val(valores[0]['modulo_id']);
//        $('#progreso_id').val(valores[0]['progreso_id']);
//        $('#estado').val(valores[0]['estado']);
    };

    this.onCargarFormulario = function (r) {

    };

    this.procesarConsulta = function (r, c) {
        switch (c) {

        }
    };

    this.onCargaTabla = function (c) {
        switch (c) {

        }
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

    var app = new Application(this);
};

var ModuleFunctions = function (modulo) {

};

var ModuleEvents = function (modulo) {

};
