var Modulo = function () {
    var resultContainer = 'tblCategoria';
    var formulario = $('#categoria');
    var module = "administrar_categoria";

    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar();
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
        $('#descripcion').val(valores[0]['descripcion']);        
        $('#estado').val(valores[0]['estado']);

    }
    
    this.procesarConsulta = function(r){
        
    }

    var app = new Application(this);
};
