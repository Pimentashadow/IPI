
  // ===== ESTADO DA APLICAÇÃO =====
  const AppState = {
    candidatos: [],
    adminSecret: '1256',
    studentSecret: '5679'
  };

  // ===== SELETORES DE ELEMENTOS DOM =====
  const DOMElements = {
    // Páginas principais
    loginPage: document.getElementById('loginPage'),
    adminPanel: document.getElementById('adminPanel'),
    studentPanel: document.getElementById('studentPanel'),
    
    // Formulário de login
    loginForm: document.getElementById('loginForm'),
    usuarioInput: document.getElementById('user'),
    senhaInput: document.getElementById('pass'),

    // Botões de navegação admin
    btnPrincipal: document.getElementById('btnDashboard'),
    btnGestao: document.getElementById('btnCandidatos'),
    btnRelatorios: document.getElementById('btnRelatorios'),
    btnSairAdmin: document.getElementById('btnLogoutAdmin'),

    // Botões de ações
    btnAdicionarCandidato: document.getElementById('btnAddCandidato'),
    btnFiltrar: document.getElementById('btnAplicarFiltro'),
    btnGerarRelatorio: document.getElementById('btnExportarPDF'),
    btnBuscarAluno: document.getElementById('btnSearchStudent'),
    btnSairAluno: document.getElementById('btnLogoutStudent'),
    codigoAluno: document.getElementById('studentCode'),

    // Campos do formulário de candidatos
    inputNome: document.getElementById('nome'),
    inputIdade: document.getElementById('idade'),
    inputBI: document.getElementById('bi'),
    inputContato: document.getElementById('contacto'),
    inputCurso: document.getElementById('curso'),
    inputStatus: document.getElementById('estado'),

    // Elementos de dashboard
    totalCandidatos: document.getElementById('total'),
    totalAprovados: document.getElementById('aprovados'),
    totalReprovados: document.getElementById('reprovados'),
    totalPendentes: document.getElementById('pendentes'),
    containerResumoCursos: document.getElementById('resumoCursos'),

    // Tabelas e filtros
    tabelaCandidatos: document.getElementById('lista'),
    seletorCurso: document.getElementById('filtroCurso'),
    seletorStatus: document.getElementById('filtroEstado'),
    tabelaRelatorios: document.getElementById('tabelaRelatorio')
  };

  // ===== LISTENERS DE EVENTOS =====
  DOMElements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    autenticarUsuario();
  });

  DOMElements.btnPrincipal.addEventListener('click', function() {
    exibirPagina('dashboard', this);
  });

  DOMElements.btnGestao.addEventListener('click', function() {
    exibirPagina('candidatos', this);
  });

  DOMElements.btnRelatorios.addEventListener('click', function() {
    exibirPagina('relatorios', this);
  });

  DOMElements.btnSairAdmin.addEventListener('click', () => desconectarSessao());
  DOMElements.btnSairAluno.addEventListener('click', () => desconectarSessao());

  DOMElements.btnAdicionarCandidato.addEventListener('click', () => registrarCandidato());
  DOMElements.btnFiltrar.addEventListener('click', () => aplicarFiltros());
  DOMElements.btnGerarRelatorio.addEventListener('click', () => exportarRelatorioTXT());
  DOMElements.btnBuscarAluno.addEventListener('click', () => consultarResultado());

  DOMElements.codigoAluno.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') consultarResultado();
  });

  // ===== FUNÇÕES PRINCIPAIS =====

  /**
   * Autentica o usuário verificando a senha
   */
  const autenticarUsuario = () => {
    const { usuarioInput, senhaInput, loginPage, adminPanel, studentPanel } = DOMElements;
    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!usuario || !senha) {
      alert('Preencha todos os campos');
      return;
    }

    if (senha === AppState.adminSecret) {
      loginPage.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      atualizarPainelPrincipal();
    } else if (senha === AppState.studentSecret) {
      loginPage.classList.add('hidden');
      studentPanel.classList.remove('hidden');
    } else {
      alert('Utilizador ou palavra-passe inválidos');
    }

    usuarioInput.value = '';
    senhaInput.value = '';
  };

  /**
   * Desconecta o usuário e recarrega a página
   */
  const desconectarSessao = () => {
    location.reload();
  };

  /**
   * Exibe uma página específica do painel
   */
  const exibirPagina = (paginaId, botao) => {
    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('candidatos')?.classList.add('hidden');
    document.getElementById('relatorios')?.classList.add('hidden');
    
    document.getElementById(paginaId)?.classList.remove('hidden');

    document.querySelectorAll('.sidebar nav button:not(.logout)').forEach(btn => {
      btn.classList.remove('active');
    });
    botao.classList.add('active');
  };

  /**
   * Registra um novo candidato no sistema
   */
  const registrarCandidato = () => {
    const { inputNome, inputIdade, inputBI, inputContato, inputCurso, inputStatus } = DOMElements;
    const { nome, idade, bi, contacto, curso, estado } = {
      nome: inputNome.value.trim(),
      idade: inputIdade.value.trim(),
      bi: inputBI.value.trim(),
      contacto: inputContato.value.trim(),
      curso: inputCurso.value.trim(),
      estado: inputStatus.value
    };

    if (!nome || !idade || !bi || !contacto || !curso) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (AppState.candidatos.find(c => c.bi === bi)) {
      alert('Já existe um candidato com este BI');
      return;
    }

    const codigoAcesso = Math.random().toString(36).substr(2, 9).toUpperCase();
    const mediaAtual = Math.random() * 20;

    AppState.candidatos.push({
      nome,
      idade: Number(idade),
      bi,
      contacto,
      curso,
      estado,
      media: mediaAtual,
      codigo: codigoAcesso
    });

    atualizarListaCursos();
    renderizarCandidatos();
    atualizarPainelPrincipal();
    
    inputNome.value = '';
    inputIdade.value = '';
    inputBI.value = '';
    inputContato.value = '';
    inputCurso.value = '';
    inputStatus.value = 'Pendente';

    alert('Candidato registado com sucesso! Código: ' + codigoAcesso);
  };

  /**
   * Renderiza a lista de candidatos na tabela
   */
  const renderizarCandidatos = () => {
    const { tabelaCandidatos } = DOMElements;
    tabelaCandidatos.innerHTML = '';
    
    AppState.candidatos.forEach((candidato, indice) => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${candidato.nome}</td>
        <td>${candidato.curso}</td>
        <td>${candidato.codigo}</td>
        <td>${candidato.estado}</td>
        <td>
          <button type="button" class="action-btn" onclick="editarCandidato(${indice})">Editar</button>
          <button type="button" class="action-btn delete" onclick="apagarCandidato(${indice})">Apagar</button>
          <button type="button" class="action-btn" onclick="copiarCodigoAcesso('${candidato.codigo}')">Copiar código</button>
        </td>
      `;
      tabelaCandidatos.appendChild(linha);
    });
  };

  /**
   * Copia o código de acesso para a área de transferência
   */
  const copiarCodigoAcesso = (codigo) => {
    if (!codigo) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codigo).then(
        () => alert('Código copiado: ' + codigo),
        () => prompt('Copiar código (Ctrl+C):', codigo)
      );
    } else {
      prompt('Copiar código (Ctrl+C):', codigo);
    }
  };

  /**
   * Edita um candidato existente
   */
  const editarCandidato = (indice) => {
    const { inputNome, inputIdade, inputBI, inputContato, inputCurso, inputStatus } = DOMElements;
    const candidato = AppState.candidatos[indice];
    
    inputNome.value = candidato.nome;
    inputIdade.value = candidato.idade;
    inputBI.value = candidato.bi;
    inputContato.value = candidato.contacto;
    inputCurso.value = candidato.curso;
    inputStatus.value = candidato.estado;
    
    AppState.candidatos.splice(indice, 1);
    renderizarCandidatos();
    atualizarPainelPrincipal();
  };

  /**
   * Apaga um candidato do sistema
   */
  const apagarCandidato = (indice) => {
    if (confirm('Tem certeza que deseja apagar este candidato?')) {
      AppState.candidatos.splice(indice, 1);
      renderizarCandidatos();
      atualizarPainelPrincipal();
    }
  };

  /**
   * Atualiza a lista de cursos disponíveis
   */
  const atualizarListaCursos = () => {
    const { seletorCurso } = DOMElements;
    seletorCurso.innerHTML = '<option value="">Todos os Cursos</option>';
    
    const cursosUnicos = [...new Set(AppState.candidatos.map(c => c.curso))];
    cursosUnicos.forEach(curso => {
      const opcao = document.createElement('option');
      opcao.value = curso;
      opcao.textContent = curso;
      seletorCurso.appendChild(opcao);
    });
  };

  /**
   * Aplica filtros na tabela de relatórios
   */
  const aplicarFiltros = () => {
    const { seletorCurso, seletorStatus, tabelaRelatorios } = DOMElements;
    const cursoSelecionado = seletorCurso.value;
    const statusSelecionado = seletorStatus.value;
    
    tabelaRelatorios.innerHTML = '';
    
    AppState.candidatos
      .filter(c => !cursoSelecionado || c.curso === cursoSelecionado)
      .filter(c => !statusSelecionado || c.estado === statusSelecionado)
      .forEach(candidato => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${candidato.nome}</td>
          <td>${candidato.idade}</td>
          <td>${candidato.bi}</td>
          <td>${candidato.contacto}</td>
          <td>${candidato.curso}</td>
          <td>${candidato.codigo}</td>
          <td>${candidato.estado}</td>
        `;
        tabelaRelatorios.appendChild(linha);
      });
  };

  /**
   * Atualiza o painel principal com estatísticas
   */
  const atualizarPainelPrincipal = () => {
    const { totalCandidatos, totalAprovados, totalReprovados, totalPendentes, containerResumoCursos } = DOMElements;
    
    totalCandidatos.textContent = AppState.candidatos.length;
    totalAprovados.textContent = AppState.candidatos.filter(c => c.estado === 'Aprovado').length;
    totalReprovados.textContent = AppState.candidatos.filter(c => c.estado === 'Reprovado').length;
    totalPendentes.textContent = AppState.candidatos.filter(c => c.estado === 'Pendente').length;

    containerResumoCursos.innerHTML = '';
    const resumoCursos = {};
    
    AppState.candidatos.forEach(c => {
      resumoCursos[c.curso] = (resumoCursos[c.curso] || 0) + 1;
    });
    
    if (Object.keys(resumoCursos).length === 0) {
      const item = document.createElement('li');
      item.textContent = 'Nenhum candidato registado';
      containerResumoCursos.appendChild(item);
    } else {
      Object.keys(resumoCursos).forEach(curso => {
        const item = document.createElement('li');
        item.textContent = `${curso}: ${resumoCursos[curso]} candidato(s)`;
        containerResumoCursos.appendChild(item);
      });
    }

    atualizarListaCursos();
  };

  /**
   * Consulta o resultado de um aluno pelo código
   */
  const consultarResultado = () => {
    const { codigoAluno } = DOMElements;
    const codigo = codigoAluno.value.trim();
    const candidatoEncontrado = AppState.candidatos.find(c => c.codigo === codigo);
    const divResultados = document.getElementById('studentResults');
    const divSemResultados = document.getElementById('noResults');

    if (candidatoEncontrado) {
      document.getElementById('sNome').textContent = candidatoEncontrado.nome;
      document.getElementById('sBI').textContent = candidatoEncontrado.bi;
      document.getElementById('sCurso').textContent = candidatoEncontrado.curso;
      document.getElementById('sMedia').textContent = candidatoEncontrado.media.toFixed(2);
      
      const elementoStatus = document.getElementById('sStatus');
      elementoStatus.innerHTML = `<span class="status-badge ${candidatoEncontrado.estado.toLowerCase()}">${candidatoEncontrado.estado}</span>`;
      
      divResultados.classList.remove('hidden');
      divSemResultados.classList.add('hidden');
    } else {
      alert('Código de acesso não encontrado');
      divResultados.classList.add('hidden');
      divSemResultados.classList.remove('hidden');
    }
  };

  /**
   * Exporta relatório em formato TXT
   */
  const exportarRelatorioTXT = () => {
    const { seletorCurso, seletorStatus } = DOMElements;
    const cursoSelecionado = seletorCurso.value;
    const statusSelecionado = seletorStatus.value;
    
    let candidatosRelatorio = AppState.candidatos
      .filter(c => !cursoSelecionado || c.curso === cursoSelecionado)
      .filter(c => !statusSelecionado || c.estado === statusSelecionado);

    if (candidatosRelatorio.length === 0) {
      alert('Nenhum candidato para exportar');
      return;
    }

    let conteudo = 'RELATÓRIO DE CANDIDATOS\n';
    conteudo += 'Gerado em: ' + new Date().toLocaleDateString('pt-PT') + '\n';
    conteudo += '='.repeat(50) + '\n\n';
    
    candidatosRelatorio.forEach((c, i) => {
      conteudo += `${i + 1}. Nome: ${c.nome}\n`;
      conteudo += `   Idade: ${c.idade}\n`;
      conteudo += `   BI: ${c.bi}\n`;
      conteudo += `   Contacto: ${c.contacto}\n`;
      conteudo += `   Curso: ${c.curso}\n`;
      conteudo += `   Código: ${c.codigo}\n`;
      conteudo += `   Média: ${c.media.toFixed(2)}\n`;
      conteudo += `   Estado: ${c.estado}\n`;
      conteudo += '---\n\n';
    });

    conteudo += '='.repeat(50) + '\n';
    conteudo += `Total de candidatos: ${candidatosRelatorio.length}\n`;

    const linkDownload = document.createElement('a');
    linkDownload.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(conteudo));
    linkDownload.setAttribute('download', 'relatorio.txt');
    linkDownload.style.display = 'none';
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
  };
