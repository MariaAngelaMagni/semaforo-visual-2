```javascript
// ============================================================
// SEMÁFORO DO BARULHO
// JavaScript - Microfone + emojis + semáforo
// ============================================================


// ------------------------------------------------------------
// VARIÁVEIS
// ------------------------------------------------------------

let audioContext;
let analyser;
let microphone;
let dados;
let microfoneAtivo = false;


// ------------------------------------------------------------
// ELEMENTOS DO HTML
// ------------------------------------------------------------

const botao = document.getElementById("botao");
const statusMicrofone = document.getElementById("statusMicrofone");

const emoji = document.getElementById("emoji");
const mensagem = document.getElementById("mensagem");
const nivel = document.getElementById("nivel");
const barra = document.getElementById("nivelBarra");

const luzAzul = document.getElementById("luzAzul");
const luzVerde = document.getElementById("luzVerde");
const luzAmarela = document.getElementById("luzAmarela");
const luzLaranja = document.getElementById("luzLaranja");
const luzVermelha = document.getElementById("luzVermelha");


// ------------------------------------------------------------
// INICIAR MICROFONE
// ------------------------------------------------------------

async function iniciarMicrofone() {

    if (microfoneAtivo) {
        return;
    }

    try {

        // Solicita autorização para utilizar o microfone

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        // Cria o contexto de áudio

        audioContext =
            new (window.AudioContext ||
                 window.webkitAudioContext)();


        // Cria o analisador

        analyser =
            audioContext.createAnalyser();


        // Define a resolução da análise

        analyser.fftSize = 1024;


        // Cria o microfone como fonte de áudio

        microphone =
            audioContext.createMediaStreamSource(stream);


        // Liga o microfone ao analisador

        microphone.connect(analyser);


        // Cria espaço para armazenar os dados

        dados =
            new Uint8Array(analyser.fftSize);


        microfoneAtivo = true;


        // Atualiza a interface

        botao.innerHTML =
            "🎤 MICROFONE ATIVO";

        statusMicrofone.innerHTML =
            "🟢 O microfone está ouvindo a sala";


        // Começa a medição

        medirSom();


    } catch (erro) {

        console.error(erro);

        statusMicrofone.innerHTML =
            "⚠️ Não foi possível acessar o microfone.";

        mensagem.innerHTML =
            "Verifique a permissão do microfone.";

        emoji.innerHTML = "🎤";
    }
}


// ------------------------------------------------------------
// MEDIR O SOM
// ------------------------------------------------------------

function medirSom() {

    if (!analyser) {
        return;
    }


    // Obtém os dados do áudio

    analyser.getByteTimeDomainData(dados);


    let soma = 0;


    // Calcula o RMS do sinal

    for (let i = 0; i < dados.length; i++) {

        const valor =
            (dados[i] - 128) / 128;

        soma += valor * valor;
    }


    const rms =
        Math.sqrt(soma / dados.length);


    // --------------------------------------------------------
    // TRANSFORMAÇÃO PARA UMA ESCALA VISUAL
    // --------------------------------------------------------

    /*
       ATENÇÃO:

       O navegador não fornece uma medição profissional
       de dB SPL.

       Por isso usamos uma escala relativa de 0 a 100,
       adequada para controlar visualmente o semáforo.

       Os valores podem ser calibrados de acordo com
       o ambiente da escola.
    */


    let intensidade =
        Math.round(rms * 1000);


    // Limita entre 0 e 100

    intensidade =
        Math.max(0, Math.min(100, intensidade));


    // Atualiza o semáforo

    atualizarSemaforo(intensidade);


    // Continua analisando

    requestAnimationFrame(medirSom);
}


// ------------------------------------------------------------
// ATUALIZAR SEMÁFORO
// ------------------------------------------------------------

function atualizarSemaforo(valor) {


    // Apaga todas as luzes

    apagarLuzes();


    // Atualiza a barra

    barra.style.width =
        valor + "%";


    nivel.innerHTML =
        "Nível de som: " + valor + "%";


    // --------------------------------------------------------
    // 🔵 SILÊNCIO
    // --------------------------------------------------------

    if (valor < 15) {

        luzAzul.classList.add("acesa");

        emoji.innerHTML = "😌";

        mensagem.innerHTML =
            "Está bem tranquilo! 🤫";

        barra.style.background =
            "#2196f3";
    }


    // --------------------------------------------------------
    // 🟢 TRANQUILO
    // --------------------------------------------------------

    else if (valor < 35) {

        luzVerde.classList.add("acesa");

        emoji.innerHTML = "😊";

        mensagem.innerHTML =
            "Podemos continuar assim! 👍";

        barra.style.background =
            "#4caf50";
    }


    // --------------------------------------------------------
    // 🟡 ATENÇÃO
    // --------------------------------------------------------

    else if (valor < 55) {

        luzAmarela.classList.add("acesa");

        emoji.innerHTML = "😐";

        mensagem.innerHTML =
            "Vamos falar um pouquinho mais baixo.";

        barra.style.background =
            "#ffca28";
    }


    // --------------------------------------------------------
    // 🟠 BARULHO ALTO
    // --------------------------------------------------------

    else if (valor < 75) {

        luzLaranja.classList.add("acesa");

        emoji.innerHTML = "😮";

        mensagem.innerHTML =
            "Está ficando barulhento!";

        barra.style.background =
            "#ff9800";
    }


    // --------------------------------------------------------
    // 🔴 MUITO BARULHO
    // --------------------------------------------------------

    else {

        luzVermelha.classList.add("acesa");

        emoji.innerHTML = "🙉";

        mensagem.innerHTML =
            "Muito barulho! Vamos diminuir juntos.";

        barra.style.background =
            "#f44336";
    }

}


// ------------------------------------------------------------
// APAGAR LUZES
// ------------------------------------------------------------

function apagarLuzes() {

    luzAzul.classList.remove("acesa");

    luzVerde.classList.remove("acesa");

    luzAmarela.classList.remove("acesa");

    luzLaranja.classList.remove("acesa");

    luzVermelha.classList.remove("acesa");
}


// ------------------------------------------------------------
// BOTÃO
// ------------------------------------------------------------

botao.addEventListener(
    "click",
    iniciarMicrofone
);


// ------------------------------------------------------------
// MENSAGEM INICIAL
// ------------------------------------------------------------

emoji.innerHTML = "😌";

mensagem.innerHTML =
    "Clique no botão para começar!";

nivel.innerHTML =
    "Microfone aguardando...";
```
