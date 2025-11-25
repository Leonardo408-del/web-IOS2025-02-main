let precoSorvete = 5
// preço fixo

let dinheiro = 8
// quanto a pessoa tem

let sabor = "chocolate"
// pode trocar por morango, creme, etc

if (dinheiro >= precoSorvete){
    console.log("Você pode comprar um sorvete!");
console.log("sabor escolhido: " + (sabor));
console.log("troco: R$ " + (dinheiro-precoSorvete));
} else{
    console.log("dinheiro insuficiente😥!");
}
