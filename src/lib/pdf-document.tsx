import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import {
  calcularPlanos,
  formatSindico,
  formatBRL,
} from "./calculations";

/* ================================================================
   CORES
   ================================================================ */
const NAVY        = "#1B2A4A";
const GOLD        = "#C8A961";
const GOLD_LIGHT  = "#E5D4A1";
const WHITE       = "#FFFFFF";
const GRAY_50     = "#F7F8FA";
const GRAY_200    = "#E5E7EB";
const GRAY_500    = "#6B7280";
const GRAY_700    = "#374151";
const TEXT_COLOR  = "#111827";
const GREEN_CHECK = "#16A34A";
const NAVY_LIGHT  = "#243555";

import logoAlpha from "../assets/logo-alpha.png";
const LOGO_B64 = logoAlpha;

/* ================================================================
   HELPERS GLOBAIS
   ================================================================ */
function PageFooter({ current, total }: { current: number; total: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: NAVY,
        paddingVertical: 8,
        paddingHorizontal: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 1.5, fontWeight: "bold" }}>
        ALPHA CONDOMÍNIOS
      </Text>
      <Text style={{ fontSize: 7.5, color: WHITE }}>
        Página {current} de {total}
      </Text>
    </View>
  );
}

function PageHeader({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: NAVY,
        paddingVertical: 12,
        paddingHorizontal: 50,
      }}
    >
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold" }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 16 }} />;
}

function SectionRule() {
  return <View style={{ height: 0.5, backgroundColor: GRAY_200, marginVertical: 0 }} />;
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 7 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: GREEN_CHECK,
          marginRight: 10,
          marginTop: 1,
          flexShrink: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 9, color: WHITE, fontWeight: "bold" }}>✓</Text>
      </View>
      <Text style={{ fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 }}>
        {text}
      </Text>
    </View>
  );
}

function ServicoRow({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 12 }}>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: GOLD,
            marginRight: 12,
            marginTop: 5,
            flexShrink: 0,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}
          >
            {titulo}
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
            {descricao}
          </Text>
        </View>
      </View>
      <SectionRule />
    </View>
  );
}

function DiferencialCard({
  icon,
  titulo,
  texto,
}: {
  icon: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: GOLD,
      }}
    >
      <View style={{ marginBottom: 6 }}>{icon}</View>
      <Text
        style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
      >
        {titulo}
      </Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 }}>{texto}</Text>
    </View>
  );
}

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 22 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: GOLD,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", color: NAVY }}>{n}</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 2 }}>
        <Text
          style={{ fontSize: 11, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
        >
          {titulo}
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
      </View>
    </View>
  );
}

/* ================================================================
   SVG ÍCONES
   ================================================================ */
const IChart = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M3 14h4v7H3zM10 8h4v13h-4zM17 3h4v18h-4z" fill={GOLD} />
  </Svg>
);
const IMonitor = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M2 3h20v14H2V3zm2 2v10h16V5H4zm5 14h6v2H9v-2z" fill={GOLD} />
  </Svg>
);
const IPeople = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M9 4a3 3 0 1 1 0 6A3 3 0 0 1 9 4zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z"
      fill={GOLD}
    />
  </Svg>
);
const IShield = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z"
      fill={GOLD}
    />
  </Svg>
);
const IMoney = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z"
      fill={GOLD}
    />
  </Svg>
);
const IStar = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={GOLD}
    />
  </Svg>
);

/* ================================================================
   TIPOS
   ================================================================ */
interface PropostaPDFData {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}

function formatPlanoDetalhado(p: ReturnType<typeof calcularPlanos>["essencial"]) {
  if (p.tipo === "valor") {
    return {
      totalFmt: formatBRL(p.mensal) + "/mês",
      porUnidadeFmt: formatBRL(p.porUnidade),
    };
  }
  return { totalFmt: p.texto, porUnidadeFmt: "Sob consulta" };
}

/* ================================================================
   DOCUMENTO PRINCIPAL
   ================================================================ */
export function PropostaDocument(props: PropostaPDFData) {
  const {
    numero,
    data,
    cidade,
    condominio,
    contato,
    incluiAdmin,
    incluiSindico,
    consideracoesFinais,
  } = props;

  const nomeCondominio  = condominio?.nome || "Condomínio";
  const numeroUnidades  = Number(condominio?.unidades) || 0;
  const bairro          = condominio?.endereco || "";
  const nomeContato     = contato?.nome || "";
  const numeroContrato  = numero || "";

  /* total de páginas:
     1 capa + 1 quem somos + 1 diferenciais + 1 serviços
     + (admin ? 4 planos+comparativo : 0)
     + (sindico ? 1 : 0)
     + 1 condições + 1 próximos passos + 1 contracapa
     + (considerações ? 1 : 0)                              */
  const total =
    4 +
    (incluiAdmin ? 4 : 0) +
    (incluiSindico ? 1 : 0) +
    2 +
    1 +
    (consideracoesFinais?.trim() ? 1 : 0);

  const planos   = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(numeroUnidades) : null;

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");
  const dataHoje   = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  /* numeração dinâmica */
  let pg = 1;
  const P = {
    capa:       () => pg++,
    quemSomos:  () => pg++,
    diferenciais: () => pg++,
    servicos:   () => pg++,
    essencial:  incluiAdmin ? () => pg++ : null,
    completo:   incluiAdmin ? () => pg++ : null,
    premium:    incluiAdmin ? () => pg++ : null,
    comparativo: incluiAdmin ? () => pg++ : null,
    sindico:    incluiSindico ? () => pg++ : null,
    condicoes:  () => pg++,
    proximos:   () => pg++,
    consideracoes: consideracoesFinais?.trim() ? () => pg++ : null,
    contracapa: () => pg++,
  };

  /* resolve números de uma vez */
  const pCapa         = 1;
  const pQuemSomos    = 2;
  const pDiferenciais = 3;
  const pServicos     = 4;
  let   nextPg        = 5;
  const pEssencial    = incluiAdmin ? nextPg++ : 0;
  const pCompleto     = incluiAdmin ? nextPg++ : 0;
  const pPremium      = incluiAdmin ? nextPg++ : 0;
  const pComparativo  = incluiAdmin ? nextPg++ : 0;
  const pSindico      = incluiSindico ? nextPg++ : 0;
  const pCondicoes    = nextPg++;
  const pProximos     = nextPg++;
  const pConsideracoes = consideracoesFinais?.trim() ? nextPg++ : 0;
  const pContracapa   = nextPg;

  /* ── SERVIÇOS ─────────────────────────────────────────────── */
  const SERVICOS = [
    {
      titulo: "Administração de Condomínios",
      descricao:
        "Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência.",
    },
    {
      titulo: "Síndico Profissional",
      descricao:
        "Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico.",
    },
    {
      titulo: "Certificado Digital",
      descricao:
        "Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade.",
    },
    {
      titulo: "Seguro Condominial",
      descricao:
        "Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos.",
    },
    {
      titulo: "AVCB",
      descricao:
        "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores.",
    },
    {
      titulo: "Assessoria Jurídica",
      descricao:
        "Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos.",
    },
    {
      titulo: "Garantidora de Crédito",
      descricao:
        "Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência.",
    },
    {
      titulo: "Dentre Outros",
      descricao:
        "Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais.",
    },
  ];

  /* ── COMPARATIVO ──────────────────────────────────────────── */
  const COMP_ROWS: { label: string; e: boolean | null; c: boolean | null; p: boolean | null }[] = [
    { label: "FINANCEIRO", e: null, c: null, p: null },
    { label: "Emissão de boletos",              e: true,  c: true,  p: true  },
    { label: "Cobrança de inadimplentes",       e: true,  c: true,  p: true  },
    { label: "Balancete digital mensal",        e: true,  c: true,  p: true  },
    { label: "Gestão de contas a pagar",        e: false, c: true,  p: true  },
    { label: "Pagamentos online integrados",    e: false, c: true,  p: true  },
    { label: "Planejamento orçamentário anual", e: false, c: true,  p: true  },
    { label: "OPERACIONAL", e: null, c: null, p: null },
    { label: "Portal do condômino",             e: true,  c: true,  p: true  },
    { label: "Suporte via WhatsApp",            e: true,  c: true,  p: true  },
    { label: "Rateio de água e gás",            e: false, c: true,  p: true  },
    { label: "Elaboração de atas e convocações",e: false, c: true,  p: true  },
    { label: "Relatórios gerenciais",           e: false, c: true,  p: true  },
    { label: "PREMIUM", e: null, c: null, p: null },
    { label: "Assessoria jurídica condominial", e: false, c: false, p: true  },
    { label: "Cumprimento de obrigações fiscais",e: false,c: false, p: true  },
    { label: "Gestão de obras e reformas",      e: false, c: false, p: true  },
    { label: "Revisão anual da convenção",      e: false, c: false, p: true  },
    { label: "Atendimento prioritário SLA 12h", e: false, c: false, p: true  },
    { label: "Relatório trimestral de desempenho", e: false, c: false, p: true },
  ];

  function CompCell({ val }: { val: boolean | null }) {
    if (val === null) return <View style={{ flex: 1 }} />;
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: val ? GREEN_CHECK : GRAY_500,
          }}
        >
          {val ? "✓" : "—"}
        </Text>
      </View>
    );
  }

  return (
    <Document>

      {/* ══════════════════════════════════════════════════════
          PÁG 1 — CAPA
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ flexDirection: "row", backgroundColor: WHITE }}>

        {/* Coluna esquerda — branca */}
        <View style={{ flex: 55, paddingHorizontal: 44, paddingTop: 44, paddingBottom: 50 }}>
          {/* Logo grande */}
          <Image
            src={LOGO_B64}
            style={{ width: 160, height: 64, objectFit: "contain", marginBottom: 48 }}
          />

          {/* Badge + título */}
          <Text
            style={{
              fontSize: 8,
              color: GOLD,
              letterSpacing: 3,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            PROPOSTA COMERCIAL
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: NAVY,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {nomeCondominio}
          </Text>
          {localidade ? (
            <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 32 }}>
              {localidade}
            </Text>
          ) : null}

          <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 28 }} />

          {/* Metadados */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
              N° DA PROPOSTA
            </Text>
            <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY }}>
              PROP-{numeroContrato}
            </Text>
          </View>
          <View style={{ height: 0.5, backgroundColor: GRAY_200, marginVertical: 10 }} />
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
              DATA
            </Text>
            <Text style={{ fontSize: 10.5, color: NAVY }}>{dataHoje}</Text>
          </View>
          <View style={{ height: 0.5, backgroundColor: GRAY_200, marginVertical: 10 }} />
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
              PREPARADO PARA
            </Text>
            <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY }}>
              {nomeContato || nomeCondominio}
            </Text>
          </View>

          {/* Rodapé esquerdo */}
          <View style={{ position: "absolute", bottom: 36, left: 44 }}>
            <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>
              (31) 99778-7316
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>
              comercial@alphafacilities.com.br
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_500 }}>
              www.alphafacilities.com.br
            </Text>
          </View>
        </View>

        {/* Coluna direita — NAVY gradiente */}
        <View
          style={{
            flex: 45,
            backgroundColor: NAVY,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 32,
          }}
        >
          {/* Detalhe decorativo */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: NAVY_LIGHT,
              opacity: 0.4,
              borderBottomLeftRadius: 120,
            }}
          />
          <Text
            style={{
              fontSize: 7,
              color: GOLD,
              letterSpacing: 3,
              opacity: 0.7,
              marginBottom: 8,
            }}
          >
            ALPHA CONDOMÍNIOS
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: WHITE,
              opacity: 0.5,
              letterSpacing: 1,
            }}
          >
            Gestão Condominial de Excelência
          </Text>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 2 — QUEM SOMOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Sobre Nós" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            QUEM SOMOS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Conheça a Alpha Condomínios
          </Text>
          <Divider />

          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 }}>
            A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a
            administração de condomínios, combinando tecnologia, transparência e atendimento
            humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo condomínios
            residenciais, comerciais e mistos.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 }}>
            Nossa equipe é formada por especialistas em gestão condominial, contabilidade,
            direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir
            controle financeiro rigoroso, comunicação eficiente e total conformidade legal.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 28 }}>
            Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis
            que se adaptam à realidade de cada empreendimento — do essencial ao premium,
            sempre com a mesma excelência.
          </Text>

          {/* Box Missão */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 22,
              borderLeftWidth: 4,
              borderLeftColor: GOLD,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                color: GOLD,
                letterSpacing: 2.5,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              NOSSA MISSÃO
            </Text>
            <Text style={{ fontSize: 11, color: WHITE, lineHeight: 1.6 }}>
              Entregar gestão condominial de excelência, com transparência, tecnologia e
              compromisso com o bem-estar dos moradores.
            </Text>
          </View>
        </View>

        <PageFooter current={pQuemSomos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 3 — NOSSOS DIFERENCIAIS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Por Que Nos Escolher" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            NOSSOS DIFERENCIAIS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Por Que Escolher a Alpha?
          </Text>
          <Divider />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <DiferencialCard
              icon={<IChart />}
              titulo="Transparência Total"
              texto="Balancetes digitais mensais e acesso em tempo real às finanças do condomínio."
            />
            <DiferencialCard
              icon={<IMonitor />}
              titulo="Tecnologia de Ponta"
              texto="Portal do condomínio, boletos digitais e aplicativo para gestão completa."
            />
            <DiferencialCard
              icon={<IPeople />}
              titulo="Atendimento Humanizado"
              texto="Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail."
            />
            <DiferencialCard
              icon={<IShield />}
              titulo="Conformidade Legal"
              texto="Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais."
            />
            <DiferencialCard
              icon={<IMoney />}
              titulo="Redução de Custos"
              texto="Gestão estratégica e negociação qualificada com fornecedores, gerando economia real."
            />
            <DiferencialCard
              icon={<IStar />}
              titulo="Excelência Comprovada"
              texto="Mais de 25 anos de experiência com histórico consistente de resultados."
            />
          </View>
        </View>

        <PageFooter current={pDiferenciais} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 4 — NOSSOS SERVIÇOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Serviços" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            NOSSOS SERVIÇOS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Soluções Completas
          </Text>
          <Divider />

          <View style={{ marginTop: 4 }}>
            {SERVICOS.map((s, i) => (
              <ServicoRow key={i} titulo={s.titulo} descricao={s.descricao} />
            ))}
          </View>
        </View>

        <PageFooter current={pServicos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PLANOS (apenas se incluiAdmin)
          ══════════════════════════════════════════════════════ */}
      {incluiAdmin && (
        <>
          {/* PÁG — PLANO ESSENCIAL */}
          <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Essencial
              </Text>
              <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
                Gestão financeira objetiva e eficiente
              </Text>

              {/* Ideal para */}
              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 20,
                  borderLeftWidth: 3,
                  borderLeftColor: GOLD,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que buscam organização financeira com custo acessível.
                </Text>
              </View>

              <FeatureRow text="Emissão de boletos" />
              <FeatureRow text="Cobrança de inadimplentes" />
              <FeatureRow text="Balancete digital mensal" />
              <FeatureRow text="Portal do condômino" />
              <FeatureRow text="Suporte via WhatsApp" />

              {/* Box preço */}
              <View
                style={{
                  backgroundColor: NAVY,
                  borderRadius: 8,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {essencial.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
                  {essencial.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pEssencial} total={total} />
          </Page>

          {/* PÁG — PLANO COMPLETO */}
          <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              {/* Badge mais escolhido */}
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: GOLD,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 4,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 8, fontWeight: "bold", color: NAVY, letterSpacing: 1 }}>
                  MAIS ESCOLHIDO
                </Text>
              </View>

              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Completo
              </Text>
              <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
                Administração completa com gestão integrada
              </Text>

              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 20,
                  borderLeftWidth: 3,
                  borderLeftColor: GOLD,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que precisam de gestão financeira, operacional e de comunicação integradas.
                </Text>
              </View>

              <FeatureRow text="Tudo do Plano Essencial" />
              <FeatureRow text="Rateio de água e gás" />
              <FeatureRow text="Planejamento orçamentário anual" />
              <FeatureRow text="Gestão de contas a pagar" />
              <FeatureRow text="Elaboração de atas e convocações" />
              <FeatureRow text="Pagamentos online integrados" />
              <FeatureRow text="Relatórios gerenciais" />

              <View
                style={{
                  backgroundColor: NAVY,
                  borderRadius: 8,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {completo.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
                  {completo.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pCompleto} total={total} />
          </Page>

          {/* PÁG — PLANO PREMIUM */}
          <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Premium
              </Text>
              <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
                Gestão completa com assessoria jurídica e atendimento prioritário
              </Text>

              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 6,
                  padding: 14,
                  marginBottom: 20,
                  borderLeftWidth: 3,
                  borderLeftColor: GOLD,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA de atendimento.
                </Text>
              </View>

              <FeatureRow text="Tudo do Plano Completo" />
              <FeatureRow text="Assessoria jurídica condominial" />
              <FeatureRow text="Cumprimento de obrigações fiscais" />
              <FeatureRow text="Gestão de obras e reformas" />
              <FeatureRow text="Revisão anual da convenção" />
              <FeatureRow text="Atendimento prioritário SLA 12h" />
              <FeatureRow text="Relatório trimestral de desempenho" />

              <View
                style={{
                  backgroundColor: NAVY,
                  borderRadius: 8,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {premium.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GOLD_LIGHT }}>
                  {premium.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pPremium} total={total} />
          </Page>

          {/* PÁG — COMPARATIVO */}
          <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
            <PageHeader label="Comparativo" />
            <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
                COMPARATIVO DE PLANOS
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 16 }}>
                Veja o que cada plano oferece
              </Text>

              {/* Cabeçalho da tabela */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: NAVY,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 2,
                }}
              >
                <Text style={{ flex: 3, fontSize: 8, color: WHITE, fontWeight: "bold", letterSpacing: 1 }}>
                  SERVIÇO
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                  ESSENCIAL
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                  COMPLETO
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
                  PREMIUM
                </Text>
              </View>

              {COMP_ROWS.map((row, i) => {
                const isCategory = row.e === null;
                return isCategory ? (
                  <View
                    key={i}
                    style={{
                      backgroundColor: NAVY,
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      marginTop: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: GOLD,
                        fontWeight: "bold",
                        letterSpacing: 2,
                      }}
                    >
                      {row.label.toUpperCase()}
                    </Text>
                  </View>
                ) : (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      backgroundColor: i % 2 === 0 ? WHITE : GRAY_50,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ flex: 3, fontSize: 8.5, color: GRAY_700 }}>{row.label}</Text>
                    <CompCell val={row.e} />
                    <CompCell val={row.c} />
                    <CompCell val={row.p} />
                  </View>
                );
              })}

              {/* Linha de investimento */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: NAVY,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginTop: 6,
                  borderRadius: 4,
                }}
              >
                <Text style={{ flex: 3, fontSize: 8.5, color: WHITE, fontWeight: "bold" }}>
                  Investimento mensal
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>
                  {essencial.totalFmt}
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>
                  {completo.totalFmt}
                </Text>
                <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>
                  {premium.totalFmt}
                </Text>
              </View>
            </View>
            <PageFooter current={pComparativo} total={total} />
          </Page>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG — SÍNDICO PROFISSIONAL
          ══════════════════════════════════════════════════════ */}
      {incluiSindico && (
        <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
          <PageHeader label="Serviço" />
          <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
              SERVIÇO
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
              Síndico Profissional
            </Text>
            <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20 }}>
              Gestão presencial com representação legal do condomínio
            </Text>

            <View
              style={{
                backgroundColor: GRAY_50,
                borderRadius: 6,
                padding: 14,
                marginBottom: 20,
                borderLeftWidth: 3,
                borderLeftColor: GOLD,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                Condomínios que desejam um síndico dedicado, com experiência em gestão condominial e representação legal.
              </Text>
            </View>

            <FeatureRow text="Representação legal do condomínio" />
            <FeatureRow text="Gestão de funcionários e fornecedores" />
            <FeatureRow text="Convocação e condução de assembleias" />
            <FeatureRow text="Cumprimento de obrigações trabalhistas" />
            <FeatureRow text="Fiscalização de contratos e obras" />
            <FeatureRow text="Atendimento aos condôminos" />
            <FeatureRow text="Aplicação do regimento interno" />

            {/* Box seguro RC */}
            <View
              style={{
                backgroundColor: GOLD,
                borderRadius: 8,
                padding: 16,
                marginTop: 20,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 8.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                SEGURO RC DE SÍNDICO INCLUSO
              </Text>
              <Text style={{ fontSize: 9, color: NAVY, lineHeight: 1.55 }}>
                A Alpha Condomínios tem como diferencial no mercado o Seguro de Responsabilidade
                Civil (RC) do Síndico INCLUSO. Protegemos o síndico contra riscos inerentes à
                função, sem custo adicional.
              </Text>
            </View>

            {/* Box preço */}
            <View
              style={{
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
                INVESTIMENTO MENSAL — SÍNDICO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {sindico?.texto ?? "1 salário-mínimo/mês"}
              </Text>
              <Text style={{ fontSize: 9, color: GOLD_LIGHT }}>
                Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
              </Text>
            </View>
          </View>
          <PageFooter current={pSindico} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG — CONDIÇÕES COMERCIAIS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Condições" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            CONDIÇÕES COMERCIAIS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Transparência em todos os termos
          </Text>
          <Divider />

          {/* Grid 2×3 */}
          {[
            [
              { titulo: "Vigência",    texto: "Contrato de 12 meses, renovável automaticamente por igual período." },
              { titulo: "Pagamento",   texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
            ],
            [
              { titulo: "Reajuste",    texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
              { titulo: "Implantação", texto: "Prazo de implantação de até 30 dias após assinatura do contrato." },
            ],
            [
              { titulo: "Rescisão",    texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias." },
              { titulo: "Validade",    texto: "Esta proposta tem validade de 30 dias a partir da data de emissão." },
            ],
          ].map((linha, li) => (
            <View
              key={li}
              style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}
            >
              {linha.map((item, ii) => (
                <View
                  key={ii}
                  style={{
                    width: "48%",
                    backgroundColor: GRAY_50,
                    borderRadius: 6,
                    padding: 16,
                    borderTopWidth: 3,
                    borderTopColor: GOLD,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                    {item.titulo}
                  </Text>
                  <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.55 }}>
                    {item.texto}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <PageFooter current={pCondicoes} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG — PRÓXIMOS PASSOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Como Contratar" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            PRÓXIMOS PASSOS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
            Simples, rápido e sem burocracia
          </Text>
          <Divider />

          <View style={{ marginTop: 8 }}>
            <StepRow
              n={1}
              titulo="Aprovação da Proposta"
              texto="Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização."
            />
            <StepRow
              n={2}
              titulo="Assinatura do Contrato"
              texto="Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro."
            />
            <StepRow
              n={3}
              titulo="Implantação"
              texto="Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado."
            />
            <StepRow
              n={4}
              titulo="Gestão Ativa"
              texto="Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência."
            />
          </View>

          {/* CTA */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 22,
              marginTop: 24,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 11, color: WHITE, fontWeight: "bold", marginBottom: 14 }}>
              Pronto para transformar a gestão do seu condomínio?
            </Text>
            <Text style={{ fontSize: 10, color: GOLD, marginBottom: 4 }}>
              (31) 99778-7316
            </Text>
            <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
              comercial@alphafacilities.com.br
            </Text>
          </View>
        </View>
        <PageFooter current={pProximos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG — CONSIDERAÇÕES FINAIS (opcional)
          ══════════════════════════════════════════════════════ */}
      {consideracoesFinais?.trim() && (
        <Page size="A4" style={{ paddingBottom: 40, backgroundColor: WHITE }}>
          <PageHeader label="Considerações Finais" />
          <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
              CONSIDERAÇÕES FINAIS
            </Text>
            <Divider />
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7 }}>
              {consideracoesFinais}
            </Text>
          </View>
          <PageFooter current={pConsideracoes} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG FINAL — CONTRACAPA
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: NAVY }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 60,
          }}
        >
          <Image
            src={LOGO_B64}
            style={{
              width: 180,
              height: 72,
              objectFit: "contain",
              marginBottom: 36,
            }}
          />
          <View style={{ height: 2, width: 60, backgroundColor: GOLD, marginBottom: 28 }} />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: WHITE,
              letterSpacing: 1,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            GESTÃO CONDOMINIAL DE EXCELÊNCIA
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT, marginBottom: 6, textAlign: "center" }}>
            (31) 99778-7316
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT, marginBottom: 6, textAlign: "center" }}>
            comercial@alphafacilities.com.br
          </Text>
          <Text style={{ fontSize: 9.5, color: GOLD_LIGHT, textAlign: "center" }}>
            www.alphafacilities.com.br
          </Text>
        </View>
      </Page>

    </Document>
  );
}
