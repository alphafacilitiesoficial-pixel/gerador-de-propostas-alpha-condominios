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
const NAVY       = "#1B2A4A";
const GOLD       = "#C8A961";
const GOLD_LIGHT = "#E5D4A1";
const WHITE      = "#FFFFFF";
const GRAY_50    = "#F7F8FA";
const GRAY_100   = "#EFF1F5";
const GRAY_200   = "#E5E7EB";
const GRAY_300   = "#CBD0DA";
const GRAY_500   = "#6B7280";
const GRAY_600   = "#4B5563";
const GRAY_700   = "#374151";
const TEXT_COLOR = "#111827";

/* ================================================================
   LOGO
   ================================================================ */
const LOGO_B64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 5 }}>
      <View
        style={{
          width: 13,
          height: 13,
          borderRadius: 7,
          backgroundColor: GOLD,
          marginRight: 8,
          marginTop: 2,
          flexShrink: 0,
        }}
      />
      <Text style={{ fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 }}>
        {text}
      </Text>
    </View>
  );
}

function SectionBand({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: NAVY,
        paddingVertical: 4,
        paddingHorizontal: 50,
        marginBottom: 0,
      }}
    >
      <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold" }}>
        {label.toUpperCase()}
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
    justifyContent: "center",
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

  const nomeCondominio = condominio?.nome || "Condomínio";
  const numeroUnidades = Number(condominio?.unidades) || 0;
  const bairro = condominio?.endereco || "";
  const nomeContato = contato?.nome || "";
  const cargoContato = "";
  const numeroContrato = numero || "";
  const dataValidade = "";

  /* total de páginas */
  let total = 1;
  total += 2;
  if (incluiAdmin) total += 4;
  if (incluiSindico) total += 1;
  total += 2;
  if (consideracoesFinais?.trim()) total += 1;

  const planos    = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(planos.sindico) : null;

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");
  const dataHoje   = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const condPg = 3 + (incluiAdmin ? 4 : 0) + (incluiSindico ? 1 : 0) + 1;
  const contPg = condPg + 1;
  const finalPg = contPg + 1;

  /* ── Serviços — pág 3 ─────────────────────────────────── */
  const SERVICOS = [
    {
      titulo: "Administração de Condomínios",
      texto: "Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência.",
    },
    {
      titulo: "Síndico Profissional",
      texto: "Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico.",
    },
    {
      titulo: "Certificado Digital",
      texto: "Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade.",
    },
    {
      titulo: "Seguro Condominial",
      texto: "Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos.",
    },
    {
      titulo: "AVCB",
      texto: "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores.",
    },
    {
      titulo: "Assessoria Jurídica",
      texto: "Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos.",
    },
    {
      titulo: "Garantidora de Crédito",
      texto: "Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência.",
    },
    {
      titulo: "Dentre Outros",
      texto: "Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais.",
    },
  ];

  /* ── Tabela comparativa ──────────────────────────────── */
  type Row = {
    label: string;
    e: boolean | null;
    c: boolean | null;
    p: boolean | null;
    header?: boolean;
  };

  const TABLE: Row[] = [
    { label: "FINANCEIRO", e: null, c: null, p: null, header: true },
    { label: "Emissão de boletos",               e: true,  c: true,  p: true  },
    { label: "Cobrança de inadimplentes",        e: true,  c: true,  p: true  },
    { label: "Balancete digital mensal",         e: true,  c: true,  p: true  },
    { label: "Gestão de contas a pagar",         e: false, c: true,  p: true  },
    { label: "Pagamentos online integrados",     e: false, c: true,  p: true  },
    { label: "Planejamento orçamentário anual",  e: false, c: true,  p: true  },
    { label: "OPERACIONAL", e: null, c: null, p: null, header: true },
    { label: "Portal do condômino",              e: true,  c: true,  p: true  },
    { label: "Suporte via WhatsApp",             e: true,  c: true,  p: true  },
    { label: "Rateio de água e gás",             e: false, c: true,  p: true  },
    { label: "Elaboração de atas e convocações", e: false, c: true,  p: true  },
    { label: "Relatórios gerenciais",            e: false, c: true,  p: true  },
    { label: "PREMIUM", e: null, c: null, p: null, header: true },
    { label: "Assessoria jurídica condominial",  e: false, c: false, p: true  },
    { label: "Cumprimento de obrigações fiscais",e: false, c: false, p: true  },
    { label: "Gestão de obras e reformas",       e: false, c: false, p: true  },
    { label: "Revisão anual da convenção",       e: false, c: false, p: true  },
    { label: "Atendimento prioritário SLA 12h",  e: false, c: false, p: true  },
    { label: "Relatório trimestral de desempenho", e: false, c: false, p: true },
  ];

  const cellVal   = (v: boolean | null) => (v === null ? "" : v ? "✓" : "–");
  const cellColor = (v: boolean | null) => (v === true ? NAVY : GRAY_500);

  return (
    <Document>

      {/* ══════════════════════════════════════════
          PÁG 1 — CAPA
          ══════════════════════════════════════════ */}
      <Page size="A4" style={{ padding: 0, backgroundColor: WHITE }}>
        <View style={{ flexDirection: "row", flex: 1 }}>

          {/* Coluna esquerda */}
          <View
            style={{
              width: "55%",
              paddingTop: 56,
              paddingBottom: 40,
              paddingHorizontal: 40,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Image
                src={LOGO_B64}
                style={{ width: 110, height: 36, marginBottom: 40, objectFit: "contain" }}
              />
              <Text
                style={{
                  fontSize: 8,
                  color: GOLD,
                  letterSpacing: 3,
                  fontWeight: "bold",
                  marginBottom: 12,
                }}
              >
                PROPOSTA COMERCIAL
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: NAVY,
                  marginBottom: 6,
                  lineHeight: 1.2,
                }}
              >
                {nomeCondominio}
              </Text>
              {localidade ? (
                <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 4 }}>
                  {localidade}
                </Text>
              ) : null}
              {nomeContato ? (
                <Text style={{ fontSize: 10, color: GRAY_600, marginBottom: 4 }}>
                  A/C: {nomeContato}
                  {cargoContato ? ` — ${cargoContato}` : ""}
                </Text>
              ) : null}
              <View
                style={{
                  height: 3,
                  width: 48,
                  backgroundColor: GOLD,
                  marginTop: 16,
                  marginBottom: 16,
                }}
              />
              {numeroContrato ? (
                <Text style={{ fontSize: 9, color: GRAY_500, marginBottom: 4 }}>
                  Nº {numeroContrato}
                </Text>
              ) : null}
              <Text style={{ fontSize: 9, color: GRAY_500 }}>{dataHoje}</Text>
            </View>

            <View
              style={{
                borderTopWidth: 0.5,
                borderTopColor: GRAY_200,
                paddingTop: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: GOLD,
                  letterSpacing: 1.5,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                ENTRE EM CONTATO
              </Text>
              <Text style={{ fontSize: 9, color: GRAY_600, marginBottom: 3 }}>
                (31) 99778-7316
              </Text>
              <Text style={{ fontSize: 9, color: GRAY_600, marginBottom: 3 }}>
                comercial@alphafacilities.com.br
              </Text>
              <Text style={{ fontSize: 9, color: GRAY_600 }}>
                www.alphafacilities.com.br
              </Text>
            </View>
          </View>

          {/* Coluna direita — navy */}
          <View
            style={{
              width: "45%",
              backgroundColor: NAVY,
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 30,
            }}
          >
            <Svg width={160} height={200} viewBox="0 0 160 200">
              <Path d="M10 140 h28 v60 h-28z" fill="rgba(255,255,255,0.12)" />
              <Path d="M14 148 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M26 148 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M14 162 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M26 162 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M14 176 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M26 176 h8 v8 h-8z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M46 100 h32 v100 h-32z" fill="rgba(255,255,255,0.15)" />
              <Path d="M50 108 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M64 108 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M50 124 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M64 124 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M50 140 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M64 140 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M50 156 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M64 156 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M50 172 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M64 172 h10 v10 h-10z" fill="rgba(255,255,255,0.2)" />
              <Path d="M86 118 h30 v82 h-30z" fill="rgba(255,255,255,0.13)" />
              <Path d="M90 126 h9 v9 h-9z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M103 126 h9 v9 h-9z" fill="rgba(255,255,255,0.18)" />
              <Path d="M90 141 h9 v9 h-9z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M103 141 h9 v9 h-9z" fill="rgba(255,255,255,0.18)" />
              <Path d="M90 156 h9 v9 h-9z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M103 156 h9 v9 h-9z" fill="rgba(255,255,255,0.18)" />
              <Path d="M90 171 h9 v9 h-9z"  fill="rgba(255,255,255,0.18)" />
              <Path d="M103 171 h9 v9 h-9z" fill="rgba(255,255,255,0.18)" />
              <Path d="M124 150 h26 v50 h-26z" fill="rgba(255,255,255,0.10)" />
              <Path d="M128 158 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
              <Path d="M138 158 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
              <Path d="M128 172 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
              <Path d="M138 172 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
              <Path d="M128 186 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
              <Path d="M138 186 h8 v8 h-8z" fill="rgba(255,255,255,0.16)" />
            </Svg>
            <Text
              style={{ fontSize: 7.5, color: "rgba(255,255,255,0.4)", marginTop: 12 }}
            >
              Página 1 de {total}
            </Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════
          PÁG 2 — SOBRE NÓS
          ══════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <SectionBand label="Sobre Nós" />
        <View style={s.body}>
          <Text style={s.badge}>QUEM SOMOS</Text>
          <Text style={s.h1}>Alpha Condomínios</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>
            Conheça a Alpha Condomínios e nossa missão de transformar a gestão condominial.
          </Text>
          <Text style={s.paragraph}>
            A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a
            administração de condomínios, combinando tecnologia, transparência e atendimento
            humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo
            condomínios residenciais, comerciais e mistos.
          </Text>
          <Text style={s.paragraph}>
            Nossa equipe é formada por especialistas em gestão condominial, contabilidade,
            direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir
            controle financeiro rigoroso, comunicação eficiente e total conformidade legal.
          </Text>
          <Text style={s.paragraph}>
            Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis
            que se adaptam à realidade de cada empreendimento — do essencial ao premium,
            sempre com a mesma excelência.
          </Text>

          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 18,
              marginTop: 10,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 7.5,
                color: GOLD,
                letterSpacing: 2,
                fontWeight: "bold",
                marginBottom: 6,
              }}
            >
              NOSSA MISSÃO
            </Text>
            <Text style={{ fontSize: 10.5, color: WHITE, lineHeight: 1.6 }}>
              Entregar gestão condominial de excelência, com transparência, tecnologia e
              compromisso com o bem-estar dos moradores.
            </Text>
          </View>

          <Text
            style={{
              fontSize: 7.5,
              color: GOLD,
              letterSpacing: 2,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            POR QUE NOS ESCOLHER
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5 }}>
            {[
              { icon: <IconChart />,   title: "Transparência Total",    text: "Balancetes digitais mensais e acesso em tempo real às finanças do condomínio." },
              { icon: <IconMonitor />, title: "Tecnologia de Ponta",    text: "Portal do condomínio, boletos digitais e aplicativo para gestão completa." },
              { icon: <IconPeople />,  title: "Atendimento Humanizado", text: "Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail." },
              { icon: <IconShield />,  title: "Conformidade Legal",     text: "Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais." },
              { icon: <IconMoney />,   title: "Redução de Custos",      text: "Gestão estratégica e negociação qualificada com fornecedores, gerando economia real." },
              { icon: <IconStar />,    title: "Excelência Comprovada",  text: "Mais de 25 anos de experiência em administração condominial." },
            ].map((d, i) => (
              <View key={i} style={{ width: "50%", padding: 5 }}>
                <View
                  style={{
                    backgroundColor: GRAY_50,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: GOLD,
                    padding: 12,
                    minHeight: 90,
                  }}
                >
                  <View style={{ marginBottom: 6 }}>{d.icon}</View>
                  <Text
                    style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
                  >
                    {d.title}
                  </Text>
                  <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 }}>
                    {d.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <PageFooter current={2} total={total} />
      </Page>

      {/* ══════════════════════════════════════════
          PÁG 3 — SERVIÇOS
          ══════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <SectionBand label="Serviços" />
        <View style={s.body}>
          <Text style={s.badge}>NOSSOS SERVIÇOS</Text>
          <Text style={s.h1}>Soluções Completas</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>
            Soluções completas para a administração do seu condomínio.
          </Text>
          {SERVICOS.map((sv, i) => (
            <View key={i}>
              <View style={s.sectionRule} />
              <Text
                style={{ fontSize: 11.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}
              >
                {sv.titulo}
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
                {sv.texto}
              </Text>
            </View>
          ))}
        </View>
        <PageFooter current={3} total={total} />
      </Page>

      {/* ══════════════════════════════════════════
          PLANOS (condicional)
          ══════════════════════════════════════════ */}
      {incluiAdmin && (
        <>
          {/* PÁG 4 — ESSENCIAL */}
          <Page size="A4" style={s.page}>
            <SectionBand label="Plano" />
            <View style={s.body}>
              <Text style={s.badge}>PLANO</Text>
              <Text style={s.h1}>Essencial</Text>
              <View style={s.divider} />
              <Text style={s.subtitle}>Gestão financeira objetiva e eficiente</Text>
              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
                >
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 }}>
                  Condomínios que buscam organização financeira com custo acessível.
                </Text>
              </View>
              <View style={{ marginBottom: 20 }}>
                {[
                  "Emissão de boletos",
                  "Cobrança de inadimplentes",
                  "Balancete digital mensal",
                  "Portal do condômino",
                  "Suporte via WhatsApp",
                ].map((f, i) => (
                  <FeatureRow key={i} text={f} />
                ))}
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: GRAY_200,
                  paddingTop: 16,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    color: GRAY_500,
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  }}
                >
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY }}>
                  {essencial.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_500, marginTop: 4 }}>
                  {essencial.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={4} total={total} />
          </Page>

          {/* PÁG 5 — COMPLETO */}
          <Page size="A4" style={s.page}>
            <SectionBand label="Plano" />
            <View style={s.body}>
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: GOLD,
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 7.5,
                    fontWeight: "bold",
                    color: NAVY,
                    letterSpacing: 1,
                  }}
                >
                  MAIS ESCOLHIDO
                </Text>
              </View>
              <Text style={s.h1}>Completo</Text>
              <View style={s.divider} />
              <Text style={s.subtitle}>Administração completa com gestão integrada</Text>
              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
                >
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 }}>
                  Condomínios que precisam de gestão financeira, operacional e de
                  comunicação integradas.
                </Text>
              </View>
              <View style={{ marginBottom: 20 }}>
                {[
                  "Tudo do Plano Essencial",
                  "Rateio de água e gás",
                  "Planejamento orçamentário anual",
                  "Gestão de contas a pagar",
                  "Elaboração de atas e convocações",
                  "Pagamentos online integrados",
                  "Relatórios gerenciais",
                ].map((f, i) => (
                  <FeatureRow key={i} text={f} />
                ))}
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: GRAY_200,
                  paddingTop: 16,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    color: GRAY_500,
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  }}
                >
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY }}>
                  {completo.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_500, marginTop: 4 }}>
                  {completo.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={5} total={total} />
          </Page>

          {/* PÁG 6 — PREMIUM */}
          <Page size="A4" style={s.page}>
            <SectionBand label="Plano" />
            <View style={s.body}>
              <Text style={s.badge}>PLANO</Text>
              <Text style={s.h1}>Premium</Text>
              <View style={s.divider} />
              <Text style={s.subtitle}>
                Gestão completa com assessoria jurídica e atendimento prioritário
              </Text>
              <View
                style={{
                  backgroundColor: GRAY_50,
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
                >
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 }}>
                  Condomínios que desejam o mais alto nível de gestão, com suporte jurídico
                  e SLA de atendimento.
                </Text>
              </View>
              <View style={{ marginBottom: 20 }}>
                {[
                  "Tudo do Plano Completo",
                  "Assessoria jurídica condominial",
                  "Cumprimento de obrigações fiscais",
                  "Gestão de obras e reformas",
                  "Revisão anual da convenção",
                  "Atendimento prioritário SLA 12h",
                  "Relatório trimestral de desempenho",
                ].map((f, i) => (
                  <FeatureRow key={i} text={f} />
                ))}
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: GRAY_200,
                  paddingTop: 16,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    color: GRAY_500,
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  }}
                >
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY }}>
                  {premium.totalFmt}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_500, marginTop: 4 }}>
                  {premium.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={6} total={total} />
          </Page>

          {/* PÁG 7 — COMPARATIVO */}
          <Page size="A4" style={s.page}>
            <SectionBand label="Comparativo" />
            <View
              style={{
                paddingHorizontal: 50,
                paddingTop: 30,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text style={s.badge}>COMPARATIVO</Text>
              <Text style={s.h1}>Comparativo de Planos</Text>
              <View style={s.divider} />
              <Text style={{ fontSize: 9.5, color: GRAY_500, marginBottom: 16 }}>
                Veja lado a lado o que cada plano oferece.
              </Text>

              {/* Cabeçalho */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: NAVY,
                  paddingVertical: 9,
                  paddingHorizontal: 8,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ flex: 3, fontSize: 8.5, color: WHITE, fontWeight: "bold" }}
                >
                  Serviço
                </Text>
                {["Essencial", "Completo", "Premium"].map((h) => (
                  <Text
                    key={h}
                    style={{
                      flex: 1,
                      fontSize: 8.5,
                      color: WHITE,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {h}
                  </Text>
                ))}
              </View>

              {TABLE.map((row, i) =>
                row.header ? (
                  <View
                    key={i}
                    style={{
                      backgroundColor: GRAY_100,
                      paddingVertical: 5,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontWeight: "bold",
                        color: NAVY,
                        letterSpacing: 1,
                      }}
                    >
                      {row.label}
                    </Text>
                  </View>
                ) : (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 6,
                      paddingHorizontal: 8,
                      borderBottomWidth: 0.5,
                      borderBottomColor: GRAY_200,
                    }}
                  >
                    <Text style={{ flex: 3, fontSize: 8.5, color: TEXT_COLOR }}>
                      {row.label}
                    </Text>
                    {([row.e, row.c, row.p] as (boolean | null)[]).map((v, j) => (
                      <Text
                        key={j}
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: v ? "bold" : "normal",
                          color: cellColor(v),
                          textAlign: "center",
                        }}
                      >
                        {cellVal(v)}
                      </Text>
                    ))}
                  </View>
                )
              )}

              {/* Linha de investimento */}
              <View
                style={{
                  flexDirection: "row",
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  backgroundColor: GRAY_50,
                  borderTopWidth: 1,
                  borderTopColor: NAVY,
                  marginTop: 2,
                }}
              >
                <Text
                  style={{ flex: 3, fontSize: 8.5, fontWeight: "bold", color: NAVY }}
                >
                  Investimento mensal
                </Text>
                {[essencial.totalFmt, completo.totalFmt, premium.totalFmt].map((v, j) => (
                  <Text
                    key={j}
                    style={{
                      flex: 1,
                      fontSize: 8.5,
                      fontWeight: "bold",
                      color: NAVY,
                      textAlign: "center",
                    }}
                  >
                    {v}
                  </Text>
                ))}
              </View>
            </View>
            <PageFooter current={7} total={total} />
          </Page>
        </>
      )}

      {/* ══════════════════════════════════════════
          PÁG — SÍNDICO (condicional)
          ══════════════════════════════════════════ */}
      {incluiSindico && sindico && (
        <Page size="A4" style={s.page}>
          <SectionBand label="Serviço" />
          <View style={s.body}>
            <Text style={s.badge}>SERVIÇO</Text>
            <Text style={s.h1}>Síndico Profissional</Text>
            <View style={s.divider} />
            <Text style={s.subtitle}>
              Gestão presencial com representação legal do condomínio
            </Text>
            <View
              style={{
                backgroundColor: GRAY_50,
                borderRadius: 8,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
              >
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 }}>
                Condomínios que desejam um síndico dedicado, com experiência em gestão
                condominial e representação legal.
              </Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              {[
                "Representação legal do condomínio",
                "Gestão de funcionários e fornecedores",
                "Convocação e condução de assembleias",
                "Cumprimento de obrigações trabalhistas",
                "Fiscalização de contratos e obras",
                "Atendimento aos condôminos",
                "Aplicação do regimento interno",
              ].map((f, i) => (
                <FeatureRow key={i} text={f} />
              ))}
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: GRAY_200,
                paddingTop: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: GRAY_500,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                }}
              >
                INVESTIMENTO MENSAL — SÍNDICO
              </Text>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 4 }}
              >
                {sindico || "Sob consulta"}
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_500, marginBottom: 14 }}>
                Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste
                conforme avaliação técnica.
              </Text>
              <View
                style={{
                  backgroundColor: NAVY,
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <Text style={{ fontSize: 9.5, color: GOLD_LIGHT, lineHeight: 1.6 }}>
                  A Alpha Condomínios tem como diferencial no mercado o{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    Seguro de Responsabilidade Civil (RC) do Síndico INCLUSO
                  </Text>
                  . Protegemos o síndico contra riscos inerentes à função, sem custo
                  adicional.
                </Text>
              </View>
            </View>
          </View>
          <PageFooter
            current={incluiAdmin ? 8 : 4}
            total={total}
          />
        </Page>
      )}

      {/* ══════════════════════════════════════════
          PÁG — CONDIÇÕES COMERCIAIS
          ══════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <SectionBand label="Condições" />
        <View style={s.body}>
          <Text style={s.badge}>CONDIÇÕES</Text>
          <Text style={s.h1}>Condições Comerciais</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>
            Transparência em todos os termos da nossa proposta.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 }}>
            {[
              {
                titulo: "Vigência",
                texto: "Contrato de 12 meses, renovável automaticamente por igual período.",
              },
              {
                titulo: "Pagamento",
                texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10.",
              },
              {
                titulo: "Reajuste",
                texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente.",
              },
              {
                titulo: "Implantação",
                texto: "Prazo de implantação de até 30 dias após assinatura do contrato.",
              },
              {
                titulo: "Rescisão",
                texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias.",
              },
              {
                titulo: "Validade",
                texto: dataValidade
                  ? `Esta proposta tem validade até ${dataValidade}.`
                  : "Esta proposta tem validade de 30 dias a partir da data de emissão.",
              },
            ].map((c, i) => (
              <View key={i} style={{ width: "50%", padding: 6 }}>
                <View
                  style={{
                    backgroundColor: GRAY_50,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: GOLD,
                    padding: 14,
                    minHeight: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: NAVY,
                      marginBottom: 5,
                    }}
                  >
                    {c.titulo}
                  </Text>
                  <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.55 }}>
                    {c.texto}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <PageFooter current={condPg} total={total} />
      </Page>

      {/* ══════════════════════════════════════════
          PÁG — COMO CONTRATAR
          ══════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <SectionBand label="Próximos Passos" />
        <View style={s.body}>
          <Text style={s.badge}>PRÓXIMOS PASSOS</Text>
          <Text style={s.h1}>Como Contratar</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>Simples, rápido e sem burocracia.</Text>
          {[
            {
              n: "1",
              titulo: "Aprovação da Proposta",
              texto: "Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização.",
            },
            {
              n: "2",
              titulo: "Assinatura do Contrato",
              texto: "Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro.",
            },
            {
              n: "3",
              titulo: "Implantação",
              texto: "Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado.",
            },
            {
              n: "4",
              titulo: "Gestão Ativa",
              texto: "Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência.",
            },
          ].map((step, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: NAVY,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "bold", color: WHITE }}>
                  {step.n}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: NAVY,
                    marginBottom: 3,
                  }}
                >
                  {step.titulo}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
                  {step.texto}
                </Text>
              </View>
            </View>
          ))}

          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 10,
              padding: 22,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: WHITE,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Pronto para transformar a gestão do seu condomínio?
            </Text>
            <Text
              style={{
                fontSize: 9.5,
                color: GOLD,
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              (31) 99778-7316{"\n"}
              comercial@alphafacilities.com.br
            </Text>
          </View>
        </View>
        <PageFooter current={contPg} total={total} />
      </Page>

      {/* ══════════════════════════════════════════
          PÁG — CONSIDERAÇÕES FINAIS (condicional)
          ══════════════════════════════════════════ */}
      {consideracoesFinais?.trim() && (
        <Page size="A4" style={s.page}>
          <SectionBand label="Considerações Finais" />
          <View style={s.body}>
            <Text style={s.badge}>OBSERVAÇÕES</Text>
            <Text style={s.h1}>Considerações Finais</Text>
            <View style={s.divider} />
            <Text style={s.paragraph}>{consideracoesFinais}</Text>
          </View>
          <PageFooter current={finalPg} total={total} />
        </Page>
      )}
    </Document>
  );
}
