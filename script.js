const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 100);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const projectBack = document.querySelector('.project-back');
const projectBackWrap = document.querySelector('.project-back-wrap');

if (projectBack && projectBackWrap) {
  if ('IntersectionObserver' in window) {
    // observa o wrapper (que tem altura fixa e nunca vira position:fixed),
    // evitando qualquer alteração de layout que pudesse mexer na rolagem
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        projectBack.classList.toggle('is-floating', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(projectBackWrap);
  } else {
    // fallback simples para navegadores sem suporte a IntersectionObserver
    window.addEventListener('scroll', () => {
      projectBack.classList.toggle('is-floating', window.scrollY > 300);
    });
  }
}

const nav = document.getElementById("nav");
const pill = document.getElementById("pill");

if (nav && pill) {
  const links = [...nav.querySelectorAll("a")];

  function moverPill(link) {
    pill.style.width = link.offsetWidth + "px";
    pill.style.transform = "translateX(" + (link.offsetLeft - 3) + "px)";
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  }

  // ao clicar: anima a pílula, depois navega
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const destino = link.getAttribute("href");
      // se já é a página atual, não faz nada
      if (link.classList.contains("active")) { e.preventDefault(); return; }
      e.preventDefault();              // segura a navegação
      moverPill(link);                 // desliza a pílula
      setTimeout(() => {               // navega depois do deslize
        window.location.href = destino;
      }, 280);
    });
  });

  // posiciona no item ativo ao abrir, sem animar
  function posicionarInicial() {
    const ativo = nav.querySelector("a.active");
    if (!ativo) return;
    pill.style.transition = "none";
    pill.style.width = ativo.offsetWidth + "px";
    pill.style.transform = "translateX(" + (ativo.offsetLeft - 3) + "px)";
    pill.offsetWidth;                  // aplica sem animar
    pill.style.transition = "";        // religa pra animar nos cliques
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(posicionarInicial);
  } else {
    window.addEventListener("load", posicionarInicial);
  }

  window.addEventListener("resize", posicionarInicial);
}



const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot) {
  let visivel = false;

  // insere o "+" (pontas arredondadas) dentro da bolinha, escondido por padrão
  cursorDot.innerHTML = `
    <svg class="cursor-plus" viewBox="0 0 24 24" fill="none"
         stroke="#ffffff" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5V19"></path>
      <path d="M5 12H19"></path>
    </svg>`;

  function moverCursor(e) {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    if (!visivel) {
      cursorDot.style.opacity = '1';
      visivel = true;
    }
    // guarda a posição para o próximo carregamento de página
    try {
      sessionStorage.setItem('cursorPos', e.clientX + ',' + e.clientY);
    } catch (err) { /* sessionStorage indisponível: ignora */ }
  }

  // ao carregar: posiciona a bolinha onde o mouse estava por último
  // (normalmente o link clicado), antes mesmo do primeiro evento — assim
  // o cursor nativo fica escondido por baixo dela sem precisar mover o mouse
  try {
    const salvo = sessionStorage.getItem('cursorPos');
    if (salvo) {
      const [x, y] = salvo.split(',');
      cursorDot.style.left = x + 'px';
      cursorDot.style.top = y + 'px';
      cursorDot.style.opacity = '1';
      visivel = true;
    }
  } catch (err) { /* ignora */ }

  // movimento normal
  window.addEventListener('mousemove', moverCursor);

  // pega a posição assim que o ponteiro toca a página (resolve o cursor
  // parado logo após carregar, sem precisar mover o mouse)
  window.addEventListener('mouseover', moverCursor);

  // reaparece ao voltar pra janela; some ao sair
  document.addEventListener('mouseenter', moverCursor);
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    visivel = false;
  });

  // cresce sobre elementos clicáveis usando classe (não mexe na posição)
  const clicaveis = document.querySelectorAll('a, button, .project, input, textarea, [role="button"]');
  clicaveis.forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hover'));
  });

  // ao sair da página (clique em link), esconde a bolinha pra não "congelar"
  window.addEventListener('beforeunload', () => {
    cursorDot.style.opacity = '0';
  });
}