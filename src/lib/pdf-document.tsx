import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
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
const NAVY_MID    = "#2C3E6B";
const NAVY_DARK   = "#0F1A30";
const BLUE_LIGHT  = "#C8D8F0";

import logoAlpha from "../assets/logo-alpha.png";
const LOGO_B64 = logoAlpha;

/* ================================================================
   SILHUETA DE PRÉDIOS SVG — igual ao Décimo Teste
   ================================================================ */
function BuildingsSilhouette() {
  return (
    <Svg width="200" height="220" viewBox="0 0 200 220">
      {/* Prédio 1 — mais baixo, esquerda */}
      <Rect x="8"  y="120" width="36" height="100" fill="#B0BACA" opacity="0.55" rx="1" />
      <Rect x="13" y="128" width="9"  height="11"  fill="#8A95A8" opacity="0.7" />
      <Rect x="26" y="128" width="9"  height="11"  fill="#8A95A8" opacity="0.5" />
      <Rect x="13" y="144" width="9"  height="11"  fill="#8A95A8" opacity="0.6" />
      <Rect x="26" y="144" width="9"  height="11"  fill="#8A95A8" opacity="0.7" />
      <Rect x="13" y="160" width="9"  height="11"  fill="#8A95A8" opacity="0.5" />
      <Rect x="26" y="160" width="9"  height="11"  fill="#8A95A8" opacity="0.6" />
      <Rect x="13" y="176" width="9"  height="11"  fill="#8A95A8" opacity="0.7" />
      <Rect x="26" y="176" width="9"  height="11"  fill="#8A95A8" opacity="0.5" />

      {/* Prédio 2 — mais alto, centro-esquerda */}
      <Rect x="52" y="70"  width="42" height="150" fill="#A8B4C8" opacity="0.6" rx="1" />
      <Rect x="57" y="78"  width="10" height="12"  fill="#7A8799" opacity="0.65" />
      <Rect x="71" y="78"  width="10" height="12"  fill="#7A8799" opacity="0.5"  />
      <Rect x="57" y="95"  width="10" height="12"  fill="#7A8799" opacity="0.7"  />
      <Rect x="71" y="95"  width="10" height="12"  fill="#7A8799" opacity="0.55" />
      <Rect x="57" y="112" width="10" height="12"  fill="#7A8799" opacity="0.5"  />
      <Rect x="71" y="112" width="10" height="12"  fill="#7A8799" opacity="0.65" />
      <Rect x="57" y="129" width="10" height="12"  fill="#7A8799" opacity="0.7"  />
      <Rect x="71" y="129" width="10" height="12"  fill="#7A8799" opacity="0.5"  />
      <Rect x="57" y="146" width="10" height="12"  fill="#7A8799" opacity="0.6"  />
      <Rect x="71" y="146" width="10" height="12"  fill="#7A8799" opacity="0.65" />
      <Rect x="57" y="163" width="10" height="12"  fill="#7A8799" opacity="0.5"  />
      <Rect x="71" y="163" width="10" height="12"  fill="#7A8799" opacity="0.7"  />

      {/* Prédio 3 — alto, centro */}
      <Rect x="102" y="50"  width="40" height="170" fill="#B8C4D4" opacity="0.55" rx="1" />
      <Rect x="107" y="58"  width="10" height="12"  fill="#8C99AD" opacity="0.6"  />
      <Rect x="121" y="58"  width="10" height="12"  fill="#8C99AD" opacity="0.45" />
      <Rect x="107" y="75"  width="10" height="12"  fill="#8C99AD" opacity="0.65" />
      <Rect x="121" y="75"  width="10" height="12"  fill="#8C99AD" opacity="0.5"  />
      <Rect x="107" y="92"  width="10" height="12"  fill="#8C99AD" opacity="0.45" />
      <Rect x="121" y="92"  width="10" height="12"  fill="#8C99AD" opacity="0.65" />
      <Rect x="107" y="109" width="10" height="12"  fill="#8C99AD" opacity="0.6"  />
      <Rect x="121" y="109" width="10" height="12"  fill="#8C99AD" opacity="0.45" />
      <Rect x="107" y="126" width="10" height="12"  fill="#8C99AD" opacity="0.65" />
      <Rect x="121" y="126" width="10" height="12"  fill="#8C99AD" opacity="0.5"  />
      <Rect x="107" y="143" width="10" height="12"  fill="#8C99AD" opacity="0.45" />
      <Rect x="121" y="143" width="10" height="12"  fill="#8C99AD" opacity="0.65" />
      <Rect x="107" y="160" width="10" height="12"  fill="#8C99AD" opacity="0.6"  />
      <Rect x="121" y="160" width="10" height="12"  fill="#8C99AD" opacity="0.45" />

      {/* Prédio 4 — médio, direita */}
      <Rect x="150" y="100" width="38" height="120" fill="#A0AEBF" opacity="0.5" rx="1" />
      <Rect x="155" y="108" width="9"  height="11"  fill="#7C8DA0" opacity="0.6"  />
      <Rect x="168" y="108" width="9"  height="11"  fill="#7C8DA0" opacity="0.45" />
      <Rect x="155" y="124" width="9"  height="11"  fill="#7C8DA0" opacity="0.65" />
      <Rect x="168" y="124" width="9"  height="11"  fill="#7C8DA0" opacity="0.5"  />
      <Rect x="155" y="140" width="9"  height="11"  fill="#7C8DA0" opacity="0.45" />
      <Rect x="168" y="140" width="9"  height="11"  fill="#7C8DA0" opacity="0.6"  />
      <Rect x="155" y="156" width="9"  height="11"  fill="#7C8DA0" opacity="0.65" />
      <Rect x="168" y="156" width="9"  height="11"  fill="#7C8DA0" opacity="0.45" />
      <Rect x="155" y="172" width="9"  height="11"  fill="#7C8DA0" opacity="0.6"  />
      <Rect x="168" y="172" width="9"  height="11"  fill="#7C8DA0" opacity="0.5"  />
    </Svg>
  );
}

/* ================================================================
   HELPERS GLOBAIS
   ================================================================ */
function PageFooter({ current, total }: { current: number; total: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
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
    <View style={{ backgroundColor: NAVY, paddingVertical: 12, paddingHorizontal: 50 }}>
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
  return <View style={{ height: 0.5, backgroundColor: GRAY_200 }} />;
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
      <View
        style={{
          width: 16, height: 16, borderRadius: 8,
          backgroundColor: GREEN_CHECK,
          marginRight: 10, marginTop: 1, flexShrink: 0,
          justifyContent: "center", alignItems: "center",
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
      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 11 }}>
        <View
          style={{
            width: 4, height: 4, borderRadius: 2,
            backgroundColor: GOLD,
            marginRight: 12, marginTop: 5, flexShrink: 0,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10.5, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
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
  icon, titulo, texto,
}: { icon: React.ReactNode; titulo: string; texto: string }) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6, padding: 14, marginBottom: 10,
        borderLeftWidth: 3, borderLeftColor: GOLD,
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

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 22 }}>
      <View
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: GOLD,
          justifyContent: "center", alignItems: "center",
          marginRight: 16, flexShrink: 0,
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
    <Path d="M9 4a3 3 0 1 1 0 6A3 3 0 0 1 9 4zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z" fill={GOLD} />
  </Svg>
);
const IShield = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z" fill={GOLD} />
  </Svg>
);
const IMoney = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z" fill={GOLD} />
  </Svg>
);
const IStar = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={GOLD} />
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
    numero, data, cidade, condominio, contato,
    incluiAdmin, incluiSindico, consideracoesFinais,
  } = props;

  const nomeCondominio  = condominio?.nome      || "Condomínio";
  const numeroUnidades  = Number(condominio?.unidades) || 0;
  const bairro          = condominio?.endereco  || "";
  const nomeContato     = contato?.nome         || "";
  const telefoneContato = contato?.telefone     || "(31) 98809-0800";
  const emailContato    = contato?.email        || "contato@alphafacilities.com.br";

  /* total de páginas */
  let total = 1; // capa
  total += 1;    // quem somos
  total += 1;    // diferenciais
  total += 1;    // serviços
  if (incluiAdmin) total += 4; // 3 planos + comparativo
  if (incluiSindico) total += 1;
  total += 1;    // condições
  total += 1;    // próximos passos
  total += 1;    // contracapa

  const planos    = calcularPlanos(numeroUnidades);
  const essencial = formatPlanoDetalhado(planos.essencial);
  const completo  = formatPlanoDetalhado(planos.completo);
  const premium   = formatPlanoDetalhado(planos.premium);
  const sindico   = incluiSindico ? formatSindico(numeroUnidades) : null;

  const dataHoje = (data instanceof Date ? data : new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  /* numeração das páginas internas */
  let pg = 1;
  const capaPg        = pg++;
  const quemSomosPg   = pg++;
  const diferenciaisPg = pg++;
  const servicosPg    = pg++;
  const essencialPg   = incluiAdmin ? pg++ : 0;
  const completoPg    = incluiAdmin ? pg++ : 0;
  const premiumPg     = incluiAdmin ? pg++ : 0;
  const comparativoPg = incluiAdmin ? pg++ : 0;
  const sindicoPg     = incluiSindico ? pg++ : 0;
  const condicoesPg   = pg++;
  const passosPg      = pg++;
  const contracapaPg  = pg++;

  /* ── PÁGINA 1 — CAPA ──────────────────────────────────────────── */
  const CoverPage = () => (
    <Page size="A4" style={{ flexDirection: "row", backgroundColor: WHITE }}>
      {/* Coluna esquerda — branca */}
      <View style={{ width: "52%", backgroundColor: WHITE, padding: 40, justifyContent: "space-between" }}>
        {/* Logo grande */}
        <View>
          <Image
            src={LOGO_B64}
            style={{ width: 160, height: "auto", marginBottom: 48 }}
          />

          {/* Textos da proposta */}
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 10 }}>
            PROPOSTA COMERCIAL
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 4, lineHeight: 1.2 }}>
            {nomeCondominio}
          </Text>
          <Text style={{ fontSize: 11, color: GRAY_500, marginBottom: 2 }}>
            {numeroUnidades} unidades
          </Text>
          {bairro ? (
            <Text style={{ fontSize: 10, color: GRAY_500, marginBottom: 24 }}>{bairro}</Text>
          ) : null}

          <Text style={{ fontSize: 9, color: GRAY_700, marginBottom: 4 }}>
            Preparado para: <Text style={{ fontWeight: "bold", color: NAVY }}>{nomeContato || nomeCondominio}</Text>
          </Text>

          {/* Box número/data */}
          <View
            style={{
              flexDirection: "row", marginTop: 20,
              borderTopWidth: 1, borderTopColor: GRAY_200,
              paddingTop: 16, gap: 24,
            }}
          >
            <View>
              <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.2, marginBottom: 4 }}>
                N° DA PROPOSTA
              </Text>
              <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY }}>
                PROP-{numero || "2026-001"}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 7.5, color: GRAY_500, letterSpacing: 1.2, marginBottom: 4 }}>
                DATA
              </Text>
              <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY }}>{dataHoje}</Text>
            </View>
          </View>
        </View>

        {/* Rodapé esquerdo — contatos */}
        <View style={{ borderTopWidth: 1, borderTopColor: GRAY_200, paddingTop: 14 }}>
          <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 3 }}>{telefoneContato}</Text>
          <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 3 }}>{emailContato}</Text>
          <Text style={{ fontSize: 8, color: GRAY_500 }}>www.alphafacilities.com.br</Text>
        </View>
      </View>

      {/* Coluna direita — gradiente azul + prédios */}
      <View style={{ width: "48%", position: "relative", overflow: "hidden" }}>
        {/* Fundo gradiente simulado em camadas */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: BLUE_LIGHT }} />
        <View
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "75%",
            backgroundColor: NAVY_MID,
            opacity: 0.85,
          }}
        />
        <View
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "55%",
            backgroundColor: NAVY,
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "35%",
            backgroundColor: NAVY_DARK,
            opacity: 0.95,
          }}
        />

        {/* Silhueta de prédios na base */}
        <View style={{ position: "absolute", bottom: 8, left: 0, right: 0, alignItems: "center" }}>
          <BuildingsSilhouette />
        </View>

        {/* Rodapé pág 1 */}
        <View
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            backgroundColor: NAVY_DARK,
            paddingVertical: 8, paddingHorizontal: 20,
            flexDirection: "row", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 7, color: GOLD, letterSpacing: 1.2, fontWeight: "bold" }}>
            ALPHA CONDOMÍNIOS
          </Text>
          <Text style={{ fontSize: 7, color: WHITE }}>
            Página 1 de {total}
          </Text>
        </View>
      </View>
    </Page>
  );

  /* ── PÁGINA 2 — QUEM SOMOS ────────────────────────────────────── */
  const QuemSomosPage = () => (
    <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
      <PageHeader label="Sobre Nós" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          QUEM SOMOS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Conheça a Alpha Condomínios
        </Text>
        <Divider />
        <Text style={{ fontSize: 10, color: GRAY_500, lineHeight: 1.6, marginBottom: 6 }}>
          e nossa missão de transformar a gestão condominial.
        </Text>

        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 }}>
          A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a
          administração de condomínios, combinando tecnologia, transparência e atendimento
          humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo
          condomínios residenciais, comerciais e mistos.
        </Text>
        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 10 }}>
          Nossa equipe é formada por especialistas em gestão condominial, contabilidade,
          direito imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir
          controle financeiro rigoroso, comunicação eficiente e total conformidade legal.
        </Text>
        <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.65, marginBottom: 24 }}>
          Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que
          se adaptam à realidade de cada empreendimento — do essencial ao premium, sempre
          com a mesma excelência.
        </Text>

        {/* Box Missão */}
        <View
          style={{
            backgroundColor: NAVY,
            borderRadius: 6, padding: 20,
            borderLeftWidth: 4, borderLeftColor: GOLD,
          }}
        >
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
            NOSSA MISSÃO
          </Text>
          <Text style={{ fontSize: 11, color: WHITE, lineHeight: 1.6 }}>
            Entregar gestão condominial de excelência, com transparência, tecnologia e
            compromisso com o bem-estar dos moradores.
          </Text>
        </View>
      </View>
      <PageFooter current={quemSomosPg} total={total} />
    </Page>
  );

  /* ── PÁGINA 3 — DIFERENCIAIS ──────────────────────────────────── */
  const DiferenciaisPage = () => (
    <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
      <PageHeader label="Por Que Nos Escolher" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          NOSSOS DIFERENCIAIS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
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
            texto="Gestão estratégica e negociação qualificada com fornecedores, gerando economia real e sustentável para o condomínio."
          />
          <DiferencialCard
            icon={<IStar />}
            titulo="Excelência Comprovada"
            texto="Mais de 25 anos de experiência em administração condominial, com histórico consistente de resultados."
          />
        </View>
      </View>
      <PageFooter current={diferenciaisPg} total={total} />
    </Page>
  );

  /* ── PÁGINA 4 — SERVIÇOS ─────────────────────────────────────── */
  const ServicosPage = () => (
    <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
      <PageHeader label="Serviços" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          NOSSOS SERVIÇOS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
          Soluções Completas
        </Text>
        <Divider />
        <Text style={{ fontSize: 10, color: GRAY_500, lineHeight: 1.6, marginBottom: 16 }}>
          para a administração do seu condomínio.
        </Text>

        <ServicoRow
          titulo="Administração de Condomínios"
          descricao="Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência."
        />
        <ServicoRow
          titulo="Síndico Profissional"
          descricao="Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico."
        />
        <ServicoRow
          titulo="Certificado Digital"
          descricao="Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade."
        />
        <ServicoRow
          titulo="Seguro Condominial"
          descricao="Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos."
        />
        <ServicoRow
          titulo="AVCB"
          descricao="Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores."
        />
        <ServicoRow
          titulo="Assessoria Jurídica"
          descricao="Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos."
        />
        <ServicoRow
          titulo="Garantidora de Crédito"
          descricao="Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência."
        />
        <ServicoRow
          titulo="Dentre Outros"
          descricao="Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais."
        />
      </View>
      <PageFooter current={servicosPg} total={total} />
    </Page>
  );

  /* ── PLANOS ───────────────────────────────────────────────────── */
  function PlanoPage({
    pageNum,
    badge,
    nome,
    subtitulo,
    idealPara,
    features,
    totalFmt,
    porUnidadeFmt,
    destaque = false,
  }: {
    pageNum: number;
    badge: string;
    nome: string;
    subtitulo: string;
    idealPara: string;
    features: string[];
    totalFmt: string;
    porUnidadeFmt: string;
    destaque?: boolean;
  }) {
    return (
      <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Plano" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          {/* Badge "Mais Escolhido" */}
          {destaque && (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: GOLD,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 5,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                ★  MAIS ESCOLHIDO
              </Text>
            </View>
          )}

          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            {badge}
          </Text>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
            {nome}
          </Text>
          <Divider />
          <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20, lineHeight: 1.5 }}>
            {subtitulo}
          </Text>

          {/* Ideal para */}
          <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
              IDEAL PARA
            </Text>
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>{idealPara}</Text>
          </View>

          {/* Checklist */}
          <View style={{ marginBottom: 8 }}>
            {features.map((f, i) => <FeatureRow key={i} text={f} />)}
          </View>

          {/* Box de preço */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8, padding: 20, marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
              INVESTIMENTO MENSAL
            </Text>
            <Text style={{ fontSize: 32, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
              {totalFmt}
            </Text>
            <Text style={{ fontSize: 10, color: GOLD_LIGHT }}>
              {porUnidadeFmt} por unidade/mês
            </Text>
          </View>
        </View>
        <PageFooter current={pageNum} total={total} />
      </Page>
    );
  }

  /* ── COMPARATIVO ──────────────────────────────────────────────── */
  const ComparativoPage = () => {
    type Row = { label: string; e: boolean; c: boolean; p: boolean };
    type Section = { section: string; rows: Row[] };

    const sections: Section[] = [
      {
        section: "FINANCEIRO",
        rows: [
          { label: "Emissão de boletos",             e: true,  c: true,  p: true  },
          { label: "Cobrança de inadimplentes",       e: true,  c: true,  p: true  },
          { label: "Balancete digital mensal",        e: true,  c: true,  p: true  },
          { label: "Gestão de contas a pagar",        e: false, c: true,  p: true  },
          { label: "Pagamentos online integrados",    e: false, c: true,  p: true  },
          { label: "Planejamento orçamentário anual", e: false, c: true,  p: true  },
        ],
      },
      {
        section: "OPERACIONAL",
        rows: [
          { label: "Portal do condômino",              e: true,  c: true,  p: true  },
          { label: "Suporte via WhatsApp",             e: true,  c: true,  p: true  },
          { label: "Rateio de água e gás",             e: false, c: true,  p: true  },
          { label: "Elaboração de atas e convocações", e: false, c: true,  p: true  },
          { label: "Relatórios gerenciais",            e: false, c: true,  p: true  },
        ],
      },
      {
        section: "PREMIUM",
        rows: [
          { label: "Assessoria jurídica condominial",      e: false, c: false, p: true },
          { label: "Cumprimento de obrigações fiscais",    e: false, c: false, p: true },
          { label: "Gestão de obras e reformas",           e: false, c: false, p: true },
          { label: "Revisão anual da convenção",           e: false, c: false, p: true },
          { label: "Atendimento prioritário SLA 12h",      e: false, c: false, p: true },
          { label: "Relatório trimestral de desempenho",   e: false, c: false, p: true },
        ],
      },
    ];

    const cell = (val: boolean) => (
      <View style={{ width: "20%", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: val ? GREEN_CHECK : GRAY_500,
          }}
        >
          {val ? "+" : "—"}
        </Text>
      </View>
    );

    return (
      <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Comparativo" />
        <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            COMPARATIVO DE PLANOS
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
            Veja o que cada plano oferece
          </Text>
          <Divider />

          {/* Header da tabela */}
          <View
            style={{
              flexDirection: "row", backgroundColor: NAVY,
              borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12,
              marginBottom: 0, marginTop: 10,
            }}
          >
            <Text style={{ width: "40%", fontSize: 8, color: GOLD, fontWeight: "bold", letterSpacing: 1 }}>
              SERVIÇO
            </Text>
            <Text style={{ width: "20%", fontSize: 8, color: WHITE, fontWeight: "bold", textAlign: "center" }}>
              ESSENCIAL
            </Text>
            <Text style={{ width: "20%", fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}>
              COMPLETO
            </Text>
            <Text style={{ width: "20%", fontSize: 8, color: WHITE, fontWeight: "bold", textAlign: "center" }}>
              PREMIUM
            </Text>
          </View>

          {sections.map((sec, si) => (
            <View key={si}>
              {/* Cabeçalho de seção */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: GRAY_50,
                  paddingVertical: 7, paddingHorizontal: 12,
                  borderBottomWidth: 1, borderBottomColor: GRAY_200,
                }}
              >
                <Text style={{ width: "40%", fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
                  {sec.section}
                </Text>
                <View style={{ width: "60%" }} />
              </View>

              {sec.rows.map((row, ri) => (
                <View
                  key={ri}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 7, paddingHorizontal: 12,
                    backgroundColor: ri % 2 === 0 ? WHITE : GRAY_50,
                    borderBottomWidth: 0.5, borderBottomColor: GRAY_200,
                  }}
                >
                  <Text style={{ width: "40%", fontSize: 9, color: GRAY_700 }}>{row.label}</Text>
                  {cell(row.e)}
                  {cell(row.c)}
                  {cell(row.p)}
                </View>
              ))}
            </View>
          ))}

          {/* Linha de investimento */}
          <View
            style={{
              flexDirection: "row", backgroundColor: NAVY,
              borderRadius: 6, paddingVertical: 12, paddingHorizontal: 12,
              marginTop: 4,
            }}
          >
            <Text style={{ width: "40%", fontSize: 9, color: GOLD, fontWeight: "bold" }}>
              Investimento mensal
            </Text>
            <Text style={{ width: "20%", fontSize: 8.5, color: WHITE, textAlign: "center" }}>
              {essencial.totalFmt}
            </Text>
            <Text style={{ width: "20%", fontSize: 8.5, color: GOLD, textAlign: "center", fontWeight: "bold" }}>
              {completo.totalFmt}
            </Text>
            <Text style={{ width: "20%", fontSize: 8.5, color: WHITE, textAlign: "center" }}>
              {premium.totalFmt}
            </Text>
          </View>
        </View>
        <PageFooter current={comparativoPg} total={total} />
      </Page>
    );
  };

  /* ── SÍNDICO ──────────────────────────────────────────────────── */
  const SindicoPage = () => {
    const sindicoFmt = sindico;
    return (
      <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Serviço" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            SERVIÇO
          </Text>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
            Síndico Profissional
          </Text>
          <Divider />
          <Text style={{ fontSize: 10.5, color: GRAY_500, marginBottom: 20, lineHeight: 1.5 }}>
            Gestão presencial com representação legal do condomínio
          </Text>

          <View style={{ backgroundColor: GRAY_50, borderRadius: 6, padding: 14, marginBottom: 20 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
              IDEAL PARA
            </Text>
            <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.55 }}>
              Condomínios que desejam um síndico dedicado, com experiência em gestão
              condominial e representação legal.
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
          ].map((f, i) => <FeatureRow key={i} text={f} />)}

          {/* Box Seguro RC */}
          <View
            style={{
              backgroundColor: NAVY,
              borderRadius: 8, padding: 18, marginTop: 16, marginBottom: 16,
              borderLeftWidth: 4, borderLeftColor: GOLD,
            }}
          >
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
              SEGURO RC DE SÍNDICO INCLUSO
            </Text>
            <Text style={{ fontSize: 10, color: WHITE, lineHeight: 1.6 }}>
              A Alpha Condomínios tem como diferencial no mercado o Seguro de
              Responsabilidade Civil (RC) do Síndico{" "}
              <Text style={{ fontWeight: "bold", color: GOLD }}>INCLUSO</Text>. Protegemos o
              síndico contra riscos inerentes à função, sem custo adicional.
            </Text>
          </View>

          {/* Box investimento */}
          <View style={{ backgroundColor: NAVY, borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>
              INVESTIMENTO MENSAL — SÍNDICO
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
              1 salário-mínimo/mês
            </Text>
            <Text style={{ fontSize: 9, color: GOLD_LIGHT }}>
              Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
            </Text>
          </View>
        </View>
        <PageFooter current={sindicoPg} total={total} />
      </Page>
    );
  };

  /* ── CONDIÇÕES ────────────────────────────────────────────────── */
  const CondicoesPage = () => {
    const items = [
      { titulo: "Vigência",     texto: "Contrato de 12 meses, renovável automaticamente por igual período." },
      { titulo: "Pagamento",    texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
      { titulo: "Reajuste",     texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
      { titulo: "Implantação",  texto: "Prazo de implantação de até 30 dias após assinatura do contrato." },
      { titulo: "Rescisão",     texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias." },
      { titulo: "Validade",     texto: "Esta proposta tem validade de 30 dias a partir da data de emissão." },
    ];

    return (
      <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
        <PageHeader label="Condições" />
        <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
            CONDIÇÕES COMERCIAIS
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
            Transparência em todos os termos
          </Text>
          <Divider />
          <Text style={{ fontSize: 10, color: GRAY_500, lineHeight: 1.6, marginBottom: 24 }}>
            da nossa proposta.
          </Text>

          {/* Grid 2×3 */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {items.map((item, i) => (
              <View
                key={i}
                style={{
                  width: "47%",
                  backgroundColor: GRAY_50,
                  borderRadius: 6, padding: 16,
                  marginBottom: 12,
                  borderTopWidth: 3, borderTopColor: GOLD,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                  {item.titulo}
                </Text>
                <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
                  {item.texto}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <PageFooter current={condicoesPg} total={total} />
      </Page>
    );
  };

  /* ── PRÓXIMOS PASSOS ──────────────────────────────────────────── */
  const PassosPage = () => (
    <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
      <PageHeader label="Como Contratar" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          PRÓXIMOS PASSOS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
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
            borderRadius: 8, padding: 22, marginTop: 16,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: WHITE, marginBottom: 12, textAlign: "center" }}>
            Pronto para transformar a gestão do seu condomínio?
          </Text>
          <Text style={{ fontSize: 10, color: GOLD, textAlign: "center", marginBottom: 4 }}>
            {telefoneContato}
          </Text>
          <Text style={{ fontSize: 10, color: GOLD_LIGHT, textAlign: "center" }}>
            {emailContato}
          </Text>
        </View>
      </View>
      <PageFooter current={passosPg} total={total} />
    </Page>
  );

  /* ── CONTRACAPA ───────────────────────────────────────────────── */
  const ContracapaPage = () => (
    <Page size="A4" style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center" }}>
      <View style={{ alignItems: "center", paddingHorizontal: 60 }}>
        <Image
          src={LOGO_B64}
          style={{ width: 140, height: "auto", marginBottom: 32 }}
        />
        <View style={{ height: 2, width: 40, backgroundColor: GOLD, marginBottom: 28 }} />
        <Text style={{ fontSize: 13, fontWeight: "bold", color: WHITE, letterSpacing: 1.5, marginBottom: 8, textAlign: "center" }}>
          GESTÃO CONDOMINIAL DE EXCELÊNCIA
        </Text>
        <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 4, textAlign: "center" }}>
          {telefoneContato}
        </Text>
        <Text style={{ fontSize: 10, color: GOLD_LIGHT, marginBottom: 4, textAlign: "center" }}>
          {emailContato}
        </Text>
        <Text style={{ fontSize: 10, color: GOLD_LIGHT, textAlign: "center" }}>
          www.alphafacilities.com.br
        </Text>
      </View>
    </Page>
  );

  /* ── CONSIDERAÇÕES FINAIS (opcional) ──────────────────────────── */
  const ConsideracoesPage = () => (
    <Page size="A4" style={{ fontSize: 10, color: TEXT_COLOR, paddingBottom: 40, backgroundColor: WHITE }}>
      <PageHeader label="Considerações Finais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 32 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          CONSIDERAÇÕES FINAIS
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, marginBottom: 16 }}>
          Observações Importantes
        </Text>
        <Divider />
        <Text style={{ fontSize: 10.5, color: GRAY_700, lineHeight: 1.75 }}>
          {consideracoesFinais}
        </Text>
      </View>
      <PageFooter current={pg - 1} total={total} />
    </Page>
  );

  /* ── MONTAGEM FINAL ───────────────────────────────────────────── */
  return (
    <Document>
      <CoverPage />
      <QuemSomosPage />
      <DiferenciaisPage />
      <ServicosPage />

      {incluiAdmin && (
        <>
          <PlanoPage
            pageNum={essencialPg}
            badge="PLANO"
            nome="Essencial"
            subtitulo="Gestão financeira objetiva e eficiente"
            idealPara="Condomínios que buscam organização financeira com custo acessível."
            features={[
              "Emissão de boletos",
              "Cobrança de inadimplentes",
              "Balancete digital mensal",
              "Portal do condômino",
              "Suporte via WhatsApp",
            ]}
            totalFmt={essencial.totalFmt}
            porUnidadeFmt={essencial.porUnidadeFmt}
          />
          <PlanoPage
            pageNum={completoPg}
            badge="PLANO"
            nome="Completo"
            subtitulo="Administração completa com gestão integrada"
            idealPara="Condomínios que precisam de gestão financeira, operacional e de comunicação integradas."
            features={[
              "Tudo do Plano Essencial",
              "Rateio de água e gás",
              "Planejamento orçamentário anual",
              "Gestão de contas a pagar",
              "Elaboração de atas e convocações",
              "Pagamentos online integrados",
              "Relatórios gerenciais",
            ]}
            totalFmt={completo.totalFmt}
            porUnidadeFmt={completo.porUnidadeFmt}
            destaque
          />
          <PlanoPage
            pageNum={premiumPg}
            badge="PLANO"
            nome="Premium"
            subtitulo="Gestão completa com assessoria jurídica e atendimento prioritário"
            idealPara="Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA de atendimento."
            features={[
              "Tudo do Plano Completo",
              "Assessoria jurídica condominial",
              "Cumprimento de obrigações fiscais",
              "Gestão de obras e reformas",
              "Revisão anual da convenção",
              "Atendimento prioritário SLA 12h",
              "Relatório trimestral de desempenho",
            ]}
            totalFmt={premium.totalFmt}
            porUnidadeFmt={premium.porUnidadeFmt}
          />
          <ComparativoPage />
        </>
      )}

      {incluiSindico && <SindicoPage />}

      <CondicoesPage />
      <PassosPage />
      {consideracoesFinais?.trim() && <ConsideracoesPage />}
      <ContracapaPage />
    </Document>
  );
}

function DiferencialCard({
  icon, titulo, texto,
}: { icon: React.ReactNode; titulo: string; texto: string }) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: GRAY_50,
        borderRadius: 6, padding: 14, marginBottom: 10,
        borderLeftWidth: 3, borderLeftColor: GOLD,
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

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 22 }}>
      <View
        style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: GOLD,
          justifyContent: "center", alignItems: "center",
          marginRight: 16, flexShrink: 0,
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
