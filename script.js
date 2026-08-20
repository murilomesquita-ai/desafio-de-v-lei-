let pontos = 0;
let placarTimeA = 0;
let placarTimeB = 0;
let bolaEmJogo = true;
let bolaLevantada = false;
let animacaoAtiva = true;
let temaAtual = "dia";

function exibirResultado(mensagem) {
  document.getElementById("resultado").innerHTML = mensagem;
}

function atualizarPlacar() {
  document.getElementById("placar-time-a").textContent = placarTimeA;
  document.getElementById("placar-time-b").textContent = placarTimeB;
}

function fazerRodizio() {
  const jogadores = {};
  for (let posicao = 1; posicao <= 6; posicao++) {
    jogadores[posicao] = document.getElementById(`pos${posicao}`).value;
  }

  document.getElementById("pos1").value = jogadores[2];
  document.getElementById("pos6").value = jogadores[1];
  document.getElementById("pos5").value = jogadores[6];
  document.getElementById("pos4").value = jogadores[5];
  document.getElementById("pos3").value = jogadores[4];
  document.getElementById("pos2").value = jogadores[3];
  bolaLevantada = false;

  exibirResultado(`🔄 Rodízio realizado! O novo sacador é <b>${jogadores[2]}</b>.`);
}

function sacar() {
  if (!bolaEmJogo) return;
  bolaLevantada = false;
  const sacador = document.getElementById("pos1").value || "o jogador da posição 1";
  exibirResultado(`🏐 Saque realizado por <b>${sacador}</b>!`);
}

function defender() {
  if (!bolaEmJogo) return;
  exibirResultado("👏 Defesa realizada com sucesso! Preparem o levantamento.");
}

function manchete() {
  if (!bolaEmJogo) return;
  exibirResultado("🤲 Manchete firme! A recepção deixou a bola controlada.");
}

function toque() {
  if (!bolaEmJogo) return;
  exibirResultado("☝️ Toque preciso! A bola foi direcionada para a próxima jogada.");
}

function levantar() {
  if (!bolaEmJogo) return;
  const levantador = document.getElementById("pos3").value || "o levantador";
  bolaLevantada = true;
  exibirResultado(`🎯 Levantamento perfeito feito por <b>${levantador}</b>! Bola pronta para o ataque.`);
}

function atacar() {
  if (!bolaEmJogo) return;
  if (!bolaLevantada) {
    exibirResultado("⚠️ <b>Ataque não permitido!</b> Faça um levantamento antes de atacar.");
    return;
  }

  bolaLevantada = false;
  registrarPonto("A");
  exibirResultado("🔥 Ataque potente no chão! Ponto para sua equipe!");
}

function bloquear() {
  if (!bolaEmJogo) return;
  exibirResultado("🛡️ Bloqueio realizado!");
}

function registrarPonto(timeVencedor) {
  if (!bolaEmJogo) return;

  if (timeVencedor === "A") {
    placarTimeA++;
    pontos = placarTimeA;
    fazerRodizio();
  } else {
    placarTimeB++;
  }

  atualizarPlacar();
  verificarFimDeSet();
}

function reiniciarSet() {
  pontos = 0;
  placarTimeA = 0;
  placarTimeB = 0;
  bolaEmJogo = true;
  bolaLevantada = false;
  atualizarPlacar();
  exibirResultado("🏐 Novo set iniciado! Aguardando o saque.");
}

function alternarAnimacao() {
  animacaoAtiva = !animacaoAtiva;
  document.body.classList.toggle("animacao-pausada", !animacaoAtiva);
  document.getElementById("alternar-animacao").textContent = animacaoAtiva ? "Pausar fundo" : "Retomar fundo";
}

function alternarTema() {
  temaAtual = temaAtual === "dia" ? "noite" : "dia";
  document.body.classList.toggle("tema-noite", temaAtual === "noite");
  exibirResultado(temaAtual === "noite" ? "🌙 Clima noturno ativado." : "☀️ Clima de treino ativado.");
}

function verificarFimDeSet() {
  if (placarTimeA >= 5) {
    bolaEmJogo = false;
    exibirResultado("🏆 Fim do set! Sua equipe venceu!");
  } else if (placarTimeB >= 5) {
    bolaEmJogo = false;
    exibirResultado("🏆 Fim do set! O adversário venceu.");
  }
}

atualizarPlacar();

const canvas = document.getElementById("fundo-animado");
const contexto = canvas.getContext("2d");
const ponteiro = { x: 0.5, y: 0.5 };
let particulas = [];

function ajustarCanvas() {
  const escala = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * escala;
  canvas.height = window.innerHeight * escala;
  contexto.setTransform(escala, 0, 0, escala, 0, 0);
  particulas = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 16)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    raio: Math.random() * 3 + 1,
    velocidade: Math.random() * 0.35 + 0.12,
    fase: Math.random() * Math.PI * 2
  }));
}

function desenharFundo(tempo = 0) {
  const largura = window.innerWidth;
  const altura = window.innerHeight;
  contexto.clearRect(0, 0, largura, altura);
  const noite = document.body.classList.contains("tema-noite");
  const gradiente = contexto.createLinearGradient(0, 0, largura, altura);
  gradiente.addColorStop(0, noite ? "#173e48" : "#cfe9dc");
  gradiente.addColorStop(1, noite ? "#244b43" : "#f5e0bd");
  contexto.fillStyle = gradiente;
  contexto.fillRect(0, 0, largura, altura);

  particulas.forEach((particula) => {
    if (animacaoAtiva) particula.y -= particula.velocidade;
    if (particula.y < -10) particula.y = altura + 10;
    const deslocamentoX = (ponteiro.x - 0.5) * particula.raio * 8;
    const brilho = 0.18 + Math.sin(tempo * 0.001 + particula.fase) * 0.08;
    contexto.beginPath();
    contexto.arc(particula.x + deslocamentoX, particula.y, particula.raio, 0, Math.PI * 2);
    contexto.fillStyle = noite ? `rgba(245, 181, 111, ${brilho})` : `rgba(23, 107, 87, ${brilho})`;
    contexto.fill();
  });
  requestAnimationFrame(desenharFundo);
}

window.addEventListener("resize", ajustarCanvas);
window.addEventListener("pointermove", (evento) => {
  ponteiro.x = evento.clientX / window.innerWidth;
  ponteiro.y = evento.clientY / window.innerHeight;
});
ajustarCanvas();
desenharFundo();
