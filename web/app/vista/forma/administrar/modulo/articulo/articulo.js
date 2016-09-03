var Modulo = function () {
    var resultContainer = 'tblArticulo';
    var formulario = $('#articulo');
    var module = "administrar_articulo";
    var ListaArticulos = null;

    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar();
        app.consultar(null, 'modulo_id', 'modulo_id');
        inicializarEventos();        
        app.consultar(null, 'ListaArticulos', 'ListaArticulos');        
    };

    var inicializarEventos = function () {
        $('#articulo_label').on('click', function () {
            articulo_labelOnClick();
        });
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
        $('#modulo_id').val(valores[0]['modulo_id']);
        $('#articulo_id').val(valores[0]['articulo_id']);
        $('#estado').val(valores[0]['estado']);
    };

    this.onCargarFormulario = function (r) {
        refrescarArticuloSelect(r);
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

    var articulo_labelOnClick = function () {        
        var selar = new seleccionarArticulos();
        selar.cargarTablaArticulos(null);
    };

    var refrescarArticuloSelect = function (r) {
        app.cargarTabla(r.content, 'selectorArticulo_table', false);
    };

    this.onCargaTabla = function (c) {
        switch (c) {
            case "selectorArticulo_table":
                ajustarSelectorArticulo_table(c);
                break;
        }
    };

    var ajustarSelectorArticulo_table = function(c) {
        var tabla = $('#' + c);
        tabla.find('tbody tr').each(function () {
            $(this).find('td').eq(0).hide();
            $(this).find('td').eq(2).hide();
            $(this).on('click', function(){
                selectorArticulo_table_onTdClick(this);
            });
        });
    };
    
    var selectorArticulo_table_onTdClick = function(fila){
        var id = $(fila).find('td').eq(0).html();
        var nombre = $(fila).find('td').eq(1).html();
        $('#articulo_id').val(id);
        $('#articulo_label').val(nombre);
    };
    
    var cargarArticulos = function(r){        
        ListaArticulos = r;   
        console.log(ListaArticulos);
    };
    
    var seleccionarArticulos = function (){        
        this.cargarTablaArticulos = function (articulo_padre){
            articulo_padre = articulo_padre | null;
            var lista = obtenerArticulosParaMostrar(articulo_padre);
            console.log(lista);
        };
        
        function obtenerArticulosParaMostrar (articulo_padre){            
            var ListaArticulosReturn = [];
            for (var i in ListaArticulos){
                alert(ListaArticulos[i].articulo_id + " vs ap:" + articulo_padre);
                if (ListaArticulos[i].articulo_id === articulo_padre){
                    ListaArticulosReturn.push(ListaArticulos[i]);
                }
            }
            return ListaArticulosReturn;
        }
    };

};
