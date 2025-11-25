let idade = 17
let temDinheiro = false
let temCadUnico = true
// > maior que 
// >= maior ou igual a 
// < menor que 
// <= menor ou igual a 

if (idade >= 18) {
    if (temDinheiro == false ) {
        console.log("Vamos pagar o quebra");
    }
    else{
        if (temCadUnico == false) {
            console.log("CNH de graça");
        }
       else{
        console.log("Pobrinho e sem cadastro");
       }
    }
}
else{
    console.log("Muito novo para pilotar");
}