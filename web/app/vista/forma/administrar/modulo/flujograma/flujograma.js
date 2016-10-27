var Modulo = function () {
    var resultContainer = 'tblFlujograma';
    var formulario = $('#flujograma');
    var module = "administrar_flujograma";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);

    this.inicializarFormulario = function () {
        inicializarEventos();
        $('#id, #articulo_id').hide();
        var args = {
            flujo: app.getVars('flujo')
        };
        app.consultar(null, 'lista_articulos', 'lista_articulos', args);
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
//        $('#id').val(valores[0]['id']);
//        $('#nombre').val(valores[0]['nombre']);
//        $('#grupo').val(valores[0]['grupo']);
//        $('#estado').val(valores[0]['estado']);
//        $('#modulo_id').val(valores[0]['modulo_id']);
    };

    this.onCargarFormulario = function (r) {

    };

    this.procesarConsulta = function (r, c) {
        switch (c) {
            case "lista_articulos":
                app.cargarTabla(r.content, "ArticulosHitosSinAsignar");
                break;
            case "lista_articulos_filtro":
                app.cargarTabla(r.content, "ArticuloSucesorPositivo");
                break;
        }
    };

    var app = new Application(this);
    this.getApp = function () {
        return app;
    };
    this.onCargaTabla = function (c) {
        switch (c) {
            case "ArticulosHitosSinAsignar":
                moduleFunctions.articulosNoAsignadosCargados();
                break;
        }
    };


};

var ModuleFunctions = function (modulo) {
    var app;
    this.articulosNoAsignadosCargados = function () {
        app = modulo.getApp();
        $('input[name=ArticulosHitosSinAsignar_conse]').on('click', function () {
            var args = {
                flujo: app.getVars('flujo'),
                idSeleccion_1: $('input[name=ArticulosHitosSinAsignar_conse]:checked').val()
            };
            app.consultar(null, 'lista_articulos_filtro', 'lista_articulos_filtro', args);
        });
    };

    this.articuloSucesorPositivoCargado = function () {
        app = modulo.getApp();
        $('input[name=ArticuloSucesorPositivo_conse]').on('click', function () {
            var args = {
                flujo: app.getVars('flujo'),
                idSeleccion_1: $('input[name=ArticulosHitosSinAsignar_conse]:checked').val(),
                idSeleccion_2: $('input[name=ArticuloSucesorPositivo_conse]:checked').val()        
                
            };
            app.consultar(null, 'lista_articulos_filtro', 'lista_articulos_filtro', args);
        });
    };

    this.articuloSucesorNegativoCargado = function () {

    };
};

var ModuleEvents = function (modulo) {

};