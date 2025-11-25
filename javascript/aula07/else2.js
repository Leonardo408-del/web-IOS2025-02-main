let credencial = "PJ"

if (credencial == "visitante") {
    console.log("Você só pode ir onde seu anfitrião for.");
}
else if (credencial == "estagiario") {
    console.log("Você pode acessar as baias de trabalho e refeitório.");
}
else if (credencial == "aprendiz") {
    console.log("Voc~e pode acessar as áreas de lazer, baias e refeitório.");
}
else if (credencial == "CLT") {
    console.log("Você pode acessar tudo, exceto a diretoria.");
}
else if (credencial == "CEO") {
    console.log("o céu é o limite.");
} 
else{
    console.log("Credencial é inválida. ACESSO NEGADO!");
}