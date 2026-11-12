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

  const linksRedes = DADOS.redes
    .map((r) => `<a href="${r.url}" target="_blank" rel="noopener">${r.nome}</a>`)
    .join("");
  $("#redes").innerHTML = linksRedes;
  $("#contatos").innerHTML = linksRedes;

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

// ===== Terminal interativo (o diferencial do projeto) =====
function configurarTerminal() {
  const corpo = $("#term-corpo");
  const entrada = $("#term-input");
  const historico = [];
  let posHist = 0;

  const escrever = (texto, classe = "") => {
    const linha = document.createElement("div");
    if (classe) linha.className = classe;
    linha.textContent = texto;
    corpo.appendChild(linha);
    corpo.scrollTop = corpo.scrollHeight;
  };

  const comandos = {
    help: () =>
      "Comandos disponíveis:\n" +
      "  whoami         quem sou eu\n" +
      "  git log        minha trajetória\n" +
      "  git branch     minhas habilidades\n" +
      "  git remote -v  onde me encontrar\n" +
      "  ls             meus projetos\n" +
      "  git status     o que estou fazendo agora\n" +
      "  tema           alterna tema claro/escuro\n" +
      "  clear          limpa a tela",
    whoami: () => `${DADOS.nome}\n${DADOS.cargos.join(" · ")}`,
    "git log": () =>
      DADOS.trajetoria.map((t) => `commit ${hashDe(t.titulo)} (${t.tag})\n    ${t.data} — ${t.titulo}`).join("\n\n"),
    "git log --oneline": () => DADOS.trajetoria.map((t) => `${hashDe(t.titulo)} ${t.titulo}`).join("\n"),
    "git branch": () => DADOS.habilidades.map((h, i) => `${i === 0 ? "*" : " "} ${h.nome.padEnd(20)} ${h.nivel}%`).join("\n"),
    "git remote -v": () => DADOS.redes.map((r) => `${r.nome.toLowerCase().padEnd(10)} ${r.url}`).join("\n"),
    ls: () => DADOS.projetos.map((p) => `${p.nome}/`).join("   "),
    "git status": () =>
      "On branch main\nYour branch is up to date with 'origin/main'.\n\n" +
      "Em andamento:\n  modified:   capacitacao-asimov-jr (Ciência de Dados)\n  new file:   aprendendo-git-flow.md",
    tema: () => { $("#btn-tema").click(); return "Tema alterado."; },
    "git push": () => "Everything up-to-date ✔  (o currículo já está publicado!)",
    sudo: () => "Permissão negada: nem com sudo você me contrata sem conversar antes 😄",
  };

  escrever(`Bem-vindo ao terminal do ${DADOS.apelido}! Digite "help" para começar.`, "info-t");

  $("#term-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const cmd = entrada.value.trim();
    entrada.value = "";
    if (!cmd) return;
    historico.push(cmd);
    posHist = historico.length;
    escrever(`$ ${cmd}`, "cmd");

    const chave = cmd.toLowerCase().replace(/\s+/g, " ");
    if (chave === "clear") { corpo.innerHTML = ""; return; }
    const acao = comandos[chave] || (chave.startsWith("sudo") && comandos.sudo);
    if (acao) escrever(acao());
    else escrever(`git: '${cmd}' não é um comando conhecido. Digite "help".`, "erro");
  });

  // Setas para cima/baixo navegam pelo histórico, como num terminal de verdade
  entrada.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowUp" && posHist > 0) entrada.value = historico[--posHist];
    else if (ev.key === "ArrowDown") {
      posHist = Math.min(posHist + 1, historico.length);
      entrada.value = historico[posHist] || "";
    } else return;
    ev.preventDefault();
  });

  $("#term").addEventListener("click", () => entrada.focus());
}

montarPagina();
digitarCargos();
configurarTema();
configurarMenu();
configurarRevelar();
configurarTerminal();
