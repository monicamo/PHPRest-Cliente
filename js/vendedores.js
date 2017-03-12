
$(document).ready(function() {
    verifyLogin();
    atualizaGrid();
    preparaData($("#inputContratacao"));
});

function atualizaGrid()
{
    // limpa qq informacao no tbody
    // para isso usamos o seletor 'tbody tr'
    // que encontra todas as tags TR em TBODY
    // e entao usamos o remove
    $("#tableVendedores").find("tbody tr").remove();

    // insere uma nova mensagem de carregando
    // usamos o append para inserir uma nova TR em TBODY
    // que contem a mensagem que os dados estao carregando
    // PODEMOS colocar numa div a parte com os dados bloqueando
    // enqto carregam
    $("#tableVendedores").find("tbody").append('<tr><td colspan=10><div class="alert alert-success"><img src="img/ajax-loader.gif">Carregando...</div></td></tr>')

    // verifica se um filtro de texto foi digitado
    // para filtrar a pesquisa
    filtro = "";
    if ($("#filtrar").val())
        filtro = "/" + $("#filtrar").val();

    // faz o ajax receber os dados do servidor
    // Configurado para acessar metodo listAll
    // da Classe Vendedor
    // SUCESSO sera executado e preparamos a tabela
    // para inserir cada vendedor excluindo a mensagem 'carregando'
    // anterior e usamos o foreach nativo para cada vendedor
    $.ajax({
        type: "get",
        url: rootUrl + "vendedor/listAll" + filtro,
        dataType: "json",
        success: function(data) 
        {
            $("#tableVendedores").find("tbody tr").remove();

            // Laço do foreach  para cada item de data.result
            // e cada vendedor fica em um TR
            data.result.forEach(function(vendedor) 
            {

                // criamos um link e adicionamos um campo data-id
                // para armazenar o id do vendedor, pois usaremos para
                // carregar os dados do vendedor no FORM
                // o link fica no nome do vendedor para possibilitar sua
                // edicao e na ultima celula temos um link para remocao
                // do vendedor 
                row = "<tr><td>" + vendedor.matricula
                        + "</td><td><a id='edit' href='#' data-id='" 
                        + vendedor.id 
                        + "'>" 
                        + vendedor.nome 
                        + "</a>"
                        + "</td><td>" 
                        + vendedor.login
                        + "</td><td>" 
                        + vendedor.dataContratacao
                        + "</td><td> <a href='#'><i class='icon-remove' data-idUsuario='" 
                        + vendedor.idUsuario 
                        + "' data-id='" 
                        + vendedor.id 
                        + "' data-nome='" 
                        + vendedor.nome 
                        + "'/></i></a>"
                        + "</td></tr>";
            
                // insere os dados na tabela depos de recebe-los
                // esse seletor temos o ultimos tbody da tabela com
                // o id tableVendedores e adicionamos o conteudo
                // da variavel row
                $("#tableVendedores > tbody:last").append(row);
            });
        }
    });
}

/*
    Botao buscar configirado para quando clicado, chame 
    novamente o metodo atualizarGrid()
    Como esse metodo obtem o que foi digitado na caixa
    de busca , nao eh necessario realizar nenhuma
    operacao a mais no botao
 */
$('#btnBuscar').click(function() 
{
    atualizaGrid();
});


/*
    botao NOVO tem varias acoes
    pois abre uma janel MODAL para criar o vendedor
    tb deve checar se ja existe um vendedor sendo editado
    e se sim, deve limpar os campos do form
    Precisamos disso pois, o form tanto cria novo vendedor
    como tb edita um existente
    Assim, precisamos saber se editamos ou estamos criando um
    vendedor.... para isso usamos o campo inputId do id do vendedor
 */
$('#btnNovo').click(function() {

    if ($("#inputId").val() != "") 
    {
        $("form")[0].reset();
        $("#inputId").val("");
        $("#inputIdUsuario").val("");
        $("#errorServer").hide();
    }
    
    $('#novoModal').modal('show');
});


/*
    
 */
$('#salvar').click(function() 
{
    var valido = true;

    //remove o erro destacado em todos os inputs
    // callback usado para selecionar todos os
    // input s do formulario, a classe error eh
    // removida do div que contem input
    $("#form input").map(function() {
        $(this).parents("div").removeClass("error");
    });

    /*
        Preenchimento obrigatorio
     */
    if ($('#inputNome').val().length == 0)
    {
        valido = false;
        $('#inputNome').parents("div").addClass("error");
    }

    if ($('#inputLogin').val().length == 0)
    {
        valido = false;
        $('#inputLogin').parents("div").addClass("error");
    }

    if ($('#inputSenha').val().length == 0)
    {
        valido = false;
        $('#inputSenha').parents("div").addClass("error");
    }

    /*
            Processo para enviar os dados para o servidor
            - Criamos a variavel vendedor e adicionamos os campos
            necessarios
            Usamos JSON.stringify para que o objeto JSON seja
            convertido para uma string , e fica no formato
            correto da requisicao


     */
    if (valido)
    {
        /*
                Mensagens de erros sao escondidas
                Formulario eh escondido
                Mensagem informando o processo no servidor eh exibida
                entre outras mensagens
         */
        travarFormulario();

        vendedor = JSON.stringify({
            idVendedor: $("#inputId").val(),
            idUsuario: $("#inputIdUsuario").val(),
            nome: $("#inputNome").val(),
            email: $("#inputEmail").val(),
            login: $("#inputLogin").val(),
            senha: $("#inputSenha").val(),
            cpf: $("#inputCpf").val(),
            matricula: $("#inputMatricula").val(),
            dataContratacao: $("#inputContratacao").val()
        });

        /*
            Usamos o POST chamando a classe Vendedor e 
            o metodo save
         */
        $.ajax({
            type: "post",
            url: rootUrl + "vendedor/save",
            dataType: "json",
            data: vendedor,
            success: function(result) 
            {


                // se for OK, destravamos o FORM
                // reiniciamos os campos
                // escondemos o modal
                // e chamamos atualizar GRID
                destravarFormulario();
                $('#novoModal').modal('hide');
                $("form")[0].reset();
                atualizaGrid();
            },
            error: function(result) 
            {
                // Destravamos o form
                destravarFormulario();
                $("#errorServer").html(getErrorMessage(result.responseText));
                $("#errorServer").show();
            }
        });
    }
    else
    {
        $("#errorEmpty").show();
        $("#erroServer").hide();
    }

});

/*
    Trava o FORM apos clique em SALVAR
    Mensagens de erros sao escondidas
    Formulario eh escondido
    Mensagem informando o processo no servidor eh exibida
    entre outras mensagens
 */
function travarFormulario()
{
    $("#errorEmpty").hide();
    $("form").hide();
    $("#saveMessage").show();
    $("#salvar").addClass("disabled");
    $("#clearForm").addClass("disabled");
}

/*
    
 */
function destravarFormulario()
{
    $("#errorEmpty").hide();
    $("#errorServer").hide();
    $("form").show();
    $("#saveMessage").hide();
    $("#salvar").removeClass("disabled");
    $("#clearForm").removeClass("disabled");
}

/*
    USAMOS O CALLBACK live(), que eh executado
    inclusive se a linha for criada apos o
    carregemento
    VAMOS excluir um vendedor

 */
$(".icon-remove").live("click", function() 
{
    // pegamos o ID do Vendedor
    id = $(this).attr("data-id");
    // pegamos o ID de Usuario do Vendedor
    idUsuario = $(this).attr("data-idUsuario");
    // pegamos o nome do vendedor
    nome = $(this).attr("data-nome");
    // indica a linha que o usuario clicou
    // Pois this retorna o objeto que esta corrente
    // no seletor
    // Assim se temos um div <div id="meuDiv">
    // e usamos o seletor $('#meuDiv').map, o
    // $(this) representa o pprio div
    // A var row representa um objeto que contem 
    // a classe icon-remove neste caso o <i>
    // Usamos o row, pois o 'this' dentro do AJAX
    // representa a propria requisicao ajax e nao
    // mais a linha clicada, assim usamos row dentro
    // do callback success
    row = $(this);
    if (confirm("Excluir " + nome + "?"))
    {
        $.ajax({
            type: "post",
            url: rootUrl + "vendedor/delete",
            dataType: "json",
            data: JSON.stringify({id: id, idUsuario: idUsuario}),
            success: function() {
                row.parent().parent().parent().fadeTo(400, 0, function() {
                    row.parent().parent().parent().remove();
                });
            },
            error: function() {
                //todo
            }
        });
    }
});


/*
        EDITAR um vendedor
    Usamos o callback live para capturar o click
    do evento
 */
$("#edit").live("click", function() {
    // recupera o ID do vendedor Editado
    // nesse caso o this retorna a tag A
    // e pegamos o atributo data-id para
    // iniciar a edicao
    id = $(this).attr("data-id");

    $("#errorServer").hide();
    $("#errorEmpty").hide();

    /*
        assim obtemos informacoes no servidor
        do vendedor quequeremos editar e no 
        callback sucess preenchemos os dados
        do servidor no FORM do modal
     */
    $.ajax({
        type: "get",
        url: rootUrl + "vendedor/list/" + id,
        dataType: "json",
        success: function(data) 
        {
            vendedor = data.result;
            
            $("#inputId").val(vendedor.id);
            $("#inputIdUsuario").val(vendedor.idUsuario);
            $("#inputNome").val(vendedor.nome);
            $("#inputEmail").val(vendedor.email);
            $("#inputLogin").val(vendedor.login);
            $("#inputSenha").val(vendedor.senha);
            $("#inputCpf").val(vendedor.cpf);
            $("#inputMatricula").val(vendedor.matricula);
            $("#inputContratacao").val(vendedor.dataContratacao);
            
            $("#novoModal").modal("show");
        }
    });
});