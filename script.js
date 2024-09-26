// Dados das categorias e opções
const categorias = {
  conta: ['SIX COMÉRCIO LTDA', 'SEVEN COMÉRCIO LTDA', 'PHARMA SIX'],
  produto: ['Lipotrin', 'Floraxil'],
  tipo: ['LÍQUIDO', 'BLISTER', 'CÁPSULA', 'PÓ', 'GUMMY'],
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

// Função para criar os elementos de seleção
function criarSelecoes() {
  const selecoesDiv = document.getElementById('selecoes');

  Object.entries(categorias).forEach(([categoria, opcoes]) => {
    const select = document.createElement('select');
    select.id = categoria;
    select.className =
      'w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
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

  document.getElementById('skuGerado').textContent =
    sku || 'Selecione todas as opções';
}

// Função para ler o SKU
function lerSKU() {
  const skuInput = document.getElementById('skuInput').value.toUpperCase();
  const resultadoDiv = document.getElementById('resultadoLeitura');
  resultadoDiv.innerHTML = '';

  if (skuInput.length === 0) {
    resultadoDiv.innerHTML =
      '<p class="text-red-500">Por favor, insira um SKU.</p>';
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
  const skuGerado = document.getElementById('skuGerado');
  const textoSKU = skuGerado.textContent;

  if (textoSKU !== 'Selecione todas as opções') {
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

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
  criarSelecoes();
  gerarSKU();
  document.getElementById('lerSKU').addEventListener('click', lerSKU);
  document.getElementById('skuGerado').addEventListener('click', copiarSKU);
});
