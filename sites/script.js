"use strict";
/* =========================================================
   VESTE — lógica do site
   Catálogo, carrinho com checkout via WhatsApp, galeria com
   lightbox, pesquisa de satisfação e menu responsivo.
   ========================================================= */
const NUMERO_WHATSAPP = "5531998765432";
const PRODUTOS = [
    { id: "cam-1", nome: "Camisa Linho Areia", categoria: "camisas", preco: 249.9, imagem: "https://picsum.photos/seed/veste-camisa-areia/500/625" },
    { id: "cam-2", nome: "Camisa Popeline Índigo", categoria: "camisas", preco: 219.9, imagem: "https://picsum.photos/seed/veste-camisa-indigo/500/625" },
    { id: "cam-3", nome: "Camisa Manga Longa Terracota", categoria: "camisas", preco: 259.9, imagem: "https://picsum.photos/seed/veste-camisa-terra/500/625" },
    { id: "cal-1", nome: "Calça Alfaiataria Grafite", categoria: "calcas", preco: 329.9, imagem: "https://picsum.photos/seed/veste-calca-grafite/500/625" },
    { id: "cal-2", nome: "Calça Wide Leg Cru", categoria: "calcas", preco: 299.9, imagem: "https://picsum.photos/seed/veste-calca-cru/500/625" },
    { id: "cal-3", nome: "Calça Jeans Reta Índigo", categoria: "calcas", preco: 279.9, imagem: "https://picsum.photos/seed/veste-calca-jeans/500/625" },
    { id: "ves-1", nome: "Vestido Midi Linho", categoria: "vestidos", preco: 389.9, imagem: "https://picsum.photos/seed/veste-vestido-midi/500/625" },
    { id: "ves-2", nome: "Vestido Camisa Terracota", categoria: "vestidos", preco: 349.9, imagem: "https://picsum.photos/seed/veste-vestido-terra/500/625" },
    { id: "ace-1", nome: "Cinto Couro Natural", categoria: "acessorios", preco: 129.9, imagem: "https://picsum.photos/seed/veste-cinto/500/625" },
    { id: "ace-2", nome: "Lenço Seda Estampado", categoria: "acessorios", preco: 149.9, imagem: "https://picsum.photos/seed/veste-lenco/500/625" },
];
const NOMES_CATEGORIA = {
    camisas: "Camisas",
    calcas: "Calças",
    vestidos: "Vestidos",
    acessorios: "Acessórios",
};
const FOTOS_GALERIA = [
    { src: "https://picsum.photos/seed/veste-look-1/700/900", alt: "Look completo da coleção atual", destaque: "tall" },
    { src: "https://picsum.photos/seed/veste-look-2/700/500", alt: "Detalhe de costura em linho" },
    { src: "https://picsum.photos/seed/veste-look-3/700/500", alt: "Corte de tecido sobre a mesa do ateliê" },
    { src: "https://picsum.photos/seed/veste-look-4/900/500", alt: "Bastidor de produção da coleção", destaque: "wide" },
    { src: "https://picsum.photos/seed/veste-look-5/700/900", alt: "Modelo em ambiente externo", destaque: "tall" },
    { src: "https://picsum.photos/seed/veste-look-6/700/500", alt: "Rolos de linho cru empilhados" },
    { src: "https://picsum.photos/seed/veste-look-7/700/500", alt: "Acabamento de botões à mão" },
    { src: "https://picsum.photos/seed/veste-look-8/900/500", alt: "Vitrine da loja em Belo Horizonte", destaque: "wide" },
];
const FOTOS_INSTAGRAM = Array.from({ length: 6 }, (_, i) => ({
    src: `https://picsum.photos/seed/veste-insta-${i + 1}/400/400`,
    alt: `Publicação ${i + 1} do Instagram da VESTE`,
}));
/* ---------- estado em memória (sem localStorage) ---------- */
const carrinho = [];
let indiceLightbox = 0;
/* ---------- utilidades ---------- */
function qs(seletor, escopo = document) {
    const el = escopo.querySelector(seletor);
    if (!el)
        throw new Error(`Elemento não encontrado: ${seletor}`);
    return el;
}
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
/* =========================================================
   Menu mobile
   ========================================================= */
function initMenu() {
    const nav = qs("#mainNav");
    const botao = qs("#navToggle");
    botao.addEventListener("click", () => {
        const aberto = nav.classList.toggle("is-open");
        botao.setAttribute("aria-expanded", String(aberto));
    });
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            botao.setAttribute("aria-expanded", "false");
        });
    });
}
/* =========================================================
   Catálogo
   ========================================================= */
function cartaoProdutoHTML(produto) {
    return `
    <article class="produto-card">
      <div class="produto-media">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" width="500" height="625">
      </div>
      <div class="produto-info">
        <p class="produto-categoria">${NOMES_CATEGORIA[produto.categoria]}</p>
        <h3 class="produto-nome">${produto.nome}</h3>
        <p class="produto-preco">${formatarPreco(produto.preco)}</p>
        <button class="produto-add" data-id="${produto.id}" type="button">Adicionar</button>
      </div>
    </article>
  `;
}
function renderProdutos(categoria) {
    const grid = qs("#produtosGrid");
    const lista = categoria === "todos" ? PRODUTOS : PRODUTOS.filter((p) => p.categoria === categoria);
    grid.innerHTML = lista.map(cartaoProdutoHTML).join("");
    grid.querySelectorAll(".produto-add").forEach((botao) => {
        botao.addEventListener("click", () => {
            const id = botao.dataset["id"];
            if (!id)
                return;
            adicionarAoCarrinho(id);
            botao.textContent = "Adicionado";
            botao.classList.add("is-added");
            window.setTimeout(() => {
                botao.textContent = "Adicionar";
                botao.classList.remove("is-added");
            }, 900);
        });
    });
}
function initFiltros() {
    const filtros = qs("#filtros");
    filtros.querySelectorAll(".filtro").forEach((botao) => {
        botao.addEventListener("click", () => {
            filtros.querySelectorAll(".filtro").forEach((b) => {
                b.classList.remove("is-active");
                b.setAttribute("aria-selected", "false");
            });
            botao.classList.add("is-active");
            botao.setAttribute("aria-selected", "true");
            renderProdutos(botao.dataset["categoria"] ?? "todos");
        });
    });
}
/* =========================================================
   Carrinho
   ========================================================= */
function adicionarAoCarrinho(id) {
    const produto = PRODUTOS.find((p) => p.id === id);
    if (!produto)
        return;
    const existente = carrinho.find((i) => i.id === id);
    if (existente) {
        existente.quantidade += 1;
    }
    else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    renderCarrinho();
}
function alterarQuantidade(id, delta) {
    const item = carrinho.find((i) => i.id === id);
    if (!item)
        return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }
    renderCarrinho();
}
function removerDoCarrinho(id) {
    const indice = carrinho.findIndex((i) => i.id === id);
    if (indice >= 0)
        carrinho.splice(indice, 1);
    renderCarrinho();
}
function itemCarrinhoHTML(item) {
    return `
    <div class="carrinho-item">
      <img src="${item.imagem}" alt="${item.nome}">
      <div>
        <p class="carrinho-item-nome">${item.nome}</p>
        <p class="carrinho-item-preco">${formatarPreco(item.preco)}</p>
        <div class="qtd-controls">
          <button type="button" data-acao="menos" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantidade}</span>
          <button type="button" data-acao="mais" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="item-remover" type="button" data-acao="remover" data-id="${item.id}">Remover</button>
    </div>
  `;
}
function totalCarrinho() {
    return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}
function mensagemWhatsapp() {
    if (carrinho.length === 0) {
        return "Olá! Vim do site da VESTE e queria saber mais sobre o catálogo.";
    }
    const tipoEntrega = qs("#entregaTipo").value;
    const linhas = carrinho.map((item) => `• ${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco * item.quantidade)}`);
    return [
        "Olá! Quero fechar este pedido na VESTE:",
        "",
        ...linhas,
        "",
        `Subtotal: ${formatarPreco(totalCarrinho())}`,
        `Entrega: ${tipoEntrega}`,
    ].join("\n");
}
function atualizarLinkWhatsapp() {
    const link = qs("#checkoutWhatsapp");
    const texto = encodeURIComponent(mensagemWhatsapp());
    link.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`;
}
function renderCarrinho() {
    const container = qs("#carrinhoItens");
    const contagem = qs("#cartCount");
    const totalEl = qs("#carrinhoTotal");
    const totalItens = carrinho.reduce((soma, i) => soma + i.quantidade, 0);
    contagem.textContent = String(totalItens);
    contagem.classList.remove("is-bump");
    // força reflow para reiniciar a animação a cada clique
    void contagem.offsetWidth;
    contagem.classList.add("is-bump");
    if (carrinho.length === 0) {
        container.innerHTML = `<p class="carrinho-vazio" id="carrinhoVazio">Seu carrinho está vazio.</p>`;
    }
    else {
        container.innerHTML = carrinho.map(itemCarrinhoHTML).join("");
        container.querySelectorAll("button[data-acao]").forEach((botao) => {
            const id = botao.dataset["id"] ?? "";
            const acao = botao.dataset["acao"];
            botao.addEventListener("click", () => {
                if (acao === "mais")
                    alterarQuantidade(id, 1);
                if (acao === "menos")
                    alterarQuantidade(id, -1);
                if (acao === "remover")
                    removerDoCarrinho(id);
            });
        });
    }
    totalEl.textContent = formatarPreco(totalCarrinho());
    atualizarLinkWhatsapp();
}
function initCarrinho() {
    const drawer = qs("#carrinho");
    const overlay = qs("#overlay");
    const abrir = qs("#cartToggle");
    const fechar = qs("#cartClose");
    const selectEntrega = qs("#entregaTipo");
    const abrirCarrinho = () => {
        drawer.classList.add("is-open");
        overlay.classList.add("is-visible");
        drawer.setAttribute("aria-hidden", "false");
        abrir.setAttribute("aria-expanded", "true");
    };
    const fecharCarrinho = () => {
        drawer.classList.remove("is-open");
        overlay.classList.remove("is-visible");
        drawer.setAttribute("aria-hidden", "true");
        abrir.setAttribute("aria-expanded", "false");
    };
    abrir.addEventListener("click", abrirCarrinho);
    fechar.addEventListener("click", fecharCarrinho);
    overlay.addEventListener("click", fecharCarrinho);
    selectEntrega.addEventListener("change", atualizarLinkWhatsapp);
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape")
            fecharCarrinho();
    });
    renderCarrinho();
}
/* =========================================================
   Galeria + lightbox
   ========================================================= */
function classeDestaque(foto) {
    if (foto.destaque === "tall")
        return " galeria-item--tall";
    if (foto.destaque === "wide")
        return " galeria-item--wide";
    return "";
}
function renderGaleria() {
    const grid = qs("#galeriaGrid");
    grid.innerHTML = FOTOS_GALERIA.map((foto, indice) => `
      <button class="galeria-item${classeDestaque(foto)}" type="button" data-indice="${indice}">
        <img src="${foto.src}" alt="${foto.alt}" loading="lazy">
      </button>
    `).join("");
    grid.querySelectorAll(".galeria-item").forEach((botao) => {
        botao.addEventListener("click", () => {
            const indice = Number(botao.dataset["indice"] ?? 0);
            abrirLightbox(indice);
        });
    });
}
function renderInstagram() {
    const grid = qs("#instagramGrid");
    grid.innerHTML = FOTOS_INSTAGRAM.map((foto) => `
      <a href="https://instagram.com/veste" target="_blank" rel="noopener">
        <img src="${foto.src}" alt="${foto.alt}" loading="lazy">
      </a>
    `).join("");
}
function mostrarFotoLightbox() {
    const foto = FOTOS_GALERIA[indiceLightbox];
    if (!foto)
        return;
    const img = qs("#lightboxImg");
    img.src = foto.src;
    img.alt = foto.alt;
}
function abrirLightbox(indice) {
    indiceLightbox = indice;
    mostrarFotoLightbox();
    const lightbox = qs("#lightbox");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
}
function fecharLightbox() {
    const lightbox = qs("#lightbox");
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
}
function initLightbox() {
    const lightbox = qs("#lightbox");
    qs("#lightboxClose").addEventListener("click", fecharLightbox);
    qs("#lightboxPrev").addEventListener("click", () => {
        indiceLightbox = (indiceLightbox - 1 + FOTOS_GALERIA.length) % FOTOS_GALERIA.length;
        mostrarFotoLightbox();
    });
    qs("#lightboxNext").addEventListener("click", () => {
        indiceLightbox = (indiceLightbox + 1) % FOTOS_GALERIA.length;
        mostrarFotoLightbox();
    });
    lightbox.addEventListener("click", (evento) => {
        if (evento.target === lightbox)
            fecharLightbox();
    });
    document.addEventListener("keydown", (evento) => {
        if (!lightbox.classList.contains("is-open"))
            return;
        if (evento.key === "Escape")
            fecharLightbox();
        if (evento.key === "ArrowLeft")
            qs("#lightboxPrev").click();
        if (evento.key === "ArrowRight")
            qs("#lightboxNext").click();
    });
}
/* =========================================================
   Pesquisa de satisfação
   ========================================================= */
function initPesquisa() {
    const grupo = qs("#estrelas");
    const notaInput = qs("#notaSelecionada");
    const form = qs("#pesquisaForm");
    const obrigado = qs("#pesquisaObrigado");
    const estrelas = Array.from(grupo.querySelectorAll(".estrela"));
    const pintarEstrelas = (nota) => {
        estrelas.forEach((estrela) => {
            const valor = Number(estrela.dataset["valor"] ?? 0);
            estrela.classList.toggle("is-active", valor <= nota);
            estrela.setAttribute("aria-checked", String(valor === nota));
        });
    };
    estrelas.forEach((estrela) => {
        estrela.addEventListener("click", () => {
            const valor = Number(estrela.dataset["valor"] ?? 0);
            notaInput.value = String(valor);
            pintarEstrelas(valor);
        });
    });
    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (Number(notaInput.value) === 0) {
            estrelas[0]?.focus();
            return;
        }
        form.querySelectorAll("button, textarea").forEach((el) => {
            el.disabled = true;
        });
        obrigado.hidden = false;
    });
}
/* =========================================================
   Inicialização
   ========================================================= */
function init() {
    initMenu();
    initFiltros();
    renderProdutos("todos");
    initCarrinho();
    renderGaleria();
    initLightbox();
    renderInstagram();
    initPesquisa();
}
document.addEventListener("DOMContentLoaded", init);
