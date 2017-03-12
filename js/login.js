// captura o evento do click com uma funcao
// anonima que serah executada no click
$("#btnIr").click(function(event) {

    valido = true;
console.log("1...................");
exit;
    // validar se os campos estao vazios
    // com uma callback especial chamado map
    // que dispara uma funcao para cada objeto
    // encontrado no selector
    $("#form-login input").map(function() 
    {
        // se o campo esta em branco acrescentamos a classe error
        // na div pai daquele elemento, pelo seletor this que retorna
        // o objeto corrente, e parents(div) retorna o 1o. div pai 
        // daquele elemento
        if ($(this).val().length == 0)
        {
            valido = false;
            $(this).parents("div").addClass("error");
        }
        // campo preenchido remove a classe error
        // preve que o campo possa estar com a classe erro
        // e que o usuario preencheu o campo e cliclou novamente
        // no botao IR
        else
        {
            $(this).parents("div").removeClass("error");
        }
    });

    /*
        Se os campos forem validos iniciamos a chamada ao servidor
        1. escondemos qq mensagem de erro e desabilitamos o botao
        para que o usuario nao clique mais de uma vez enqto o
        Ajax esta rolando....
     */
    

    if (valido)
    {
        $("#erroLoginEmpty").hide();
        $("#erroLoginServer").hide();
        $("#btnIr").addClass("disabled");
        $("#tryLogin").show();

        // variavel que sera enviada ao servidor
        data = JSON.stringify({"login": $("#login").val(), "senha": $("#senha").val()});


        // mandamos por AJAX
        // -- type - define o tipo de requisicao: GET, POST, PUT, DELETE
        // -- url - que a requisicao ajax vai chamar, aqui usamos a variavel
        // rootUrl, do arqui app.js e em seguida definimos a classe e o metodo
        // no caso do login acessamos classe Usuario, metodo post_login
        // -- datatype - tipo de dado que sera usado na requisicao e na resposta,
        // usaremos sempre JSON
        // -- data - sao os dados que serao enviados ao servidor, com o framework Slim
        // faremos que esses dados seja o primeiro parametro do metod post chamado
        // -- success e error - funcao que sao executadas caso a chamada ao servidor 
        // seja realizada com sucesso ou caso algum erro ocorra, geralmente ja ficam na
        // propria chamada ajax 
        $.ajax({
            type: "post",
            url: rootUrl + "usuario/login",
            dataType: "json",
            data: data,
            success: onSuccessLogin,
            error: onErrorLogin
        });
    }
    else
    {
        $("#erroLoginServer").hide();
        $("#erroLoginEmpty").show();
    }
    
});

/*
    Se o Loginm do usuario for um sucesso
    1. retira a mensagem carregando  e de erros
    2. configura o cookie do usuario com $.cookie (plugin do JQuery)
    3. redireciona para bemVindo
 */
function onSuccessLogin(data) {
	console.log(data);
 
    $("#tryLogin").hide();
    $("#erroLoginServer").hide();
    $("#erroLoginEmpty").hide();
    $.cookie.json = true;
    $.cookie('usuario', data.result, {expires: 1});

    goPage("bemVindo");

}

/*
    Caso login falhe, exibimos a mensagem de erro que o servidor retornou
 */
function onErrorLogin(error) {
	console.log(error);
    $("#tryLogin").hide();
    $("#erroLoginServer").html(getErrorMessage(error.responseText));
    $("#erroLoginServer").show();
    $("#btnIr").removeClass("disabled");
 
}


