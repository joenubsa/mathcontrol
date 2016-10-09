var Modulo = function () {
    var resultContainer = 'tblProgreso';
    var formulario = $('#progreso');
    var module = "progreso";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);
    this.ModuleFunctions = moduleFunctions;
    this.inicializarFormulario = function () {
        $('#id').hide();
        $('#cmdIniciarPrueba, .cuestionario-container').hide();
        inicializarEventos();
        //app.consultar();
    };

    var inicializarEventos = function () {
        $('.modulo-icon').on('click', moduleEvents.accionesModulo);
        $('#cmdResumen').on('click', function () {
            document.location = "/?modulo=temario";
        });
        $('#cmdAvanzar').on('click', function () {
            moduleFunctions.avanzarAction();
            $("#cmdMod_1").trigger('click');
            $("body").animate({ scrollTop: 0 }, 1000);
            
        });
        $('#cmdTerminarPrueba').on('click', function(){
            moduleFunctions.finalizarCuestionario();
        });

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
                moduleFunctions.verificarCuestionario(r.content[0].id);
                break;
            case "verificar_cuestionario":
                if (r.content.length > 0){
                    $('#cmdIniciarPrueba').show();
                    $('#cmdIniciarPrueba').on('click', function(){
                        moduleFunctions.renderizarCuestionario(r.content[0]);
                    });
                }
                break;
            case "traer_cuestionario":
                //moduleFunctions.renderizarCuestionario(r.content[0]);
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
    this.getApp = function () {
        return app;
    };
};

var ModuleFunctions = function (modulo) {
    var app;
    this.consultarArticulo = function (moduloId) {
        app = modulo.getApp();
        var args = {
            modulo: moduloId
        };
        app.consultar(null, 'articulo_actual', 'articulo_actual', args);
    };
    
    this.verificarCuestionario = function (articulo_id) {
        app = modulo.getApp();
        var args = {
            articulo_id: articulo_id
        };
        app.consultar(null, 'verificar_cuestionario', 'verificar_cuestionario', args);
    };

    this.consultarCuestionario = function (articulo_id) {
        app = modulo.getApp();
        var args = {
            articulo_id: articulo_id
        };
        app.consultar(null, 'traer_cuestionario', 'traer_cuestionario', args);
    };

    this.renderizarArticulo = function (r) {
        $('.progreso_articulo-container input[name=articulo_id]').val(r.id);
        $('.progreso_articulo-container .titulo').html(r.nombre);
        $('.progreso_articulo-container .cuerpo').html(r.descripcion);
    };

    this.renderizarCuestionario = function (r) {
        $('.cuestionario-container').show();
        var preguntasCollection = JSON.parse(r.cuerpo);
        var cantidadPreguntas = preguntasCollection.length;
        var seleccion = [];
        for (var i = 0; i < 10; i++) {
            var seRepite = false;
            do {
                seRepite = false;
                var pregSeleccionada = Math.floor((Math.random() * cantidadPreguntas));
                for (var k in seleccion) {
                    if (seleccion[k] === pregSeleccionada) {
                        seRepite = true;
                    }
                }
                if (!seRepite) {
                    seleccion [i] = pregSeleccionada;
                }
            } while (seRepite);
        }

        var contenedorMaestro = $('.cuestionario .pregunta:first-child').clone();
        $('.cuestionario').attr('data-id', r.id);
        $('.cuestionario .pregunta').remove();
        for (var i in seleccion) {
            var preguntaHTML = contenedorMaestro.clone();
            var pregunta = preguntasCollection[seleccion[i]];
            $('.cuestionario').append(preguntaHTML);
            preguntaHTML.attr('data-id', pregunta.id);
            preguntaHTML.find('.texto').html(decodeURI(pregunta.texto));
            preguntaHTML.find('.respuestas').html(pregunta.respuestas);
            var respuestasOl = $('<ol>').attr('type', 'a');
            for (var k in pregunta.respuestas) {
                var respuesta = pregunta.respuestas[k];
                var label = $('<label>');
                var input = $('<input>').attr('type', 'radio').attr('data-validate', respuesta.correcta).attr('name', 'pregunta_' + pregunta.id).val(respuesta.id);
                label.append(input);
                $('<span>').html(decodeURI(respuesta.texto)).appendTo(label);
                $('<li>').append(label).appendTo(respuestasOl);
            }
            respuestasOl.appendTo(preguntaHTML.find('.respuestas'));
        }
    };

    this.avanzarAction = function () {
        app = modulo.getApp();
        var args = {
            articulo_id: $('input[name=articulo_id]').val()
        };
        app.ejecutar('avanzarAction', args);
    };

    this.finalizarCuestionario = function () {
        var respuestas = {
                id: $('.cuestionario').data('id'),
                cuerpo: []
        };
        var sinCompletar = false;
        $('.cuestionario').find('.pregunta').each(function () {
            var respuestaInput = $(this).find('input:checked');
            if (!respuestaInput.val() || respuestaInput.val() === '') {
                sinCompletar = true;
            } else {
                respuestas.cuerpo.push({
                    id: $(this).data('id'),
                    rta_id: respuestaInput.val(),
                    rta_validate: respuestaInput.data('validate')
                });
            }
        });

        if (sinCompletar) {
            alert('Debes completar el cuestionario antes de enviarlo');
            return false;
        }

        var args = {
            cuestionario_id: $('.cuestionario').data('id'),
            respuestas : JSON.stringify(respuestas)
        };
        app.ejecutar('terminarPruebaAction', args);
    };

};

var ModuleEvents = function (modulo) {
    this.accionesModulo = function (event) {
        var moduloId = $(event.target).attr('id');
        modulo.ModuleFunctions.consultarArticulo(moduloId);
    };

};
