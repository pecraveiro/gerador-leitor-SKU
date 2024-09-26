// Dados das categorias e opções
const categorias = {
  conta: ['SIX COMÉRCIO LTDA', 'SEVEN COMÉRCIO LTDA', 'PHARMA SIX'],
  produto: ['Lipotrin', 'Floraxil'],
  tipo: ['XAROPE', 'GOTAS', 'BLISTER', 'CÁPSULA', 'PÓ', 'GUMMY'],
  quantidade: [
    '10ML',
    '20ML',
    '30ML',
    '40ML',
    '50ML',
    '60ML',
    '70ML',
    '80ML',
    '90ML',
    '100ML',
    '30CAPS',
    '60CAPS',
    '10BLISTERS'
  ],
  kit: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15'
  ],
  modelo: ['FÍSICO', 'AGRUPADO'],
  recorrencia: ['NÃO', 'SIM'],
  nicho: [
    'EMAGRECIMENTO',
    'MEMÓRIA',
    'DIABETES',
    'REJUVENESCIMENTO',
    'DISFUNÇÃO ERÉTIL',
    'PRÓSTATA',
    'DORES ARTICULARES',
    'VISÃO',
    'AUDIÇÃO',
    'FUNGOS',
    'CONSTIPAÇÃO',
    'HIPERTENSÃO'
  ]
};

let skuAnterior = '';

// Função para criar os elementos de seleção
function criarSelecoes() {
  const selecoesDiv = document.getElementById('selecoes');

  Object.entries(categorias).forEach(([categoria, opcoes]) => {
    const select = document.createElement('select');
    select.id = categoria;
    select.className =
      'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black';
    select.innerHTML = `<option value="">Selecione ${categoria}</option>`;

    opcoes.forEach((opcao, index) => {
      const option = document.createElement('option');
      option.value = index + 1;
      option.textContent = opcao;
      select.appendChild(option);
    });

    const label = document.createElement('label');
    label.htmlFor = categoria;
    label.className = 'block text-sm font-medium text-gray-700 mb-1';
    label.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    const wrapper = document.createElement('div');
    wrapper.className = 'mb-4';
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    selecoesDiv.appendChild(wrapper);

    select.addEventListener('change', gerarSKU);
  });
}

// Função para gerar o SKU
function gerarSKU() {
  let sku = '';
  Object.keys(categorias).forEach((categoria) => {
    const select = document.getElementById(categoria);
    if (select.value) {
      sku += categoria.charAt(0).toUpperCase() + select.value;
    }
  });

  const skuInput = document.getElementById('skuInput');
  const feedbackDiv = document.getElementById('skuFeedback');

  if (sku !== skuAnterior && skuAnterior !== '') {
    const mudancas = compararSKUs(skuAnterior, sku);
    if (mudancas.length > 0) {
      feedbackDiv.innerHTML =
        '<h3 class="font-semibold text-black mb-2">Alterações no SKU:</h3>';
      mudancas.forEach((mudanca) => {
        feedbackDiv.innerHTML += `<p class="text-sm text-gray-600">${mudanca}</p>`;
      });
      feedbackDiv.innerHTML += '<div class="arrow-down"></div>';
      feedbackDiv.classList.remove('hidden');
      feedbackDiv.style.opacity = '1';
      setTimeout(() => {
        feedbackDiv.style.opacity = '0';
        setTimeout(() => {
          feedbackDiv.classList.add('hidden');
        }, 300);
      }, 5000);
    } else {
      feedbackDiv.classList.add('hidden');
    }
  }

  skuInput.textContent = sku || 'SKU gerado aparecerá aqui';
  skuAnterior = sku;
}

// Função para ler o SKU
function lerSKU() {
  const skuInput = document
    .getElementById('skuInput')
    .textContent.toUpperCase();
  const resultadoDiv = document.getElementById('resultadoLeitura');
  resultadoDiv.innerHTML = '';

  if (skuInput === 'SKU GERADO APARECERÁ AQUI') {
    resultadoDiv.innerHTML =
      '<p class="text-red-500">Por favor, gere um SKU primeiro.</p>';
    return;
  }

  let skuValido = true;
  Object.entries(categorias).forEach(([categoria, opcoes]) => {
    const letra = categoria.charAt(0).toUpperCase();
    const index = skuInput.indexOf(letra);
    if (index !== -1 && index + 1 < skuInput.length) {
      const valor = parseInt(skuInput[index + 1]);
      if (valor > 0 && valor <= opcoes.length) {
        const item = document.createElement('p');
        item.className = 'text-gray-700';
        item.innerHTML = `<span class="font-semibold">${categoria}:</span> ${
          opcoes[valor - 1]
        }`;
        resultadoDiv.appendChild(item);
      } else {
        skuValido = false;
      }
    } else {
      skuValido = false;
    }
  });

  if (!skuValido) {
    resultadoDiv.innerHTML =
      '<p class="text-red-500">SKU inválido. Verifique o formato.</p>';
  }
}

// Função para copiar o SKU para a área de transferência
function copiarSKU() {
  const skuInput = document.getElementById('skuInput');
  const textoSKU = skuInput.textContent;

  if (textoSKU !== 'SKU gerado aparecerá aqui') {
    navigator.clipboard
      .writeText(textoSKU)
      .then(() => {
        const copyFeedback = document.getElementById('copyFeedback');
        copyFeedback.classList.remove('hidden');
        setTimeout(() => {
          copyFeedback.classList.add('hidden');
        }, 2000);
      })
      .catch((err) => {
        console.error('Erro ao copiar texto: ', err);
      });
  }
}

// Função para comparar SKUs e gerar feedback
function compararSKUs(skuAntigo, skuNovo) {
  let mudancas = [];
  Object.entries(categorias).forEach(([categoria, opcoes]) => {
    const letraCategoria = categoria.charAt(0).toUpperCase();
    const indexAntigo = skuAntigo.indexOf(letraCategoria);
    const indexNovo = skuNovo.indexOf(letraCategoria);

    if (indexAntigo !== -1 && indexNovo !== -1) {
      const valorAntigo = parseInt(skuAntigo[indexAntigo + 1]);
      const valorNovo = parseInt(skuNovo[indexNovo + 1]);

      if (valorAntigo !== valorNovo) {
        mudancas.push(
          `${categoria}: ${opcoes[valorAntigo - 1]} → ${opcoes[valorNovo - 1]}`
        );
      }
    } else if (indexAntigo === -1 && indexNovo !== -1) {
      const valorNovo = parseInt(skuNovo[indexNovo + 1]);
      mudancas.push(`${categoria}: Adicionado ${opcoes[valorNovo - 1]}`);
    } else if (indexAntigo !== -1 && indexNovo === -1) {
      const valorAntigo = parseInt(skuAntigo[indexAntigo + 1]);
      mudancas.push(`${categoria}: Removido ${opcoes[valorAntigo - 1]}`);
    }
  });
  return mudancas;
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
  criarSelecoes();
  gerarSKU();
  document.getElementById('lerSKU').addEventListener('click', lerSKU);
  document.getElementById('skuInput').addEventListener('click', copiarSKU);
  document.getElementById('skuInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      copiarSKU();
    }
  });

  const lerSKUButton = document.getElementById('lerSKU');
  lerSKUButton.addEventListener('click', () => {
    lerSKU();
    lerSKUButton.classList.add('bg-gray-800');
    setTimeout(() => {
      lerSKUButton.classList.remove('bg-gray-800');
    }, 200);
  });

  // Adicione este trecho para atualizar o SKU quando qualquer select for alterado
  Object.keys(categorias).forEach((categoria) => {
    document.getElementById(categoria).addEventListener('change', gerarSKU);
  });
});

// Adicione este estilo ao final do arquivo ou em um arquivo CSS separado
document.head.insertAdjacentHTML(
  'beforeend',
  `
  <style>
    .arrow-down {
      width: 0; 
      height: 0; 
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #000;
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
  </style>
`
);
