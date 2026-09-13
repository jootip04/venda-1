# VESTE — site da loja de roupa

Site completo em HTML + CSS + TypeScript: página inicial, história da
marca, catálogo com categorias e carrinho, galeria de fotos, Instagram,
localização, botão flutuante de WhatsApp (com finalização de pedido) e
pesquisa de satisfação. Responsivo, com animações e SEO básico.

## Como abrir

O site já vem compilado — é só abrir `index.html` no navegador
(duplo clique) ou publicar a pasta inteira em qualquer serviço de
hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).
Não precisa de servidor nem de backend.

## Estrutura

```
index.html      → estrutura e conteúdo do site
style.css       → todo o visual (cores, tipografia, layout, animações)
src/script.ts   → código-fonte em TypeScript (comentado, em português)
dist/script.js  → versão já compilada que o site realmente usa
tsconfig.json   → configuração do compilador
```

Se editar `src/script.ts`, recompile com:
```
npm install -g typescript   # só na primeira vez, se necessário
tsc
```
Isso gera novamente `dist/script.js`.

## O que personalizar antes de publicar

- **Fotos**: as imagens usam o serviço `picsum.photos` como placeholder.
  Troque os `src` em `index.html` e em `src/script.ts` (constantes
  `PRODUTOS`, `FOTOS_GALERIA`, `FOTOS_INSTAGRAM`) pelas fotos reais da loja.
- **WhatsApp**: troque o número `5531998765432` em `index.html` e no
  topo de `src/script.ts` (`NUMERO_WHATSAPP`) pelo número real.
- **Endereço e mapa**: seção "Localização" em `index.html` — troque o
  endereço no texto e no link do `iframe` do Google Maps.
- **Instagram**: troque `instagram.com/veste` pelo perfil real.
- **Produtos e preços**: lista `PRODUTOS` em `src/script.ts`.
- **Entrega**: o cartão "Retirada ou entrega" e o link "Rastrear um
  pedido existente" (`#rastreioLink` em `index.html`) estão como
  placeholder — aponte para a transportadora ou sistema de delivery
  que vocês já usam.
- **Pesquisa de satisfação**: hoje só mostra "obrigado" na tela (não
  envia para lugar nenhum). Para receber as respostas de verdade,
  ligue o formulário a um Google Forms, planilha ou backend próprio.

## Observações

- Não há carrinho persistente entre visitas (ele zera se a pessoa
  atualizar a página) nem processamento de pagamento — o fechamento
  do pedido acontece pelo WhatsApp, no mesmo modelo usado por lojas
  pequenas. Se quiser checkout com pagamento online de verdade, é um
  passo adicional (ex.: Mercado Pago, Stripe).
- "Cardápio" e "Carta de bebidas" do pedido original foram adaptados:
  viraram o **Catálogo** de produtos; a carta de bebidas foi removida
  por não se aplicar a uma loja de roupa.
