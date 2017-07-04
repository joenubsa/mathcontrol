var Modulo = function () {
    var resultContainer = 'tblTemario';
    var formulario = $('#temario');
    var module = "temario";

    this.inicializarFormulario = function () {
        $('#id').hide();
        app.consultar();
//        if (typeof app.getVars('mode') !== 'undefined') {
//            this.soloContenido();
//        }
        if (typeof app.getVars('modulo_id') !== 'undefined') {
            $('#modulo_id').val(+app.getVars('modulo_id'));
        }
        setTimeout(function () {
            $('#modulo_id').trigger('change');
        }, 500);
        inicializarEventos();

    };

    var inicializarEventos = function () {
        $('#modulo_id').on('change', function () {
            if ($(this).val() !== '') {
                cargarModulo($(this).val());
            } else {
                limpiarFormulario();
            }
        });
    };

    var cargarModulo = function (modulo_id) {
        app.consultar(null, 'consultar_modulo_id', 'consultar_modulo_id', null);
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
        $('#nivel').val(valores[0]['nivel']);
        $('#ayudaPaginaWeb').val(valores[0]['ayudaPaginaWeb']);
        $('#ayudaVideos').val(valores[0]['ayudaVideos']);
        $('#ayudaPresentaciones').val(valores[0]['ayudaPresentaciones']);
        $('#ayudaLibros').val(valores[0]['ayudaLibros']);
        $('#ayudaApuntesClase').val(valores[0]['ayudaApuntesClase']);
        $('#ayudaOtros').val(valores[0]['ayudaOtros']);
        $('#ayudaCompas').val(valores[0]['ayudaCompas']);
        $('#ayudaProfesor').val(valores[0]['ayudaProfesor']);
        $('#ayudaFamiliares').val(valores[0]['ayudaFamiliares']);
        $('#ayudaAmigos').val(valores[0]['ayudaAmigos']);
        $('#dedicacionHoras').val(valores[0]['dedicacionHoras']);
        $('#dedicacionDias').val(valores[0]['dedicacionDias']);
    };

    var limpiarFormulario = function () {
        $('#nivel').val('');
        $('#ayudaPaginaWeb').val('');
        $('#ayudaVideos').val('');
        $('#ayudaPresentaciones').val('');
        $('#ayudaLibros').val('');
        $('#ayudaApuntesClase').val('');
        $('#ayudaOtros').val('');
        $('#ayudaCompas').val('');
        $('#ayudaProfesor').val('');
        $('#ayudaFamiliares').val('');
        $('#ayudaAmigos').val('');
        $('#dedicacionHoras').val('');
        $('#dedicacionDias').val('');
    };

    this.onCargarFormulario = function (r) {

    };

    this.procesarConsulta = function (r, c) {
        switch (c) {
            case 'consultar_modulo_id':
                if (r.content.length > 0) {
                    this.cargarFormulario(r.content);
                } else {
                    limpiarFormulario();
                }
                break;
        }
    };



    this.onCargaTabla = function (c) {

    };


    var app = new Application(this);

};
