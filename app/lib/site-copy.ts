import type { SiteLanguage } from "@/app/components/language-provider";

export const siteCopy = {
  en: {
    shell: {
      homeLabel: "Home",
      copyright: "Debora Joppi.",
    },
    nav: {
      about: "About",
      research: "Research",
      publications: "Publications",
      projects: "Projects",
    },
    about: {
      title: "About",
      intro:
        "Postdoctoral researcher at Charite (Berlin). I study how mutations in PRC1.1 (USP7, PCGF1, BCOR, KDM2B) reshape chromatin and drive DLBCL. I integrate functional assays with spatial genomics and structure-guided models (AlphaFold, PyMOL) to generate mechanistic and biomarker hypotheses.",
      interests: [
        "Cancer epigenetics (PRC1.1: USP7, PCGF1, BCOR, KDM2B)",
        "Functional and spatial genomics (CUT&Tag, ChIP-seq, RNA-seq)",
        "Structure-guided hypotheses (AlphaFold, PyMOL)",
        "DLBCL mechanistic models and biomarkers",
      ],
    },
    research: {
      title: "Research",
      cards: [
        {
          title: "USP7 mutational landscape in GCB-DLBCL",
          summary:
            "Site-directed mutagenesis (Y243D, I660K, T730S, Y1056H), CRISPR perturbations, and structural modeling to understand PRC1.1 assembly and deubiquitinase activity.",
        },
        {
          title: "PCGF1 overexpression and H2AK119ub dynamics",
          summary:
            "Functional genomics and CUT&Tag profiling to quantify Polycomb deposition and downstream effects.",
        },
        {
          title: "GFI1-OE and BCR signaling (CD79b)",
          summary:
            "Global proteomics in HBL1; TF networks (LCK/LAT2) and potential BCAR1 cytosolic interactions.",
        },
        {
          title: "Public re-analysis: BCOR/KDM2B peaks in LY1",
          summary:
            "ChIP-seq overlap and motif discovery (HOMER), excluding H3K27me3 to enrich for PRC1.1 candidates.",
        },
      ],
    },
    publications: {
      title: "Publications and manuscripts",
      items: [
        {
          year: 2025,
          title: "USP7 mutations rewire PRC1.1 activity in GCB-DLBCL",
          note: "manuscript in preparation",
        },
        {
          year: 2025,
          title: "GFI1 overexpression modulates CD79b networks in HBL1",
          note: "proteomics and validation - in prep",
        },
        {
          year: 2024,
          title: "Deciphering the oncogenic role of PRC1 complexes in DLBCL (PhD Thesis)",
          venue: "University of Gottingen",
          href: "#",
        },
      ],
      linkLabel: "link",
    },
    projects: {
      eyebrow: "Projects",
      title: "Computational tools and side builds",
      intro:
        "Small, focused tools that support my research workflow and data analysis. Stats lives here as a project rather than a top-level science section.",
      openProject: "Open project",
      items: [
        {
          href: "/science/projects/stats",
          title: "Stats",
          summary:
            "A Prism-like analysis studio for quick grouped and XY plots, summary statistics, and common tests from pasted tables.",
          status: "Live",
        },
        {
          href: "/science/projects/cloneflow",
          title: "CloneFlow",
          summary:
            "A local-first molecular cloning planning app with config-driven workflow logic, kept in its own standalone repository.",
          status: "External Repo",
        },
      ],
    },
    cloneflow: {
      back: "Back to Projects",
      eyebrow: "Project",
      title: "CloneFlow",
      intro:
        "CloneFlow is a local-first Next.js app for molecular cloning planning. It stays in its own repository, but this page makes it part of the Projects section on your website.",
      whatItDoes: "What it does",
      whatItDoesBody:
        "The app is designed around config-driven cloning workflows rather than hardcoded UI logic. That makes it easier to extend vectors, rule sets, and workflow types without rewriting the interface each time.",
      capabilities: [
        "Config-driven cloning logic with editable workflow and vector rule files",
        "Local-first project history and imported plasmid handling in the browser",
        "Sequence planning support for cloning, mutagenesis, and validation workflows",
        "Deployable as a standalone Next.js app without merging it into this website repo",
      ],
      access: "Access",
      accessBody:
        "CloneFlow remains a separate standalone repo, but the live app is also available directly. Visitors can open the deployed site or inspect the codebase from here.",
      openLive: "Open Live App",
      openRepo: "Open GitHub Repository",
    },
    stats: {
      backProjects: "Back Projects",
      backScience: "Back Science",
    },
    statsTool: {
      eyebrow: "Data + Stats",
      title: "Prism-like Analysis Studio",
      intro:
        "Paste CSV/TSV data, compute statistical tests, and visualize results with multiple chart styles. Grouped mode uses column-wise groups (like Prism column tables). XY mode supports correlation, linear regression, and fitted scatter plots.",
      dataInput: "Data Input",
      grouped: "Grouped",
      xy: "XY",
      loadSample: "Load Sample",
      firstRowHeader: "First row is header",
      parsed: "Parsed",
      rows: "rows",
      columns: "columns",
      parseFailed: "Could not parse this table.",
      xColumn: "X Column",
      yColumn: "Y Column",
      statsCharts: "Statistics + Charts",
      descriptiveStats: "Descriptive Statistics",
      welch: "Welch t-test (two-tailed)",
      oneWayAnova: "One-way ANOVA",
      needGroups: "Need at least 2 groups for inferential statistics.",
      nPairs: "N pairs",
      meanX: "Mean X",
      meanY: "Mean Y",
      sdX: "SD X",
      sdY: "SD Y",
      pearsonR: "Pearson r",
      rSquared: "R squared",
      linearFit: "Linear fit",
      correlationP: "Correlation p",
      notEnoughPoints: "Not enough points",
      correlationHelp: "Pearson correlation p-value is computed from the t statistic with df = n - 2.",
      group: "Group",
      n: "n",
      mean: "Mean",
      median: "Median",
      sd: "SD",
      sem: "SEM",
      ci95: "95% CI",
      value: "Value",
      couldNotParseInput: "Could not parse your input. Use comma, tab, or semicolon delimiters.",
      noNumericData: "No numeric data found. In grouped mode, each column is interpreted as one group.",
      needTwoRows: "Need at least two valid (x, y) rows for XY analysis.",
      noDataRowsAfterHeader: "No data rows after header.",
      delimiterTab: "tab",
      delimiterComma: "comma",
      delimiterSemicolon: "semicolon",
      chartOptionsGrouped: {
        bar: "Bar + SEM",
        box: "Box Plot",
        strip: "Strip Plot",
        meanLine: "Mean Line",
      },
      chartOptionsXY: {
        scatter: "Scatter + Fit",
        line: "Line",
      },
      sampleGrouped: `Control,Treatment A,Treatment B
9.8,11.2,13.6
10.5,10.9,14.2
9.9,11.7,13.1
10.1,12.0,13.7
10.7,11.5,14.5
9.6,11.9,13.9`,
      sampleXY: `Dose,Response
0,3.1
1,4.0
2,5.1
3,6.4
4,7.5
5,8.4
6,9.1`,
      columnLabel: "Column",
    },
  },
  pt: {
    shell: {
      homeLabel: "Inicio",
      copyright: "Debora Joppi.",
    },
    nav: {
      about: "Sobre",
      research: "Pesquisa",
      publications: "Publicacoes",
      projects: "Projetos",
    },
    about: {
      title: "Sobre",
      intro:
        "Pesquisadora de pos-doutorado na Charite (Berlim). Estudo como mutacoes em PRC1.1 (USP7, PCGF1, BCOR, KDM2B) remodelam a cromatina e impulsionam o DLBCL. Integro ensaios funcionais com genomica espacial e modelos guiados por estrutura (AlphaFold, PyMOL) para gerar hipoteses mecanisticas e de biomarcadores.",
      interests: [
        "Epigenetica do cancer (PRC1.1: USP7, PCGF1, BCOR, KDM2B)",
        "Genomica funcional e espacial (CUT&Tag, ChIP-seq, RNA-seq)",
        "Hipoteses guiadas por estrutura (AlphaFold, PyMOL)",
        "Modelos mecanisticos e biomarcadores em DLBCL",
      ],
    },
    research: {
      title: "Pesquisa",
      cards: [
        {
          title: "Paisagem mutacional de USP7 em GCB-DLBCL",
          summary:
            "Mutagenese sitio-dirigida (Y243D, I660K, T730S, Y1056H), perturbacoes por CRISPR e modelagem estrutural para entender a montagem de PRC1.1 e a atividade de desubiquitinase.",
        },
        {
          title: "Superexpressao de PCGF1 e dinamica de H2AK119ub",
          summary:
            "Genomica funcional e perfilamento por CUT&Tag para quantificar a deposicao de Polycomb e os efeitos downstream.",
        },
        {
          title: "GFI1-OE e sinalizacao de BCR (CD79b)",
          summary:
            "Proteomica global em HBL1; redes de fatores de transcricao (LCK/LAT2) e possiveis interacoes citosolicas de BCAR1.",
        },
        {
          title: "Reanalise publica: picos de BCOR/KDM2B em LY1",
          summary:
            "Sobreposicao de ChIP-seq e descoberta de motivos (HOMER), excluindo H3K27me3 para enriquecer candidatos de PRC1.1.",
        },
      ],
    },
    publications: {
      title: "Publicacoes e manuscritos",
      items: [
        {
          year: 2025,
          title: "Mutacoes em USP7 reprogramam a atividade de PRC1.1 em GCB-DLBCL",
          note: "manuscrito em preparacao",
        },
        {
          year: 2025,
          title: "Superexpressao de GFI1 modula redes de CD79b em HBL1",
          note: "proteomica e validacao - em preparacao",
        },
        {
          year: 2024,
          title: "Deciphering the oncogenic role of PRC1 complexes in DLBCL (Tese de doutorado)",
          venue: "Universidade de Gottingen",
          href: "#",
        },
      ],
      linkLabel: "link",
    },
    projects: {
      eyebrow: "Projetos",
      title: "Ferramentas computacionais e projetos paralelos",
      intro:
        "Ferramentas pequenas e focadas que apoiam meu fluxo de trabalho em pesquisa e analise de dados. O Stats aparece aqui como projeto, e nao como secao principal de ciencia.",
      openProject: "Abrir projeto",
      items: [
        {
          href: "/science/projects/stats",
          title: "Stats",
          summary:
            "Um estudio de analise no estilo Prism para graficos agrupados e XY, estatisticas descritivas e testes comuns a partir de tabelas coladas.",
          status: "Ativo",
        },
        {
          href: "/science/projects/cloneflow",
          title: "CloneFlow",
          summary:
            "Um aplicativo local-first para planejamento de clonagem molecular, mantido em um repositorio independente com logica de workflow configuravel.",
          status: "Repo Externo",
        },
      ],
    },
    cloneflow: {
      back: "Voltar para Projetos",
      eyebrow: "Projeto",
      title: "CloneFlow",
      intro:
        "CloneFlow e um aplicativo Next.js local-first para planejamento de clonagem molecular. Ele continua em seu proprio repositorio, mas esta pagina o integra a secao de Projetos do site.",
      whatItDoes: "O que faz",
      whatItDoesBody:
        "O aplicativo foi desenhado em torno de workflows de clonagem guiados por configuracao, em vez de uma logica de interface rigidamente codificada. Isso facilita expandir vetores, conjuntos de regras e tipos de workflow sem reescrever a interface a cada vez.",
      capabilities: [
        "Logica de clonagem guiada por configuracao com arquivos editaveis de workflow e regras de vetores",
        "Historico local-first de projetos e manipulacao de plasmideos importados no navegador",
        "Suporte ao planejamento de sequencias para clonagem, mutagenese e workflows de validacao",
        "Pode ser implantado como um app Next.js independente sem ser incorporado a este repositorio do site",
      ],
      access: "Acesso",
      accessBody:
        "CloneFlow continua sendo um repositorio independente, mas o aplicativo ao vivo tambem esta disponivel diretamente. Visitantes podem abrir a versao implantada ou inspecionar o codigo a partir daqui.",
      openLive: "Abrir app",
      openRepo: "Abrir repositorio GitHub",
    },
    stats: {
      backProjects: "Voltar Projetos",
      backScience: "Voltar Ciencia",
    },
    statsTool: {
      eyebrow: "Dados + Estatistica",
      title: "Studio de Analise estilo Prism",
      intro:
        "Cole dados CSV/TSV, calcule testes estatisticos e visualize resultados com varios estilos de grafico. O modo agrupado usa colunas como grupos (como nas tabelas de colunas do Prism). O modo XY suporta correlacao, regressao linear e graficos de dispersao com ajuste.",
      dataInput: "Entrada de dados",
      grouped: "Agrupado",
      xy: "XY",
      loadSample: "Carregar exemplo",
      firstRowHeader: "Primeira linha e cabecalho",
      parsed: "Interpretado",
      rows: "linhas",
      columns: "colunas",
      parseFailed: "Nao foi possivel interpretar esta tabela.",
      xColumn: "Coluna X",
      yColumn: "Coluna Y",
      statsCharts: "Estatistica + Graficos",
      descriptiveStats: "Estatisticas descritivas",
      welch: "Teste t de Welch (bicaudal)",
      oneWayAnova: "ANOVA de uma via",
      needGroups: "Sao necessarios pelo menos 2 grupos para estatistica inferencial.",
      nPairs: "N pares",
      meanX: "Media X",
      meanY: "Media Y",
      sdX: "DP X",
      sdY: "DP Y",
      pearsonR: "Pearson r",
      rSquared: "R ao quadrado",
      linearFit: "Ajuste linear",
      correlationP: "p da correlacao",
      notEnoughPoints: "Pontos insuficientes",
      correlationHelp: "O p-valor da correlacao de Pearson e calculado a partir da estatistica t com gl = n - 2.",
      group: "Grupo",
      n: "n",
      mean: "Media",
      median: "Mediana",
      sd: "DP",
      sem: "EPM",
      ci95: "IC 95%",
      value: "Valor",
      couldNotParseInput: "Nao foi possivel interpretar sua entrada. Use delimitadores por virgula, tabulacao ou ponto e virgula.",
      noNumericData: "Nenhum dado numerico encontrado. No modo agrupado, cada coluna e interpretada como um grupo.",
      needTwoRows: "Sao necessarias pelo menos duas linhas XY validas para a analise.",
      noDataRowsAfterHeader: "Nao ha linhas de dados apos o cabecalho.",
      delimiterTab: "tabulacao",
      delimiterComma: "virgula",
      delimiterSemicolon: "ponto e virgula",
      chartOptionsGrouped: {
        bar: "Barras + EPM",
        box: "Box Plot",
        strip: "Strip Plot",
        meanLine: "Linha da media",
      },
      chartOptionsXY: {
        scatter: "Dispersao + ajuste",
        line: "Linha",
      },
      sampleGrouped: `Controle,Tratamento A,Tratamento B
9.8,11.2,13.6
10.5,10.9,14.2
9.9,11.7,13.1
10.1,12.0,13.7
10.7,11.5,14.5
9.6,11.9,13.9`,
      sampleXY: `Dose,Resposta
0,3.1
1,4.0
2,5.1
3,6.4
4,7.5
5,8.4
6,9.1`,
      columnLabel: "Coluna",
    },
  },
} as const;

export function getCopy(language: SiteLanguage) {
  return siteCopy[language];
}
