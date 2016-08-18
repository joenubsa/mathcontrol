var Modulo = function () {
    var resultContainer = 'tblPartidos';
    var formulario = $('#venta');
    var module = "venta";
    var contenedorPais = 'content_pais';
    var contenedorLiga = 'content_liga';
    var partidoSeleccionado = null;
    var apuesta_change_id = null;
    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar(null, 'pais', contenedorPais);
        cargarEventos();
    };

    var cargarEventos = function () {
        $('#cmdAgregarPartido').on('click', function () {
            if (+$('#valorApostar').val() !== 0 && !isNaN($('#valorApostar').val())) {
                $('#valorApostar').prop('readonly', true);
            }
            agregarPartidoTicketPreview();
        });
        $('#cmdGenerarTicket').on('click', function () {
            generarTicket();
        });
        $('.cmdReiniciarApuesta').on('click', function () {
            window.location = '/?modulo=venta';
        });
        $('input[name=equipoApuesta]').on('click', function () {
            switch ($(this).val()) {
                case "L":
                    $('#tblPartidosApuesta .valor_local').show();
                    $('#tblPartidosApuesta .valor_visita').hide();
                    break;
                case "V":
                    $('#tblPartidosApuesta .valor_local').hide();
                    $('#tblPartidosApuesta .valor_visita').show();
                    break;
            }
            $('#tblPartidosApuesta').find('tbody tr.valor_apuesta').find('td').html('0');
        });

    };

    var agregarPartidoTicketPreview = function () {
        if ($('input[name=tblPartidos_conse]:checked').length === 0) {
            alert("Por favor seleccione un partido");
            return false;
        }
        if (!$('input[name=equipoApuesta]:checked').val() || $('input[name=equipoApuesta]:checked').val() === '') {
            alert("Seleccione a qué equipo hace la apuesta: Local o Visitante");
            return false;
        }
        var inputPartido = $('input[name=tblPartidos_conse]:checked');
        var partido_id = partidoSeleccionado;
        if (!partidoSeleccionado) {
            partido_id = partidoSeleccionado = inputPartido.val();
        }
        var apuesta = 0;
        $('#tblPartidosApuesta').find('tbody tr.valor_apuesta').find('td').each(function () {
            apuesta += +$(this).html();
        });

        if (apuesta === 0) {
            alert('Debe escojer al menos un parámetro de apuesta y escribir el valor de la apuesta');
            return false;
        }

        var tabla = $('#ticketPreview').find('tbody.mainbody');
        var selectedPartido = $('<table>').append(inputPartido.parents('tr').clone());
        var equipos = "<strong>" + selectedPartido.find('td').eq(2).html() + '</strong> vs <strong>' + selectedPartido.find('td').eq(3).html() + "<strong>";
        equipos += '<span>' + $('input[name=equipoApuesta]:checked').siblings('.desc').html() + '</span>'
        equipos += ''
        var newParams = false;
        var equipoApuesta = $('input[name=equipoApuesta]:checked').val();
        var params = $('.apuesta_registro[data-apuesta_identifier="' + apuesta_change_id + '"]');
        apuesta_change_id = null;
        if (params.length === 0) {
var partidoExiste = false;
$('#ticketPreview').find('.apuesta_registro').each(function(){
if (+$(this).data('partido_id') === +partido_id){
partidoExiste = true;
}
});
if (partidoExiste){
alert('Este partido ya se encuentra en la apuesta, debe seleccionar otro.');
return false;
}
            params = $('<table>')
                    .attr('class', 'apuesta_registro')
                    .attr('data-partido_id', partido_id)
                    .attr('data-equipo_apuesta', $('input[name=equipoApuesta]:checked').val())
                    .append($('#tblPartidosApuesta').clone().html());
            newParams = true;
            params.find('.marca_preview').each(function () {
                var marcahtml = equipoApuesta === 'L' ? $(this).data('marca_local') : $(this).data('marca_visita');
                marcahtml = "(" + marcahtml + ")";
                $(this).html(marcahtml);
            });
        } else {
            params.append($('#tblPartidosApuesta').clone().html());
            
            params.find('.marca_preview').each(function () {
                var marcahtml = equipoApuesta === 'L' ? $(this).data('marca_local') : $(this).data('marca_visita');
                marcahtml = "(" + marcahtml + ")";
                $(this).html(marcahtml);
            });            
        }
        switch (equipoApuesta) {
            case "L":
                params.find('.valor_local').show();
                params.find('.valor_visita').remove();
                break;
            case "V":
                params.find('.valor_local').remove();
                params.find('.valor_visita').show();
                break;
        }
        params.find('.valor_local, .valor_visita').attr('class', 'factor');
        if (!newParams) {
            calcularApuesta();
            return false;
        }
        var fila = $('<tr>');
        var celda = $('<td>').appendTo(fila);
        $('<div>').appendTo(celda).css({'float': 'left'}).html(equipos);
        $('<a>').attr('data-partido_id', partido_id).html('Cambiar Jugada').css({'float': 'right'}).appendTo(celda).on('click', function () {
            partidoSeleccionado = $(this).data('partido_id');
            getMatchParams();
            var apuestaContainer = $(this).siblings('.apuesta_registro');
            apuestaContainer.empty();
            apuesta_change_id = apuestaContainer.data('apuesta_identifier');
        });
        if (newParams) {
            params.appendTo(celda);
        }

        fila.appendTo(tabla);


        $('.apuesta_registro').each(function (cont) {
            $(this).attr('data-apuesta_identifier', cont);
        });
        calcularApuesta();
        partidoSeleccionado = null;
        $('#apuesta')[0].reset();
    };
    var calcularApuesta = function () {
        var valorApuestaTotal = 0;
        $('.apuesta_registro tbody').each(function () {
            $(this).find('tr').eq(1).find('td').each(function () {
                valorApuestaTotal += +$(this).html();
            });
        });
        $('#valorApostadoTotal').val(valorApuestaTotal);
        $('#valorGeneralTotal').val(+$('#valorApostar').val() + valorApuestaTotal);
    }

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

    };


    this.procesarConsulta = function (r, c, e) {
        switch (r.returned) {
            case "data":
                var request = c.substr(0, c.indexOf('_'));
                switch (request) {
                    case 'content':
                        cargarContenedor(r, c);
                        break;
                    case 'result':
                        procesarResult(r, c, e);
                        break;
                    default:
                        app.cargarSelect(c, r);
                        break;
                }

                break;
        }
    };

    var cargarContenedor = function (r, c) {
        switch (c) {
            case contenedorPais:
                construirContenedorPaises(r);
                break;
            case contenedorLiga:
                construirContenedorLigas(r);
                break;
        }
    };

    var procesarResult = function (r, c, e) {
        switch (e) {
            case "getMatchParams":
                cargarParametrosPartido(r);
                break;
            case "generateTicket":
                activarImprimir(r)
                break;
        }
    };

    var construirContenedorPaises = function (r) {
        var content = r.content;
        var container = $('.venta_selector.paises');
        for (var i in content) {
            var imagen = $('<img>').attr('src', 'public/images/pais/' + content[i].imagen).attr('alt', content[i].html).attr('title', content[i].html).attr('class', 'selector_option_flag');
            var selectDiv = $('<div>').attr('id', contenedorPais + '_' + content[i].id).attr('class', 'selector_option');
            imagen.appendTo(selectDiv);
            selectDiv.on('click', opcionPaisOnclick);
            selectDiv.appendTo(container);
        }
    };

    var opcionPaisOnclick = function (e) {
        var selectDiv = $(e.currentTarget);
        var id = selectDiv[0].id;
        id = id.replace(contenedorPais + '_', '');
        var params = {
            pais_id: id
        };
        app.consultar(null, 'liga', contenedorLiga, params);
    };

    var construirContenedorLigas = function (r) {
        var content = r.content;
        var container = $('.venta_selector.ligas');
        container.empty();
        for (var i in content) {
            var imagen = $('<img>').attr('src', 'public/images/liga/' + content[i].imagen).attr('alt', content[i].html).attr('title', content[i].html).attr('class', 'selector_option_flag');
            var selectDiv = $('<div>').attr('id', contenedorLiga + '_' + content[i].id).attr('class', 'selector_option');
            imagen.appendTo(selectDiv);
            selectDiv.on('click', opcionLigaOnclick);
            selectDiv.appendTo(container);
        }
    };

    var opcionLigaOnclick = function (e) {
        var selectDiv = $(e.currentTarget);
        var id = selectDiv[0].id;
        id = id.replace(contenedorLiga + '_', '');
        var params = {
            liga_id: id
        };
        app.consultar(null, 'activo', null, params);
    };

    this.onCargaTabla = function (c) {
        switch (c) {
            case "tblPartidos":
                $('#tblPartidos tbody').find('tr').each(function () {
                    var nombreimagen = $(this).find('td').eq(2).html().split('|');
                    var imagen = $('<img>').attr('src', 'public/images/equipo/' + nombreimagen[1]);
                    var nombre = nombreimagen[0];
                    $(this).find('td').eq(2).html(nombre).append(imagen);

                    var nombreimagen = $(this).find('td').eq(3).html().split('|');
                    var imagen = $('<img>').attr('src', 'public/images/equipo/' + nombreimagen[1]);
                    var nombre = nombreimagen[0];
                    $(this).find('td').eq(3).html(nombre).append(imagen);

                });
                onCargaTablaPartidos();
                break;
        }
    };

    var onCargaTablaPartidos = function () {
        $("input[name=tblPartidos_conse]").on('click', function () {
            partidoSeleccionado = $(this).val();
            getMatchParams();
        });
    };

    var getMatchParams = function () {
        var addData = {
            partido_id: partidoSeleccionado
        };
        app.ejecutar('getMatchParams', addData);
    };

    var cargarParametrosPartido = function (r) {
        var data = r.content;
        var tablaContainer = $('#tblPartidosApuesta');
        tablaContainer.find('thead').empty();
        tablaContainer.find('tbody').empty();
        var cabeceraContainer = $('<tr>').appendTo(tablaContainer.find('thead'));
        var cuerpoLocalContainer = $('<tr>').attr('class', 'valor_local').appendTo(tablaContainer.find('tbody'));
        var cuerpoVisitaContainer = $('<tr>').attr('class', 'valor_visita').appendTo(tablaContainer.find('tbody'));
        var cuerpoValues = $('<tr>').attr('class', 'valor_apuesta').appendTo(tablaContainer.find('tbody'));
        for (var i in data) {
            var marcaStr = '';
            if (data[i].marca_local && data[i].marca_visita && data[i].marca_local !== '' && data[i].marca_visita != '') {
                marcaStr = "<span class='marca_preview' data-marca_local='" + data[i].marca_local + "' data-marca_visita='" + data[i].marca_visita + "'>(" + data[i].marca_local + "/" + data[i].marca_visita + ")";
            }
            $('<th>').html(data[i].parametro_nombre + marcaStr).appendTo(cabeceraContainer);
            $('<td>').html(parseFloat(data[i].valor_local)).appendTo(cuerpoLocalContainer);
            $('<td>').html(parseFloat(data[i].valor_visita)).appendTo(cuerpoVisitaContainer);
            $('<td>').html('0').attr('data-parametro_partido_id', data[i].id).appendTo(cuerpoValues);
        }
        cuerpoLocalContainer.hide();
        cuerpoVisitaContainer.hide();
        cargarTablaApuestaPartidoListeners();
        partidoSeleccionado = null;
    };

    var cargarTablaApuestaPartidoListeners = function () {
        $('#tblPartidosApuesta').find('tbody tr.valor_local, tbody tr.valor_visita').find('td').each(function () {
            $(this).on('click', function () {
                var color = $(this).css('background-color') + '';
                var casilla = $(this)[0].cellIndex;
                $('#tblPartidosApuesta').find('tbody tr.valor_apuesta').find('td').html('0');
                $('#tblPartidosApuesta').find('tbody tr.valor_local, tbody tr.valor_visita').find('td').css({'background-color': "transparent"});
                if (color !== 'rgb(255, 255, 153)') {
                    $(this).css({'background-color': "rgb(255, 255, 153)"});
                    var valorApuesta = +$('#valorApostar').val();
                    var valorBet = +$(this).html();
                    var ganar = (valorApuesta * valorBet) - valorApuesta;
                    $('#tblPartidosApuesta').find('tbody tr.valor_apuesta').find('td').eq(casilla).html(ganar);
                } else {
                    $(this).css({'background-color': "transparent"});
                    $('#tblPartidosApuesta').find('tbody tr.valor_apuesta').find('td').eq(casilla).html(0);
                }

            });
        });
    };

    var generarTicket = function () {
        var paramPartido = new Array();
        var partInc = 0;
        $('table.apuesta_registro').each(function () {
            var apuesta = new Object();
            var ganador = new Object();
            var partido_id = $(this).data('partido_id');
            var equipo_apuesta = $(this).data('equipo_apuesta');
            var partido_parametros = new Object();
            var i = 0;
            $(this).find('tbody').find('tr').eq(1).find('td').each(function () {
                var param_factor = $(this).parents('tbody tr').find('.factor').find('td').eq(i).html();
                var valor = +$(this).html();
                if (valor !== 0) {
                    partido_parametros[$(this).data('parametro_partido_id')] = {factor: param_factor, valor: $(this).html(), ganador: equipo_apuesta};
                }
                i++;
            });
            apuesta[partido_id] = partido_parametros;
            paramPartido[partInc] = {apuestaPartido: apuesta};
            partInc++;
        });
        var addData = {
            apuestaCuerpo: JSON.stringify(paramPartido),
            valorApostar: $('#valorApostar').val()
        };
        app.ejecutar('generateTicket', addData);
    };

    var activarImprimir = function (r) {
        $('#imprimir').remove();
        var url = window.location.href.substr(0, window.location.href.indexOf('/') + 1) + '?modulo=ticket&ticket=' + r.content;
        $('<a>').html('Imprimir').attr('href', url).attr('target', '_blank').appendTo('#tblTicket .botonera').attr('id', 'printTicketA');
$('#cmdGenerarTicket').remove();

    };

    var app = new Application(this);
};
