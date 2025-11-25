let loginCerto = "thiago@email"
let senhaCerta = "batatinha123" 
let login 
let senha 
// enquanto a senha que o usuario inserir for diferente da senha certa continuaremos pedindo para que ele insira a senha novamente

// do = faça e While = enquanto . O que dá nome a estrutura dowhile, ou seja, faça enquanto.
// dowhile executa o código uma vez antes de fazer a comparação.

do {
    login = prompt ("Insira seu email:")
} while (login != loginCerto);
do {
    senha = prompt ("Insira a sua senha:")
} while (senha != senhaCerta);

// senha != senhaCerto
// A senha  deve ser diferente da senha certa
// repete quando a senha for diferente da senha certa  
