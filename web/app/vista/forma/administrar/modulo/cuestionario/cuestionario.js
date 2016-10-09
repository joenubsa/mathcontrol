var Modulo = function () {
    var resultContainer = 'tblCuestionario';
    var formulario = $('#cuestionario');
    var module = "administrar_cuestionario";
    var cuestionarioPanel;
    var textEditorEngine = null;
    this.inicializarFormulario = function () {
        $('#id, #cuerpo').hide();
        app.consultar();
        app.consultar(null, 'articulo_id', 'articulo_id');
        inicializarEventos();
        cuestionarioPanel = new CuestionarioPanel();
        textEditorEngine = new TextEditorEngine(this, $('.text-editor-box .editionbox'), 'cuestionario');
        textEditorEngine.activar();
        $('#icon-green, #icon-blue, #icon-red, #icon-h2, #icon-h3').remove();
    };

    var inicializarEventos = function () {
        $('#agregarPregunta').on('click', function () {
            cuestionarioPanel.AgregarPregunta();
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
        $('#descripcion').val(valores[0]['descripcion']);
        $('#cuerpo').val(valores[0]['cuerpo']);
        $('#respuestaCorrecta').val(valores[0]['respuestaCorrecta']);
        $('#articulo_id').val(valores[0]['articulo_id']);
    };

    this.onCargarFormulario = function (r) {
        cuestionarioPanel.generarDOM();
        textEditorEngine.actualizarEditor();
    };

    this.procesarConsulta = function (r, c) {
        switch (c) {
            case "articulo_id":
                app.cargarSelect('articulo_id', r);
                break;
            case "result_":
                switch (r.content.type) {
                    case "cargarImagen":
                        textEditorEngine.actualizarImagen(r.content.id, r.content.link)
                        break;
                }
        }
    };

    var app = new Application(this);
    this.getApp = function () {
        return app;
    };

    this.onCargaTabla = function (c) {
        switch (c) {

        }
    };

    var CuestionarioPanel = function () {
        var PanelCuerpo = $('.PanelCuerpo');
        var respuestaLabel = ['A', 'B', 'C', 'D', 'E'];
        var PanelRespuestaDiv = $('.PanelRespuesta').clone();
        PanelRespuestaDiv.find('.agregarRespuesta').on('click', function () {
            cuestionarioPanel.AgregarRespuesta(this);
        });
        PanelRespuestaDiv.find('.Quitar').on('click', function () {
            quitarPregunta(this);
            $(this).parents('.PanelRespuesta').remove();
        });
        $('.PanelRespuesta').remove();
        this.AgregarPregunta = function () {
            var panelRespuesta = PanelRespuestaDiv.clone(true);
            panelRespuesta.appendTo('.PanelCuerpo .Preguntas');
            var idPregunta = PanelCuerpo.find('.PanelRespuesta').length;
            panelRespuesta.find('.preguntaIdLabel').html(idPregunta);
            panelRespuesta.find('.preguntaTexto').html($('#textoPregunta').val());
            ActualizarCuerpo();
            $('#textoPregunta').val('');
            $(".PanelCuerpo .Preguntas").animate({ scrollTop: $(".PanelCuerpo .Preguntas").get(0).scrollHeight }, 1000);
            $('#textoPregunta').siblings('.editionbox').html('');
        };

        this.AgregarRespuesta = function (sender, respuesta) {
            var tabla = getTabla(sender);
            var texto = $(sender).parents('.PanelRespuesta').find('.textoRespuesta').val();
            if (respuesta) {
                texto = decodeURI(respuesta.texto);
            }
            var row = $('<tr>');
            var indice = tabla.find('tbody tr').length;
            if (indice >= respuestaLabel.length) {
                alert("No puedes agregar más respuestas");
                return false;
            }
            if (respuesta) {
                $('<td>').html(respuesta.id).appendTo(row).parents('tr').attr('class', (respuesta.correcta ? 'correcta' : false));
            } else {
                $('<td>').html(respuestaLabel[indice]).appendTo(row);
            }

            $('<td>').html(texto).appendTo(row);
            var accionesTd = $('<td>').appendTo(row);
            $('<span>').attr('class', 'accion').html('Quitar').appendTo(accionesTd).on('click', function () {
                quitarRespuesta($(this).parents('tr'));
            });
            $('<span>').attr('class', 'accion').html('Correcta').appendTo(accionesTd).on('click', function () {
                $(this).parents('tr').siblings().each(function () {
                    $(this).removeAttr('class');
                });
                $(this).parents('tr').attr('class', 'correcta');
                ActualizarCuerpo();
            });
            tabla.find('tbody').append(row);
            $(sender).parents('.PanelRespuesta').find('.textoRespuesta').val('');
            $(sender).parents('.PanelRespuesta').find('.textoRespuesta')[0].focus();
            if (!respuesta) {
                ActualizarCuerpo();
                $(".PanelCuerpo .Preguntas").animate({ scrollTop: $(".PanelCuerpo .Preguntas").get(0).scrollHeight }, 1000);
            }
        };

        var quitarPregunta = function (sender) {
            $(sender).parents('.PanelRespuesta').remove();
            PanelCuerpo.find('.PanelRespuesta').each(function (indice) {
                var i = indice + 1;
                $(this).find('.preguntaIdLabel').html(i);
            });
            ActualizarCuerpo();
        };

        var quitarRespuesta = function (row) {
            var tabla = getTabla(row);
            row.remove();
            tabla.find('tbody tr').each(function (indice) {
                $(this).find('td').eq(0).html(respuestaLabel[indice]);
            });
            ActualizarCuerpo();
        };

        var ActualizarCuerpo = function () {
            var Cuestionario = [];
            var panel = $('.PanelCuerpo .Preguntas .PanelRespuesta');
            panel.each(function () {
                var idPregunta = $(this).find('.preguntaIdLabel').html();
                var textoPregunta = encodeURI($(this).find('.preguntaTexto').html());

                var Respuestas = [];
                $(this).find('.tblRespuestas tbody tr').each(function () {
                    var correcta = $(this).is('.correcta');
                    Respuestas.push({
                        id: $(this).find('td').eq(0).html(),
                        texto: encodeURI($(this).find('td').eq(1).html()),
                        correcta: correcta
                    });
                });
                var Pregunta = {
                    id: idPregunta,
                    texto: textoPregunta,
                    respuestas: Respuestas
                };
                Cuestionario.push(Pregunta);
            });
            var CuestionarioString = JSON.stringify(Cuestionario);
            $('#cuerpo').val(CuestionarioString);
        };

        var getTabla = function (objeto) {
            return $(objeto).parents('.PanelRespuesta').find('.tblRespuestas');
        };

        this.generarDOM = function () {
            $('.PanelRespuesta').each(function (id) {
                if (id >= 0) {
                    $(this).remove();
                }
            });
            var Cuestionario = null;
            try {
                Cuestionario = JSON.parse($('#cuerpo').val());
            } catch (e) {
                console.log("Cues json no parse");
                return false;
            }

            for (var i in Cuestionario) {
                var panelRespuesta = PanelRespuestaDiv.clone(true);
                panelRespuesta.appendTo('.PanelCuerpo .Preguntas');
                var id = Cuestionario[i].id;
                var texto = decodeURI(Cuestionario[i].texto);
                var respuestas = Cuestionario[i].respuestas;
                panelRespuesta.find('.preguntaIdLabel').html(id);
                panelRespuesta.find('.preguntaTexto').html(texto);
                var tabla = panelRespuesta.find('.tblRespuestas');
                for (var k in respuestas) {
                    this.AgregarRespuesta(tabla, respuestas[k]);
                }

            }
        };
    };
};
