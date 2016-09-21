var Modulo = function () {
    var resultContainer = 'tblArticulo';
    var formulario = $('#articulo');
    var module = "administrar_articulo";
    var ListaArticulos = null;
    var articulosPicker = null;
    this.inicializarFormulario = function () {
        $('#id, #articulo_id').hide();
        app.consultar();
        app.consultar(null, 'modulo_id', 'modulo_id');
        inicializarEventos();
        app.consultar(null, 'ListaArticulos', 'ListaArticulos');
        articulosPicker = new ArticulosPicker();
    };

    var inicializarEventos = function () {
        $('#articulo_label').on('click', function () {
            articulo_labelOnClick(this);
        });

        $('form').on('reset', function () {
            $('.text-editor-box .editionbox').html('');
        });

        $('.text-editor-box .editionbox').on('keyup', function () {
            actualizarEditorTextarea();
        });
        $('.text-editor-box .editionbox').on('change', function () {
            actualizarEditorTextarea();
        });
        $('.text-editor-box .editionbox').on('input', function () {
            actualizarEditorTextarea();
        });
        $('.text-editor-box .editionbox').on('propertyChanged', function () {
            actualizarEditorTextarea();
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
        $('#mostrarControl').val(valores[0]['mostrarControl']);
        $('#eshito').val(valores[0]['esHito']);
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

    var articulo_labelOnClick = function (sender) {
        articulosPicker.cargarTablaArticulos(null);
        articulosPicker.mostrarElemento(sender);
    };


    this.onCargaTabla = function (c) {
        switch (c) {
            case "selectorArticulo_table":
                ajustarSelectorArticulo_table(c);
                break;
        }
    };

    var ajustarSelectorArticulo_table = function (c) {
        var tabla = $('#' + c);
        tabla.find('tbody tr').each(function () {
            $(this).find('td').eq(0).hide();
            $(this).find('td').eq(3).hide();
            $(this).find('td').eq(1).on('click', function () {
                selectorArticulo_table_onTdClick($(this).parents('tr'));
                articulosPicker.ocultarElemento();
            });
        });
    };

    var selectorArticulo_table_onTdClick = function (fila) {
        var id = $(fila).find('td').eq(0).html();
        var nombre = $(fila).find('td').eq(1).find('span').html();
        $('#articulo_id').val(id);
        $('#articulo_label').val(nombre);
    };

    var cargarArticulos = function (r) {
        ListaArticulos = r;
    };

    var actualizarEditorTextarea = function () {
        $('#descripcion').val($('.text-editor-box .editionbox').html());
    };

    var ArticulosPicker = function () {
        var Elemento = "selectorArticulo_table";
        this.cargarTablaArticulos = function (articulo_padre) {
            articulo_padre = !isNaN(articulo_padre) ? articulo_padre : null;
            var lista = obtenerArticulosParaMostrar(articulo_padre);
            app.cargarTabla(lista, Elemento, false);
        };

        function obtenerArticulosParaMostrar(articulo) {
            var ListaArticulosReturn = [];
            for (var i in ListaArticulos) {
                if (+ListaArticulos[i].articulo_id === +articulo || +ListaArticulos[i].id === +articulo) {
                    var html = +ListaArticulos[i].id === +articulo ? "Atrás" : "Ver más";
                    var verMas = $('<span>').prop('class', 'seleccionArticulo-vermas').html(html).on('click', function () {
                        var rowId = +$(this).parents('tr').find('td').eq(0).html();
                        var padreId = +$(this).parents('tr').find('td').eq(3).html();
                        var target = +rowId === +articulo ? padreId : rowId;
                        articulosPicker.cargarTablaArticulos(+target);
                    });
                    ListaArticulosReturn.push({
                        id: ListaArticulos[i].id,
                        nombre: "<span class='seleccionArticulo-seleccionar'>" + ListaArticulos[i].nombre + "</a>",
                        desplegar: verMas,
                        padreId: ListaArticulos[i].articulo_id
                    });
                }
            }
            return ListaArticulosReturn;
        }

        this.mostrarElemento = function (sender) {
            $('#' + Elemento).toggle('slow');
            sender = $(sender);
            var senderPosition = $(sender).parent('label').position();
            $('#' + Elemento).css({
                "top": (senderPosition.top + sender.parents('label').height()) + "px",
                "left": senderPosition.left + "px"
            });

        };

        var ocultarElemento = function () {
            $('#' + Elemento).hide('slow');
        };
        this.ocultarElemento = ocultarElemento;

        this.buscarRegistro = function (id) {
            var Registro = null;
            for (var i in ListaArticulos) {
                if (+ListaArticulos[i].id === +id) {
                    Registro = ListaArticulos[i];
                    break;
                }
            }
            return Registro;
        };
    };

};
