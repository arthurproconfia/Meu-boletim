// Dados fictícios padronizados das disciplinas (brutos)
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

// NOTA: A frequência exibida no card (92%) é APENAS FICTÍCIA/DEMONSTRATIVA para esta etapa.

/**
 * Função para normalizar qualquer valor de nota para a escala de 0 a 10.
 */
function normalizarNota(valor) {
  // Trata valores ausentes, nulos ou indefinidos
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto com vírgula decimal, converte para ponto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  const num = Number(valor);

  // Se não for um número válido, descarta
  if (isNaN(num)) {
    return null;
  }

  // Regra: de 0 a 10
  if (num >= 0 && num <= 10) {
    return num;
  }

  // Regra: maiores que 10 e menores ou iguais a 100 dividem por 10
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  // Qualquer outro valor é inválido
  return null;
}

/**
 * Calcula a média simples usando apenas as notas válidas disponíveis.
 */
function calcularMedia(notas) {
  const notasValidas = notas.filter(n => n !== null);
  if (notasValidas.length === 0) return null;

  const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
  return soma / notasValidas.length;
}

/**
 * Soma o total de faltas dos trimestres.
 */
function somarFaltas(listaFaltas) {
  return listaFaltas.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Formata a nota para exibição na tabela.
 */
function formatarNotaExibicao(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// Inicialização da renderização da página
function inicializarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMedias = 0;
  let disciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosDisciplinas.forEach(item => {
    // 1. Normaliza as notas
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // 2. Calcula média e faltas
    const media = calcularMedia([n1, n2, n3]);
    const totalFaltas = somarFaltas(item.faltas);
    totalFaltasGeral += totalFaltas;

    // 3. Define a situação
    let situacaoTexto = "Nota ainda não disponível";
    let situacaoClasse = "situacao-indisponivel";

    if (media !== null) {
      somaMedias += media;
      disciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        situacaoClasse = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        situacaoClasse = "situacao-atencao";
        qtdAtencao++;
      }
    }

    // 4. Cria a linha da tabela dinamicamente
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNotaExibicao(n1)}</td>
      <td>${formatarNotaExibicao(n2)}</td>
      <td>${formatarNotaExibicao(n3)}</td>
      <td><strong>${formatarNotaExibicao(media)}</strong></td>
      <td>${totalFaltas}</td>
      <td class="${situacaoClasse}">${situacaoTexto}</td>
    `;
    corpoTabela.appendChild(tr);
  });

  // 5. Atualiza os cards superiores
  const mediaGeralCalculada = disciplinasComMedia > 0 ? (somaMedias / disciplinasComMedia).toFixed(1).replace(".", ",") : "—";
  
  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;
}

// Executa o preenchimento após carregar
document.addEventListener("DOMContentLoaded", inicializarBoletim);