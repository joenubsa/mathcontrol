var Modulo = function () {
    var resultContainer = 'tblArticulo';
    var formulario = $('#articulo');
    var module = "administrar_articulo";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);
    if (document.addEventListener) {
        document.addEventListener('paste', moduleEvents.onPasteTriggered, false);
    }
    var ListaArticulos = null;
    var articulosPicker = null;
    var removerEstilos = false;
    var textEditorTools = null;
    this.inicializarFormulario = function () {
        $('#id, #articulo_id').hide();
        app.consultar();
        app.consultar(null, 'modulo_id', 'modulo_id');
        inicializarEventos();
        app.consultar(null, 'ListaArticulos', 'ListaArticulos');
        articulosPicker = new ArticulosPicker();
        textEditorTools = new TextEditorTools();
    };

    var inicializarEventos = function () {
        $('#articulo_label').on('click', function () {
            articulo_labelOnClick(this);
        });

        $('form').on('reset', function () {
            $('.text-editor-box .editionbox').html('');
            app.consultar(null, 'ListaArticulos', 'ListaArticulos');
        });

//        $('.text-editor-box .editionbox').on('keyup', function () {
//            actualizarEditorTextarea();
//        });
        $('.text-editor-box .editionbox').on('change', function () {
            actualizarEditorTextarea();
        });
//        $('.text-editor-box .editionbox').on('input', function () {
//            actualizarEditorTextarea();
//        });
        $('.text-editor-box .editionbox').on('propertyChanged', function () {
            actualizarEditorTextarea();
        });

        $('.text-editor-box .editionbox').on('paste', function () {
            setTimeout(function () {
                removerEstilos()
            }, 300);
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
        app.consultar(null, 'ListaArticulos', 'ListaArticulos');
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
            case "result_":
                switch (r.content.type) {
                    case "cargarImagen":
                        actualizarImagen(r.content.id, r.content.link)
                        break;
                }
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
        var contenidoActual = $('.text-editor-box .editionbox').html();
        var nuevoContenido = procesarContenido(nuevoContenido);
        $('#descripcion').val(contenidoActual);
    };

    var procesarContenido = function (contenido) {
        var editor = $('.text-editor-box .editionbox');
        procesarImagenes(editor);
    };

    var procesarImagenes = function (editor) {
        editor.find('img[src^=data]').each(function (identifier) {
            var id = "img_" + identifier;
            $(this).attr('id', id);
            var addData = {
                imageContent: JSON.stringify($(this).attr('src')),
                id: id
            };

            app.ejecutar('cargarImagen', addData);
        });
    };
    var actualizarImagen = function (id, filename) {
        var ruta = "/public/images/articulo/" + filename;
        $("#" + id).attr("src", ruta);
//        var contenido = $('.text-editor-box .editionbox').html();
//        contenido = contenido.replace($("#" + id)[0].outerHTML, '<div style="width:200px;height:200px;resize:both;">' + $("#" + id)[0].outerHTML + '</div>');
//        $('.text-editor-box .editionbox').html(contenido);
    };


    var removerEstilos = function () {
        var texto = $('.text-editor-box .editionbox').html();
        var regex = /style="[\s\S]+?"/gm;
        texto = texto.replace(regex, '');
        $('.text-editor-box .editionbox').html(texto);
        actualizarEditorTextarea();
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

    var TextEditorTools = function () {
        var editor = $(".text-editor-box .editionbox");
        var selection = undefined;
        var attachEvents = function () {
            events = new eventCollection();
            var toolBox = $('.text-editor-box .toolbox');
            toolBox.find('.icon').each(function () {
                switch ($(this).attr('id')) {
                    case "icon-h2":
                        $(this).on('mousedown', events.h2Event);
                        break;
                    case "icon-h3":
                        $(this).on('mousedown', events.h3Event);
                        break;
                    case "icon-i":
                        $(this).on('mousedown', events.iEvent);
                        break;
                    case "icon-b":
                        $(this).on('mousedown', events.bEvent);
                        break;
                    case "icon-sup":
                        $(this).on('mousedown', events.supEvent);
                        break;
                }
            });
            editor.on('mouseup', events.editorSelect);

        };

        var eventCollection = function () {
            this.h2Event = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                insertTag('h2');
            };
            this.h3Event = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                insertTag('h3');
            };
            this.iEvent = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                insertTag('i');
            };
            this.bEvent = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                insertTag('b');
            };
            
            this.supEvent = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                insertTag('sup');
            };

            this.editorSelect = function (event) {
                selection = window.getSelection();
            };
        };

        var insertTag = function (tag) {
            //var newContent = '<' + tag + '>' + selection.toString() + '</' + tag + '>';
            //console.log(newContent);
            var node = document.createElement(tag);
            var content = document.createTextNode(selection.toString());
            node.appendChild(content);
            var sel, range;
            if (selection) {
                sel = selection;
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(node);
                }
            }
        };

        var inicializar = function () {
            attachEvents();
        };
        inicializar();
    };

};

var ModuleFunctions = function (modulo) {

};

var ModuleEvents = function (modulo) {
    this.onPasteTriggered = function (e) {
        if (typeof e.clipboardData !== 'undefined') {
            var copiedData = e.clipboardData.items[0]; //Get the clipboard data

            /*If the clipboard data is of type image, read the data*/
            if (copiedData.type.indexOf("image") === 0) {
                var imageFile = copiedData.getAsFile();

                /*We will use HTML5 FileReader API to read the image file*/
                var reader = new FileReader();

                reader.onload = function (evt) {
                    var result = evt.target.result; //base64 encoded image

                    /*Create an image element and append it to the content editable div*/
                    var img = document.createElement("img");
                    img.src = result;
                    $('.text-editor-box .editionbox').append(img);
                };

                /*Read the image file*/
                reader.readAsDataURL(imageFile);
            }
        }
    }
};
