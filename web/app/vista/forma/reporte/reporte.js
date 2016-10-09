var Modulo = function () {
    var resultContainer = '';
    var formulario = $('#inicio');
    var module = "inicio";

    this.inicializarFormulario = function () {
        if ($('form#login').length > 0){
            $('nav').remove();
            cargarLoginEvents();
        }
    };
    
    var cargarLoginEvents = function(){
        $('form#login').on('submit',function(){
            var addData = {
                loginData: JSON.stringify($('form#login').serializeArray())
            };
            app.ejecutar('doLogin', addData);
            return false;
        });
        $('#toggleIniciarSesion').on('click', function(){
            $('form#login').toggle({'display':'block'});
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
              
    }
    
    this.ejecutarAfterOk = function(){
        window.location.reload();
    }
    
    var iniciarSesion = function(){
        
    }
    
    this.procesarConsulta = function(r){
        
    }
    
    this.postConsulta = function(llenar, campo, _conse){
        
    }
    
    

    var app = new Application(this);
};
