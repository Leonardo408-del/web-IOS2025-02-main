/* script.js — funcionalidades: produtos, filtros, carrinho, formulário */
document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // PRODUTOS
  // =========================
  const produtos = [
    { id: 1, nome: 'Picanha', tipo: 'bovino', preco: 89.90, desc: 'Picanha suculenta, fatiada por kg', destaque: true },
    { id: 2, nome: 'Alcatra', tipo: 'bovino', preco: 39.50, desc: 'Ótima para churrasco', destaque: false },
    { id: 3, nome: 'Costela', tipo: 'bovino', preco: 29.90, desc: 'Costela macia, ideal para assar', destaque: false },
    { id: 4, nome: 'Filé Mignon', tipo: 'bovino', preco: 79.00, desc: 'Corte nobre e macio', destaque: true },
    { id: 5, nome: 'Bisteca Suína', tipo: 'suino', preco: 18.50, desc: 'Sabor delicado', destaque: false },
    { id: 6, nome: 'Linguiça Artesanal', tipo: 'suino', preco: 24.90, desc: 'Tempero caseiro', destaque: false },
    { id: 7, nome: 'Coxa e Sobrecoxa', tipo: 'aves', preco: 12.50, desc: 'Aves frescas e suculentas', destaque: false },
    { id: 8, nome: 'Peito de Frango', tipo: 'aves', preco: 16.80, desc: 'Peito desossado', destaque: false }
  ];

  // =========================
  // ELEMENTOS DOM
  // =========================
  const grid = document.getElementById('productGrid');
  const searchInput = document.getElementById('search');
  const filter = document.getElementById('filter');
  const sort = document.getElementById('sort');

  const cartPanel = document.getElementById('cartPanel');
  const openCart = document.getElementById('openCart');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');
  const cartCount = document.getElementById('cartCount');

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // =========================
  // NAV MOBILE
  // =========================
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navMenu.style.display = open ? 'none' : 'flex';
  });

  // =========================
  // CARRINHO LOCALSTORAGE
  // =========================
  let cart = JSON.parse(localStorage.getItem('cart_ribeiro')) || [];

  const saveCart = () => localStorage.setItem('cart_ribeiro', JSON.stringify(cart));
  const formatMoney = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // =========================
  // RENDER PRODUTOS
  // =========================
  function renderProducts(list) {
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">Nenhum produto encontrado.</p>`;
      return;
    }

    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb">${p.tipo.toUpperCase()}</div>
        <h4>${p.nome}</h4>
        <p>${p.desc}</p>
        <div class="meta">
          <div class="badge">${formatMoney(p.preco)}/kg</div>
          <button class="small-btn add-btn" data-id="${p.id}">Adicionar</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // =========================
  // FILTROS
  // =========================
  function applyFilters() {
    let q = searchInput.value.trim().toLowerCase();
    let type = filter.value;
    let order = sort.value;

    let list = produtos.filter(p => {
      const searchHit = p.nome.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const typeOk = (type === 'all') || p.tipo === type;
      return searchHit && typeOk;
    });

    if (order === 'price-asc') list.sort((a, b) => a.preco - b.preco);
    if (order === 'price-desc') list.sort((a, b) => b.preco - a.preco);
    if (order === 'name-asc') list.sort((a, b) => a.nome.localeCompare(b.nome));
    if (order === 'featured') list.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

    renderProducts(list);
    attachAddButtons();
  }

  // =========================
  // BOTÕES "ADICIONAR"
  // =========================
  function attachAddButtons() {
    document.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(Number(btn.dataset.id));
      });
    });

    // também funciona com .addCart e .product-card
    document.querySelectorAll('.addCart').forEach(button => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        if (!card) return;

        const id = Number(card.dataset.id);
        addToCart(id);
      });
    });
  }

  // =========================
  // CARRINHO
  // =========================
  function addToCart(id) {
    const p = produtos.find(prod => prod.id === id);
    if (!p) return;

    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: p.id, nome: p.nome, preco: p.preco, qty: 1 });

    saveCart();
    renderCart();
    flashCartCount();
  }

  function updateQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty = qty;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

    saveCart();
    renderCart();
    flashCartCount();
  }

  function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart(); renderCart(); flashCartCount();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    flashCartCount();
  }

  function cartTotal() {
    return cart.reduce((s, i) => s + i.preco * i.qty, 0);
  }

  // =========================
  // RENDER CARRINHO
  // =========================
  function renderCart() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p style="color:var(--muted)">Carrinho vazio.</p>`;
      cartTotalEl.textContent = formatMoney(0);
      cartCount.textContent = '0';
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="title">${item.nome}</div>
        <div>
          <button data-action="dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button data-action="inc" data-id="${item.id}">+</button>
        </div>
        <strong>${formatMoney(item.preco * item.qty)}</strong>
        <button data-action="remove" data-id="${item.id}">Remover</button>
      `;
      cartItemsEl.appendChild(row);
    });

    cartItemsEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const act = btn.dataset.action;

        if (act === 'inc') updateQty(id, cart.find(i => i.id === id).qty + 1);
        if (act === 'dec') updateQty(id, cart.find(i => i.id === id).qty - 1);
        if (act === 'remove') removeItem(id);
      });
    });

    cartTotalEl.textContent = formatMoney(cartTotal());
    cartCount.textContent = String(cart.reduce((s, i) => s + i.qty, 0));
  }

  // animação no contador
  function flashCartCount() {
    cartCount.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
      { duration: 400 }
    );
  }

  // abrir/fechar painel
  openCart.addEventListener('click', (e) => { e.preventDefault(); cartPanel.setAttribute('aria-hidden', 'false'); });
  closeCart.addEventListener('click', () => cartPanel.setAttribute('aria-hidden', 'true'));

  // limpar carrinho
  clearCartBtn.addEventListener('click', clearCart);

  // finalizar
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('O carrinho está vazio!');
      return;
    }
    alert('Pedido realizado com sucesso!');
    clearCart();
    cartPanel.setAttribute('aria-hidden', 'true');
  });

  // filtros
  [searchInput, filter, sort].forEach(el => el.addEventListener('input', applyFilters));

  // inicialização
  renderProducts(produtos);
  attachAddButtons();
  renderCart();

  document.getElementById('year').textContent = new Date().getFullYear();

  document.addEventListener('keydown', e => { if (e.key === 'Escape') cartPanel.setAttribute('aria-hidden', 'true'); });

  /* ====== INSERIR CHECKOUT DINÂMICO (cole dentro do DOMContentLoaded do seu script) ====== */
  (function insertCheckoutBlock() {
    // evita rodar duas vezes
    if (document.getElementById('checkoutArea')) return;

    // localiza o container onde ficam os botões do carrinho
    const checkoutButton = document.getElementById('checkout');
    const cartPanelInner = checkoutButton ? checkoutButton.parentElement.parentElement : document.getElementById('cartPanel');

    // cria bloco
    const box = document.createElement('div');
    box.id = 'checkoutArea';
    box.style.marginTop = '16px';
    box.style.padding = '12px';
    box.style.borderRadius = '10px';
    box.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))';
    box.style.border = '1px solid rgba(255,255,255,0.03)';
    box.innerHTML = `
    <h3 style="margin:0 0 8px 0">Finalizar Compra</h3>

    <label style="font-size:13px;color:var(--muted);margin-top:6px">
      CEP
      <input id="checkoutCep" type="text" placeholder="00000-000" style="width:100%;padding:8px;margin-top:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
    </label>

    <label style="margin-top:10px;font-size:13px;color:var(--muted)">Forma de pagamento</label>
    <div style="display:flex;gap:12px;margin-top:6px">
      <label style="display:flex;align-items:center;gap:6px"><input type="radio" name="checkoutPay" value="cartao"> Cartão</label>
      <label style="display:flex;align-items:center;gap:6px"><input type="radio" name="checkoutPay" value="pix"> PIX</label>
    </div>

    <div id="checkoutCard" style="display:none;margin-top:10px">
      <label style="font-size:13px;color:var(--muted)">Número do Cartão
        <input id="checkoutCardNumber" type="text" placeholder="0000 0000 0000 0000" maxlength="19" style="width:100%;padding:8px;margin-top:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
      </label>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="checkoutCardExpiry" placeholder="MM/AA" maxlength="5" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
        <input id="checkoutCardCvv" placeholder="CVV" maxlength="4" style="width:120px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
      </div>
      <input id="checkoutCardName" placeholder="Nome no cartão" style="width:100%;padding:8px;margin-top:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
    </div>

    <div id="checkoutPix" style="display:none;margin-top:10px;text-align:center">
      <div style="font-weight:700;margin-bottom:8px">Chave PIX: <span id="pixKeyText">11965774052</span></div>
      <img id="checkoutPixQR" class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PIX:11965774052" alt="QR PIX" style="width:160px;height:160px;border-radius:8px;border:1px solid rgba(255,255,255,0.04)">
      <div style="margin-top:8px;font-size:13px;color:var(--muted)"><small>Escaneie o QR ou copie a chave</small></div>
      <button id="copyPixKey" class="small-btn" style="margin-top:8px">Copiar chave PIX</button>
    </div>

    <button id="confirmCheckout" class="btn-primary" style="width:100%;margin-top:12px">Confirmar compra</button>
  `;

    // insere após os botões (ou no fim do painel)
    if (cartPanelInner) cartPanelInner.appendChild(box);
    else document.getElementById('cartPanel').appendChild(box);

    // adiciona comportamento
    const cepEl = document.getElementById('checkoutCep');
    const payRadios = Array.from(document.querySelectorAll('input[name="checkoutPay"]'));
    const cardBox = document.getElementById('checkoutCard');
    const pixBox = document.getElementById('checkoutPix');
    const pixQR = document.getElementById('checkoutPixQR');
    const copyPixKeyBtn = document.getElementById('copyPixKey');
    const confirmBtn = document.getElementById('confirmCheckout');

    // troca visual ao selecionar pagamento
    payRadios.forEach(r => r.addEventListener('change', () => {
      if (r.checked && r.value === 'cartao') {
        cardBox.style.display = 'block';
        pixBox.style.display = 'none';
      } else if (r.checked && r.value === 'pix') {
        cardBox.style.display = 'none';
        pixBox.style.display = 'block';
        // garante QR atualizado (caso mude chave no futuro)
        const pixKey = document.getElementById('pixKeyText')?.textContent || '11965774052';
        pixQR.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('PIX:' + pixKey);
      }
    }));

    // copiar chave PIX
    if (copyPixKeyBtn) {
      copyPixKeyBtn.addEventListener('click', () => {
        const key = document.getElementById('pixKeyText').textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(key).then(() => alert('Chave PIX copiada: ' + key));
        } else {
          // fallback
          const ta = document.createElement('textarea'); ta.value = key; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); alert('Chave PIX copiada: ' + key); } catch (e) { alert('Não foi possível copiar automaticamente. Copie manualmente: ' + key); }
          ta.remove();
        }
      });
    }

    // validação simples CEP
    function isValidCep(raw) {
      if (!raw) return false;
      const clean = raw.replace(/\D/g, '');
      return clean.length === 8;
    }

    // mascara simples para cartão e validade (opcional)
    const cardNumber = document.getElementById('checkoutCardNumber');
    const cardExpiry = document.getElementById('checkoutCardExpiry');
    if (cardNumber) {
      cardNumber.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      });
    }
    if (cardExpiry) {
      cardExpiry.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.replace(/(\d{2})(\d{0,2})/, '$1/$2');
        e.target.value = v;
      });
    }

    // confirmar compra (valida campos dependendo do método)
    confirmBtn.addEventListener('click', () => {
      // basic validations
      if (!cart || cart.length === 0) { alert('Carrinho vazio. Adicione produtos antes de finalizar.'); return; }

      const cepVal = cepEl.value.trim();
      if (!isValidCep(cepVal)) { alert('Informe um CEP válido (00000-000).'); cepEl.focus(); return; }

      const selected = payRadios.find(r => r.checked);
      if (!selected) { alert('Selecione uma forma de pagamento.'); return; }

      if (selected.value === 'cartao') {
        const num = (document.getElementById('checkoutCardNumber')?.value || '').replace(/\s/g, '');
        const exp = (document.getElementById('checkoutCardExpiry')?.value || '').trim();
        const cvv = (document.getElementById('checkoutCardCvv')?.value || '').trim();
        const name = (document.getElementById('checkoutCardName')?.value || '').trim();

        if (num.length < 13 || !/^\d+$/.test(num)) { alert('Número de cartão inválido.'); return; }
        if (!/^\d{2}\/\d{2}$/.test(exp)) { alert('Validade inválida. Use MM/AA.'); return; }
        if (cvv.length < 3 || !/^\d+$/.test(cvv)) { alert('CVV inválido.'); return; }
        if (!name) { alert('Informe o nome impresso no cartão.'); return; }

        // simulação de sucesso
        const masked = '**** **** **** ' + num.slice(-4);
        alert('Pagamento aprovado!\nCartão: ' + masked + '\nCEP: ' + cepVal);
        if (typeof clearCart === 'function') clearCart();
        if (cartPanel) { cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden', 'true'); }
        return;
      }

      if (selected.value === 'pix') {
        // mostra o pixBox (se não visível) e pede confirmação simulada
        pixBox.style.display = 'block';
        const key = document.getElementById('pixKeyText')?.textContent || '11965774052';
        pixQR.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('PIX:' + key);

        // simulate: ask user to confirm after paying
        const go = confirm('PIX selecionado. Escaneie o QR exibido. Após efetuar o pagamento, clique em OK para confirmar (simulação).');
        if (go) {
          alert('Pagamento via PIX confirmado. Pedido realizado!\nCEP: ' + cepVal);
          if (typeof clearCart === 'function') clearCart();
          if (cartPanel) { cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden', 'true'); }
        } else {
          alert('Pagamento não confirmado. Seu pedido permanece no carrinho.');
        }
        return;
      }

      // fallback
      alert('Compra processada. Obrigado!');
      if (typeof clearCart === 'function') clearCart();
      if (cartPanel) { cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden', 'true'); }
    });

  })(); /* fim insertCheckoutBlock */

});
