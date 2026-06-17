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
const GRAY_100    = "#EFF1F5";
const GRAY_200    = "#E5E7EB";
const GRAY_300    = "#CBD0DA";
const GRAY_500    = "#6B7280";
const GRAY_600    = "#4B5563";
const GRAY_700    = "#374151";
const TEXT_COLOR  = "#111827";
const GREEN_CHECK = "#16A34A";

/* ================================================================
   LOGO
   ================================================================ */
import logoAlpha from "../assets/logo-alpha.png";
const LOGO_B64 = logoAlpha;

/* ================================================================
   ÍCONES SVG
   ================================================================ */
const IconChart = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 14h4v7H3zM10 8h4v13h-4zM17 3h4v18h-4z" fill={GOLD} />
  </Svg>
);
const IconMonitor = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M2 3h20v14H2V3zm2 2v10h16V5H4zm5 14h6v2H9v-2z" fill={GOLD} />
  </Svg>
);
const IconPeople = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9 4a3 3 0 1 1 0 6A3 3 0 0 1 9 4zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z"
      fill={GOLD}
    />
  </Svg>
);
const IconShield = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z"
      fill={GOLD}
    />
  </Svg>
);
const IconMoney = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z"
      fill={GOLD}
    />
  </Svg>
);
const IconStar = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={GOLD}
    />
  </Svg>
);

/* ================================================================
   HELPERS
   ================================================================ */
function FeatureRow({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 7 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: GREEN_CHECK,
          marginRight: 9,
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
    <View style={{ backgroundColor: NAVY, paddingVertical: 10, paddingHorizontal: 50, marginBottom: 0 }}>
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold" }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function SectionDivider() {
  return <View style={{ height: 0.5, backgroundColor: GRAY_200, marginVertical: 14 }} />;
}

function StepCircle({ n }: { n: number }) {
  return (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: GOLD,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        flexShrink: 0,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "bold", color: NAVY }}>{n}</Text>
    </View>
  );
}

/* ================================================================
   ESTILOS GLOBAIS
   ================================================================ */
const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: TEXT_COLOR,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    backgroundColor: WHITE,
  },
  body: {
    paddingHorizontal: 50,
    paddingTop: 36,
    flex: 1,
  },
  badge: {
    fontSize: 7.5,
    color: GOLD,
    letterSpacing: 2.5,
    fontWeight: "bold",
    marginBottom: 6,
  },
  h1: {
    fontSize: 26,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  h2: { fontSize: 14, fontWeight: "bold", color: NAVY, marginBottom: 4 },
  divider: { height: 3, width: 44, backgroundColor: GOLD, marginBottom: 14 },
  paragraph: { fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 8 },
  subtitle: { fontSize: 10.5, color: GRAY_500, marginBottom: 18, lineHeight: 1.5 },
  sectionRule: { height: 0.5, backgroundColor: GRAY_200, marginVertical: 12 },
});

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
  const numeroContrato  = numero || "";

  /* total de páginas */
  let total = 2; // capa + sobre nós
  total += 1;    // serviços
  if (incluiAdmin) total += 4; // 3 planos + comparativo
  if (incluiSindico) total += 1;
  total += 2; // condições + próximos passos
  total += 1; // contracapa
  if (consideracoesFinais?.trim()) total += 1;

  const planos   = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(numeroUnidades) : null;

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");
  const dataHoje   = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  let pg = 0;
  const nextPg = () => ++pg;

  /* ─── Páginas de admin ──────────────────────────────────────── */
  const pgEssencial  = 3;
  const pgCompleto   = 4;
  const pgPremium    = 5;
  const pgComp       = 6;
  const pgSindico    = incluiAdmin ? pgComp + 1 : 3;
  const pgCond       = pgSindico + (incluiSindico ? 1 : 0) + (incluiAdmin ? 0 : 0);
  // recalculate cleanly
  let pageCounter = 1; // capa
  const pgSobreNos = ++pageCounter;
  const pgServicos = ++pageCounter;
  const pgEss = incluiAdmin ? ++pageCounter : 0;
  const pgComp2 = incluiAdmin ? ++pageCounter : 0;
  const pgPrem = incluiAdmin ? ++pageCounter : 0;
  const pgComparativo = incluiAdmin ? ++pageCounter : 0;
  const pgSind = incluiSindico ? ++pageCounter : 0;
  const pgCondicoes = ++pageCounter;
  const pgProximos = ++pageCounter;
  const pgFinal = consideracoesFinais?.trim() ? ++pageCounter : 0;
  const pgContracapa = ++pageCounter;

  /* ── Serviços ─────────────────────────────────────────────── */
  const SERVICOS = [
    {
      titulo: "Administração de Condomínios",
      texto:
        "Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência.",
    },
    {
      titulo: "Síndico Profissional",
      texto:
        "Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico.",
    },
    {
      titulo: "Certificado Digital",
      texto:
        "Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade.",
    },
    {
      titulo: "Seguro Condominial",
      texto:
        "Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos.",
    },
    {
      titulo: "AVCB",
      texto:
        "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores.",
    },
    {
      titulo: "Assessoria Jurídica",
      texto:
        "Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos.",
    },
    {
      titulo: "Garantidora de Crédito",
      texto:
        "Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência.",
    },
    {
      titulo: "Dentre Outros",
      texto:
        "Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais.",
    },
  ];

  /* ── Comparativo ──────────────────────────────────────────── */
  type CompRow = { label: string; ess: boolean | null; comp: boolean | null; prem: boolean | null };
  const COMP_FINANCEIRO: CompRow[] = [
    { label: "Emissão de boletos",             ess: true,  comp: true,  prem: true  },
    { label: "Cobrança de inadimplentes",      ess: true,  comp: true,  prem: true  },
    { label: "Balancete digital mensal",       ess: true,  comp: true,  prem: true  },
    { label: "Gestão de contas a pagar",       ess: false, comp: true,  prem: true  },
    { label: "Pagamentos online integrados",   ess: false, comp: true,  prem: true  },
    { label: "Planejamento orçamentário anual",ess: false, comp: true,  prem: true  },
  ];
  const COMP_OPERACIONAL: CompRow[] = [
    { label: "Portal do condômino",            ess: true,  comp: true,  prem: true  },
    { label: "Suporte via WhatsApp",           ess: true,  comp: true,  prem: true  },
    { label: "Rateio de água e gás",           ess: false, comp: true,  prem: true  },
    { label: "Elaboração de atas e convocações",ess: false, comp: true, prem: true  },
    { label: "Relatórios gerenciais",          ess: false, comp: true,  prem: true  },
  ];
  const COMP_PREMIUM: CompRow[] = [
    { label: "Assessoria jurídica condominial",ess: false, comp: false, prem: true  },
    { label: "Cumprimento de obrigações fiscais",ess: false,comp: false,prem: true  },
    { label: "Gestão de obras e reformas",     ess: false, comp: false, prem: true  },
    { label: "Revisão anual da convenção",     ess: false, comp: false, prem: true  },
    { label: "Atendimento prioritário SLA 12h",ess: false, comp: false, prem: true  },
    { label: "Relatório trimestral de desempenho",ess: false,comp: false,prem: true },
  ];

  const CompCell = ({ val }: { val: boolean | null }) =>
    val ? (
      <Text style={{ fontSize: 10, color: GREEN_CHECK, fontWeight: "bold" }}>✓</Text>
    ) : (
      <Text style={{ fontSize: 10, color: GRAY_300 }}>—</Text>
    );

  const CompRow2 = ({ row, shaded }: { row: CompRow; shaded: boolean }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: shaded ? GRAY_50 : WHITE,
        paddingVertical: 5,
        paddingHorizontal: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: GRAY_200,
      }}
    >
      <Text style={{ flex: 3, fontSize: 8.5, color: GRAY_700 }}>{row.label}</Text>
      <View style={{ flex: 1, alignItems: "center" }}><CompCell val={row.ess} /></View>
      <View style={{ flex: 1, alignItems: "center" }}><CompCell val={row.comp} /></View>
      <View style={{ flex: 1, alignItems: "center" }}><CompCell val={row.prem} /></View>
    </View>
  );

  const CompHeader = ({ label }: { label: string }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: NAVY,
        paddingVertical: 5,
        paddingHorizontal: 50,
      }}
    >
      <Text style={{ flex: 3, fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold" }}>
        {label}
      </Text>
      <Text style={{ flex: 1, fontSize: 7.5, color: WHITE, textAlign: "center" }}>ESSENCIAL</Text>
      <Text style={{ flex: 1, fontSize: 7.5, color: WHITE, textAlign: "center" }}>COMPLETO</Text>
      <Text style={{ flex: 1, fontSize: 7.5, color: WHITE, textAlign: "center" }}>PREMIUM</Text>
    </View>
  );

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <Document>

      {/* ══════════════════════════════════════════════════════════
          PÁGINA 1 — CAPA
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: "row", flex: 1 }}>

          {/* Coluna esquerda — branca */}
          <View style={{ flex: 1.1, paddingHorizontal: 40, paddingTop: 48, paddingBottom: 40, justifyContent: "space-between" }}>
            {/* Logo */}
            <View>
              <Image src={LOGO_B64} style={{ width: 130, height: 55, objectFit: "contain", marginBottom: 60 }} />

              {/* Textos */}
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 14 }}>
                PROPOSTA COMERCIAL
              </Text>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 6, lineHeight: 1.2 }}>
                {nomeCondominio}
              </Text>
              {localidade ? (
                <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 20 }}>{localidade}</Text>
              ) : null}

              <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 20 }} />

              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>Nº DA PROPOSTA</Text>
                <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY }}>PROP-{numeroContrato}</Text>
              </View>
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>DATA</Text>
                <Text style={{ fontSize: 11, color: NAVY }}>{dataHoje}</Text>
              </View>
              {nomeCondominio && (
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 3 }}>PREPARADO PARA</Text>
                  <Text style={{ fontSize: 11, color: NAVY }}>{nomeCondominio}</Text>
                </View>
              )}
            </View>

            {/* Rodapé contato */}
            <View>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 10 }}>
                ENTRE EM CONTATO
              </Text>
              <Text style={{ fontSize: 8.5, color: GRAY_600, marginBottom: 4 }}>☎ (31) 99778-7316</Text>
              <Text style={{ fontSize: 8.5, color: GRAY_600, marginBottom: 4 }}>✉ comercial@alphafacilities.com.br</Text>
              <Text style={{ fontSize: 8.5, color: GRAY_600 }}>⊕ www.alphafacilities.com.br</Text>
            </View>
          </View>

          {/* Coluna direita — gradiente azul com prédios */}
          <View
            style={{
              width: 210,
              backgroundColor: NAVY,
              position: "relative",
              overflow: "hidden",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 30,
            }}
          >
            {/* Gradiente simulado com camadas */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 260,
                backgroundColor: "#D8E4F0",
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 80,
                left: 0,
                right: 0,
                height: 200,
                backgroundColor: "#8AAAC8",
                opacity: 0.7,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 200,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: NAVY,
              }}
            />

            {/* Prédios SVG */}
            <View style={{ position: "absolute", bottom: 30, left: 0, right: 0, alignItems: "center" }}>
              <Svg width={200} height={180} viewBox="0 0 200 180">
                {/* Prédio 1 */}
                <Path d="M20 180 L20 90 L55 90 L55 180 Z" fill="#CCCCCC" opacity="0.35" />
                {/* Prédio 2 */}
                <Path d="M60 180 L60 50 L100 50 L100 180 Z" fill="#BBBBBB" opacity="0.35" />
                {/* Prédio 3 */}
                <Path d="M105 180 L105 70 L140 70 L140 180 Z" fill="#CCCCCC" opacity="0.35" />
                {/* Prédio 4 */}
                <Path d="M145 180 L145 110 L175 110 L175 180 Z" fill="#BBBBBB" opacity="0.30" />
                {/* Janelas prédio 1 */}
                <Path d="M26 100 L34 100 L34 108 L26 108 Z M40 100 L48 100 L48 108 L40 108 Z M26 115 L34 115 L34 123 L26 123 Z M40 115 L48 115 L48 123 L40 123 Z M26 130 L34 130 L34 138 L26 138 Z M40 130 L48 130 L48 138 L40 138 Z" fill="#AAAAAA" opacity="0.4" />
                {/* Janelas prédio 2 */}
                <Path d="M66 60 L74 60 L74 68 L66 68 Z M80 60 L88 60 L88 68 L80 68 Z M93 60 L101 60 L101 68 L93 68 Z M66 76 L74 76 L74 84 L66 84 Z M80 76 L88 76 L88 84 L80 84 Z M93 76 L101 76 L101 84 L93 84 Z M66 92 L74 92 L74 100 L66 100 Z M80 92 L88 92 L88 100 L80 100 Z M93 92 L101 92 L101 100 L93 100 Z" fill="#AAAAAA" opacity="0.4" />
                {/* Janelas prédio 3 */}
                <Path d="M111 80 L119 80 L119 88 L111 88 Z M124 80 L132 80 L132 88 L124 88 Z M111 96 L119 96 L119 104 L111 104 Z M124 96 L132 96 L132 104 L124 104 Z M111 112 L119 112 L119 120 L111 120 Z M124 112 L132 112 L132 120 L124 120 Z" fill="#AAAAAA" opacity="0.4" />
              </Svg>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <PageFooter current={1} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          PÁGINA 2 — SOBRE NÓS
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader label="Sobre Nós" />

        <View style={s.body}>
          {/* Quem somos */}
          <Text style={[s.h2, { marginBottom: 2 }]}>Quem Somos</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>
            Conheça a Alpha Condomínios e nossa missão de transformar a gestão condominial.
          </Text>
          <Text style={s.paragraph}>
            A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a administração de condomínios, combinando tecnologia, transparência e atendimento humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo condomínios residenciais, comerciais e mistos.
          </Text>
          <Text style={s.paragraph}>
            Nossa equipe é formada por especialistas em gestão condominial, contabilidade, direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle financeiro rigoroso, comunicação eficiente e total conformidade legal.
          </Text>
          <Text style={s.paragraph}>
            Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a mesma excelência.
          </Text>

          {/* Box missão */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 18,
              marginTop: 6,
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
              NOSSA MISSÃO
            </Text>
            <Text style={{ fontSize: 10.5, color: WHITE, lineHeight: 1.6 }}>
              Entregar gestão condominial de excelência, com transparência, tecnologia e compromisso com o bem-estar dos moradores.
            </Text>
          </View>

          {/* Por que nos escolher */}
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 4 }}>
            POR QUE NOS ESCOLHER
          </Text>
          <Text style={[s.h2, { marginBottom: 14 }]}>Nossos Diferenciais</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {[
              { icon: <IconChart />, titulo: "Transparência Total", texto: "Balancetes digitais mensais e acesso em tempo real às finanças do condomínio." },
              { icon: <IconMonitor />, titulo: "Tecnologia de Ponta", texto: "Portal do condomínio, boletos digitais e aplicativo para gestão completa." },
              { icon: <IconPeople />, titulo: "Atendimento Humanizado", texto: "Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail." },
              { icon: <IconShield />, titulo: "Conformidade Legal", texto: "Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais." },
              { icon: <IconMoney />, titulo: "Redução de Custos", texto: "Gestão estratégica e negociação qualificada com fornecedores, gerando economia real." },
              { icon: <IconStar />, titulo: "Excelência Comprovada", texto: "Mais de 25 anos de experiência com histórico consistente de resultados." },
            ].map((d, i) => (
              <View
                key={i}
                style={{
                  width: "47%",
                  backgroundColor: GRAY_50,
                  borderRadius: 8,
                  padding: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: GOLD,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                  {d.icon}
                  <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginLeft: 8 }}>
                    {d.titulo}
                  </Text>
                </View>
                <Text style={{ fontSize: 8.5, color: GRAY_600, lineHeight: 1.5 }}>{d.texto}</Text>
              </View>
            ))}
          </View>
        </View>

        <PageFooter current={pgSobreNos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          PÁGINA 3 — SERVIÇOS
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader label="Serviços" />

        <View style={s.body}>
          <Text style={[s.h2, { marginBottom: 2 }]}>Nossos Serviços</Text>
          <View style={s.divider} />
          <Text style={[s.subtitle, { marginBottom: 16 }]}>
            Soluções completas para a administração do seu condomínio.
          </Text>

          {SERVICOS.map((sv, i) => (
            <View key={i}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 10 }}>
                <View style={{ width: 4, height: "100%", backgroundColor: GOLD, borderRadius: 2, marginRight: 14, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
                    {sv.titulo}
                  </Text>
                  <Text style={{ fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 }}>{sv.texto}</Text>
                </View>
              </View>
              {i < SERVICOS.length - 1 && <SectionDivider />}
            </View>
          ))}
        </View>

        <PageFooter current={pgServicos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          PÁGINAS 4–6 — PLANOS (somente se incluiAdmin)
          ══════════════════════════════════════════════════════════ */}
      {incluiAdmin && (
        <>
          {/* ── PLANO ESSENCIAL ─────────────────────────────────── */}
          <Page size="A4" style={s.page}>
            <View style={s.body}>
              <Text style={s.badge}>PLANO</Text>
              <Text style={s.h1}>Essencial</Text>
              <View style={s.divider} />
              <Text style={[s.subtitle, { marginBottom: 20 }]}>
                Gestão financeira objetiva e eficiente
              </Text>

              {/* IDEAL PARA */}
              <View style={{ backgroundColor: GRAY_50, borderRadius: 8, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: GOLD }}>
                <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>IDEAL PARA</Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que buscam organização financeira com custo acessível.
                </Text>
              </View>

              {/* Itens */}
              {[
                "Emissão de boletos",
                "Cobrança de inadimplentes",
                "Balancete digital mensal",
                "Portal do condômino",
                "Suporte via WhatsApp",
              ].map((item, i) => <FeatureRow key={i} text={item} />)}

              {/* Preço */}
              <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 24 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 34, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {essencial.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {essencial.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgEss} total={total} />
          </Page>

          {/* ── PLANO COMPLETO ──────────────────────────────────── */}
          <Page size="A4" style={s.page}>
            <View style={s.body}>
              {/* Badge MAIS ESCOLHIDO */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <Text style={s.badge}>PLANO</Text>
                <View
                  style={{
                    backgroundColor: GOLD,
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    marginLeft: 12,
                  }}
                >
                  <Text style={{ fontSize: 7.5, color: NAVY, fontWeight: "bold", letterSpacing: 1 }}>
                    ★ MAIS ESCOLHIDO
                  </Text>
                </View>
              </View>

              <Text style={s.h1}>Completo</Text>
              <View style={s.divider} />
              <Text style={[s.subtitle, { marginBottom: 20 }]}>
                Administração completa com gestão integrada
              </Text>

              <View style={{ backgroundColor: GRAY_50, borderRadius: 8, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: GOLD }}>
                <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>IDEAL PARA</Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que precisam de gestão financeira, operacional e de comunicação integradas.
                </Text>
              </View>

              {[
                "Tudo do Plano Essencial",
                "Rateio de água e gás",
                "Planejamento orçamentário anual",
                "Gestão de contas a pagar",
                "Elaboração de atas e convocações",
                "Pagamentos online integrados",
                "Relatórios gerenciais",
              ].map((item, i) => <FeatureRow key={i} text={item} />)}

              <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 24 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 34, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {completo.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {completo.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgComp2} total={total} />
          </Page>

          {/* ── PLANO PREMIUM ───────────────────────────────────── */}
          <Page size="A4" style={s.page}>
            <View style={s.body}>
              <Text style={s.badge}>PLANO</Text>
              <Text style={s.h1}>Premium</Text>
              <View style={s.divider} />
              <Text style={[s.subtitle, { marginBottom: 20 }]}>
                Gestão completa com assessoria jurídica e atendimento prioritário
              </Text>

              <View style={{ backgroundColor: GRAY_50, borderRadius: 8, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: GOLD }}>
                <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>IDEAL PARA</Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                  Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA de atendimento.
                </Text>
              </View>

              {[
                "Tudo do Plano Completo",
                "Assessoria jurídica condominial",
                "Cumprimento de obrigações fiscais",
                "Gestão de obras e reformas",
                "Revisão anual da convenção",
                "Atendimento prioritário SLA 12h",
                "Relatório trimestral de desempenho",
              ].map((item, i) => <FeatureRow key={i} text={item} />)}

              <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 24 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 34, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {premium.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {premium.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgPrem} total={total} />
          </Page>

          {/* ── COMPARATIVO ─────────────────────────────────────── */}
          <Page size="A4" style={s.page}>
            <PageHeader label="Comparativo" />
            <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
              <Text style={[s.h2, { marginBottom: 2 }]}>Comparativo de Planos</Text>
              <View style={s.divider} />
              <Text style={[s.subtitle, { marginBottom: 18 }]}>
                Veja lado a lado o que cada plano oferece.
              </Text>
            </View>

            {/* Header colunas */}
            <View style={{ flexDirection: "row", backgroundColor: NAVY, paddingVertical: 8, paddingHorizontal: 50 }}>
              <Text style={{ flex: 3, fontSize: 8, color: WHITE }}>SERVIÇO</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>ESSENCIAL</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>COMPLETO</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GOLD, textAlign: "center", fontWeight: "bold" }}>PREMIUM</Text>
            </View>

            {/* FINANCEIRO */}
            <CompHeader label="FINANCEIRO" />
            {COMP_FINANCEIRO.map((r, i) => <CompRow2 key={i} row={r} shaded={i % 2 === 0} />)}

            {/* OPERACIONAL */}
            <CompHeader label="OPERACIONAL" />
            {COMP_OPERACIONAL.map((r, i) => <CompRow2 key={i} row={r} shaded={i % 2 === 0} />)}

            {/* PREMIUM */}
            <CompHeader label="PREMIUM" />
            {COMP_PREMIUM.map((r, i) => <CompRow2 key={i} row={r} shaded={i % 2 === 0} />)}

            {/* Linha de investimento */}
            <View style={{ flexDirection: "row", backgroundColor: GRAY_100, paddingVertical: 10, paddingHorizontal: 50, borderTopWidth: 1, borderTopColor: GRAY_300, marginTop: 2 }}>
              <Text style={{ flex: 3, fontSize: 8.5, fontWeight: "bold", color: NAVY }}>Investimento mensal</Text>
              <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: NAVY, textAlign: "center" }}>{essencial.totalFmt}</Text>
              <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: NAVY, textAlign: "center" }}>{completo.totalFmt}</Text>
              <Text style={{ flex: 1, fontSize: 8.5, fontWeight: "bold", color: NAVY, textAlign: "center" }}>{premium.totalFmt}</Text>
            </View>

            <PageFooter current={pgComparativo} total={total} />
          </Page>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          SÍNDICO PROFISSIONAL
          ══════════════════════════════════════════════════════════ */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <View style={s.body}>
            <Text style={s.badge}>SERVIÇO</Text>
            <Text style={s.h1}>Síndico Profissional</Text>
            <View style={s.divider} />
            <Text style={[s.subtitle, { marginBottom: 20 }]}>
              Gestão presencial com representação legal do condomínio
            </Text>

            <View style={{ backgroundColor: GRAY_50, borderRadius: 8, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: GOLD }}>
              <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>IDEAL PARA</Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.5 }}>
                Condomínios que desejam um síndico dedicado, com experiência em gestão condominial e representação legal.
              </Text>
            </View>

            {[
              "Representação legal do condomínio",
              "Gestão de funcionários e fornecedores",
              "Convocação e condução de assembleias",
              "Cumprimento de obrigações trabalhistas",
              "Fiscalização de contratos e obras",
              "Atendimento aos condôminos",
              "Aplicação do regimento interno",
            ].map((item, i) => <FeatureRow key={i} text={item} />)}

            {/* Box Seguro RC — diferencial */}
            <View
              style={{
                backgroundColor: GOLD,
                borderRadius: 8,
                padding: 16,
                marginTop: 20,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <View style={{ marginRight: 12, marginTop: 2 }}>
                <IconShield size={28} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, color: NAVY, fontWeight: "bold", marginBottom: 4, letterSpacing: 0.5 }}>
                  SEGURO RC DE SÍNDICO INCLUSO
                </Text>
                <Text style={{ fontSize: 9, color: NAVY, lineHeight: 1.5 }}>
                  A Alpha Condomínios tem como diferencial no mercado o Seguro de Responsabilidade Civil (RC) do Síndico INCLUSO. Protegemos o síndico contra riscos inerentes à função, sem custo adicional.
                </Text>
              </View>
            </View>

            {/* Preço */}
            <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 1.5, fontWeight: "bold", marginBottom: 8 }}>
                INVESTIMENTO MENSAL — SÍNDICO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {sindico?.texto ?? "1 salário-mínimo/mês"}
              </Text>
              <Text style={{ fontSize: 9, color: GRAY_300 }}>
                Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
              </Text>
            </View>
          </View>
          <PageFooter current={pgSind} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          CONDIÇÕES COMERCIAIS
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader label="Condições" />
        <View style={s.body}>
          <Text style={[s.h2, { marginBottom: 2 }]}>Condições Comerciais</Text>
          <View style={s.divider} />
          <Text style={[s.subtitle, { marginBottom: 20 }]}>
            Transparência em todos os termos da nossa proposta.
          </Text>

          {/* Grid 2×3 */}
          {[
            [
              { titulo: "Vigência",     texto: "Contrato de 12 meses, renovável automaticamente por igual período." },
              { titulo: "Pagamento",    texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
            ],
            [
              { titulo: "Reajuste",     texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
              { titulo: "Implantação",  texto: "Prazo de implantação de até 30 dias após assinatura do contrato." },
            ],
            [
              { titulo: "Rescisão",     texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias." },
              { titulo: "Validade",     texto: "Esta proposta tem validade de 30 dias a partir da data de emissão." },
            ],
          ].map((row, ri) => (
            <View key={ri}>
              <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
                {row.map((cell, ci) => (
                  <View
                    key={ci}
                    style={{
                      flex: 1,
                      backgroundColor: GRAY_50,
                      borderRadius: 8,
                      padding: 16,
                      borderTopWidth: 3,
                      borderTopColor: GOLD,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                      {cell.titulo}
                    </Text>
                    <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
                      {cell.texto}
                    </Text>
                  </View>
                ))}
              </View>
              {ri < 2 && <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 14 }} />}
            </View>
          ))}
        </View>
        <PageFooter current={pgCondicoes} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          PRÓXIMOS PASSOS
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <PageHeader label="Próximos Passos" />
        <View style={s.body}>
          <Text style={[s.h2, { marginBottom: 2 }]}>Como Contratar</Text>
          <View style={s.divider} />
          <Text style={[s.subtitle, { marginBottom: 24 }]}>
            Simples, rápido e sem burocracia.
          </Text>

          {[
            { n: 1, titulo: "Aprovação da Proposta",   texto: "Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização." },
            { n: 2, titulo: "Assinatura do Contrato",  texto: "Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro." },
            { n: 3, titulo: "Implantação",             texto: "Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado." },
            { n: 4, titulo: "Gestão Ativa",            texto: "Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência." },
          ].map((step) => (
            <View key={step.n} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 20 }}>
              <StepCircle n={step.n} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                  {step.titulo}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
                  {step.texto}
                </Text>
              </View>
            </View>
          ))}

          {/* CTA */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 10,
              padding: 22,
              marginTop: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "bold", color: WHITE, marginBottom: 10 }}>
              Pronto para transformar a gestão do seu condomínio?
            </Text>
            <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 4 }}>
              ☎ (31) 99778-7316
            </Text>
            <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
              ✉ comercial@alphafacilities.com.br
            </Text>
          </View>
        </View>
        <PageFooter current={pgProximos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════════
          CONSIDERAÇÕES FINAIS (opcional)
          ══════════════════════════════════════════════════════════ */}
      {consideracoesFinais?.trim() && (
        <Page size="A4" style={s.page}>
          <PageHeader label="Considerações Finais" />
          <View style={s.body}>
            <Text style={[s.h2, { marginBottom: 2 }]}>Considerações Finais</Text>
            <View style={s.divider} />
            <Text style={s.paragraph}>{consideracoesFinais}</Text>
          </View>
          <PageFooter current={pgFinal} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════════
          CONTRACAPA
          ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={[s.page, { backgroundColor: NAVY, paddingBottom: 0 }]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 60 }}>
          <Image src={LOGO_B64} style={{ width: 150, height: 65, objectFit: "contain", marginBottom: 32 }} />
          <View style={{ height: 2, width: 60, backgroundColor: GOLD, marginBottom: 28 }} />
          <Text style={{ fontSize: 9, color: GOLD_LIGHT, letterSpacing: 2, marginBottom: 32, textAlign: "center" }}>
            GESTÃO CONDOMINIAL DE EXCELÊNCIA
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_300, marginBottom: 8, textAlign: "center" }}>
            ☎ (31) 99778-7316
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_300, marginBottom: 8, textAlign: "center" }}>
            ✉ comercial@alphafacilities.com.br
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_300, textAlign: "center" }}>
            ⊕ www.alphafacilities.com.br
          </Text>
        </View>
      </Page>

    </Document>
  );
}
