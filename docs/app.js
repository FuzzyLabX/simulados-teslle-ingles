// Armazenamento das tentativas.
// Se houver uma API de tentativas no mesmo endereço, ela é usada; senão, as tentativas ficam no localStorage deste navegador.
const LS_KEY = 'simulados-leitura-en:tentativas';

const Store = {
  modo: null,
  async init(){
    if (this.modo) return this.modo;
    try{
      const r = await fetch('api/tentativas', {cache:'no-store'});
      if (r.ok && (r.headers.get('content-type') || '').includes('json')){ this.modo = 'servidor'; return this.modo; }
    }catch(e){}
    this.modo = 'navegador';
    return this.modo;
  },
  _ler(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)) || []; }catch(e){ return []; } },
  _gravar(l){ try{ localStorage.setItem(LS_KEY, JSON.stringify(l)); return true; }catch(e){ return false; } },
  async listar(){
    await this.init();
    if (this.modo === 'servidor') return (await fetch('api/tentativas', {cache:'no-store'})).json();
    return this._ler();
  },
  // sim = simulado completo; respostas = {n: 'a'}; dificeis = [n]
  async registrar(sim, sid, respostas, dificeis, duracao_s){
    await this.init();
    if (this.modo === 'servidor'){
      const r = await fetch('api/tentativas', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({simulado:sid, respostas, dificeis, duracao_s})});
      if (!r.ok) throw new Error((await r.json()).erro || r.status);
      return r.json();
    }
    const questoes = sim.questoes.map((q,i)=>{ const n = i+1, m = respostas[n] || null;
      return {n, tipo:q.tipo, marcada:m, certa:m===q.resposta, dificil:dificeis.includes(n)}; });
    const d = new Date(), pad = x => String(x).padStart(2,'0');
    const t = {id: Math.random().toString(16).slice(2,12), simulado:sid, titulo:sim.titulo,
      data:`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      duracao_s: (duracao_s > 0 && duracao_s <= 6*3600) ? Math.round(duracao_s) : 0, acertos:questoes.filter(q=>q.certa).length, total:questoes.length, questoes};
    const l = this._ler(); l.push(t);
    if (!this._gravar(l)) throw new Error('o navegador bloqueou o armazenamento local');
    return t;
  },
  async apagar(id){
    await this.init();
    if (this.modo === 'servidor'){ await fetch('api/tentativas/' + encodeURIComponent(id), {method:'DELETE'}); return; }
    this._gravar(this._ler().filter(t=>t.id !== id));
  },
  // junta tentativas de um arquivo exportado (sem duplicar ids)
  importar(lista){
    const atual = this._ler(), ids = new Set(atual.map(t=>t.id));
    const novas = lista.filter(t=>t && t.id && t.questoes && !ids.has(t.id));
    this._gravar(atual.concat(novas).sort((a,b)=>a.data < b.data ? -1 : 1));
    return novas.length;
  },
};

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
