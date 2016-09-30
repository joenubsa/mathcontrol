$(function () {
    modulo = new Modulo();
    modulo.inicializarFormulario();
});

var Application = function (modulo) {
    var modulo = modulo;
    var module = modulo.getModule();
    var cargarEventosGenerales = function () {
        $('#cmdNuevo,#cmdCancelar').on('click', function () {
            $(this).parents('form')[0].reset();
        });
        $('#cmdEliminar').on('click', function () {
            if ($('#emp_conse').val() === '') {
                alert('Debe seleccionar un registro para poder editarlo.');
                return false;
            }
            if (!confirm("Está seguro de que desea eliminar el registro?")) {
                return false;
            }
            borrar();
            return true;
        });

        modulo.getFormulario().on('submit', function () {
            if ($('#id').val() === '') {
                guardar();
            } else {
                editar();
            }
            return false;
        });
    };

    var consultar = function (_conse, llenar, campo, params) {
        llenar = llenar || 'activo';
        _conse = _conse || null;
        params = params || null;
        var args = "&accion=consultar";
        args += "&tipo=" + llenar;
        if (_conse) {
            args += "&_conse=" + _conse;
        }
        args += "&modulo=" + module;
        if (params) {
            args += "&params=" + JSON.stringify(params);
        }
        new $.ajax({
            type: 'post',
            data: modulo.getFormulario().serialize() + args,
            dataType: 'json',
            url: 'index.php',
            success: function (respuesta) {
                switch (respuesta.returned) {
                    case "ok" || true:
                        alert("Registro procesado correctamente");
                        break;
                    case "error":
                        alert("Error crítico: " + respuesta.content);
                        break;
                    case "data":
                        switch (llenar) {
                            case "activo":
                                cargarTabla(respuesta.content);
                                break;
                            case "formulario":
                                cargarFormulario(respuesta.content);
                                break;
                            default:
                                modulo.procesarConsulta(respuesta, campo);
                                break;
                        }
                        try {
                            modulo.postConsulta(llenar, campo, _conse, respuesta);
                        } catch (e) {
                        }
                        break;
                    default:
                        alert(respuesta.content);
                        break;
                }
            },
            error: function (error) {
                console.log('error:\r\n');
                console.log(error.responseText);
            }
        });
    }
    ;
    this.consultar = consultar;

    var cargarTabla = function (r, rc, inputOption, defaultInputOptionListener) {
        defaultInputOptionListener = defaultInputOptionListener === undefined ? true : defaultInputOptionListener === true ? true : false;
        rc = rc || modulo.getResultContainer();
        inputOption = inputOption === undefined ? 'radio' : inputOption;        
        var tabla = $('#' + rc);
        tabla.find('tbody').empty();
        var resultset = r;
        if (!resultset) {
            console.log("Error de datos en la carga de la tabla");
            return false;
        }
        if (resultset.length === 0 || !resultset) {
            var tr = $('<tr>').appendTo(tabla);
            $('<td colspan=99>').html("No se encontraror registros").appendTo(tr);
            return true;
        }
        for (var i in resultset) {
            var tr = $('<tr>').appendTo(tabla);
            for (var k in resultset[i]) {
                $('<td>').html(resultset[i][k]).appendTo(tr);
            }
        }

        if (inputOption) {
            tabla.find('tbody tr').each(function () {
                var celdaID = $(this).find('td').eq(0);
                var radio = $('<input>').attr('type', inputOption).attr('name', rc + '_conse').attr('value', celdaID.html());
                if (defaultInputOptionListener) {
                    radio.on('click', function () {
                        $('#id').val($(this).val());
                        consultar($(this).val(), 'formulario');
                    });
                }
                celdaID.html(radio);
            });
        }

        try {
            modulo.onCargaTabla(rc);
        } catch (e) {
        }

    };
    this.cargarTabla = cargarTabla;

    this.cargarSelect = function (inputStr, r, s) {
        var inputStr = inputStr;
        var input = $('#' + inputStr);
        s = s || true;
        input.empty();

        if (s) {
            $('<option>').html("Seleccione").attr('value', '').appendTo(input);
        }

        var resultset = r;
        if (resultset.length === 0) {
            $('<option>').html("No se encontraror registros").appendTo(input);
            return true;
        }

        for (var i in resultset.content) {
            $('<option>').html(resultset.content[i]['html']).attr('value', resultset.content[i]['id']).appendTo(input);
        }
    }
    ;

    var cargarFormulario = function (r) {
        modulo.cargarFormulario(r);
        try {
            modulo.onCargarFormulario(r);
        } catch (e) {

        }
    };

    this.ejecutar = function (evento, addData, formulario) {
        var args = "accion=ejecutar";
        args += "&modulo=" + module;
        args += "&evento=" + evento;
        var evento = evento;
        for (var i in addData) {
            args += "&" + i + "=" + addData[i];
        }
        $.ajax({
            type: 'post',
            data: formulario ? formulario.serialize() + '&' + args : '' + args,
            dataType: 'json',
            url: 'index.php',
            success: function (respuesta) {
                switch (respuesta.returned) {
                    case "ok":
                        alert(respuesta.content);
                        try {
                            modulo.ejecutarAfterOk();
                        } catch (e) {
                        }
                        break;
                    case "data":
                        modulo.procesarConsulta(respuesta, 'result_', evento);
                        break;
                    case "error":
                        alert("Error crítico: " + respuesta.content);
                        break;
                }
            },
            error: function (error) {
                console.log('error:\r\n');
                console.log(error.responseText);
            }
        });
        return true;
    };

    var guardar = function () {
        var args = "&accion=guardar";
        args += "&modulo=" + module;
        $.ajax({
            type: 'post',
            data: modulo.getFormulario().serialize() + args,
            dataType: 'json',
            url: 'index.php',
            success: function (respuesta) {
                switch (respuesta.returned) {
                    case "ok":
                        alert("Registro guardado correctamente");
                        modulo.getFormulario()[0].reset();
                        break;
                    case "id":
                        modulo.getFormulario()[0].reset();
                        consultar();
                        break;
                    default:
                        alert(respuesta.content);
                        break;
                }
            },
            error: function (error) {
                console.log('error:\r\n');
                console.log(error.responseText);
            }
        });
        return true;
    };

    var editar = function () {
        var args = "&accion=editar";
        args += "&modulo=" + module;
        $.ajax({
            type: 'post',
            data: modulo.getFormulario().serialize() + args,
            dataType: 'json',
            url: 'index.php',
            success: function (respuesta) {
                switch (respuesta.returned) {
                    case "ok":
                        alert("Registro editado correctamente");
                        consultar();
                        modulo.getFormulario()[0].reset();
                        break;
                    default:
                        alert(respuesta.content);
                        break;
                }
            },
            error: function (error) {
                console.log('error:\r\n');
                console.log(error.responseText);
            }
        });
        return true;
    };

    var borrar = function () {
        var args = "&accion=borrar";
        args += "&modulo=" + module;
        $.ajax({
            type: 'post',
            data: modulo.getFormulario().serialize() + args,
            dataType: 'json',
            url: 'index.php',
            success: function (respuesta) {
                switch (respuesta.returned) {
                    case "ok":
                        alert("Registro borrado correctamente");
                        consultar();
                        modulo.getFormulario()[0].reset();
                        break;
                    default:
                        alert(respuesta.content);
                        break;
                }
            },
            error: function (error) {
                console.log('error:\r\n');
                console.log(error.responseText);
            }
        });
        return true;
    };

    this.crearFechaSelector = function (campo) {
        $('.FechaSelector').remove();
        var cont = $('<div>').attr('class', 'FechaSelector');
        var comAnyo = $('<select>').appendTo(cont).on('change', function () {
            comMes.trigger('change');
        });
        var comMes = $('<select>').appendTo(cont).on('change', function () {
            comDia.empty();
            var v = $(this).val();
            if (v === '1' || v === '3' || v === '5' || v === '7' || v === '8' || v === '10' || v === '12') {
                for (var i = 1; i <= 31; i++) {
                    $('<option>').attr('value', i).html(i).appendTo(comDia);
                }
            } else if (v === '2') {
                if (comAnyo.val() % 4 === 0) {
                    for (var i = 1; i <= 29; i++) {
                        $('<option>').attr('value', i).html(i).appendTo(comDia);
                    }
                } else {
                    for (var i = 1; i <= 28; i++) {
                        $('<option>').attr('value', i).html(i).appendTo(comDia);
                    }
                }
            } else {
                for (var i = 1; i <= 30; i++) {
                    $('<option>').attr('value', i).html(i).appendTo(comDia);
                }
            }
        });
        var comDia = $('<select>').appendTo(cont);
        for (var i = 2017; i >= 1900; i--) {
            $('<option>').attr('value', i).html(i).appendTo(comAnyo);
        }
        for (var i = 1; i <= 12; i++) {
            $('<option>').attr('value', i).html(i).appendTo(comMes);
        }
        $('<button>').attr('type', 'button').html('Aceptar').appendTo(cont).on('click', function () {
            $(campo).val(comAnyo.val() + '-' + (+comMes.val() < 10 ? '0' + comMes.val() : comMes.val()) + '-' + (+comDia.val() < 10 ? '0' + comDia.val() : comDia.val()));
            cont.fadeOut({complete: function () {
                    cont.remove();
                }});
        });
        $(campo).prop('readonly', true);
        comAnyo.trigger('change');
        cont.appendTo($(campo).parents('label'));

        if ($(campo).val() !== '') {
            var v = $(campo).val();
            var f = v.split('-');
            comAnyo.val('' + (+f[0]));
            comMes.val('' + (+f[1]));
            comMes.trigger('change');
            comDia.val('' + (+f[2]));
        } else {
            comAnyo.val('' + new Date().getFullYear());
            comMes.val('' + (new Date().getMonth() + 1));
            comMes.trigger('change');
            comDia.val('' + new Date().getDate());
        }
    };

    this.crearHoraSelector = function (campo) {
        $('.HoraSelector').remove();
        var cont = $('<div>').attr('class', 'HoraSelector');
        var comHora = $('<select>').appendTo(cont).css({'width': '50px', 'display': 'inline-block'});
        for (i = 0; i <= 24; i++) {
            $('<option>').attr('value', i).html(i).appendTo(comHora);
        }
        var comMinuto = $('<select>').appendTo(cont).css({'width': '50px', 'display': 'inline-block'});
        for (i = 0; i < 60; i++) {
            if (i % 5 === 0) {
                $('<option>').attr('value', i).html(i).appendTo(comMinuto);
            }
        }
        $('<button>').attr('type', 'button').html('Aceptar').appendTo(cont).on('click', function () {
            $(campo).val((+comHora.val() < 10 ? '0' + comHora.val() : comHora.val()) + ':' + (+comMinuto.val() < 10 ? '0' + comMinuto.val() : comMinuto.val()));
            cont.fadeOut({complete: function () {
                    cont.remove();
                }});
        });
        $(campo).prop('readonly', true);
        cont.appendTo($(campo).parents('label'));
        if ($(campo).val() !== '') {
            var v = $(campo).val();
            var f = v.split(':');
            comHora.val('' + (+f[0]));
            comMinuto.val('' + (+f[1]));
        }
    };
    this.getVars = function(varname){
        var varsString = document.location.search.substr(1);
        var vars = varsString.split('&');
        for (var i in vars){
            vars[i] = [vars[i].substr(0, vars[i].indexOf('=')), vars[i].substr(vars[i].indexOf('=') + 1)];
        }
        if (varname){
            for (var i in vars){
                if (vars[i][0] === varname){
                    return vars[i][1];
                }
            }
            return undefined;
        }
        return vars;        
    };
    
    cargarEventosGenerales();
};

var Archivero = function (input, dir, exten, prefijo, module) {
    $('<div>').attr('class', 'boton_carga').html('Elegir...').appendTo($('#' + input).parent());
    var fechaMarca = new Date().getFullYear() + '' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()) + '' + (new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()) + '' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()) + '' + (new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds());
    $('#' + input).attr('readonly', true);
    $('#' + input).attr('class', 'boton_carga_campo');
    var prefijo = prefijo ? prefijo + '_' + fechaMarca + '_' : fechaMarca + '_';
    var divboton = $('#' + input).siblings('div.boton_carga')[0];
    var extOpc, extStr = '';
    if (exten) {
        extOpc = exten.split(';')
        var extOpc = exten.split(';');
        var extStr = '';
        for (var k in extOpc) {
            extStr += ' .' + extOpc[k] + ',';
        }
        extStr = extStr.substr(0, extStr.length - 1);
    }

    new AjaxUpload(divboton, {
        action: 'index.php',
        onSubmit: function (file, ext) {
            if (exten && extOpc.indexOf(ext.toString()) < 0) {
                alert('Error: Solo se permiten archivos los formatos:' + extStr);
                return false;
            } else {
                $(divboton).html('Cargando');
                this.disable();
            }
        },
        data: {
            destino: dir,
            pfx: prefijo,
            accion: 'cargarArchivo',
            modulo: module
        },
        onComplete: function (file, response) {
            if (response !== 'error') {
                $(divboton).html('Elegir...');
                this.enable();
                $('#' + input).val(response);
                $('#' + input).on('click', function () {
                    window.open(dir + '/' + response, '_blank');
                });
            } else {
                alert('No se ha podido cargar el archivo. Contactese con el administrador del sistema.');
                this.enable();
            }
        }
    });
};

var TextEditorEngine = function (modulo, editor, carpeta) {
    /*
     * 1. registrar como objeto enviando modulo, editor, carpeta y activar
     * 2. registrar listeners: ej onCargarFormulario para que cuando cambie el contenido del textbox tambien lo haga el editor
     * 3. registrar el procesar consulta
     * 4. metalo al microondas
     * 5. sirvase al gusto
     * 
     */
    if (!modulo) {
        console.log("TextEditor: Requiere un modulo.");
        return false;
    }
    if (!editor) {
        console.log("TextEditor: Requiere un objeto.");
        return false;
    }
    var app = modulo.getApp();
    var agregarEventos = function () {

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

        $('.text-editor-box .editionbox').on('paste', function () {
            setTimeout(function () {
                removerEstilos()
            }, 300);
        });
        if (document.addEventListener) {
            document.addEventListener('paste', alPegar, false);
        }
    };

    var alPegar = function (e) {
        if (typeof e.clipboardData !== 'undefined') {
            var copiedData = e.clipboardData.items[0];
            if (copiedData.type.indexOf("image") === 0) {
                var imageFile = copiedData.getAsFile();
                var reader = new FileReader();
                reader.onload = function (evt) {
                    var result = evt.target.result;
                    var img = document.createElement("img");
                    img.src = result;
                    $('.text-editor-box .editionbox').append(img);
                };
                reader.readAsDataURL(imageFile);
            }
        }
    };

    var TextEditorTools = function () {
        var selection = undefined;
        var attachEvents = function () {
            var events = new eventCollection();
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
                    case "icon-clearscreen":
                        $(this).on('mousedown', events.clearscreenEvent);
                        break;
                    case "icon-removetags":
                        $(this).on('mousedown', events.removetagsEvent);
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
            
            this.clearscreenEvent = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                $(".text-editor-box .editionbox").html('');
            };
            
            this.removetagsEvent = function (event) {
                $(".text-editor-box .editionbox")[0].focus();
                event.preventDefault();
                var findTags = /<(?!img|br|p)\/?.*?>/g;                
                var texto = $(".text-editor-box .editionbox").html();
//                console.log(texto.match(findTags));
//                return true;
                var texto = texto.replace(findTags, '');
                $('div.text-editor-box .editionbox').html(texto);
            };

            this.editorSelect = function (event) {
                selection = window.getSelection();
            };
        };

        var insertTag = function (tag) {
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

    var actualizarEditorTextarea = function () {
        var contenidoActual = $('div.text-editor-box .editionbox').html();
        var nuevoContenido = procesarContenido(nuevoContenido);
        $('div.text-editor-box textarea').val(contenidoActual);
    };

    var procesarContenido = function (contenido) {
        var editor = $('div.text-editor-box .editionbox');
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
    this.actualizarImagen = function (id, filename) {
        var ruta = "/public/images/" + carpeta + "/" + filename;
        $("#" + id).attr("src", ruta);
//        var contenido = $('.text-editor-box .editionbox').html();
//        contenido = contenido.replace($("#" + id)[0].outerHTML, '<div style="width:200px;height:200px;resize:both;">' + $("#" + id)[0].outerHTML + '</div>');
//        $('.text-editor-box .editionbox').html(contenido);
    };

    var removerEstilos = function () {
        var texto = $('div.text-editor-box .editionbox').html();
        var regex = /style="[\s\S]+?"/gm;
        texto = texto.replace(regex, '');
        $('div.text-editor-box .editionbox').html(texto);
        actualizarEditorTextarea();
    };
    
    this.actualizarEditor = function(){
        editor.html(editor.siblings('textarea').val());
    };

    this.activar = function () {
        agregarEventos();
        new TextEditorTools();
    };
};