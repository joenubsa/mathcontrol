var Modulo = function () {
    var resultContainer = 'tblArticulo';
    var formulario = $('#articulo');
    var module = "administrar_articulo";

    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar();
        app.consultar(null, 'modulo_id', 'modulo_id');
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

    };
    
    this.procesarConsulta = function(r, c){
        switch(c){
            case "modulo_id":
                console.log(r);
                app.cargarSelect('modulo_id', r)
                break;
        }
    };

    var app = new Application(this);
};
