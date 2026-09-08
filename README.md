# 🏛️ IFRO Campus Jaru 3D — Tour Virtual & Experiência Interativa

> **Reconstrução 3D interativa do campus do IFRO — Campus Jaru, desenvolvida através de 20 horas de co-programação e co-criação intensiva entre coordenação humana e Inteligência Artificial via Blender e protocolo MCP.**

🌐 **Acesse e Experimente o Tour Virtual Online:**  
👉 **[https://passoquinha.github.io/tourifrojaru/](https://passoquinha.github.io/tourifrojaru/)**

---

## 🔬 Sobre o Projeto e Contexto Acadêmico

Este projeto é um objeto de estudo prático e aprofundado do **Grupo de Estudos em Inteligência Artificial** do **Instituto Federal de Rondônia (IFRO) — Campus Jaru**, sob a coordenação do professor **Aldison Dias**.

O trabalho nasceu com a premissa de investigar a fronteira real do desenvolvimento assistido por IA: testar como ferramentas de ponta (LLMs, Visão Computacional e o protocolo MCP conectado ao Blender) se comportam diante de um desafio arquitetônico e cartográfico de grande escala no mundo real.

---

## 🤝 Metodologia Real: O Paradigma da Co-Programação Humano-IA

Longe da ilusão de uma "geração autônoma por um simples prompt", este projeto evidenciou que uma modelagem desse porte e fidelidade **seria impossível sem a atuação contínua, crítica e cirúrgica do desenvolvedor humano**.

Foram necessárias mais de **20 horas de trabalho colaborativo intenso em regime de co-programação**, com centenas de ciclos iterativos de feedback:

* **Curadoria e Alimentação de Dados Reais:** A IA não possui o modelo do campus em sua memória. O coordenador humano forneceu continuamente o material de verdade de campo — ortofotos de satélite, fotografias em múltiplos ângulos de cada bloco, croquis com metragem e referências detalhadas de fachadas.
* **Intervenções e Guias Manuais no Blender:** Em momentos críticos — como o recuo da varanda em L da Clínica Veterinária, a curvatura do paredão, o ajuste do alinhamento do Prédio 3 e a demarcação das vagas de moto e alargamento da pista —, o coordenador modelou e posicionou guias e blocos de referência diretamente na viewport do Blender para orientar a IA geometricamente.
* **Refinamento e Correção Espacial Contínua:** Foram dezenas de intervenções para corrigir direções de portas blindex, solucionar oclusões de calçadas, calibrar o caimento de telhados coloniais e acertar o posicionamento de vegetação com base no satélite.
* **O Papel da IA como Co-Programadora:** Através do **Model Context Protocol (MCP)** via socket com o Blender, a IA atuou como uma co-programadora de suporte: calculando equações de curvas elípticas, gerando malhas paramétricas, aplicando materiais com propriedades físicas, auditando colisões e programando o motor interativo em Three.js e Web Audio API.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    COORDENADOR HUMANO (Prof. Aldison Dias)                 │
│  - 20 horas de co-programação e supervisão contínua                        │
│  - Curadoria de fotos in loco, ortofotos de satélite e croquis             │
│  - Modelagem e posicionamento manual de guias espaciais no Blender         │
│  - Validação arquitetônica, correção de escala e critérios de fidelidade   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ Ciclo de Feedback Contínuo
                                      │ (Instruções, Imagens e Métricas)
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                      IA / AGENTES CO-PROGRAMADORES                         │
│  - Raciocínio espacial e interpretação visual de referências (VLM/LLMs)    │
│  - Execução de scripts Python em tempo real no Blender via MCP             │
│  - Cálculo matemático de curvas (elipses/béziers) e auditoria de malha     │
│  - Programação do motor WebGL (Three.js), física e áudio multicanal        │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

* **Blender 5:** Modelagem 3D *low-poly*, estruturação de coleções, aplicação de materiais e auditoria geométrica de solo e colisões;
* **Model Context Protocol (MCP):** Ponte de comunicação por socket TCP permitindo o controle paramétrico e a manipulação direta da sessão ativa do Blender em tempo real;
* **Exportação glTF 2.0 (GLB):** Otimização do campus inteiro para um arquivo binário ultraleve de apenas **2.88 MB**, permitindo carregamento veloz em conexões comuns e dispositivos móveis;
* **Three.js & WebGL:** Renderizador 3D em tempo real com iluminação estúdio, sombras suaves (*PCFSoftShadowMap*), neblina atmosférica e mapeamento de tons cinematográfico (*ACESFilmic*);
* **Web Audio API (Motor de Áudio em 5 Estágios):** Sistema de som com amostras reais da lambreta sintetizado em 5 canais dinâmicos:
  1. *Partida (Ignition):* Som de arranque ao ligar o veículo;
  2. *Marcha Lenta (Idle):* Rotação purr contínua em repouso;
  3. *Fade-in de Aceleração:* Ataque sonoro imediato ao acionar o acelerador;
  4. *Aceleração Contínua (Cruzeiro):* Rotação com modulação orgânica de pitch de $0.80\times$ a $1.48\times$ com a velocidade;
  5. *Fade-out de Desaceleração:* Freio-motor suave e corte ao soltar o acelerador.

---

## 🎮 Modos de Experiência Interativa

### 🛵 1. Modo JOGAR (Pilotar a Lambreta)
* Pilote uma lambreta elétrica com piloto NPC por todo o campus;
* Física arcade em 3ª pessoa com aceleração, frenagem, ré e esterçamento com inclinação dinâmica de chassi nas curvas;
* **Colisões Rígidas com Spatial Grid $O(1)$:** Mais de 680 colisores rígidos no campus (paredes com contorno preciso nas curvas, árvores, muretas, postes e veículos estacionados);
* **Controles:**
  * <kbd>W</kbd> / <kbd>▲</kbd> : Acelerar
  * <kbd>S</kbd> / <kbd>▼</kbd> : Freio / Ré
  * <kbd>A</kbd> / <kbd>D</kbd> ou <kbd>◄</kbd> / <kbd>►</kbd> : Virar
  * <kbd>Espaço</kbd> : Freio de mão
  * <kbd>C</kbd> : Alternar câmera
  * <kbd>R</kbd> : Respawn na Rua Tapajós
  * *(Controles virtuais na tela disponíveis para celulares e tablets).*

### 🌐 2. Modo NAVEGAR (Inspeção Arquitetônica)
* Navegação orbital livre em 360° com zoom e pan;
* Menu de seleção rápida com **voo suave (*fly-to*) com desaceleração cúbica** e câmeras aéreas em ângulos diagonais ($30^\circ$ a $45^\circ$) para os 8 setores do campus:
  1. **Entrada e Portaria Principal:** Pórtico monumental com pilares verde e vermelho, guarita com marquise e acesso pavimentado;
  2. **Biblioteca e Centro de Estudos:** Edifício térreo colonial em 4 águas e quadra de areia vizinha;
  3. **Bloco Administrativo (Prédio 3):** Porta blindex institucional com adesivos do IFRO, janelas em alumínio e a grande árvore frondosa no canteiro-banco;
  4. **Bloco C (Salas de Aula):** Edifício de 2 pavimentos com aletas verticais vermelhas e platibanda verde;
  5. **Pavilhões A e B:** Galpões de salas de aula paralelos com varanda colunada e novo estacionamento alinhado de veículos e motos;
  6. **Bloco Pedagógico:** Complexo em "H" com totem "CAMPUS JARU", brises solares e palmeiras imperiais;
  7. **Clínica Veterinária e Galpão de Grandes Animais:** Entrada remodelada com parede curva uniforme, letreiro 3D "CLÍNICA VETERINÁRIA", porta blindex voltada para oeste, varanda coberta em L e galpão de grandes animais;
  8. **CIT (Centro de Inovação Tecnológica):** Edifício tecnológico com corpo central de 2 pavimentos e praça com postes curvos;
  * **Vista Geral do Topo:** Visão aérea ortográfica completa de todo o lote e entorno residencial.

---

## 💻 Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/passoquinha/tourifrojaru.git

# 2. Entrar no diretório
cd tourifrojaru

# 3. Iniciar qualquer servidor estático local (ex: com Python)
python -m http.server 8000
```
Acesse no seu navegador: `http://localhost:8000`

---

## 👥 Créditos e Realização

* **Instituição:** [Instituto Federal de Educação, Ciência e Tecnologia de Rondônia (IFRO)](https://portal.ifro.edu.br/) — Campus Jaru
* **Núcleo de Pesquisa:** Grupo de Estudos em Inteligência Artificial
* **Coordenação & Engenharia do Projeto:** Prof. Aldison Dias
* **Licença:** Código e modelos distribuídos sob licença educacional aberta para a comunidade acadêmica e externa.
