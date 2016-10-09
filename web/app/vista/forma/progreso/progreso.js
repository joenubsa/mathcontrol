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
    this.getApp = function (){
        return app;
    };
};

var ModuleFunctions = function (modulo) {    
    this.consultarArticulo = function(moduloId){
        var app = modulo.getApp();
        var args = {
            modulo: moduloId
        };
        app.consultar(null, 'articulo_actual', 'articulo_actual', args);
    };
    
    this.renderizarArticulo = function(r){
        console.log(r);
        $('.progreso_articulo-container .titulo').html(r.titulo);
        $('.progreso_articulo-container .cuerpo').html(r.descripcion);
    };  
    
};

var ModuleEvents = function (modulo) {    
    this.accionesModulo = function (event){        
        var moduloId = $(event.target).attr('id');
        modulo.ModuleFunctions.consultarArticulo(moduloId);
    };
};
