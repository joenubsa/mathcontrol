var Modulo = function () {
    var resultContainer = 'tblParametro';
    var formulario = $('#parametro');
    var module = "administrar_parametro";

    this.inicializarFormulario = function () {
               
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
        $('#valor').val(valores[0]['valor']);  
    }
    
    this.procesarConsulta = function(r, c){
        
    }

    var app = new Application(this);
};
