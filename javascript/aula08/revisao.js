let login = prompt ("Insira seu e-mail:")
let senha = prompt ("Insira a sua senha:")
let loginCerto = "thiago@email"
let senhaCerto = "batatinha123" 

//Validar se login é o login certo e se a senha tambem é
if (login == loginCerto && senha == senhaCerto) {
    alert("Credencial validada.")

    alert("opção 1: Crédito \n opção 2:consignado \n opção 3: Emprestimo \n opção 4: Renegociar \n opção 0: Falar com o atendente")
    let opcao = Number(prompt("Escolha a opção"))
switch (opcao) {
    case 1:
        alert("Você selecionou Crédito. Redirecionando para o setor!")
         break;
    case 2:
        alert("Você selecionou Consignado. Redirecionando para o setor!")
         break;
    case 3:
        alert("Você selecionou Emprestimo. Redirecionando para o setor!")
         break;
    case 4:
        alert("Você selecionou Renegociar. Redirecionando para o setor!")
         break;
    case 0:
        alert("Aguarde enquanto localizamos um atendente")
         break;

    default:
        alert("O usuario não selecionou uma opção válida. Emcerrando o atendimento")
         break;
}

}
//Se o login ou a senha que o usuario inseriu não forem iguais a que temos, ele nao pode fazer login no aplicativo 
else{
    alert ("Login ou senha incorretos!")
}
