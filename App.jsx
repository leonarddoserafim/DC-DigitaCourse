/* Digita Course – protótipo em React (arquivo único).
   Em um projeto Vite, troque a linha abaixo por: import { useState, useEffect, useRef } from "react"; e use `export default App`. */
const { useState, useEffect, useRef } = React;

const L = (id, title, diff, text) => ({ id, title, diff, text });
const seed = () => ({
  nextId: 100, ach: {}, attempts: [],
  users: [
    { id: 1, name: "Miguel (Admin)", email: "admin@dc.com", role: "ADMIN", pub: false, best: 0 },
    { id: 2, name: "Aluno Demo", email: "aluno@dc.com", role: "ALUNO", pub: true, best: 0 },
    { id: 3, name: "Irene", email: "irene@dc.com", role: "ALUNO", pub: true, best: 48 },
    { id: 4, name: "Leonardo", email: "leo@dc.com", role: "ALUNO", pub: true, best: 42 },
    { id: 5, name: "Luiz", email: "luiz@dc.com", role: "ALUNO", pub: true, best: 37 },
    { id: 6, name: "Camila", email: "cami@dc.com", role: "ALUNO", pub: false, best: 55 },
  ],
  courses: [
    { id: 1, title: "Fileira base", desc: "Posicione os dedos e domine a fileira do meio.", lessons: [
      L(1, "Dedos na base", "EASY", "asdf jkl asdf jkl sad lad fall salsa dada"),
      L(2, "Primeiras palavras", "EASY", "a casa da vovo e salgada e sada dela fala da lasca"),
      L(3, "Combinando letras", "MEDIUM", "kaka jaja fala saia sala lage gaja haja hall alas")] },
    { id: 2, title: "Palavras do dia a dia", desc: "Frases curtas que voce realmente escreve.", lessons: [
      L(4, "Cumprimentos", "EASY", "bom dia, tudo bem? boa tarde, ate logo."),
      L(5, "No trabalho", "MEDIUM", "vou enviar o relatorio ate o fim do dia."),
      L(6, "Na praia", "MEDIUM", "o mar de santos esta calmo e o sol aparece cedo.")] },
    { id: 3, title: "Velocidade e precisao", desc: "Textos maiores para ganhar ritmo sem errar.", lessons: [
      L(7, "Ritmo constante", "HARD", "quem digita com calma erra menos e acaba chegando mais rapido ao fim do texto."),
      L(8, "Desafio relampago", "HARD", "a pratica diaria transforma o esforco em habito e o habito em velocidade.")] },
  ],
  challenges: [
    { id: 1, title: "Conclua 3 aulas", period: "Diário", goal: 3, kind: "lessons" },
    { id: 2, title: "Alcance 25 PPM", period: "Semanal", goal: 25, kind: "wpm" },
    { id: 3, title: "Conclua 10 aulas", period: "Mensal", goal: 10, kind: "lessons" },
  ],
});
const ACH = [
  ["first", "Primeira aula concluída", a => a.length >= 1],
  ["w25", "25 PPM alcançados", a => a.some(x => x.wpm >= 25)],
  ["acc", "Precisão de 98% ou mais", a => a.some(x => x.acc >= 98)],
  ["five", "5 tentativas registradas", a => a.length >= 5],
];
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ,.;?!]/g, "").replace(/\s+/g, " ").trim();
const avg = (a, k) => a.length ? Math.round(a.reduce((s, x) => s + x[k], 0) / a.length) : 0;
const allLessons = db => db.courses.flatMap(c => c.lessons);

/* ---------- features/auth ---------- */
function Login({ users, onLogin, onRegister, toast }) {
  const [reg, setReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(reg ? "" : "aluno@dc.com");
  const [lgpd, setLgpd] = useState(false);
  const submit = () => {
    if (!name.trim() || !email.trim()) return toast("Informe nome e e-mail.");
    if (!lgpd) return toast("É necessário aceitar o uso de dados (LGPD).");
    onRegister(name.trim(), email.trim());
  };
  return (
    <div className="card login">
      <div className="brand"><span className="logo">dc</span>Digita Course</div>
      <h1>{reg ? "Criar conta" : "Entrar"}</h1>
      <p className="mut">Aprenda a digitar com aulas curtas, metas e conquistas.</p>
      {reg && <><label htmlFor="nm">Nome</label><input id="nm" value={name} onChange={e => setName(e.target.value)} /></>}
      <label htmlFor="em">E-mail</label>
      <input id="em" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <label htmlFor="pw">Senha</label>
      <input id="pw" type="password" defaultValue="12345678" />
      {reg ? (
        <>
          <label className="ck"><input type="checkbox" checked={lgpd} onChange={e => setLgpd(e.target.checked)} />Concordo com o uso dos meus dados conforme a LGPD.</label>
          <p><button className="btn p" onClick={submit}>Criar conta</button> <button className="btn" onClick={() => setReg(false)}>Já tenho conta</button></p>
        </>
      ) : (
        <>
          <p><button className="btn p" onClick={() => onLogin("ALUNO")}>Entrar como Aluno</button> <button className="btn" onClick={() => onLogin("ADMIN")}>Entrar como Administrador</button></p>
          <p><button className="btn s" onClick={() => { setReg(true); setEmail(""); }}>Criar conta</button> <button className="btn s" onClick={() => toast("Link de redefinição enviado ao e-mail informado (simulado).")}>Esqueci a senha</button></p>
        </>
      )}
      <p className="note">Protótipo: qualquer senha é aceita. Perfis: Aluno e Administrador.</p>
    </div>
  );
}

/* ---------- features/dashboard ---------- */
function Dashboard({ db, me, mine, go }) {
  const done = new Set(mine.map(a => a.l));
  const last = mine.slice(-10);
  const mx = Math.max(30, ...last.map(x => x.wpm));
  return (
    <>
      <h1>Olá, {me.name.split(" ")[0]}</h1>
      <p className="mut">Seu desempenho nas últimas aulas.</p>
      <div className="grid">
        <div className="card"><div className="num">{avg(mine, "wpm")}</div>PPM médio</div>
        <div className="card"><div className="num">{mine.length ? avg(mine, "acc") + "%" : "–"}</div>Precisão média</div>
        <div className="card"><div className="num">{done.size}/{allLessons(db).length}</div>Aulas concluídas</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
        <div className="card">
          <h2>PPM por tentativa</h2>
          {mine.length ? (
            <svg className="ch" viewBox="0 0 300 110" role="img" aria-label="Gráfico de PPM">
              {last.map((x, i) => { const h = x.wpm / mx * 80; return (
                <g key={i}><rect x={i * 30 + 6} y={95 - h} width="20" height={h} rx="3" /><text x={i * 30 + 16} y="106" textAnchor="middle">{x.wpm}</text></g>); })}
            </svg>
          ) : (<><p className="mut">Nenhuma tentativa ainda. Comece uma aula para ver seu gráfico.</p><button className="btn p" onClick={() => go("courses")}>Ver cursos</button></>)}
        </div>
        <div className="card">
          <h2>Conquistas</h2>
          {ACH.map(([k, t]) => { const u = db.ach[me.id + k]; return (
            <div key={k} className={"ach " + (u ? "u" : "l")}><span>{u ? "★" : "–"}</span>{t}</div>); })}
        </div>
      </div>
      <div className="card">
        <h2>Progresso nos cursos</h2>
        {db.courses.map(c => { const n = c.lessons.filter(l => done.has(l.id)).length; const p = c.lessons.length ? n / c.lessons.length * 100 : 0; return (
          <div key={c.id}><div className="row"><b>{c.title}</b><span className="mut">{n}/{c.lessons.length}</span></div><div className="bar"><i style={{ width: p + "%" }} /></div></div>); })}
      </div>
    </>
  );
}

/* ---------- features/course ---------- */
function Courses({ db, mine, go }) {
  const done = new Set(mine.map(a => a.l));
  return (
    <>
      <h1>Cursos</h1>
      <p className="mut">Escolha uma aula. Seu progresso é salvo ao concluir.</p>
      {db.courses.map(c => (
        <div className="card" key={c.id}>
          <h2>{c.title}</h2><p className="mut">{c.desc}</p>
          {c.lessons.length === 0 && <p className="mut">Sem aulas neste curso.</p>}
          {c.lessons.map(l => { const b = Math.max(0, ...mine.filter(a => a.l === l.id).map(a => a.wpm)); return (
            <div className="lesson" key={l.id}>
              <div><b>{l.title}</b> <span className="tag">{l.diff}</span> {done.has(l.id) && <span className="tag">Concluída · {b} PPM</span>}</div>
              <button className="btn p s" onClick={() => go("typing", l.id)}>{done.has(l.id) ? "Repetir" : "Iniciar"}</button>
            </div>); })}
        </div>
      ))}
    </>
  );
}

/* ---------- features/typing ---------- */
const ROWS = ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm,."];
function Typing({ lesson, onFinish, onExit }) {
  const chars = [...lesson.text];
  const r = useRef({ i: 0, err: 0, t0: 0 });
  const fin = useRef(onFinish); fin.current = onFinish;
  const [, tick] = useState(0);
  const [bad, setBad] = useState(-1);
  const [lat, setLat] = useState("–");
  useEffect(() => {
    const iv = setInterval(() => tick(x => x + 1), 300);
    const onKey = e => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      e.preventDefault();
      const t = performance.now(), s = r.current;
      if (!s.t0) s.t0 = t;
      if (e.key.toLowerCase() === chars[s.i].toLowerCase()) {
        s.i++;
        if (s.i >= chars.length) {
          const sec = (performance.now() - s.t0) / 1000;
          return fin.current({ wpm: Math.round(chars.length / 5 / (sec / 60)), acc: Math.round(chars.length / (chars.length + s.err) * 100), err: s.err, dur: +sec.toFixed(1) });
        }
      } else { const at = s.i; s.err++; setBad(at); setTimeout(() => setBad(b => b === at ? -1 : b), 150); }
      setLat((performance.now() - t).toFixed(1) + " ms");
      tick(x => x + 1);
    };
    addEventListener("keydown", onKey);
    return () => { clearInterval(iv); removeEventListener("keydown", onKey); };
  }, [lesson.id]);
  const s = r.current, m = s.t0 ? (performance.now() - s.t0) / 60000 : 0;
  const next = (chars[s.i] || "").toLowerCase();
  return (
    <div className="card">
      <div className="row"><div><h2>{lesson.title}</h2><span className="tag">{lesson.diff}</span></div><button className="btn" onClick={onExit}>Sair da aula</button></div>
      <div className="txt" aria-label="Texto para digitar">
        {chars.map((c, i) => <span key={i} className={i < s.i ? "ok" : i === s.i ? (i === bad ? "cur bad" : "cur") : i === bad ? "bad" : ""}>{c}</span>)}
      </div>
      <div className="stats">
        <div><b>{m > 0 ? Math.round(s.i / 5 / m) : 0}</b>PPM</div>
        <div><b>{(s.i + s.err ? Math.round(s.i / (s.i + s.err) * 100) : 100) + "%"}</b>Precisão</div>
        <div><b>{s.err}</b>Erros</div>
        <div><b>{lat}</b>Feedback da tecla</div>
      </div>
      <div className="kb">
        {ROWS.map(row => <div className="kr" key={row}>{[...row].map(k => <div key={k} className={"key" + (k === next ? " next" : "")}>{k}</div>)}</div>)}
        <div className="kr"><div className={"key sp" + (next === " " ? " next" : "")}>espaço</div></div>
      </div>
      <p className="mut" style={{ textAlign: "center" }}>Digite o texto. O cronômetro começa na primeira tecla.</p>
    </div>
  );
}

function Result({ r, lesson, go }) {
  return (
    <div className="card">
      <h1>Aula concluída</h1><p className="mut">{lesson ? lesson.title : ""}</p>
      <div className="stats"><div><b>{r.wpm}</b>PPM</div><div><b>{r.acc}%</b>Precisão</div><div><b>{r.err}</b>Erros</div><div><b>{r.dur}s</b>Duração</div></div>
      {r.newAch.length > 0 && <><h3 style={{ marginTop: "1rem" }}>Novas conquistas</h3>{r.newAch.map(t => <div className="ach u" key={t}><span>★</span>{t}</div>)}</>}
      <h3 style={{ marginTop: "1rem" }}>Registro enviado à API (simulado)</h3>
      <pre>{"POST /api/attempts  →  201 Created\n" + JSON.stringify({ userId: r.u, classroomId: r.l, wpm: r.wpm, accuracy: r.acc, errors: r.err, duration: r.dur }, null, 1)}</pre>
      <p><button className="btn p" onClick={() => go("typing", r.l)}>Tentar de novo</button> <button className="btn" onClick={() => go("courses")}>Voltar aos cursos</button></p>
    </div>
  );
}

/* ---------- features/gamification ---------- */
function Challenges({ db, mine }) {
  return (
    <>
      <h1>Desafios</h1>
      <p className="mut">Metas diárias, semanais e mensais definidas pelos administradores.</p>
      <div className="grid">
        {db.challenges.map(c => { const v = c.kind === "wpm" ? Math.max(0, ...mine.map(x => x.wpm)) : mine.length; const p = Math.min(100, v / c.goal * 100); return (
          <div className="card" key={c.id}>
            <span className="tag">{c.period}</span><h2 style={{ marginTop: ".5rem" }}>{c.title}</h2>
            <div className="bar"><i style={{ width: p + "%" }} /></div>
            <span className="mut">{Math.min(v, c.goal)} de {c.goal}{p >= 100 ? " · Concluído" : ""}</span>
          </div>); })}
      </div>
    </>
  );
}

function Ranking({ db, me, mine, setPub }) {
  const best = u => u.id === me.id ? Math.max(u.best, 0, ...mine.map(a => a.wpm)) : u.best;
  const list = db.users.filter(u => u.pub && u.role === "ALUNO").sort((a, b) => best(b) - best(a));
  return (
    <>
      <h1>Ranking</h1><p className="mut">Só aparecem perfis públicos (REQ-013).</p>
      <div className="card"><label className="ck"><input type="checkbox" checked={me.pub} onChange={e => setPub(e.target.checked)} />Mostrar meu perfil no ranking</label></div>
      <div className="card wrap"><table><tbody>
        <tr><th>#</th><th>Aluno</th><th>Melhor PPM</th></tr>
        {list.map((u, i) => <tr key={u.id}><td>{i + 1}</td><td>{u.name}{u.id === me.id ? " (você)" : ""}</td><td>{best(u)}</td></tr>)}
      </tbody></table></div>
    </>
  );
}

/* ---------- features/admin ---------- */
function AdminContent({ db, upd, toast }) {
  const [tab, setTab] = useState("lessons");
  const [f, setF] = useState({ course: 1, title: "", diff: "MEDIUM", text: "" });
  const [c, setC] = useState({ title: "", period: "Diário", kind: "lessons", goal: 5 });
  const addLesson = () => {
    const text = norm(f.text);
    if (!f.title.trim() || text.length < 10) return toast("Informe um título e um texto com ao menos 10 caracteres.");
    upd(n => { n.courses.find(x => x.id === +f.course).lessons.push(L(n.nextId++, f.title.trim(), f.diff, text)); });
    setF({ ...f, title: "", text: "" }); toast("Aula publicada. Alunos notificados por e-mail (simulado).");
  };
  const delLesson = id => { upd(n => n.courses.forEach(x => x.lessons = x.lessons.filter(l => l.id !== id))); toast("Aula removida. Alunos notificados (simulado)."); };
  const addChal = () => {
    if (!c.title.trim() || +c.goal < 1) return toast("Informe título e meta válida.");
    upd(n => { n.challenges.push({ id: n.nextId++, title: c.title.trim(), period: c.period, goal: +c.goal, kind: c.kind }); });
    setC({ ...c, title: "" }); toast("Desafio agendado.");
  };
  return (
    <>
      <h1>Gerenciar conteúdo</h1>
      <p><button className={"btn " + (tab === "lessons" ? "p" : "")} onClick={() => setTab("lessons")}>Aulas</button> <button className={"btn " + (tab === "chals" ? "p" : "")} onClick={() => setTab("chals")}>Desafios</button></p>
      {tab === "lessons" ? (
        <>
          <div className="card">
            <h2>Nova aula</h2>
            <label htmlFor="ac">Curso</label>
            <select id="ac" value={f.course} onChange={e => setF({ ...f, course: e.target.value })}>{db.courses.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select>
            <label htmlFor="at">Título</label><input id="at" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
            <label htmlFor="ad">Dificuldade</label>
            <select id="ad" value={f.diff} onChange={e => setF({ ...f, diff: e.target.value })}><option>EASY</option><option>MEDIUM</option><option>HARD</option></select>
            <label htmlFor="ax">Texto da aula</label><textarea id="ax" rows="3" value={f.text} onChange={e => setF({ ...f, text: e.target.value })} />
            <p><button className="btn p" onClick={addLesson}>Publicar aula</button></p>
          </div>
          <div className="card wrap"><table><tbody>
            {allLessons(db).length === 0 && <tr><td>Nenhuma aula cadastrada.</td></tr>}
            {db.courses.flatMap(x => x.lessons.map(l => <tr key={l.id}><td>{l.title}</td><td className="mut">{x.title}</td><td>{l.diff}</td><td><button className="btn s" onClick={() => delLesson(l.id)}>Remover</button></td></tr>))}
          </tbody></table></div>
        </>
      ) : (
        <>
          <div className="card">
            <h2>Novo desafio</h2>
            <label htmlFor="ct">Título</label><input id="ct" value={c.title} onChange={e => setC({ ...c, title: e.target.value })} />
            <label htmlFor="cp">Período</label>
            <select id="cp" value={c.period} onChange={e => setC({ ...c, period: e.target.value })}><option>Diário</option><option>Semanal</option><option>Mensal</option></select>
            <label htmlFor="ck">Tipo de meta</label>
            <select id="ck" value={c.kind} onChange={e => setC({ ...c, kind: e.target.value })}><option value="lessons">Aulas concluídas</option><option value="wpm">PPM alcançado</option></select>
            <label htmlFor="cg">Meta</label><input id="cg" type="number" min="1" value={c.goal} onChange={e => setC({ ...c, goal: e.target.value })} />
            <p><button className="btn p" onClick={addChal}>Agendar desafio</button></p>
          </div>
          <div className="card wrap"><table><tbody>
            {db.challenges.map(x => <tr key={x.id}><td>{x.title}</td><td>{x.period}</td><td><button className="btn s" onClick={() => upd(n => { n.challenges = n.challenges.filter(y => y.id !== x.id); })}>Remover</button></td></tr>)}
          </tbody></table></div>
        </>
      )}
    </>
  );
}

function Users({ db, me, upd, toast }) {
  return (
    <>
      <h1>Usuários</h1><p className="mut">Controle de acesso por perfil.</p>
      <div className="card wrap"><table><tbody>
        <tr><th>Nome</th><th>E-mail</th><th>Perfil</th></tr>
        {db.users.map(u => (
          <tr key={u.id}><td>{u.name}</td><td className="mut">{u.email}</td>
            <td><select aria-label={"Perfil de " + u.name} value={u.role} disabled={u.id === me.id}
              onChange={e => { const v = e.target.value; upd(n => { n.users.find(x => x.id === u.id).role = v; }); toast("Perfil atualizado."); }}>
              <option>ALUNO</option><option>ADMIN</option></select></td></tr>))}
      </tbody></table></div>
    </>
  );
}

/* ---------- App (rotas, estado global e controle de acesso) ---------- */
function App() {
  const [db, setDb] = useState(seed);
  const [uid, setUid] = useState(null);
  const [view, setView] = useState("dash");
  const [arg, setArg] = useState(null);
  const [last, setLast] = useState(null);
  const [msg, setMsg] = useState("");
  const toastRef = useRef();
  const toast = m => { setMsg(m); clearTimeout(toastRef.current); toastRef.current = setTimeout(() => setMsg(""), 3000); };
  const upd = fn => setDb(d => { const n = structuredClone(d); fn(n); return n; });
  const go = (v, a) => { setView(v); if (a !== undefined) setArg(a); };
  const me = db.users.find(u => u.id === uid);
  const mine = db.attempts.filter(a => a.u === uid);

  const finish = res => {
    const att = { u: uid, l: arg, ...res }, a = [...mine, att], newAch = [];
    ACH.forEach(([k, t, f]) => { if (!db.ach[uid + k] && f(a)) newAch.push(t); });
    upd(n => { n.attempts.push(att); ACH.forEach(([k, t, f]) => { if (!n.ach[uid + k] && f(a)) n.ach[uid + k] = 1; }); });
    setLast({ ...att, newAch }); go("result");
  };

  let body;
  if (!me) {
    body = <Login users={db.users} toast={toast}
      onLogin={role => { setUid(db.users.find(u => u.role === role).id); go("dash"); toast("Autenticado. Token JWT gerado (simulado)."); }}
      onRegister={(name, email) => { const id = db.nextId; upd(n => { n.users.push({ id: n.nextId++, name, email, role: "ALUNO", pub: false, best: 0 }); }); setUid(id); go("dash"); toast("Conta criada com perfil Aluno."); }} />;
  } else {
    const isAdmin = me.role === "ADMIN";
    const nav = [["dash", "Painel"], ["courses", "Cursos"], ["chal", "Desafios"], ["rank", "Ranking"], ...(isAdmin ? [["admin", "Conteúdo"], ["users", "Usuários"]] : [])];
    const v = (["admin", "users"].includes(view) && !isAdmin) ? "dash" : view;
    const act = v === "typing" || v === "result" ? "courses" : v;
    const lesson = allLessons(db).find(l => l.id === arg);
    let page;
    if (v === "dash") page = <Dashboard db={db} me={me} mine={mine} go={go} />;
    else if (v === "courses") page = <Courses db={db} mine={mine} go={go} />;
    else if (v === "typing" && lesson) page = <Typing key={lesson.id} lesson={lesson} onFinish={finish} onExit={() => go("courses")} />;
    else if (v === "result" && last) page = <Result r={last} lesson={lesson} go={go} />;
    else if (v === "chal") page = <Challenges db={db} mine={mine} />;
    else if (v === "rank") page = <Ranking db={db} me={me} mine={mine} setPub={p => { upd(n => { n.users.find(u => u.id === uid).pub = p; }); toast(p ? "Seu perfil agora é público." : "Seu perfil agora é privado."); }} />;
    else if (v === "admin") page = <AdminContent db={db} upd={upd} toast={toast} />;
    else if (v === "users") page = <Users db={db} me={me} upd={upd} toast={toast} />;
    else page = <Dashboard db={db} me={me} mine={mine} go={go} />;
    body = (
      <>
        <header>
          <div className="brand"><span className="logo">dc</span>Digita Course</div>
          <nav>{nav.map(([k, t]) => <button key={k} className={act === k ? "on" : ""} onClick={() => go(k)}>{t}</button>)}</nav>
          <span className="mut">{me.name} · {me.role}</span>
          <button className="btn s" onClick={() => { setUid(null); go("dash"); }}>Sair</button>
        </header>
        <main>{page}<p className="note">Protótipo em React do Documento de Arquitetura. Dados mantidos apenas em memória.</p></main>
      </>
    );
  }
  return <>{body}<div id="toast" className={msg ? "on" : ""} role="status">{msg}</div></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
