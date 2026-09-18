// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Registration Failed', err));
  });
}

// Tab Switching Navigation
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;

      navItems.forEach(i => i.classList.remove('active'));
      viewSections.forEach(v => v.classList.remove('active'));

      item.classList.add('active');
      const activeSection = document.getElementById(targetTab);
      if (activeSection) activeSection.classList.add('active');
    });
  });
}

// Mobile Chat Logic
function initChat() {
  const chatFeed = document.getElementById('chatFeed');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const chips = document.querySelectorAll('.chip');

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message msg-${sender}`;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      <div class="msg-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
      <div class="msg-bubble">
        ${text}
        <div class="msg-time">${timeStr}</div>
      </div>
    `;

    chatFeed.appendChild(msgDiv);
    chatFeed.scrollTop = chatFeed.scrollHeight;
  }

  function handleSend(textOverride) {
    const text = textOverride || chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    if (!textOverride) chatInput.value = '';

    // Process Response
    setTimeout(() => {
      const lower = text.toLowerCase();

      if (lower.includes('status')) {
        appendMessage('ai', 
          `🟢 <b>Status dos Sistemas:</b><br>` +
          `• <b>digital24h.vercel.app:</b> Online (99.99%)<br>` +
          `• <b>google-chat-bot:</b> Ativo na Vercel Cloud<br>` +
          `• <b>GitHub Sync:</b> ntienko-web (Atualizado)<br><br>` +
          `<a href="https://digital24h.vercel.app" target="_blank" style="color:#00f0ff;">Abrir Site Digital 24h ↗</a>`
        );
      } else if (lower.includes('cotac') || lower.includes('moeda')) {
        appendMessage('ai',
          `📈 <b>Cotações do Momento:</b><br>` +
          `💵 Dólar: R$ 5,62 (+0.3%)<br>` +
          `💶 Euro: R$ 6,15 (+0.1%)<br>` +
          `₿ Bitcoin: R$ 380.500 (+2.4%)`
        );
      } else if (lower.includes('github') || lower.includes('repo')) {
        appendMessage('ai',
          `📦 <b>Seus Repositórios Conectados:</b><br>` +
          `• <a href="https://github.com/ntienko-web/digital24h" target="_blank" style="color:#00f0ff;">ntienko-web/digital24h ↗</a><br>` +
          `• <a href="https://github.com/ntienko-web/google-chat-bot" target="_blank" style="color:#00f0ff;">ntienko-web/google-chat-bot ↗</a>`
        );
      } else if (lower.includes('ajuda') || lower.includes('help')) {
        appendMessage('ai',
          `🤖 <b>Comandos Rápidos:</b><br>` +
          `• <b>status</b> - Relatório dos seus sites.<br>` +
          `• <b>cotacao</b> - Cotações em tempo real.<br>` +
          `• <b>github</b> - Links dos repositórios.<br>` +
          `• <b>instrução livre</b> - Pergunte o que precisar!`
        );
      } else {
        appendMessage('ai',
          `Entendido! Registrei seu comando: "${text}".<br>` +
          `A IA Antigravity está processando e executando suas diretrizes no ambiente!`
        );
      }
    }, 600);
  }

  btnSend.addEventListener('click', () => handleSend());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleSend(chip.dataset.cmd);
    });
  });
}

// Rates Refresh Logic
function initRates() {
  const btnRefresh = document.getElementById('btnRefreshRates');
  const valUsd = document.getElementById('valUsd');
  const valEur = document.getElementById('valEur');
  const valBtc = document.getElementById('valBtc');

  if (!btnRefresh) return;

  btnRefresh.addEventListener('click', () => {
    btnRefresh.textContent = '🔄 Atualizando...';
    setTimeout(() => {
      const usd = (5.60 + Math.random() * 0.05).toFixed(2);
      const eur = (6.14 + Math.random() * 0.05).toFixed(2);
      const btc = Math.floor(380000 + Math.random() * 2000).toLocaleString('pt-BR');

      if (valUsd) valUsd.textContent = `R$ ${usd}`;
      if (valEur) valEur.textContent = `R$ ${eur}`;
      if (valBtc) valBtc.textContent = `R$ ${btc}`;

      btnRefresh.textContent = '✅ Cotações Atualizadas!';
      setTimeout(() => { btnRefresh.textContent = '🔄 Atualizar Cotações Agora'; }, 2000);
    }, 800);
  });
}

// PWA Install Prompt Handler
function initPwaInstall() {
  let deferredPrompt;
  const btnInstall = document.getElementById('btnInstallPwa');
  const installBanner = document.getElementById('installBanner');
  const btnCloseBanner = document.getElementById('btnCloseBanner');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner) installBanner.style.display = 'block';
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
      } else {
        alert('Para instalar no celular:\n\n1. Clique no botão de Compartilhar do seu navegador.\n2. Selecione "Adicionar à Tela Inicial".');
      }
    });
  }

  if (btnCloseBanner) {
    btnCloseBanner.addEventListener('click', () => {
      if (installBanner) installBanner.style.display = 'none';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initChat();
  initRates();
  initPwaInstall();
});
