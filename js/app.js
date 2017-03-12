/* variaveis globais */

/* Acessada por todas as paginas do sistema */

/*
    Aqui armazena o caminho da conexao para o servidor, que sera usado nas requisicoes ajax
    - exemplo -- acessar rootUrl/cliente/listAll, estamos acessando o metodo:: get_listAll() 
 */
var rootUrl = "http://www.sistemaserver.com.br/"; // CAMINHA DA CONN COM SERVER
var clientUrl = "http://www.sistemaclient.com.br/index.php"; 


/* métodos globais */

// Helper -  para obter uma mensagem dado um JSON de formato desconhecido
// Úsado para mensagens de erro qualquer
function getErrorMessage(jsonError) 
{
    alert(jsonError)
    return (JSON.parse(jsonError)).error.text;
}


// redirecionar a pagina, mas usando a nomenclatura que foi criada
function goPage(page) 
{
    location.href = clientUrl + "?go=" + page;
}

// Usa o plugin $.cookie para descobrir 
// se existe um cookie com a chave usuario
// esse cookie indica se o usuario esta logado
function verifyLogin() 
{
    $.cookie.json = true;

    if ($.cookie('usuario') == undefined)
        goPage("login");
}

/*
    Usado para formatar um campo data corretamente,
    de modo a incluir um calendario drop downno componente
    Tb tem um callback chamado keypress, ou seja, um evento que 
    eh disparado quando o usuario digita algo no campo, nesse
    cado o mento event.preventDefault evita que o evento se pro
    pague, fazendo com que algo que foi digitado no campo nao seja
    exibido nele.
    Evita que o usuario digite valores diferentes de uma data-padrao
    A unica forma de entrar com a dara no campo eh por meio do
    calendario
 */
function preparaData(data) 
{
    data.datepicker();
    data.datepicker("option", "dateFormat", "dd/mm/yy");
    data.keypress(function(event) {
        event.preventDefault();
    });
}

/*
    Retorna a descricao do Tipo de Usuario
 */
function getDescTipo($tipo)
{
    /*
     * Não é interessante criar switch dessa forma, pois quando formos
     * criar um novo tipo, teremos que vir até este código e adicionar
     * mais um item. A solução para este problema é criar classes abstratas,
     * mas como nosso objetivo é abordar o RESTful, não iremos fazer isso em 
     * um primeiro momento.
     */
    switch ($tipo) {
        case "a":
            return "Admin";
            break;
        case "v":
            return "Vendedor";
            break;
        case "c":
            return "Cliente";
            break;
    }
}

//
//retirado de: http://codigosprontos.blogspot.com.br/2010/06/o-codigo-function-moedavalor-casas.html
//
function moeda(valor) 
{
    casas = 2;
    separdor_decimal = ",";
    separador_milhar = ".";

    var valor_total = parseInt(valor * (Math.pow(10, casas)));
    var inteiros = parseInt(parseInt(valor * (Math.pow(10, casas))) / parseFloat(Math.pow(10, casas)));
    var centavos = parseInt(parseInt(valor * (Math.pow(10, casas))) % parseFloat(Math.pow(10, casas)));


    if (centavos % 10 == 0 && centavos + "".length < 2) {
        centavos = centavos + "0";
    } else if (centavos < 10) {
        centavos = "0" + centavos;
    }

    var milhares = parseInt(inteiros / 1000);
    inteiros = inteiros % 1000;

    var retorno = "";

    if (milhares > 0) {
        retorno = milhares + "" + separador_milhar + "" + retorno
        if (inteiros == 0) {
            inteiros = "000";
        } else if (inteiros < 10) {
            inteiros = "00" + inteiros;
        } else if (inteiros < 100) {
            inteiros = "0" + inteiros;
        }
    }
    retorno += inteiros + "" + separdor_decimal + "" + centavos;


    return retorno;

}

$(document).ready(function() {

    // Adiciona o link da funcionalidade de sair
    $("#linkSair").click(function() 
    {
        $.ajax({
            type: "get",
            url: rootUrl + "usuario/logout",
            success: function() {
                $.removeCookie('usuario');
                goPage("login");
            }
        });

    });

    // formata o campo de moedas
    $(".moeda").maskMoney({thousands: '.', decimal: ','});

    /*
     Desabilita a tecla que faz um post na pagina   
     Previne que um enter poste o formulário
     Em ambientes jquery e ajax, enter 
     submetendo formulários não são bem vindos
     */
    $(window).keydown(function(event) 
    {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});



