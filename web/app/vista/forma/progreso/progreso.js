var Modulo = function () {
    var resultContainer = 'tblProgreso';
    var formulario = $('#progreso');
    var module = "progreso";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);
    this.ModuleFunctions = moduleFunctions;
    this.inicializarFormulario = function () {
        $('#id').hide();
        inicializarEventos();
        //app.consultar();
    };

    var inicializarEventos = function () {
        $('.modulo-icon').on('click', moduleEvents.accionesModulo);
        $('#cmdResumen').on('click', function () {
            document.location = "/?modulo=temario";
        });
        $('#cmdAvanzar').on('click', function () {
            moduleFunctions.avanzarAction();
        });

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
            case "articulo_actual":
                moduleFunctions.renderizarArticulo(r.content[0]);
                break;
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
    this.getApp = function () {
        return app;
    };
};

var ModuleFunctions = function (modulo) {
    var app;
    this.consultarArticulo = function (moduloId) {
        app = modulo.getApp();
        var args = {
            modulo: moduloId
        };
        app.consultar(null, 'articulo_actual', 'articulo_actual', args);
    };

    this.renderizarArticulo = function (r) {
        $('.progreso_articulo-container input[name=articulo_id]').val(r.id);
        $('.progreso_articulo-container .titulo').html(r.nombre);
        $('.progreso_articulo-container .cuerpo').html(r.descripcion);
    };

    this.avanzarAction = function () {
        app = modulo.getApp();
        var args = {
            articulo_id: $('input[name=articulo_id]').val()
        };
        app.ejecutar('avanzarAction', args);
    };

};

var ModuleEvents = function (modulo) {
    this.accionesModulo = function (event) {
        var moduloId = $(event.target).attr('id');
        modulo.ModuleFunctions.consultarArticulo(moduloId);
    };

};
