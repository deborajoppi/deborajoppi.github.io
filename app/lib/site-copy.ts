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
      presentations: "Presentations",
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
      educationTitle: "Training",
      education: [
        {
          period: "2020-2024",
          degree: "PhD in Molecular Medicine",
          institution: "University of Göttingen, Germany",
          detail: "Thesis: The Role of Polycomb Repressive Complexes 1 in Diffuse Large B-cell Lymphoma.",
        },
        {
          period: "2017-2019",
          degree: "MSc in Biomedicine",
          institution: "Karolinska Institutet, Sweden",
          detail: "Specialization in cancer biology; thesis on Id proteins in hair follicle and epidermis morphogenesis.",
        },
        {
          period: "2012-2017",
          degree: "BSc in Pharmacy",
          institution: "Federal University of Santa Catarina, Brazil",
          detail: "Included an academic exchange period at Columbia University in 2014.",
        },
      ],
      highlightsTitle: "Highlights",
      highlights: [
        "International research training at Amgen, the University of Tokyo, the University of Oxford, and IFOM.",
        "Best Scientific Poster, Karolinska Institutet (2019).",
        "Additional training in single-cell RNA-seq and computational analyses of mRNA-seq, ChIP-seq, and ATAC-seq.",
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
      title: "Publications",
      items: [
        {
          year: 2020,
          authors: "Hershey, B. J., Vazzana, R., Joppi, D. L., Havas, K. M.",
          title: "Lipid Droplets Define a Sub-Population of Breast Cancer Stem Cells",
          venue: "Journal of Clinical Medicine 9:87",
          href: "https://doi.org/10.3390/jcm9010087",
        },
        {
          year: 2017,
          authors:
            "Cisilotto, J., Sandjo, L. P., Faqueti, L. G., Fernandes, H., Joppi, D., Biavatti, M. W., Creczynski-Pasa, T. B.",
          title:
            "Cytotoxicity mechanisms in melanoma cells and UPLC-QTOF/MS2 chemical characterization of two Brazilian stingless bee propolis: the uncommon presence of piperidinic alkaloids",
          venue: "Journal of Pharmaceutical and Biomedical Analysis 149:502-511",
          href: "https://doi.org/10.1016/j.jpba.2017.11.038",
        },
      ],
      linkLabel: "link",
    },
    presentations: {
      title: "Conference Abstracts and Presentations",
      abstractsTitle: "Published conference abstracts",
      presentationsTitle: "Other presentations listed in CV",
      linkLabel: "link",
      items: [
        {
          category: "abstract",
          year: 2024,
          authors: "Joppi, D. L., Loeber, J., Fanlo, L., Alcalde, Á., Javierre, B., Chapuy, B.",
          title: "Exploring the biological underpinnings of PRC1.1 deregulation in DLBCL",
          venue: "Clinical Epigenetics International Conference, Warsaw",
          href: "https://clinicalepigeneticsjournal.biomedcentral.com/articles/10.1186/s13148-024-01749-0",
        },
        {
          category: "presentation",
          year: 2024,
          authors: "Joppi, D. L., Loeber, J., Fanlo, L., Alcalde, Á., Javierre, B., Chapuy, B.",
          title: "Exploring the biological underpinnings of PRC1.1 deregulation in DLBCL",
          venue: "Conference presentation",
        },
        {
          category: "presentation",
          year: 2023,
          authors: "Joppi, D. L., Javierre, B., Chapuy, B.",
          title: "PRC1 Deregulation in DLBCL",
          venue: "Seminar",
        },
        {
          category: "presentation",
          year: 2022,
          authors: "Joppi, D. L., Chapuy, B.",
          title: "Deciphering the role of Polycomb Repressive Complex 1 in Diffuse Large B-cell Lymphoma",
          venue: "Conference talk",
        },
        {
          category: "presentation",
          year: 2021,
          authors: "Joppi, D. L., Chapuy, B.",
          title: "Deciphering the oncogenic role of PRC1 complexes in Diffuse Large B-cell Lymphoma",
          venue: "Seminar",
        },
        {
          category: "abstract",
          year: 2016,
          authors: "Suzuki, G., Ohnuki, S., Joppi, D. L., Ishizaka, S., Costanzo, M., Andrews, B., Boone, C., Ohya, Y.",
          title: "High dimensional and large scale phenotyping of budding yeast essential gene temperature sensitive mutants",
          venue: "The 39th Annual Meeting of the Molecular Biology Society of Japan, Yokohama",
        },
        {
          category: "abstract",
          year: 2014,
          authors: "Joppi, D. L., Cisilotto, J., Mello Junior, L. J., Creczynski-Pasa, T. B.",
          title: "Evaluation of Antiproliferative Activity of Native Stingless Bees Propolis",
          venue: "1st Symposium of the Graduate Program in Pharmacy, Federal University of Santa Catarina, Florianópolis",
        },
        {
          category: "presentation",
          year: 2018,
          authors: "Joppi, D. L., Chen, Z., D'Angiolella, V.",
          title: "Purification of Cyclin F from insect cells",
          venue: "Conference presentation",
        },
        {
          category: "presentation",
          year: 2014,
          authors: "Joppi, D. L., Cisilotto, J., Mello Junior, L. J., Creczynski-Pasa, T. B.",
          title: "Evaluation of Antiproliferative Activity of Native Stingless Bees' Propolis",
          venue: "Symposium presentation",
        },
        {
          category: "abstract",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Extrato de Própolis de Abelhas Indígenas Sem Ferrão Induzem Apoptose em Linhagens de Melanoma",
          venue: "II Seminário da Rede Nanofito/CAPES, Florianópolis",
        },
        {
          category: "abstract",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de própolis de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "III Workshop de Materiais Aplicados à Física e Farmácia, Rio dos Cedros",
        },
        {
          category: "presentation",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "Seminar presentation",
        },
        {
          category: "presentation",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de própolis de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "Symposium presentation",
        },
      ],
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
      homeLabel: "Início",
      copyright: "Débora Joppi.",
    },
    nav: {
      about: "Sobre",
      research: "Pesquisa",
      publications: "Publicações",
      presentations: "Apresentações",
      projects: "Projetos",
    },
    about: {
      title: "Sobre",
      intro:
        "Pesquisadora de pós-doutorado na Charité (Berlim). Estudo como mutações em PRC1.1 (USP7, PCGF1, BCOR, KDM2B) remodelam a cromatina e impulsionam o DLBCL. Integro ensaios funcionais com genômica espacial e modelos guiados por estrutura (AlphaFold, PyMOL) para gerar hipóteses mecanísticas e de biomarcadores.",
      interests: [
        "Epigenética do câncer (PRC1.1: USP7, PCGF1, BCOR, KDM2B)",
        "Genômica funcional e espacial (CUT&Tag, ChIP-seq, RNA-seq)",
        "Hipóteses guiadas por estrutura (AlphaFold, PyMOL)",
        "Modelos mecanísticos e biomarcadores em DLBCL",
      ],
      educationTitle: "Formação",
      education: [
        {
          period: "2020-2024",
          degree: "Doutorado em Medicina Molecular",
          institution: "Universidade de Göttingen, Alemanha",
          detail: "Tese: The Role of Polycomb Repressive Complexes 1 in Diffuse Large B-cell Lymphoma.",
        },
        {
          period: "2017-2019",
          degree: "Mestrado em Biomedicina",
          institution: "Karolinska Institutet, Suécia",
          detail: "Especialização em biologia do câncer; tese sobre proteínas Id na morfogênese do folículo piloso e da epiderme.",
        },
        {
          period: "2012-2017",
          degree: "Graduação em Farmácia",
          institution: "Universidade Federal de Santa Catarina, Brasil",
          detail: "Incluiu período de intercâmbio acadêmico na Columbia University em 2014.",
        },
      ],
      highlightsTitle: "Destaques",
      highlights: [
        "Formação internacional em pesquisa na Amgen, University of Tokyo, University of Oxford e IFOM.",
        "Melhor Pôster Científico, Karolinska Institutet (2019).",
        "Treinamento adicional em single-cell RNA-seq e análises computacionais de mRNA-seq, ChIP-seq e ATAC-seq.",
      ],
    },
    research: {
      title: "Pesquisa",
      cards: [
        {
          title: "Paisagem mutacional de USP7 em GCB-DLBCL",
          summary:
            "Mutagênese sítio-dirigida (Y243D, I660K, T730S, Y1056H), perturbações por CRISPR e modelagem estrutural para entender a montagem de PRC1.1 e a atividade de desubiquitinase.",
        },
        {
          title: "Superexpressão de PCGF1 e dinâmica de H2AK119ub",
          summary:
            "Genômica funcional e perfilamento por CUT&Tag para quantificar a deposição de Polycomb e os efeitos downstream.",
        },
        {
          title: "GFI1-OE e sinalização de BCR (CD79b)",
          summary:
            "Proteômica global em HBL1; redes de fatores de transcrição (LCK/LAT2) e possíveis interações citosólicas de BCAR1.",
        },
        {
          title: "Reanálise pública: picos de BCOR/KDM2B em LY1",
          summary:
            "Sobreposição de ChIP-seq e descoberta de motivos (HOMER), excluindo H3K27me3 para enriquecer candidatos de PRC1.1.",
        },
      ],
    },
    publications: {
      title: "Publicações",
      items: [
        {
          year: 2020,
          authors: "Hershey, B. J., Vazzana, R., Joppi, D. L., Havas, K. M.",
          title: "Lipid Droplets Define a Sub-Population of Breast Cancer Stem Cells",
          venue: "Journal of Clinical Medicine 9:87",
          href: "https://doi.org/10.3390/jcm9010087",
        },
        {
          year: 2017,
          authors:
            "Cisilotto, J., Sandjo, L. P., Faqueti, L. G., Fernandes, H., Joppi, D., Biavatti, M. W., Creczynski-Pasa, T. B.",
          title:
            "Cytotoxicity mechanisms in melanoma cells and UPLC-QTOF/MS2 chemical characterization of two Brazilian stingless bee propolis: the uncommon presence of piperidinic alkaloids",
          venue: "Journal of Pharmaceutical and Biomedical Analysis 149:502-511",
          href: "https://doi.org/10.1016/j.jpba.2017.11.038",
        },
      ],
      linkLabel: "link",
    },
    presentations: {
      title: "Resumos em congressos e apresentações",
      abstractsTitle: "Resumos publicados em anais de congressos",
      presentationsTitle: "Outras apresentações listadas no CV",
      linkLabel: "link",
      items: [
        {
          category: "abstract",
          year: 2024,
          authors: "Joppi, D. L., Loeber, J., Fanlo, L., Alcalde, Á., Javierre, B., Chapuy, B.",
          title: "Exploring the biological underpinnings of PRC1.1 deregulation in DLBCL",
          venue: "Clinical Epigenetics International Conference, Varsóvia",
          href: "https://clinicalepigeneticsjournal.biomedcentral.com/articles/10.1186/s13148-024-01749-0",
        },
        {
          category: "presentation",
          year: 2024,
          authors: "Joppi, D. L., Loeber, J., Fanlo, L., Alcalde, Á., Javierre, B., Chapuy, B.",
          title: "Exploring the biological underpinnings of PRC1.1 deregulation in DLBCL",
          venue: "Apresentação em congresso",
        },
        {
          category: "presentation",
          year: 2023,
          authors: "Joppi, D. L., Javierre, B., Chapuy, B.",
          title: "PRC1 Deregulation in DLBCL",
          venue: "Seminário",
        },
        {
          category: "presentation",
          year: 2022,
          authors: "Joppi, D. L., Chapuy, B.",
          title: "Deciphering the role of Polycomb Repressive Complex 1 in Diffuse Large B-cell Lymphoma",
          venue: "Conferência ou palestra",
        },
        {
          category: "presentation",
          year: 2021,
          authors: "Joppi, D. L., Chapuy, B.",
          title: "Deciphering the oncogenic role of PRC1 complexes in Diffuse Large B-cell Lymphoma",
          venue: "Seminário",
        },
        {
          category: "abstract",
          year: 2016,
          authors: "Suzuki, G., Ohnuki, S., Joppi, D. L., Ishizaka, S., Costanzo, M., Andrews, B., Boone, C., Ohya, Y.",
          title: "High dimensional and large scale phenotyping of budding yeast essential gene temperature sensitive mutants",
          venue: "39th Annual Meeting of the Molecular Biology Society of Japan, Yokohama",
        },
        {
          category: "abstract",
          year: 2014,
          authors: "Joppi, D. L., Cisilotto, J., Mello Junior, L. J., Creczynski-Pasa, T. B.",
          title: "Evaluation of Antiproliferative Activity of Native Stingless Bees Propolis",
          venue: "1º Simpósio do Programa de Pós-Graduação em Farmácia da UFSC, Florianópolis",
        },
        {
          category: "presentation",
          year: 2018,
          authors: "Joppi, D. L., Chen, Z., D'Angiolella, V.",
          title: "Purification of Cyclin F from insect cells",
          venue: "Apresentação em congresso",
        },
        {
          category: "presentation",
          year: 2014,
          authors: "Joppi, D. L., Cisilotto, J., Mello Junior, L. J., Creczynski-Pasa, T. B.",
          title: "Evaluation of Antiproliferative Activity of Native Stingless Bees' Propolis",
          venue: "Apresentação em simpósio",
        },
        {
          category: "abstract",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Extrato de Própolis de Abelhas Indígenas Sem Ferrão Induzem Apoptose em Linhagens de Melanoma",
          venue: "II Seminário da Rede Nanofito/CAPES, Florianópolis",
        },
        {
          category: "abstract",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de própolis de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "III Workshop de Materiais Aplicados à Física e Farmácia, Rio dos Cedros",
        },
        {
          category: "presentation",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "Apresentação em seminário",
        },
        {
          category: "presentation",
          year: 2013,
          authors: "Joppi, D. L., Cisilotto, J., Creczynski-Pasa, T. B.",
          title: "Atividade citotóxica de própolis de abelhas sem ferrão Scaptotrigona bipunctata (Tubuna) e Melipona quadrifasciata (Mandaçaia) em células de melanoma",
          venue: "Apresentação em simpósio",
        },
      ],
    },
    projects: {
      eyebrow: "Projetos",
      title: "Ferramentas computacionais e projetos paralelos",
      intro:
        "Ferramentas pequenas e focadas que apoiam meu fluxo de trabalho em pesquisa e análise de dados. O Stats aparece aqui como projeto, e não como seção principal de ciência.",
      openProject: "Abrir projeto",
      items: [
        {
          href: "/science/projects/stats",
          title: "Stats",
          summary:
            "Um estúdio de análise no estilo Prism para gráficos agrupados e XY, estatísticas descritivas e testes comuns a partir de tabelas coladas.",
          status: "Ativo",
        },
        {
          href: "/science/projects/cloneflow",
          title: "CloneFlow",
          summary:
            "Um aplicativo local-first para planejamento de clonagem molecular, mantido em um repositório independente com lógica de workflow configurável.",
          status: "Repo Externo",
        },
      ],
    },
    cloneflow: {
      back: "Voltar para Projetos",
      eyebrow: "Projeto",
      title: "CloneFlow",
      intro:
        "CloneFlow é um aplicativo Next.js local-first para planejamento de clonagem molecular. Ele continua em seu próprio repositório, mas esta página o integra à seção de Projetos do site.",
      whatItDoes: "O que faz",
      whatItDoesBody:
        "O aplicativo foi desenhado em torno de workflows de clonagem guiados por configuração, em vez de uma lógica de interface rigidamente codificada. Isso facilita expandir vetores, conjuntos de regras e tipos de workflow sem reescrever a interface a cada vez.",
      capabilities: [
        "Lógica de clonagem guiada por configuração com arquivos editáveis de workflow e regras de vetores",
        "Histórico local-first de projetos e manipulação de plasmídeos importados no navegador",
        "Suporte ao planejamento de sequências para clonagem, mutagênese e workflows de validação",
        "Pode ser implantado como um app Next.js independente sem ser incorporado a este repositório do site",
      ],
      access: "Acesso",
      accessBody:
        "CloneFlow continua sendo um repositório independente, mas o aplicativo ao vivo também está disponível diretamente. Visitantes podem abrir a versão implantada ou inspecionar o código a partir daqui.",
      openLive: "Abrir app",
      openRepo: "Abrir repositório GitHub",
    },
    stats: {
      backProjects: "Voltar Projetos",
      backScience: "Voltar Ciência",
    },
    statsTool: {
      eyebrow: "Dados + Estatística",
      title: "Estúdio de Análise estilo Prism",
      intro:
        "Cole dados CSV/TSV, calcule testes estatísticos e visualize resultados com vários estilos de gráfico. O modo agrupado usa colunas como grupos (como nas tabelas de colunas do Prism). O modo XY suporta correlação, regressão linear e gráficos de dispersão com ajuste.",
      dataInput: "Entrada de dados",
      grouped: "Agrupado",
      xy: "XY",
      loadSample: "Carregar exemplo",
      firstRowHeader: "Primeira linha é cabeçalho",
      parsed: "Interpretado",
      rows: "linhas",
      columns: "colunas",
      parseFailed: "Não foi possível interpretar esta tabela.",
      xColumn: "Coluna X",
      yColumn: "Coluna Y",
      statsCharts: "Estatística + Gráficos",
      descriptiveStats: "Estatísticas descritivas",
      welch: "Teste t de Welch (bicaudal)",
      oneWayAnova: "ANOVA de uma via",
      needGroups: "São necessários pelo menos 2 grupos para estatística inferencial.",
      nPairs: "N pares",
      meanX: "Média X",
      meanY: "Média Y",
      sdX: "DP X",
      sdY: "DP Y",
      pearsonR: "Pearson r",
      rSquared: "R²",
      linearFit: "Ajuste linear",
      correlationP: "p da correlação",
      notEnoughPoints: "Pontos insuficientes",
      correlationHelp: "O p-valor da correlação de Pearson é calculado a partir da estatística t com gl = n - 2.",
      group: "Grupo",
      n: "n",
      mean: "Média",
      median: "Mediana",
      sd: "DP",
      sem: "EPM",
      ci95: "IC 95%",
      value: "Valor",
      couldNotParseInput: "Não foi possível interpretar sua entrada. Use delimitadores por vírgula, tabulação ou ponto e vírgula.",
      noNumericData: "Nenhum dado numérico encontrado. No modo agrupado, cada coluna é interpretada como um grupo.",
      needTwoRows: "São necessárias pelo menos duas linhas XY válidas para a análise.",
      noDataRowsAfterHeader: "Não há linhas de dados após o cabeçalho.",
      delimiterTab: "tabulação",
      delimiterComma: "vírgula",
      delimiterSemicolon: "ponto e vírgula",
      chartOptionsGrouped: {
        bar: "Barras + EPM",
        box: "Box Plot",
        strip: "Strip Plot",
        meanLine: "Linha da média",
      },
      chartOptionsXY: {
        scatter: "Dispersão + ajuste",
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
