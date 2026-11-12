// script.js — monta o currículo a partir de dados.js e cuida das interações.

const $ = (seletor) => document.querySelector(seletor);

// Gera um "hash" curto e estável a partir de um texto, só para dar cara de commit.
function hashDe(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

function iniciais(nome) {
  const partes = nome.split(" ").filter((p) => p.length > 2);
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// ===== Preenche a página com os dados =====
function montarPagina() {
  document.title = `${DADOS.apelido} — Currículo`;
  $("#nome").textContent = DADOS.nome;
  $("#rodape-nome").textContent = DADOS.nome;
  $("#ano").textContent = new Date().getFullYear();
  $("#sobre-texto").textContent = DADOS.sobre;

  $("#foto").innerHTML = DADOS.foto
    ? `<img src="${DADOS.foto}" alt="Foto de ${DADOS.apelido}">`
    : iniciais(DADOS.nome);

  $("#redes").innerHTML = DADOS.redes
    .filter((r) => r.noTopo !== false)
    .map((r) => `<a href="${r.url}" target="_blank" rel="noopener">${r.nome}</a>`)
    .join("");

  $("#contatos").innerHTML = DADOS.redes
    .map(
      (r) => `
      <a class="contato-item" href="${r.url}" target="_blank" rel="noopener">
        <span class="contato-rotulo">${r.nome}</span>
        <span class="contato-valor">${r.texto}</span>
      </a>`
    )
    .join("");

  $("#info").innerHTML = DADOS.info
    .map((i) => `<div><dt>${i.rotulo}</dt><dd>${i.valor}</dd></div>`)
    .join("");

  $("#commits").innerHTML = DADOS.trajetoria
    .map(
      (t) => `
      <li class="commit revelar">
        <div class="commit-cab">
          <span class="hash">${hashDe(t.titulo)}</span>
          <span class="ref">${t.tag}</span>
          <span class="tipo">${t.tipo}:</span>
          <span>${t.data}</span>
        </div>
        <h4>${t.titulo}</h4>
        <p>${t.texto}</p>
      </li>`
    )
    .join("");

  $("#lista-habilidades").innerHTML = DADOS.habilidades
    .map(
      (h) => `
      <div class="hab revelar">
        <div class="hab-topo"><span>${h.nome}</span><span>${h.nivel}%</span></div>
        <div class="barra"><i data-nivel="${h.nivel}"></i></div>
      </div>`
    )
    .join("");

  $("#idiomas").innerHTML = DADOS.idiomas
    .map((i) => `<span>${i.nome} · <b>${i.nivel}</b></span>`)
    .join("");

  $("#lista-projetos").innerHTML = DADOS.projetos
    .map(
      (p) => `
      <article class="repo revelar">
        <a class="repo-nome" href="${p.link}" target="_blank" rel="noopener">${p.nome}</a>
        <p>${p.descricao}</p>
        <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      </article>`
    )
    .join("");
}

// ===== Efeito de digitação dos cargos =====
function digitarCargos() {
  const alvo = $("#cargo-digitado");
  let i = 0, letra = 0, apagando = false;

  function passo() {
    const atual = DADOS.cargos[i];
    letra += apagando ? -1 : 1;
    alvo.textContent = atual.slice(0, letra);

    let espera = apagando ? 40 : 90;
    if (!apagando && letra === atual.length) { apagando = true; espera = 1800; }
    else if (apagando && letra === 0) { apagando = false; i = (i + 1) % DADOS.cargos.length; espera = 300; }
    setTimeout(passo, espera);
  }
  passo();
}

// ===== Tema claro/escuro (lembra a escolha do visitante) =====
function configurarTema() {
  let salvo = null;
  try { salvo = localStorage.getItem("tema"); } catch (e) {}
  if (salvo) document.documentElement.dataset.tema = salvo;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) document.documentElement.dataset.tema = "claro";

  $("#btn-tema").addEventListener("click", () => {
    const novo = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";
    document.documentElement.dataset.tema = novo;
    try { localStorage.setItem("tema", novo); } catch (e) {}
  });
}

// ===== Menu mobile e link ativo =====
function configurarMenu() {
  const menu = $("#menu");
  $("#btn-menu").addEventListener("click", () => menu.classList.toggle("aberto"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("aberto")));

  const links = [...menu.querySelectorAll("a")];
  const observador = new IntersectionObserver(
    (entradas) => entradas.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("ativo", l.getAttribute("href") === `#${e.target.id}`));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => observador.observe(s));
}

// ===== Animação ao rolar a página =====
function configurarRevelar() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visivel");
      e.target.querySelectorAll(".barra i").forEach((b) => (b.style.width = b.dataset.nivel + "%"));
      observador.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));
}

montarPagina();
digitarCargos();
configurarTema();
configurarMenu();
configurarRevelar();
