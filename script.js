let pontos = 0;
let placarTimeA = 0;
let placarTimeB = 0;
let bolaEmJogo = true;
let bolaLevantada = false;
let animacaoAtiva = true;
let temaAtual = "dia";
let resultadoEscolhido = true;
let bolaLevantadaAdversario = false;
const historico = [];

function escolherResultado(sucesso) {
  resultadoEscolhido = sucesso;
  document.getElementById("escolha-sucesso").classList.toggle("selecionado", sucesso);
  document.getElementById("escolha-falha").classList.toggle("selecionado", !sucesso);
}

function movimentarBola(lado) {
  const bola = document.getElementById("bola");
  const destinoX = lado === "adversario" ? Math.floor(Math.random() * 18) + 8 : Math.floor(Math.random() * 18) + 74;
  const origemX = lado === "adversario" ? Math.floor(Math.random() * 18) + 74 : Math.floor(Math.random() * 18) + 8;
  const origemY = Math.floor(Math.random() * 45) + 28;
  const destinoY = Math.floor(Math.random() * 45) + 28;
  bola.style.setProperty("--bola-origem-x", `${origemX}%`);
  bola.style.setProperty("--bola-destino-x", `${destinoX}%`);
  bola.style.setProperty("--bola-origem-y", `${origemY}%`);
  bola.style.setProperty("--bola-destino-y", `${destinoY}%`);
  bola.classList.remove("animar-para-adversario", "animar-para-sua-equipe");
  void bola.offsetWidth;
  bola.classList.add(`animar-para-${lado}`);
}

function atualizarHistorico(descricao, sucesso, lado) {
  historico.unshift({ descricao, sucesso, lado });
  historico.splice(8);
  const lista = document.getElementById("historico-jogadas");
  lista.innerHTML = historico.map((jogada) => `
    <li class="historico-item ${jogada.sucesso ? "jogada-sucesso" : "jogada-falha"}">
      <span class="indicador-jogada" aria-hidden="true">${jogada.sucesso ? "✓" : "!"}</span>
      <span><b>${jogada.descricao}</b><small>${jogada.sucesso ? "Sucesso" : "Falha"} · ${jogada.lado === "adversario" ? "bola no Vermelho" : "bola no Azul"}</small></span>
    </li>
  `).join("");
}

function executarJogada(descricao, lado, mensagemSucesso, mensagemFalha) {
  const sucesso = resultadoEscolhido;
  const ladoFinal = sucesso ? lado : lado === "adversario" ? "sua-equipe" : "adversario";
  movimentarBola(ladoFinal);
  atualizarHistorico(descricao, sucesso, ladoFinal);
  exibirResultado(sucesso ? mensagemSucesso : mensagemFalha);
  return sucesso;
}

function exibirResultado(mensagem) {
  document.getElementById("resultado").innerHTML = mensagem;
}

function atualizarPlacar() {
  document.getElementById("placar-time-a").textContent = placarTimeA;
  document.getElementById("placar-time-b").textContent = placarTimeB;
}

function fazerRodizio(mostrarMensagem = true) {
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

  if (mostrarMensagem) {
    atualizarHistorico("Rodízio", true, "sua-equipe");
    exibirResultado(`🔄 Rodízio do Azul realizado! O novo sacador é <b>${jogadores[2]}</b>.`);
  }
}

function sacar() {
  if (!bolaEmJogo) return;
  bolaLevantada = false;
  const sacador = document.getElementById("pos1").value || "o jogador da posição 1";
  executarJogada("Saque", "adversario", `🏐 Saque realizado por <b>${sacador}</b>!`, "⚠️ O saque falhou e a bola ficou com sua equipe.");
}

function sacarForte() {
  if (!bolaEmJogo) return;
  bolaLevantada = false;
  executarJogada("Saque forte", "adversario", "💥 Saque forte do Azul!", "⚠️ O saque forte do Azul falhou.");
}

function sacarFraco() {
  if (!bolaEmJogo) return;
  bolaLevantada = false;
  executarJogada("Saque fraco", "adversario", "🎯 Saque fraco do Azul, colocado com precisão!", "⚠️ O saque fraco do Azul falhou.");
}

function defender() {
  if (!bolaEmJogo) return;
  executarJogada("Defesa", "sua-equipe", "👏 Defesa realizada com sucesso! Preparem o levantamento.", "⚠️ A defesa falhou e a bola voltou para o adversário.");
}

function manchete() {
  if (!bolaEmJogo) return;
  executarJogada("Manchete", "sua-equipe", "🤲 Manchete firme! A recepção deixou a bola controlada.", "⚠️ A manchete falhou e a bola voltou para o adversário.");
}

function toque() {
  if (!bolaEmJogo) return;
  executarJogada("Toque", "sua-equipe", "☝️ Toque preciso! A bola foi direcionada para a próxima jogada.", "⚠️ O toque falhou e a bola voltou para o adversário.");
}

function levantar() {
  if (!bolaEmJogo) return;
  const levantador = document.getElementById("pos3").value || "o levantador";
  bolaLevantada = executarJogada("Levantamento", "sua-equipe", `🎯 Levantamento perfeito feito por <b>${levantador}</b>! Bola pronta para o ataque.`, "⚠️ O levantamento falhou e a bola voltou para o adversário.");
}

function atacar() {
  if (!bolaEmJogo) return;
  if (!bolaLevantada) {
    exibirResultado("⚠️ <b>Ataque não permitido!</b> Faça um levantamento antes de atacar.");
    return;
  }

  bolaLevantada = false;
  if (executarJogada("Ataque", "adversario", "🔥 Ataque potente no chão! Ponto para sua equipe!", "⚠️ O ataque falhou e a bola voltou para o adversário.")) {
    registrarPonto("A", "Ataque - ponto");
    if (bolaEmJogo) exibirResultado("🔥 Ataque potente no chão! Ponto para sua equipe!");
  }
}

function bloquear() {
  if (!bolaEmJogo) return;
  executarJogada("Bloqueio", "sua-equipe", "🛡️ Bloqueio realizado!", "⚠️ O bloqueio falhou e a bola voltou para o adversário.");
}

function sacarAdversario() {
  if (!bolaEmJogo) return;
  bolaLevantadaAdversario = false;
  executarJogada("Saque adversário", "sua-equipe", "🏐 Saque adversário recebido com sucesso!", "⚠️ O saque adversário falhou e a bola ficou com o adversário.");
}

function sacarForteAdversario() {
  if (!bolaEmJogo) return;
  bolaLevantadaAdversario = false;
  executarJogada("Saque forte Vermelho", "sua-equipe", "💥 Saque forte do Vermelho!", "⚠️ O saque forte do Vermelho falhou.");
}

function sacarFracoAdversario() {
  if (!bolaEmJogo) return;
  bolaLevantadaAdversario = false;
  executarJogada("Saque fraco Vermelho", "sua-equipe", "🎯 Saque fraco do Vermelho!", "⚠️ O saque fraco do Vermelho falhou.");
}

function atacarAdversario() {
  if (!bolaEmJogo) return;
  if (!bolaLevantadaAdversario) {
    exibirResultado("⚠️ <b>Ataque adversário não permitido!</b> Faça um levantamento adversário antes.");
    return;
  }

  bolaLevantadaAdversario = false;
  if (executarJogada("Ataque adversário", "sua-equipe", "🔥 Ataque adversário! Prepare a defesa.", "🛡️ O ataque adversário falhou e a bola voltou para eles.")) {
    registrarPonto("B", "Ataque adversário - ponto");
    if (bolaEmJogo) exibirResultado("🔥 Ataque adversário marcou ponto!");
  }
}

function defenderAdversario() {
  if (!bolaEmJogo) return;
  executarJogada("Defesa adversária", "adversario", "👏 Defesa adversária realizada!", "⚠️ A defesa adversária falhou e a bola está com sua equipe.");
}

function mancheteAdversaria() {
  if (!bolaEmJogo) return;
  executarJogada("Manchete adversária", "adversario", "🤲 Manchete adversária realizada!", "⚠️ A manchete adversária falhou e a bola está com sua equipe.");
}

function toqueAdversario() {
  if (!bolaEmJogo) return;
  executarJogada("Toque adversário", "adversario", "☝️ Toque adversário realizado!", "⚠️ O toque adversário falhou e a bola está com sua equipe.");
}

function levantarAdversario() {
  if (!bolaEmJogo) return;
  bolaLevantadaAdversario = executarJogada("Levantamento adversário", "adversario", "🎯 Levantamento adversário pronto para o ataque!", "⚠️ O levantamento adversário falhou e a bola está com sua equipe.");
}

function bloquearAdversario() {
  if (!bolaEmJogo) return;
  executarJogada("Bloqueio adversário", "adversario", "🛡️ Bloqueio adversário realizado!", "⚠️ O bloqueio adversário falhou e a bola está com sua equipe.");
}

function fazerRodizioAdversario() {
  if (!bolaEmJogo) return;
  const jogadores = {};
  for (let posicao = 1; posicao <= 6; posicao++) {
    jogadores[posicao] = document.getElementById(`adversario-pos${posicao}`).value;
  }

  document.getElementById("adversario-pos1").value = jogadores[2];
  document.getElementById("adversario-pos6").value = jogadores[1];
  document.getElementById("adversario-pos5").value = jogadores[6];
  document.getElementById("adversario-pos4").value = jogadores[5];
  document.getElementById("adversario-pos3").value = jogadores[4];
  document.getElementById("adversario-pos2").value = jogadores[3];
  bolaLevantadaAdversario = false;
  atualizarHistorico("Rodízio adversário", true, "adversario");
  exibirResultado(`🔄 Rodízio do Vermelho realizado! O novo sacador é <b>${jogadores[2]}</b>.`);
}

function darPontoMinhaEquipe() {
  if (!bolaEmJogo) return;
  movimentarBola("adversario");
  registrarPonto("A", "Ponto sua equipe");
  if (bolaEmJogo) exibirResultado("🏆 Ponto para o Azul!");
}

function darPontoAdversario() {
  if (!bolaEmJogo) return;
  movimentarBola("sua-equipe");
  registrarPonto("B", "Ponto adversário");
  if (bolaEmJogo) exibirResultado("🏆 Ponto para o Vermelho!");
}

function registrarPonto(timeVencedor, descricao) {
  if (!bolaEmJogo) return;

  if (timeVencedor === "A") {
    placarTimeA++;
    pontos = placarTimeA;
    fazerRodizio(false);
    atualizarHistorico(descricao, true, "adversario");
  } else {
    placarTimeB++;
    atualizarHistorico(descricao, true, "sua-equipe");
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
  bolaLevantadaAdversario = false;
  historico.length = 0;
  document.getElementById("historico-jogadas").innerHTML = '<li class="historico-vazio">Nenhuma jogada registrada ainda.</li>';
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
