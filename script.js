/**
 * DADOS FICTÍCIOS PADRONIZADOS — 9º ANO
 */
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Estado de ordenação da tabela
let ordenacaoAtual = { coluna: null, ascendente: true };

/**
 * Normaliza notas para a escala de 0 a 10.
 */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "string") valor = valor.replace(",", ".");
  
  const num = Number(valor);
  if (isNaN(num)) return null;

  if (num >= 0 && num <= 10) return num;
  if (num > 10 && num <= 100) return num / 10;
  return null;
}

function calcularMedia(notas) {
  const validas = notas.filter(n => n !== null);
  if (validas.length === 0) return null;
  return validas.reduce((acc, c) => acc + c, 0) / validas.length;
}

function somarFaltas(faltas) {
  return faltas.reduce((acc, c) => acc + c, 0);
}

function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

/**
 * Processa o dataset bruto e constrói objetos tratados
 */
function processarDados() {
  return dadosDisciplinas.map(item => {
    const tri1 = normalizarNota(item.tri1);
    const tri2 = normalizarNota(item.tri2);
    const tri3 = normalizarNota(item.tri3);
    const media = calcularMedia([tri1, tri2, tri3]);
    const totalFaltas = somarFaltas(item.faltas);

    let situacaoTexto = "Nota ainda não disponível";
    let situacaoClasse = "status-indisponivel";

    if (media !== null) {
      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        situacaoClasse = "status-bom";
      } else {
        situacaoTexto = "Atenção";
        situacaoClasse = "status-atencao";
      }
    }

    return {
      disciplina: item.disciplina,
      tri1, tri2, tri3,
      media,
      totalFaltas,
      situacaoTexto,
      situacaoClasse
    };
  });
}

/**
 * Animação fluida de contagem numérica nos cards (Count-Up Animation)
 */
function animarContador(idElemento, valorFinal, eDecimal = false) {
  const el = document.getElementById(idElemento);
  if (!el || valorFinal === null || isNaN(valorFinal)) return;

  let inicio = 0;
  const duracao = 800; // ms
  const passos = 30;
  const incremento = valorFinal / passos;
  const tempoPasso = duracao / passos;

  const timer = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      inicio = valorFinal;
      clearInterval(timer);
    }
    el.textContent = eDecimal 
      ? inicio.toFixed(1).replace(".", ",") 
      : Math.floor(inicio);
  }, tempoPasso);
}

/**
 * Renderiza a tabela HTML com base em um array de dados
 */
function renderizarTabela(lista) {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  lista.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td class="text-center">${formatarNota(item.tri1)}</td>
      <td class="text-center">${formatarNota(item.tri2)}</td>
      <td class="text-center">${formatarNota(item.tri3)}</td>
      <td class="text-center"><strong>${formatarNota(item.media)}</strong></td>
      <td class="text-center">${item.totalFaltas}</td>
      <td class="text-center">
        <span class="badge-status ${item.situacaoClasse}">${item.situacaoTexto}</span>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

/**
 * Configura ordenação interativa nas colunas da tabela
 */
function configurarOrdenacao(dadosProcessados) {
  const cabecalhos = document.querySelectorAll(".col-sortable");

  cabecalhos.forEach(th => {
    th.addEventListener("click", () => {
      const coluna = th.getAttribute("data-col");

      if (ordenacaoAtual.coluna === coluna) {
        ordenacaoAtual.ascendente = !ordenacaoAtual.ascendente;
      } else {
        ordenacaoAtual.coluna = coluna;
        ordenacaoAtual.ascendente = true;
      }

      dadosProcessados.sort((a, b) => {
        let valA = a[coluna];
        let valB = b[coluna];

        if (valA === null) return 1;
        if (valB === null) return -1;

        if (typeof valA === "string") {
          return ordenacaoAtual.ascendente 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }

        return ordenacaoAtual.ascendente ? valA - valB : valB - valA;
      });

      renderizarTabela(dadosProcessados);
    });
  });
}

/**
 * Inicialização principal do Dashboard
 */
function inicializarDashboard() {
  const dados = processarDados();

  // 1. Renderiza tabela inicial
  renderizarTabela(dados);

  // 2. Calcula métricas gerais
  const disciplinasComMedia = dados.filter(d => d.media !== null);
  const mediaGeral = disciplinasComMedia.reduce((acc, c) => acc + c.media, 0) / disciplinasComMedia.length;
  const totalFaltasGeral = dados.reduce((acc, c) => acc + c.totalFaltas, 0);
  const qtdBomDesempenho = dados.filter(d => d.media !== null && d.media >= 6.0).length;
  const qtdAtencao = dados.filter(d => d.media !== null && d.media < 6.0).length;

  // 3. Executa animações de contagem
  animarContador("media-geral", mediaGeral, true);
  animarContador("total-faltas", totalFaltasGeral, false);
  animarContador("qtd-bom-desempenho", qtdBomDesempenho, false);
  animarContador("qtd-atencao", qtdAtencao, false);

  // 4. Habilita filtros interativos
  configurarOrdenacao(dados);
}

document.addEventListener("DOMContentLoaded", inicializarDashboard);