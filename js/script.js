let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

document.getElementById('form-transacao').addEventListener('submit', function(e) {
    e.preventDefault();
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;
    if (!descricao || isNaN(valor) || !data) return;

    transacoes.push({ descricao, valor, data });
    salvarTransacoes();
    atualizarUI();
    this.reset();
});

function salvarTransacoes() {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

function removerTransacao(index) {
    transacoes.splice(index, 1);
    salvarTransacoes();
    atualizarUI();
}

function atualizarUI() {
    const lista = document.getElementById('lista-transacoes');
    lista.innerHTML = '';
    let saldo = 0, entradas = 0, saidas = 0;

    transacoes.forEach((t, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${t.data} - ${t.descricao}: R$ ${t.valor.toFixed(2)}
            <button class="remover" onclick="removerTransacao(${index})">×</button>`;
        lista.appendChild(li);
        saldo += t.valor;
        if (t.valor >= 0) entradas += t.valor;
        else saidas += Math.abs(t.valor);
    });

    document.getElementById('saldo').textContent = saldo.toFixed(2);
    document.getElementById('entradas').textContent = entradas.toFixed(2);
    document.getElementById('saidas').textContent = saidas.toFixed(2);
    atualizarGrafico(entradas, saidas);
}

let grafico;

function atualizarGrafico(entradas, saidas) {
    const ctx = document.getElementById('grafico').getContext('2d');
    if (grafico) grafico.destroy();
    grafico = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                data: [entradas, saidas],
                backgroundColor: ['#2e7d32', '#d32f2f'], // verde e vermelho forte
                borderColor: '#f9f9f9', // cor clara para borda
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#333333',
                        font: {
                            weight: '600',
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#2e7d32',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1b4d22',
                    borderWidth: 1,
                    cornerRadius: 6,
                    padding: 10,
                }
            },
            cutout: '65%',
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

document.getElementById('btn-ver-graficos').addEventListener('click', () => {
    window.location.href = 'graficos.html';
});


atualizarUI();
