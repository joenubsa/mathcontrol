var Modulo = function () {
    var resultContainer = 'tblProgreso';
    var formulario = $('#progreso');
    var module = "progreso";
    var moduleFunctions = new ModuleFunctions(this);
    var moduleEvents = new ModuleEvents(this);
    var cuestionarioOriginal = null;
    var foroOriginal = null;
    this.ModuleFunctions = moduleFunctions;
    this.inicializarFormulario = function () {
        $('#id').hide();
        $('#cmdIniciarPrueba, .cuestionario-container, .foro-container, #cmdVerForo').hide();
        inicializarEventos();
        moduleFunctions.validarModulosCondicionados();
        new Archivero('foro_adjunto', 'images/foro', 'jpg;png', null, module);
        cuestionarioOriginal = $('.cuestionario-container').html();
        foroOriginal = $('.foro-container').html();
        //app.consultar();
    };

    var inicializarEventos = function () {
        $('.modulo-icon').on('click', moduleEvents.accionesModulo);
        $('#cmdResumen').on('click', function () {
            document.location = "/?modulo=temario";
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

    this.procesarConsulta = function (r, c, e) {
        switch (c) {
            case "articulo_actual":
                moduleFunctions.renderizarArticulo(r.content[0]);
                moduleFunctions.verificarCuestionario(r.content[0].id);
                moduleFunctions.verificarForo(r.content[0].id);
                break;
            case "verificar_cuestionario":
                if (r.content.length > 0) {
                    if (+r.content[0].esEntrenamiento === 1) {
                        $('#cmdIniciarPrueba').html('Entrenamiento');
                    } else {
                        $('#cmdIniciarPrueba').html('Iniciar Prueba');
                    }
                    $('#cmdIniciarPrueba').show();
                    $('#cmdIniciarPrueba').on('click', function () {
                        moduleFunctions.renderizarCuestionario(r.content[0]);
                    });
                } else {
                    $('#cmdIniciarPrueba').hide();
                    $('#cmdIniciarPrueba').off('click');
                    restartCuestionario();
                }
                break;
            case "verificar_foro":
                if (r.content.length > 0) {
                    $('#cmdVerForo').show();
                    $('#cmdVerForo').on('click', function () {
                        moduleFunctions.renderizarForo(r.content[0]);

                    });
                } else {
                    $('#cmdVerForo').hide();
                    $('#cmdVerForo').off('click');
                    restartForo();
                }
                break;
            case "traer_cuestionario":
                //moduleFunctions.renderizarCuestionario(r.content[0]);
                break;
            case "renderizar_menu":
                moduleFunctions.renderizarMenu(r.content);
                break;
            case "foro_social":
                moduleFunctions.renderizarForoSocial(r.content);
                break;
            case "result_":
                switch (e) {
                    case "validarModulosCondicionados":
                        if (r.content === true) {
                            $('.modulos .condicionados').show();
                        }
                        break;
                }
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

    var restartCuestionario = function () {
        $('.cuestionario-container').html(cuestionarioOriginal).hide();
    };

    var restartForo = function () {
        $('.foro-container').html(foroOriginal).hide();
    };

    var app = new Application(this);
    this.getApp = function () {
        return app;
    };
};

var ModuleFunctions = function (modulo) {
    var app;
    this.consultarArticulo = function (moduloId, articuloId) {
        app = modulo.getApp();
        articuloId = (articuloId || false);
        var args = {
            modulo: moduloId,
            mostraractual: articuloId
        };
        app.consultar(null, 'articulo_actual', 'articulo_actual', args);
        app.consultar(null, 'renderizar_menu', 'renderizar_menu', args);
    };

    this.verificarCuestionario = function (articulo_id) {
        app = modulo.getApp();
        var args = {
            articulo_id: articulo_id
        };
        app.consultar(null, 'verificar_cuestionario', 'verificar_cuestionario', args);
    };

    this.verificarForo = function (articulo_id) {
        app = modulo.getApp();
        var args = {
            articulo_id: articulo_id
        };
        app.consultar(null, 'verificar_foro', 'verificar_foro', args);
    };

    this.consultarCuestionario = function (articulo_id) {
        app = modulo.getApp();
        var args = {
            articulo_id: articulo_id
        };
        app.consultar(null, 'traer_cuestionario', 'traer_cuestionario', args);
    };

    this.renderizarArticulo = function (r) {
        app = modulo.getApp();
        console.log('articulo_id:' + r.id);
        $('.progreso_articulo-container input[name=articulo_id]').val(r.id);
        $('.progreso_articulo-container .titulo').html(r.nombre);
        $('.progreso_articulo-container .cuerpo .contenido').html(r.descripcion);
        $('.progreso_articulo-container .acciones .flujo').html('');
        $('.cuestionario-container').hide();
        if (r.sucesor_alternativo != null) {
            var etiquetas = r.nombre_opciones.split(';');
            $('<button>').attr('type', 'button').html(etiquetas[0]).appendTo('.progreso_articulo-container .acciones .flujo').on('click', function () {
                modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.sucesor_positivo);
            });
            $('<button>').attr('type', 'button').html(etiquetas[1]).appendTo('.progreso_articulo-container .acciones .flujo').on('click', function () {
                modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.sucesor_alternativo);
            });
            sessionStorage.articleBefore = r.id;
        } else {
            $('<button>').html('-> Continuar ->').attr('type', 'button').on('click', function () {
                modulo.ModuleFunctions.avanzarAction();
                $("#" + sessionStorage.currentModulo).trigger('click');
                $("body").animate({scrollTop: 0}, 1000);
            }).appendTo('.progreso_articulo-container .acciones .flujo');

            if (typeof sessionStorage.articleBefore !== 'undefined') {
                var articleBefore = sessionStorage.articleBefore;
                $('<button>').html('Ver otro método').attr('type', 'button').on('click', function () {
                    modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, articleBefore);
                }).appendTo('.progreso_articulo-container .acciones .flujo');
                delete sessionStorage.articleBefore;
            }
        }
    };

    this.renderizarCuestionario = function (r) {
        $('.cuestionario-container').show();
        var preguntasCollection = JSON.parse(r.cuerpo);
        var cantidadPreguntas = preguntasCollection.length;
        var esEntrenamiento = +r.esEntrenamiento;
        var seleccion = [];
        var numpreg = esEntrenamiento === 1 ? 1 : 10;
        if (cantidadPreguntas < numpreg) {
            numpreg = cantidadPreguntas;
        }
        for (var i = 0; i < numpreg; i++) {
            console.log(cantidadPreguntas);
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
            
            console.log(esEntrenamiento);
            var accionesPreguntaContainer = preguntaHTML.find('.preguntaacciones');
            if (esEntrenamiento === 1) {                
                accionesPreguntaContainer.empty();
                $('<button>').html('Pasos').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.pasos_id);
                });
                $('<button>').html('Ejercicios Modelo').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.modelo_id);
                });
                $('<button>').html('Ejercicio Resuelto').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.resuelto_id);
                });
                $('<button>').html('Ver mi resultado').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {});
                $('<button>').html('Otro Ejercicio').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.renderizarCuestionario(r);
                });
                $('<button>').html('Iniciar entrenamiento de problemas').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.renderizarCuestionario(r, true);
                });
                $('<button>').html('Iniciar Evaluación').attr('class', 'accion_entrenamiento').appendTo(accionesPreguntaContainer).on('click', function () {
                    modulo.ModuleFunctions.consultarArticulo(sessionStorage.currentModulo, r.evaluacion_id);
                });
            } else {
                accionesPreguntaContainer.empty();
            }
            respuestasOl.appendTo(preguntaHTML.find('.respuestas'));

        }
        $('.cuestionario-container .acciones').empty();
        if (!esEntrenamiento) {
            $('<button>').html('Terminar Prueba').appendTo('.cuestionario-container .acciones').on('click', function () {
                modulo.ModuleFunctions.finalizarCuestionario(esEntrenamiento);
            });
        } else {
            $('<button>').html('Terminar Entrenamiento').appendTo('.cuestionario-container .acciones').on('click', function () {
                modulo.ModuleFunctions.finalizarCuestionario(esEntrenamiento);
            });
        }
    };

    this.renderizarForo = function (r) {
        $('.foro-container').show();
        $('#foro_id').val(r.id);
        $('.foro-container .foro-titulo h3').html(r.nombre);
        $('.foro-container .foro-descripcion').html(r.descripcion);
        $('.foro-container foro_id').val(r.id);
        if (+r.id === 1) {
            $('.foro-container .juego').html('<iframe seamless="seamless" id="iframegame" scrolling="no" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" webkit-playsinline="true" src="http://cloudgames.com/games/html5/sudoku-village-en-s-iga-spil/index.html?gp=1&amp;siteid=86&amp;channelid=1&amp;siteLocale=es-ES&amp;spilStorageId=21148659664" style="width: 819.727px; height: 615px;" frameborder="0" height="751" width="1001.3333333333334"></iframe>');
        }
        $('#cmdGuardarForo').off('click');
        $('#cmdGuardarForo').on('click', function () {
            modulo.ModuleFunctions.guardarForo();
        });
        modulo.ModuleFunctions.consultarForoSocial();
    };

    this.avanzarAction = function () {
        app = modulo.getApp();
        var args = {
            articulo_id: $('input[name=articulo_id]').val()
        };
        app.ejecutar('avanzarAction', args);
    };

    this.validarModulosCondicionados = function () {
        app = modulo.getApp();
        app.ejecutar('validarModulosCondicionados');
    };

    this.finalizarCuestionario = function (esEntrenamiento) {
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

        if (sinCompletar && !esEntrenamiento) {
            alert('Debes completar el cuestionario antes de enviarlo');
            return false;
        } else {
            alert('Has completado el cuestionario satisfactoriamente');
            $('.cuestionario-container, .foro-container').hide();
        }

        var args = {
            cuestionario_id: $('.cuestionario').data('id'),
            respuestas: JSON.stringify(respuestas),
            esEntrenamiento: esEntrenamiento
        };
        app.ejecutar('terminarPruebaAction', args);
        this.validarModulosCondicionados();
    };

    this.renderizarMenu = function (r) {
        $('.progreso_articulo-container .cuerpo .menu').find('ul').remove();
        var menuhtml = $('<ul>').appendTo('.progreso_articulo-container .cuerpo .menu');
        var modulo = this;
        for (var i in r) {
            var item = r[i];
            $('<li>').attr('data-articulo', item.id).html(item.nombre).on('click', function () {
                var moduloId = sessionStorage.currentModulo;
                modulo.consultarArticulo(moduloId, $(this).data('articulo'));
            }).appendTo(menuhtml);
        }
    };

    this.guardarForo = function () {
        if ($('#foro_adjunto').val() === 'error' || $('#foro_adjunto').val() === '') {
            alert('Debes cargar una imágen para guardar tu aporte.');
            return false;
        }
        var args = {
            foro_id: $('#foro_id').val(),
            foro_adjunto: $('#foro_adjunto').val(),
            foro_texto: $('#foro_texto').val()
        };
        app.ejecutar('guardarForoAction', args);
    };

    this.consultarForoSocial = function () {
        app = modulo.getApp();
        var args = {
            foro_id: $('#foro_id').val()
        };
        app.consultar(null, 'foro_social', 'foro_social', args);
    };

    this.renderizarForoSocial = function (r) {
        $('.foro-social').empty();
        for (var i in r) {
            var registro = r[i];
            var contenedor = $('<div>').attr('class', 'foro-social-contenedor').appendTo('.foro-social');
            $('<div>').attr('class', 'foro-social-estudiante').html(registro.nombre_estudiante).appendTo(contenedor);
            var aporte = $('<div>').attr('class', 'foro-social-aporte');
            aporte.appendTo(contenedor);
            $('<div>').attr('class', 'foro-social-aporte-texto').html(registro.texto).appendTo(aporte);
            $('<img>').attr('src', 'public/images/foro/' + registro.adjunto).appendTo(aporte);
        }
    };


};

var ModuleEvents = function (modulo) {
    this.accionesModulo = function (event) {
        var moduloId = $(event.target).attr('id');
        modulo.ModuleFunctions.consultarArticulo(moduloId);
        modulo.ModuleFunctions.validarModulosCondicionados();
        sessionStorage.currentModulo = moduloId;
    };

};
