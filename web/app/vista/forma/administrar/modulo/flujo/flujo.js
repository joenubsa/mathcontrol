var Modulo = function () {
    var resultContainer = 'tblFlujo';
    var formulario = $('#flujo');
    var module = "administrar_flujo";

    this.inicializarFormulario = function () {
        inicializarEventos();
        $('#id, #articulo_id').hide();        
        app.consultar();
        app.consultar(null, 'modulo_id', 'modulo_id');
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
        $('#nombre').val(valores[0]['nombre']);
        $('#grupo').val(valores[0]['grupo']);
        $('#estado').val(valores[0]['estado']);
        $('#modulo_id').val(valores[0]['modulo_id']);
    };

    this.onCargarFormulario = function (r) {
        if (r[0].articulo_id !== null) {
            var datos = articulosPicker.buscarRegistro(r[0].articulo_id);
            $('#articulo_label').val(datos.nombre);
        }
        $('.text-editor-box .editionbox').html($('#descripcion').val());
    };

    this.procesarConsulta = function (r, c) {
        switch (c) {
            case "modulo_id":
                app.cargarSelect('modulo_id', r);
                break;
            case "ListaArticulos":
                cargarArticulos(r.content);
                break;
        }
    };

    var app = new Application(this);

    this.onCargaTabla = function (c) {
        switch (c) {
            case "selectorArticulo_table":
                ajustarSelectorArticulo_table(c);
                break;
        }
    };


};

var eventDictionary = function(){
    
};
