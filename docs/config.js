// Configuração do apoio voluntário (doação).
// Cole aqui o link da sua página no LivePix (ou outra plataforma). Enquanto estiver vazio, nada aparece no site.
window.APOIO = {
  url: 'https://livepix.gg/fuzzylabx',
  texto: 'Este projeto é gratuito. Se ele te ajudou, considere apoiar.',
  botao: 'Apoiar com Pix',
};

// Dúvidas, erros e sugestões: página de issues do repositório no GitHub.
// Deixe '' para calcular sozinho a partir do endereço do GitHub Pages (conta.github.io/repositorio → github.com/conta/repositorio/issues).
window.FEEDBACK = { issues: 'https://github.com/FuzzyLabX/simulados-teslle-ingles/issues' };
window.urlIssues = function(){
  const f = (window.FEEDBACK || {}).issues;
  if (f) return f.replace(/\/$/, '');
  const h = location.hostname, m = h.match(/^([^.]+)\.github\.io$/i);
  if (!m) return '';
  const repo = location.pathname.split('/').filter(Boolean)[0];
  return repo && !/\.html$/.test(repo) ? `https://github.com/${m[1]}/${repo}/issues` : '';
};

// Preenche qualquer elemento com o atributo data-apoio (fica escondido se não houver link).
(function(){
  function preencher(){
    const a = window.APOIO || {};
    document.querySelectorAll('[data-apoio]').forEach(el => {
      if (!a.url){ el.hidden = true; return; }
      el.hidden = false;
      el.innerHTML = '';
      const t = document.createElement('span');
      t.textContent = a.texto + ' ';
      const l = document.createElement('a');
      l.href = a.url; l.target = '_blank'; l.rel = 'noopener';
      l.textContent = a.botao;
      el.append(t, l);
    });
  }
  window.preencherApoio = preencher;
  // links de dúvidas e sugestões
  const issues = window.urlIssues();
  document.querySelectorAll('[data-feedback]').forEach(el => {
    if (!issues){ el.hidden = true; return; }
    el.hidden = false; el.innerHTML = '';
    const t = document.createElement('span'); t.textContent = 'Dúvidas, erros ou sugestões? ';
    const l = document.createElement('a'); l.href = issues; l.target = '_blank'; l.rel = 'noopener';
    l.textContent = 'Fale com a gente no GitHub';
    el.append(t, l);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preencher);
  else preencher();
})();
