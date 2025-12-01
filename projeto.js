const produtos = [
  {id:1,nome:'Picanha',preco:89.90,img:'https://i.pinimg.com/1200x/c7/51/2d/c7512d9a3d6ddb81289040069029f4c1.jpg',tipo:'bovinos'},
  {id:2,nome:'Costela Bovina',preco:49.90,img:'https://i.pinimg.com/736x/7c/1b/3f/7c1b3f8c9471a2a6751ce06dc7aebc2a.jpg',tipo:'bovinos'},
  {id:3,nome:'Alcatra',preco:59.90,img:'https://i.pinimg.com/1200x/c1/39/44/c139444bf874178c3dfee0eface7de4c.jpg',tipo:'bovinos'},
  {id:4,nome:'Maminha',preco:54.90,img:'https://i.pinimg.com/736x/76/a5/f3/76a5f37c90b4a15712475da672a99778.jpg',tipo:'bovinos'},
  {id:5,nome:'Fraldinha',preco:52.90,img:'https://i.pinimg.com/736x/6d/2b/e3/6d2be35cb3961fc7af8beb43bbe6ebe0.jpg',tipo:'bovinos'},
  {id:6,nome:'Linguiça Toscana',preco:24.90,img:'https://i.pinimg.com/1200x/f8/43/84/f84384d90be0ad6165679de3cbee891f.jpg',tipo:'suinos'},
  {id:7,nome:'Cupim',preco:44.90,img:'https://i.pinimg.com/1200x/a4/eb/48/a4eb48960f327ef554a9e6405df1262e.jpg',tipo:'bovinos'},
  {id:8,nome:'Filé Mignon',preco:99.90,img:'https://i.pinimg.com/1200x/26/38/1c/26381c85aa4bca7f52636475495a80b2.jpg',tipo:'bovinos'},
  {id:9,nome:'Contra Filé',preco:69.90,img:'https://i.pinimg.com/736x/b9/2a/46/b92a469de387eb81bc5b82a73a76d202.jpg',tipo:'bovinos'},
  {id:10,nome:'Asinha de Frango',preco:18.90,img:'https://i.pinimg.com/1200x/36/00/bc/3600bcd1efa6b409f0207d656fb47d10.jpg',tipo:'aves'},
  {id:11,nome:'Pernil',preco:32.90,img:'https://uploaddeimagens.com.br/images/004/941/833/full/pernil.jpg',tipo:'suinos'},
  {id:12,nome:'Panceta',preco:39.90,img:'https://uploaddeimagens.com.br/images/004/941/834/full/panceta.jpg',tipo:'suinos'}
];

let carrinho = [];

// Monta produtos na página
function montarProdutos(){
  const area = document.getElementById('lista-produtos');
  area.innerHTML = '';
  produtos.forEach((p,idx)=>{
    const card = document.createElement('div');
    card.className = 'produto fade-in';
    card.style.animationDelay = (idx*40)+'ms';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho(${p.id})">Adicionar ao Carrinho</button>
    `;
    area.appendChild(card);
  });
}

// Alternar abas
function aba(id){
  document.querySelectorAll('.aba').forEach(x=>x.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.remove('hidden');
  document.getElementById(id).querySelectorAll('*').forEach(el=>{
    el.classList.remove('fade-in'); 
    void el.offsetWidth; 
    el.classList.add('fade-in'); 
  });
}

// Mostrar categoria
function mostrarCategoria(tipo){
  const area = document.getElementById('categorias-lista');
  area.innerHTML = '';
  produtos.filter(p=>p.tipo===tipo).forEach((p,idx)=>{
    const card = document.createElement('div');
    card.className = 'produto fade-in';
    card.style.animationDelay = (idx*40)+'ms';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho(${p.id})">Adicionar ao Carrinho</button>
    `;
    area.appendChild(card);
  });
}

// Cardápio
const cardapioProdutos = {
  cortes: produtos.filter(p=>p.tipo==='bovinos'),
  churrasco: produtos.filter(p=>p.tipo==='suinos'),
  preparados: produtos.filter(p=>p.tipo==='aves')
};

function mostrarCardapio(tipo){
  const area = document.getElementById('cardapio-lista');
  area.innerHTML = '';
  cardapioProdutos[tipo].forEach((p,idx)=>{
    const card = document.createElement('div');
    card.className = 'produto fade-in';
    card.style.animationDelay = (idx*40)+'ms';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho(${p.id})">Adicionar ao Carrinho</button>
    `;
    area.appendChild(card);
  });
}

// Tema
const temaBtn = document.getElementById('temaBtn');
let tema = localStorage.getItem('beeflogy_tema') === 'light';
if(tema) document.body.classList.add('light');
temaBtn.addEventListener('click', ()=>{
  tema = !tema;
  document.body.classList.toggle('light');
  localStorage.setItem('beeflogy_tema',tema?'light':'dark');
});

// Adicionar produto ao carrinho
function adicionarCarrinho(id){
  const produto = produtos.find(p=>p.id===id);
  carrinho.push(produto);
  atualizarCarrinho();
}

// Atualizar carrinho fixo e finalização
function atualizarCarrinho(){
  // Carrinho fixo
  const itensCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total');
  itensCarrinho.innerHTML = '';
  let total = 0;
  carrinho.forEach(p=>{
    itensCarrinho.innerHTML += `<div class="menu-item">${p.nome} - R$ ${p.preco.toFixed(2)}</div>`;
    total += p.preco;
  });
  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;

  // Finalização
  const itensFinal = document.getElementById('itens-carrinho-final');
  const totalFinal = document.getElementById('total-carrinho');
  if(itensFinal && totalFinal){
    itensFinal.innerHTML = '';
    carrinho.forEach(p=>{
      itensFinal.innerHTML += `<div class="menu-item">${p.nome} - R$ ${p.preco.toFixed(2)}</div>`;
    });
    totalFinal.textContent = `Total: R$ ${total.toFixed(2)}`;
  }
}

// Abrir finalização
function abrirFinalizacao(){
  if(carrinho.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }
  aba('finalizacao');
  atualizarCarrinho();
  
}

// Finalizar pedido
function finalizarPedido(){
  if(carrinho.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }
  alert("Pedido finalizado com sucesso!");
  carrinho = [];
  atualizarCarrinho();
  aba('produtos');
}

// Inicialização
montarProdutos();
aba('produtos');