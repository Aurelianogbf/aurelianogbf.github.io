/*
 * dados.js — TODAS as informações pessoais do currículo ficam aqui.
 * Para atualizar o site, basta editar este arquivo (não precisa mexer no HTML).
 */
const DADOS = {
  nome: "Aureliano Guimarães Belarmino Filho",
  apelido: "Aureliano",
  usuarioGithub: "aurelianogbf",
  foto: "", // opcional: caminho de uma foto, ex.: "img/foto.jpg". Vazio = mostra as iniciais

  cargos: [
    "Estudante de Ciência de Dados",
    "Trainee na Asimov Jr",
    "UNIFEI · Itajubá-MG",
  ],

  sobre:
    "Olá! Eu sou o Aureliano, tenho 19 anos e sou estudante de Ciência de Dados na Universidade " +
    "Federal de Itajubá (UNIFEI). Também sou trainee da Diretoria de Projetos da Asimov Jr. Gosto de " +
    "entender como as coisas funcionam por dentro e de transformar dados em decisões. Este currículo " +
    "foi construído durante a capacitação de Git e GitHub e é versionado como um projeto de software " +
    "de verdade: cada etapa abaixo é um \"commit\" da minha trajetória.",

  info: [
    { rotulo: "Idade", valor: "19 anos" },
    { rotulo: "Nacionalidade", valor: "Brasil" },
    { rotulo: "Cidade/Estado", valor: "Itajubá, MG" },
    { rotulo: "E-mail", valor: "aurelianogbfilho@gmail.com" },
    { rotulo: "Telefone", valor: "+55 (35) 98861-4671" },
  ],

  redes: [
    { nome: "GitHub", url: "https://github.com/aurelianogbf" },
    { nome: "LinkedIn", url: "https://www.linkedin.com/in/aurelianogbfilho/" },
    { nome: "E-mail", url: "mailto:aurelianogbfilho@gmail.com" },
  ],

  // Linha do tempo exibida como um "git log". Do mais recente para o mais antigo.
  trajetoria: [
    {
      data: "2026",
      tag: "HEAD -> main",
      tipo: "feat",
      titulo: "Trainee — Asimov Jr (Diretoria de Projetos)",
      texto:
        "Capacitação em Ciência de Dados: Git, GitHub, Git Flow, GitHub Copilot e desenvolvimento deste currículo online.",
    },
    {
      data: "2026 — atual",
      tag: "develop",
      tipo: "feat",
      titulo: "Graduação em Ciência de Dados — UNIFEI",
      texto: "Universidade Federal de Itajubá, Itajubá-MG. Ingresso em 2026.",
    },
    {
      data: "2025",
      tag: "v1.0.0",
      tipo: "init",
      titulo: "Ensino Médio — Colégio Marista Varginha",
      texto: "Primeiro commit da jornada: concluído em 2025, onde nasceu o interesse por tecnologia e dados.",
    },
  ],

  // Cada habilidade vira uma "branch". nivel vai de 0 a 100.
  habilidades: [
    { nome: "Git & GitHub", nivel: 80 },
    { nome: "HTML & CSS", nivel: 70 },
    { nome: "JavaScript", nivel: 50 },
    { nome: "Python", nivel: 55 },
    { nome: "Análise de Dados", nivel: 40 },
    { nome: "VS Code + Copilot", nivel: 75 },
  ],

  idiomas: [
    { nome: "Português", nivel: "Fluente" },
    { nome: "Inglês", nivel: "Avançado" },
  ],

  projetos: [
    {
      nome: "curriculo-online",
      descricao:
        "Este site. HTML, CSS e JavaScript puros, publicado com GitHub Pages e organizado com Git Flow (main, develop e feature/*).",
      tags: ["HTML", "CSS", "JS", "GitHub Pages"],
      link: "https://github.com/aurelianogbf/aurelianogbf.github.io",
    },
    {
      nome: "manual-git-github",
      descricao:
        "Guia de consulta próprio com os comandos estudados na capacitação, do repositório local à publicação no GitHub.",
      tags: ["Git", "Documentação"],
      link: "docs/guia-git-github.pdf",
    },
  ],
};
