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
   HELPERS
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
        marginBottom: 0,
      }}
    >
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold" }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 14 }} />;
}

function SectionRule() {
  return <View style={{ height: 0.5, backgroundColor: GRAY_200, marginVertical: 14 }} />;
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
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
        {titulo}
      </Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 }}>{texto}</Text>
    </View>
  );
}

function ServicoRow({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <View style={{ marginBottom: 0 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 13 }}>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: GOLD,
            marginRight: 10,
            marginTop: 5,
            flexShrink: 0,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
            {titulo}
          </Text>
          <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>{descricao}</Text>
        </View>
      </View>
      <View style={{ height: 0.5, backgroundColor: GRAY_200 }} />
    </View>
  );
}

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 20 }}>
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
        <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
          {titulo}
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
      </View>
    </View>
  );
}

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
   SVG ÍCONES INLINE
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
   COMPARATIVO — CÉLULA
   ================================================================ */
function CompCell({
  value,
  isHeader = false,
  highlight = false,
}: {
  value: string;
  isHeader?: boolean;
  highlight?: boolean;
}) {
  const isCheck = value === "✓";
  const isDash = value === "—";
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 7,
        paddingHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isHeader ? NAVY : highlight ? "#F0F4FF" : WHITE,
      }}
    >
      <Text
        style={{
          fontSize: isHeader ? 7.5 : isCheck ? 11 : 10,
          fontWeight: isHeader || isCheck ? "bold" : "normal",
          color: isHeader ? GOLD : isCheck ? GREEN_CHECK : isDash ? GRAY_500 : TEXT_COLOR,
          letterSpacing: isHeader ? 1.5 : 0,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function CompCategoryRow({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: NAVY }}>
      <View style={{ flex: 3, paddingVertical: 5, paddingHorizontal: 8 }}>
        <Text style={{ fontSize: 7.5, fontWeight: "bold", color: GOLD, letterSpacing: 2 }}>
          {label}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1 }} />
    </View>
  );
}

function CompRow({
  label,
  ess,
  comp,
  prem,
  shade = false,
}: {
  label: string;
  ess: string;
  comp: string;
  prem: string;
  shade?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: shade ? GRAY_50 : WHITE,
        borderBottomWidth: 0.5,
        borderBottomColor: GRAY_200,
      }}
    >
      <View style={{ flex: 3, paddingVertical: 7, paddingHorizontal: 8, justifyContent: "center" }}>
        <Text style={{ fontSize: 8.5, color: GRAY_700 }}>{label}</Text>
      </View>
      <CompCell value={ess} />
      <CompCell value={comp} highlight />
      <CompCell value={prem} />
    </View>
  );
}

/* ================================================================
   CONDICOES — CARD
   ================================================================ */
function CondicaoCard({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6,
        padding: 14,
        marginBottom: 12,
        borderTopWidth: 3,
        borderTopColor: GOLD,
      }}
    >
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
        {titulo}
      </Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
    </View>
  );
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

  /* total de páginas */
  let total = 1; // capa
  total += 2;    // quem somos + diferenciais
  total += 1;    // serviços
  if (incluiAdmin) total += 4; // 3 planos + comparativo
  if (incluiSindico) total += 1;
  total += 2;    // condições + próximos passos
  total += 1;    // contracapa
  if (consideracoesFinais?.trim()) total += 1;

  const planos   = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(numeroUnidades) : null;

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");
  const dataHoje = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  /* numeração de páginas */
  let pg = 0;
  const P = () => { pg += 1; return pg; };

  const pgCapa       = 1;
  const pgQuemSomos  = 2;
  const pgDiferencial= 3;
  const pgServicos   = 4;
  let pgCounter      = 4;
  const pgEssencial  = incluiAdmin ? ++pgCounter : 0;
  const pgCompleto   = incluiAdmin ? ++pgCounter : 0;
  const pgPremium    = incluiAdmin ? ++pgCounter : 0;
  const pgComp       = incluiAdmin ? ++pgCounter : 0;
  const pgSindico    = incluiSindico ? ++pgCounter : 0;
  const pgCondicoes  = ++pgCounter;
  const pgPassos     = ++pgCounter;
  const pgFinal      = consideracoesFinais?.trim() ? ++pgCounter : 0;
  const pgContra     = ++pgCounter;

  /* ── SERVIÇOS ─────────────────────────────────────────── */
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

  return (
    <Document>
      {/* ══════════════════════════════════════════════════════
          PÁG 1 — CAPA
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ flexDirection: "row", backgroundColor: WHITE }}>
        {/* Coluna esquerda */}
        <View style={{ width: "55%", paddingHorizontal: 44, paddingVertical: 50, justifyContent: "space-between" }}>
          {/* Logo grande */}
          <Image
            src={LOGO_B64}
            style={{ width: 160, height: 70, objectFit: "contain", marginBottom: 60 }}
          />

          {/* Conteúdo central */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 10 }}>
              PROPOSTA COMERCIAL
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, lineHeight: 1.2, marginBottom: 6 }}>
              {nomeCondominio}
            </Text>
            {localidade ? (
              <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 30 }}>{localidade}</Text>
            ) : null}

            <View style={{ height: 3, width: 44, backgroundColor: GOLD, marginBottom: 28 }} />

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
                Nº DA PROPOSTA
              </Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY }}>
                PROP-{numeroContrato}
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
                DATA
              </Text>
              <Text style={{ fontSize: 10, color: NAVY }}>{dataHoje}</Text>
            </View>

            {nomeContato ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.5, marginBottom: 3 }}>
                  PREPARADO PARA
                </Text>
                <Text style={{ fontSize: 10, color: NAVY }}>{nomeContato}</Text>
              </View>
            ) : null}
          </View>

          {/* Rodapé esquerdo */}
          <View>
            <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 14 }} />
            <Text style={{ fontSize: 8.5, color: GRAY_700, marginBottom: 4 }}>
              (31) 99778-7316
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_700, marginBottom: 4 }}>
              comercial@alphafacilities.com.br
            </Text>
            <Text style={{ fontSize: 8.5, color: GRAY_700 }}>
              www.alphafacilities.com.br
            </Text>
          </View>
        </View>

        {/* Coluna direita — gradiente NAVY com prédios */}
        <View
          style={{
            width: "45%",
            backgroundColor: NAVY,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 40,
          }}
        >
          {/* Prédios estilizados em SVG */}
          <Svg width={200} height={260} viewBox="0 0 200 260">
            {/* Prédio fundo esquerdo */}
            <Path d="M10 260 L10 100 L50 100 L50 260 Z" fill={NAVY_LIGHT} opacity="0.5" />
            <Path d="M15 100 L15 60 L45 60 L45 100 Z" fill={NAVY_LIGHT} opacity="0.4" />
            {/* janelas prédio esquerdo */}
            <Path d="M20 70 L28 70 L28 78 L20 78 Z" fill={WHITE} opacity="0.15" />
            <Path d="M32 70 L40 70 L40 78 L32 78 Z" fill={WHITE} opacity="0.15" />
            <Path d="M20 82 L28 82 L28 90 L20 90 Z" fill={WHITE} opacity="0.15" />
            <Path d="M32 82 L40 82 L40 90 L32 90 Z" fill={WHITE} opacity="0.15" />
            <Path d="M20 108 L28 108 L28 116 L20 116 Z" fill={WHITE} opacity="0.12" />
            <Path d="M32 108 L40 108 L40 116 L32 116 Z" fill={WHITE} opacity="0.12" />

            {/* Prédio central alto */}
            <Path d="M60 260 L60 40 L110 40 L110 260 Z" fill={NAVY_LIGHT} opacity="0.6" />
            <Path d="M65 40 L65 20 L105 20 L105 40 Z" fill={NAVY_LIGHT} opacity="0.5" />
            {/* janelas central */}
            <Path d="M68 50 L80 50 L80 62 L68 62 Z" fill={WHITE} opacity="0.13" />
            <Path d="M84 50 L96 50 L96 62 L84 62 Z" fill={WHITE} opacity="0.13" />
            <Path d="M68 68 L80 68 L80 80 L68 80 Z" fill={WHITE} opacity="0.13" />
            <Path d="M84 68 L96 68 L96 80 L84 80 Z" fill={WHITE} opacity="0.13" />
            <Path d="M68 86 L80 86 L80 98 L68 98 Z" fill={WHITE} opacity="0.13" />
            <Path d="M84 86 L96 86 L96 98 L84 98 Z" fill={WHITE} opacity="0.13" />
            <Path d="M68 104 L80 104 L80 116 L68 116 Z" fill={WHITE} opacity="0.1" />
            <Path d="M84 104 L96 104 L96 116 L84 116 Z" fill={WHITE} opacity="0.1" />
            <Path d="M68 122 L80 122 L80 134 L68 134 Z" fill={WHITE} opacity="0.1" />
            <Path d="M84 122 L96 122 L96 134 L84 134 Z" fill={WHITE} opacity="0.1" />

            {/* Prédio direita */}
            <Path d="M120 260 L120 80 L170 80 L170 260 Z" fill={NAVY_LIGHT} opacity="0.55" />
            <Path d="M125 80 L125 50 L165 50 L165 80 Z" fill={NAVY_LIGHT} opacity="0.45" />
            {/* janelas direita */}
            <Path d="M130 58 L142 58 L142 70 L130 70 Z" fill={WHITE} opacity="0.13" />
            <Path d="M148 58 L160 58 L160 70 L148 70 Z" fill={WHITE} opacity="0.13" />
            <Path d="M130 88 L142 88 L142 100 L130 100 Z" fill={WHITE} opacity="0.12" />
            <Path d="M148 88 L160 88 L160 100 L148 100 Z" fill={WHITE} opacity="0.12" />
            <Path d="M130 106 L142 106 L142 118 L130 118 Z" fill={WHITE} opacity="0.12" />
            <Path d="M148 106 L160 106 L160 118 L148 118 Z" fill={WHITE} opacity="0.12" />
            <Path d="M130 124 L142 124 L142 136 L130 136 Z" fill={WHITE} opacity="0.1" />
            <Path d="M148 124 L160 124 L160 136 L148 136 Z" fill={WHITE} opacity="0.1" />

            {/* Linha do chão */}
            <Path d="M0 260 L200 260" stroke={GOLD} strokeWidth="1" opacity="0.3" />
          </Svg>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 2 — QUEM SOMOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Sobre Nós" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            QUEM SOMOS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Conheça a Alpha Condomínios
          </Text>
          <Divider />

          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
            A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a administração de condomínios, combinando tecnologia, transparência e atendimento humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo condomínios residenciais, comerciais e mistos.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 10 }}>
            Nossa equipe é formada por especialistas em gestão condominial, contabilidade, direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle financeiro rigoroso, comunicação eficiente e total conformidade legal.
          </Text>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7, marginBottom: 28 }}>
            Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a mesma excelência.
          </Text>

          {/* Box missão */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8,
              padding: 22,
              borderLeftWidth: 4,
              borderLeftColor: GOLD,
            }}
          >
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
              NOSSA MISSÃO
            </Text>
            <Text style={{ fontSize: 11, color: WHITE, lineHeight: 1.65, fontWeight: "bold" }}>
              Entregar gestão condominial de excelência, com transparência, tecnologia e compromisso com o bem-estar dos moradores.
            </Text>
          </View>
        </View>

        <PageFooter current={pgQuemSomos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 3 — NOSSOS DIFERENCIAIS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Por Que Nos Escolher" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            NOSSOS DIFERENCIAIS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Por Que Escolher a Alpha?
          </Text>
          <Divider />

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 8 }}>
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

        <PageFooter current={pgDiferencial} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG 4 — SERVIÇOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Serviços" />

        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            NOSSOS SERVIÇOS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Soluções Completas
          </Text>
          <Divider />

          <View style={{ marginTop: 4 }}>
            {SERVICOS.map((s, i) => (
              <ServicoRow key={i} titulo={s.titulo} descricao={s.descricao} />
            ))}
          </View>
        </View>

        <PageFooter current={pgServicos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PLANOS (condicional)
          ══════════════════════════════════════════════════════ */}
      {incluiAdmin && (
        <>
          {/* PÁG — PLANO ESSENCIAL */}
          <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Essencial
              </Text>
              <Text style={{ fontSize: 11, color: GRAY_500, marginBottom: 20 }}>
                Gestão financeira objetiva e eficiente
              </Text>
              <Divider />

              {/* Ideal para */}
              <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 22 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
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
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {essencial.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {essencial.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgEssencial} total={total} />
          </Page>

          {/* PÁG — PLANO COMPLETO */}
          <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              {/* Badge mais escolhido */}
              <View
                style={{
                  backgroundColor: GOLD,
                  borderRadius: 20,
                  paddingVertical: 4,
                  paddingHorizontal: 14,
                  alignSelf: "flex-start",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                  ★  MAIS ESCOLHIDO
                </Text>
              </View>

              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Completo
              </Text>
              <Text style={{ fontSize: 11, color: GRAY_500, marginBottom: 20 }}>
                Administração completa com gestão integrada
              </Text>
              <Divider />

              <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 22 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
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

              <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 24 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {completo.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {completo.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgCompleto} total={total} />
          </Page>

          {/* PÁG — PLANO PREMIUM */}
          <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
            <PageHeader label="Plano" />
            <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 6 }}>
                PLANO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
                Premium
              </Text>
              <Text style={{ fontSize: 11, color: GRAY_500, marginBottom: 20 }}>
                Gestão completa com assessoria jurídica e atendimento prioritário
              </Text>
              <Divider />

              <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 22 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                  IDEAL PARA
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
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

              <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20, marginTop: 24 }}>
                <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
                  INVESTIMENTO MENSAL
                </Text>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                  {premium.totalFmt}
                </Text>
                <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
                  {premium.porUnidadeFmt} por unidade/mês
                </Text>
              </View>
            </View>
            <PageFooter current={pgPremium} total={total} />
          </Page>

          {/* PÁG — COMPARATIVO */}
          <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
            <PageHeader label="Comparativo" />
            <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
              <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
                COMPARATIVO DE PLANOS
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>
                Veja o que cada plano oferece
              </Text>

              {/* Header da tabela */}
              <View style={{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 4 }}>
                <View style={{ flex: 3, paddingVertical: 8, paddingHorizontal: 8 }}>
                  <Text style={{ fontSize: 7.5, color: GOLD, fontWeight: "bold", letterSpacing: 1.5 }}>SERVIÇO</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 8, alignItems: "center" }}>
                  <Text style={{ fontSize: 7.5, color: WHITE, fontWeight: "bold" }}>ESSENCIAL</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: "#243555" }}>
                  <Text style={{ fontSize: 7.5, color: GOLD, fontWeight: "bold" }}>COMPLETO</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 8, alignItems: "center" }}>
                  <Text style={{ fontSize: 7.5, color: WHITE, fontWeight: "bold" }}>PREMIUM</Text>
                </View>
              </View>

              {/* Categoria FINANCEIRO */}
              <CompCategoryRow label="FINANCEIRO" />
              <CompRow label="Emissão de boletos"             ess="✓" comp="✓" prem="✓" shade />
              <CompRow label="Cobrança de inadimplentes"      ess="✓" comp="✓" prem="✓" />
              <CompRow label="Balancete digital mensal"       ess="✓" comp="✓" prem="✓" shade />
              <CompRow label="Gestão de contas a pagar"       ess="—" comp="✓" prem="✓" />
              <CompRow label="Pagamentos online integrados"   ess="—" comp="✓" prem="✓" shade />
              <CompRow label="Planejamento orçamentário anual" ess="—" comp="✓" prem="✓" />

              {/* Categoria OPERACIONAL */}
              <CompCategoryRow label="OPERACIONAL" />
              <CompRow label="Portal do condômino"            ess="✓" comp="✓" prem="✓" shade />
              <CompRow label="Suporte via WhatsApp"           ess="✓" comp="✓" prem="✓" />
              <CompRow label="Rateio de água e gás"           ess="—" comp="✓" prem="✓" shade />
              <CompRow label="Elaboração de atas e convocações" ess="—" comp="✓" prem="✓" />
              <CompRow label="Relatórios gerenciais"          ess="—" comp="✓" prem="✓" shade />

              {/* Categoria PREMIUM */}
              <CompCategoryRow label="PREMIUM" />
              <CompRow label="Assessoria jurídica condominial"    ess="—" comp="—" prem="✓" />
              <CompRow label="Cumprimento de obrigações fiscais"  ess="—" comp="—" prem="✓" shade />
              <CompRow label="Gestão de obras e reformas"         ess="—" comp="—" prem="✓" />
              <CompRow label="Revisão anual da convenção"         ess="—" comp="—" prem="✓" shade />
              <CompRow label="Atendimento prioritário SLA 12h"    ess="—" comp="—" prem="✓" />
              <CompRow label="Relatório trimestral de desempenho" ess="—" comp="—" prem="✓" shade />

              {/* Linha investimento */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: NAVY,
                  borderRadius: 4,
                  marginTop: 4,
                }}
              >
                <View style={{ flex: 3, paddingVertical: 10, paddingHorizontal: 8 }}>
                  <Text style={{ fontSize: 8.5, color: WHITE, fontWeight: "bold" }}>
                    Investimento mensal
                  </Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 10, alignItems: "center" }}>
                  <Text style={{ fontSize: 8, color: GOLD_LIGHT, fontWeight: "bold" }}>
                    {essencial.totalFmt}
                  </Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#243555" }}>
                  <Text style={{ fontSize: 8, color: GOLD, fontWeight: "bold" }}>
                    {completo.totalFmt}
                  </Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 10, alignItems: "center" }}>
                  <Text style={{ fontSize: 8, color: GOLD_LIGHT, fontWeight: "bold" }}>
                    {premium.totalFmt}
                  </Text>
                </View>
              </View>
            </View>
            <PageFooter current={pgComp} total={total} />
          </Page>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG — SÍNDICO PROFISSIONAL (condicional)
          ══════════════════════════════════════════════════════ */}
      {incluiSindico && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Serviço" />
          <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 3, fontWeight: "bold", marginBottom: 6 }}>
              SERVIÇO
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
              Síndico Profissional
            </Text>
            <Text style={{ fontSize: 11, color: GRAY_500, marginBottom: 20 }}>
              Gestão presencial com representação legal do condomínio
            </Text>
            <Divider />

            <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 22 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                IDEAL PARA
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
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
                backgroundColor: GRAY_50,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: GOLD,
                padding: 16,
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
                SEGURO RC DE SÍNDICO INCLUSO
              </Text>
              <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.6 }}>
                A Alpha Condomínios tem como diferencial no mercado o Seguro de Responsabilidade Civil (RC) do Síndico INCLUSO. Protegemos o síndico contra riscos inerentes à função, sem custo adicional.
              </Text>
            </View>

            {/* Box preço */}
            <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20 }}>
              <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 8 }}>
                INVESTIMENTO MENSAL — SÍNDICO
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
                {sindico?.texto || "1 salário-mínimo/mês"}
              </Text>
              <Text style={{ fontSize: 9, color: GOLD_LIGHT }}>
                Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
              </Text>
            </View>
          </View>
          <PageFooter current={pgSindico} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG — CONDIÇÕES COMERCIAIS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Condições" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            CONDIÇÕES COMERCIAIS
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Transparência em todos os termos
          </Text>
          <Divider />

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <CondicaoCard
              titulo="Vigência"
              texto="Contrato de 12 meses, renovável automaticamente por igual período."
            />
            <CondicaoCard
              titulo="Pagamento"
              texto="Faturamento mensal via boleto bancário, com vencimento todo dia 10."
            />
            <CondicaoCard
              titulo="Reajuste"
              texto="Reajuste anual pelo IGPM/FGV ou índice equivalente."
            />
            <CondicaoCard
              titulo="Implantação"
              texto="Prazo de implantação de até 30 dias após assinatura do contrato."
            />
            <CondicaoCard
              titulo="Rescisão"
              texto="Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias."
            />
            <CondicaoCard
              titulo="Validade"
              texto="Esta proposta tem validade de 30 dias a partir da data de emissão."
            />
          </View>
        </View>
        <PageFooter current={pgCondicoes} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG — PRÓXIMOS PASSOS
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
        <PageHeader label="Próximos Passos" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
            COMO CONTRATAR
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Simples, rápido e sem burocracia
          </Text>
          <Divider />

          <View style={{ marginTop: 16 }}>
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
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: WHITE, marginBottom: 12 }}>
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
        <PageFooter current={pgPassos} total={total} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          PÁG — CONSIDERAÇÕES FINAIS (condicional)
          ══════════════════════════════════════════════════════ */}
      {consideracoesFinais?.trim() && (
        <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
          <PageHeader label="Considerações Finais" />
          <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
            <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>
              OBSERVAÇÕES
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
              Considerações Finais
            </Text>
            <Divider />
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.75 }}>
              {consideracoesFinais}
            </Text>
          </View>
          <PageFooter current={pgFinal} total={total} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          PÁG — CONTRACAPA
          ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={{ backgroundColor: NAVY, paddingBottom: 0 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 60 }}>
          <Image
            src={LOGO_B64}
            style={{ width: 180, height: 80, objectFit: "contain", marginBottom: 32 }}
          />

          <View style={{ height: 2, width: 60, backgroundColor: GOLD, marginBottom: 28 }} />

          <Text
            style={{
              fontSize: 9,
              color: GOLD,
              letterSpacing: 4,
              fontWeight: "bold",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            GESTÃO CONDOMINIAL DE EXCELÊNCIA
          </Text>

          <Text style={{ fontSize: 10, color: WHITE, marginBottom: 8, textAlign: "center" }}>
            (31) 99778-7316
          </Text>
          <Text style={{ fontSize: 10, color: WHITE, marginBottom: 8, textAlign: "center" }}>
            comercial@alphafacilities.com.br
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, textAlign: "center" }}>
            www.alphafacilities.com.br
          </Text>
        </View>
      </Page>
    </Document>
  );
}
