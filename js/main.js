// main.js — versão enxuta do script do template: só o que este currículo usa.
(function ($) {
  "use strict";

  // Ajusta a altura do contêiner à página (aba) visível
  function ajustarAltura() {
    $(".subpages").height($(".pt-page-current").height() + 50);
  }

  // Esconde o menu lateral depois de clicar, em telas pequenas
  function esconderMenuMobile() {
    if ($(window).width() < 1024) $("#site_header").addClass("mobile-menu-hide");
  }

  $(window)
    .on("load", function () {
      $(".preloader").fadeOut("slow");
      if ($(".subpages")[0]) PageTransitions.init({ menu: "ul.site-main-menu" });
      ajustarAltura();
    })
    .on("resize", function () {
      esconderMenuMobile();
      setTimeout(ajustarAltura, 500);
    })
    .on("scroll", function () {
      $(".header").toggleClass("sticked", $(window).scrollTop() >= 20);
    })
    .on("hashchange", function () {
      setTimeout(ajustarAltura, 700);
    });

  $(function () {
    $(".menu-toggle").on("click", function () {
      $("#site_header").toggleClass("mobile-menu-hide");
    });
    $(".site-main-menu").on("click", "a", esconderMenuMobile);

    // Cargos girando abaixo do nome
    $(".text-rotation").owlCarousel({
      loop: true, dots: false, nav: false, margin: 0, items: 1,
      autoplay: true, autoplayTimeout: 3800, animateOut: "zoomOut", animateIn: "zoomIn",
    });

    // Ano atual no rodapé
    $("#ano").text(new Date().getFullYear());
  });
})(jQuery);
