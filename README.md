# Portfólio — Rodrigo Pereira

**[rodrigonegao.github.io](https://rodrigonegao.github.io/)**

Portfólio pessoal bilíngue (PT/EN). HTML, CSS e JavaScript puro — sem build, sem dependências, sem `node_modules`.

---

## 🇧🇷 Português

### Como funciona

O site é servido direto da raiz do branch `master` pelo GitHub Pages. Não há etapa de build: o que está no repositório é exatamente o que vai ao ar.

Todo o **conteúdo** vive em dois arquivos JSON. Para atualizar o portfólio, você edita JSON — não HTML.

| Arquivo | O que contém |
|---|---|
| [`data/i18n.json`](data/i18n.json) | Todos os textos, em `pt` e `en`: interface, resumo, experiência, descrições de projeto, formação, certificações |
| [`data/projects.json`](data/projects.json) | Metadados dos projetos: tags, links de demo/repositório, ano, se é destaque ou código privado |

### Estrutura

```
index.html            marcação semântica + meta tags + JSON-LD
css/main.css          design tokens, grid, animações
js/i18n.js            detecta o idioma, aplica traduções, persiste a escolha
js/render.js          renderiza experiência, projetos, stack e formação
js/animations.js      scroll reveal, efeito de digitação, navbar, menu mobile
data/i18n.json        conteúdo em PT e EN
data/projects.json    lista de projetos
img/                  favicon e imagem de compartilhamento
```

> Se algum dia você adicionar uma pasta ou arquivo começando com `_` (ex.: `_data/`), crie um arquivo vazio chamado `.nojekyll` na raiz — sem ele o GitHub Pages passa o site pelo Jekyll, que ignora nomes iniciados por `_` ou `.`.

### Idiomas

O idioma é escolhido nesta ordem:

1. Escolha anterior salva em `localStorage`
2. `navigator.language` — começa com `pt` → português; qualquer outro → inglês
3. Botão PT/EN no topo troca a qualquer momento

As datas de experiência são formatadas em runtime com `Intl.DateTimeFormat`, então `dez/2022` vira `Dec 2022` sozinho — as datas ficam guardadas uma única vez em ISO (`"2022-12"`, e `null` significa "atual").

### Como editar

**Adicionar um projeto** — duas edições:

1. Em `data/projects.json`, acrescente um objeto:
   ```json
   {
     "id": "meu-projeto",
     "featured": false,
     "private": false,
     "year": "2026",
     "tags": ["TypeScript", "NestJS"],
     "demo": "https://exemplo.com",
     "repo": "https://github.com/RodrigoNegao/meu-projeto"
   }
   ```
   Use `"demo": null` se não houver demo, e `"private": true` para trabalho profissional sem código público (o card mostra um selo em vez dos botões).

2. Em `data/i18n.json`, adicione o nome e a descrição em **`pt`** e em **`en`**, dentro de `projects.items`, usando o mesmo `id`:
   ```json
   "meu-projeto": { "name": "Meu Projeto", "desc": "O que ele faz." }
   ```

**Adicionar uma experiência** — insira um objeto em `experience.items`, nos dois idiomas. Os dois primeiros itens de `bullets` aparecem direto; o resto fica atrás do "Ver mais".

**Mudar qualquer texto fixo** — procure a chave em `data/i18n.json`. No HTML ela aparece como `data-i18n="hero.role"`; para atributos, como `data-i18n-attr="content"`.

> ⚠️ As chaves de `pt` e `en` precisam ser **idênticas**. Se você adicionar algo em um idioma, adicione no outro.

### Rodando localmente

O site carrega os JSONs via `fetch`, o que **não funciona** abrindo o `index.html` com duplo clique (bloqueio do protocolo `file://`). Use um servidor:

```bash
python -m http.server 8000
# depois abra http://localhost:8000
```

### Deploy

```bash
git add -A && git commit -m "atualiza portfólio" && git push
```

O GitHub Pages publica em ~1 minuto. Se não vir a mudança, force o refresh com `Ctrl+Shift+R`.

### Acessibilidade e performance

- Zero dependências externas além das fontes do Google Fonts
- Navegação completa por teclado, com foco sempre visível
- `prefers-reduced-motion` desliga todas as animações mantendo o conteúdo visível
- Sem JavaScript, o hero e os links de contato continuam legíveis
- Marcação semântica + JSON-LD `schema.org/Person`

---

## 🇬🇧 English

### How it works

The site is served straight from the root of the `master` branch by GitHub Pages. There is no build step — what is in the repository is exactly what ships.

All **content** lives in two JSON files. To update the portfolio you edit JSON, not HTML.

| File | Contents |
|---|---|
| [`data/i18n.json`](data/i18n.json) | Every string, in `pt` and `en`: UI, summary, experience, project descriptions, education, certifications |
| [`data/projects.json`](data/projects.json) | Project metadata: tags, demo/repo links, year, featured and private flags |

### Language selection

1. Previous choice saved in `localStorage`
2. `navigator.language` — starts with `pt` → Portuguese; anything else → English
3. The PT/EN switch in the header overrides it at any time

Experience dates are formatted at runtime with `Intl.DateTimeFormat`, so `dez/2022` becomes `Dec 2022` automatically — dates are stored once in ISO form (`"2022-12"`; `null` means "present").

### Editing

**Add a project** — two edits: append an object to `data/projects.json` (see the Portuguese example above), then add `name` and `desc` under `projects.items` in **both** `pt` and `en` in `data/i18n.json`, keyed by the same `id`.

**Add a job** — append an object to `experience.items` in both languages. The first two `bullets` show by default; the rest go behind "Show more".

> ⚠️ The `pt` and `en` key trees must stay **identical**.

### Running locally

The page loads its JSON via `fetch`, which does **not** work when opening `index.html` directly from disk (`file://` is blocked). Serve it:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

### Deploy

Push to `master`. GitHub Pages publishes within about a minute.

---

© 2019–present Rodrigo Pereira
