// Tema claro/escuro. Carregado no <head> (sem defer) para aplicar a escolha antes de pintar a página.
// Sem escolha salva, segue o sistema. O botão [data-tema] alterna entre claro e escuro e lembra a escolha.
(function(){
  var KEY = 'simulados-leitura-en:tema', root = document.documentElement;
  try{ var t = localStorage.getItem(KEY); if (t === 'light' || t === 'dark') root.dataset.theme = t; }catch(e){}
  function atual(){
    return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  var SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function pintar(){
    var escuro = atual() === 'dark';
    document.querySelectorAll('[data-tema]').forEach(function(b){
      b.innerHTML = escuro ? SOL : LUA;
      b.setAttribute('aria-label', escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      b.title = b.getAttribute('aria-label');
    });
  }
  document.addEventListener('click', function(e){
    if (!e.target.closest('[data-tema]')) return;
    var novo = atual() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = novo;
    try{ localStorage.setItem(KEY, novo); }catch(err){}
    pintar();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', pintar);
  document.addEventListener('DOMContentLoaded', pintar);
})();
