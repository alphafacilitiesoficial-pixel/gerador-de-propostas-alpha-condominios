// src/lib/pdf-document.tsx

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Svg,
  Rect,
  Path,
} from "@react-pdf/renderer";
import { format } from "date-fns";         // ✅ CORRIGIDO: import adicionado
import { ptBR } from "date-fns/locale";    // ✅ CORRIGIDO: import adicionado
import { calcularPlanos, formatSindico, formatBRL } from "./calculations";
import logoAlpha from "../assets/logo-alpha.png";

/* ================================================================
   CORES
   ================================================================ */
const NAVY        = "#1B2A4A";
const GOLD        = "#C8A961";
const WHITE       = "#FFFFFF";
const GRAY_50     = "#F7F8FA";
const GRAY_200    = "#E5E7EB";
const GRAY_500    = "#6B7280";
const GRAY_700    = "#374151";
const GREEN_CHECK = "#16A34A";
const NAVY_DARK   = "#0F1A30";

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

/* ================================================================
   COMPONENTES AUXILIARES
   ================================================================ */
function GoldDivider() {
  return (
    <View
      style={{
        width: 40,
        height: 3,
        backgroundColor: GOLD,
        marginBottom: 16,
        borderRadius: 2,
      }}
    />
  );
}

function PageHeader({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: NAVY,
        paddingHorizontal: 50,
        paddingVertical: 20,
      }}
    >
      <Image
        src={logoAlpha}
        style={{ width: 90, height: 45, objectFit: "contain", marginBottom: 6 }}
      />
      <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5 }}>
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
        backgroundColor: NAVY_DARK,
        paddingHorizontal: 50,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 7.5, color: GOLD, letterSpacing: 1.5 }}>
        ALPHA CONDOMÍNIOS
      </Text>
      <Text style={{ fontSize: 7.5, color: WHITE }}>
        Página {current} de {total}
      </Text>
    </View>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 7,
      }}
    >
      <Text style={{ fontSize: 9, color: GREEN_CHECK, marginRight: 6, marginTop: 1 }}>
        ✓
      </Text>
      <Text style={{ fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 }}>
        {text}
      </Text>
    </View>
  );
}

function ServicoRow({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: GRAY_200,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: GOLD,
          marginTop: 3,
          marginRight: 10,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 2 }}>
          {titulo}
        </Text>
        <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>
          {descricao}
        </Text>
      </View>
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
        borderTopWidth: 3,
        borderTopColor: GOLD,
      }}
    >
      <View style={{ marginBottom: 6 }}>{icon}</View>
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>
        {titulo}
      </Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
    </View>
  );
}

function StepRow({
  n,
  titulo,
  texto,
}: {
  n: number;
  titulo: string;
  texto: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 18,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: GOLD,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
          marginTop: 2,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY }}>
          {n}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>
          {titulo}
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 }}>
          {texto}
        </Text>
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
   SILHUETA DE PRÉDIOS
   ================================================================ */
function BuildingsSilhouette() {
  return (
    <Svg width="260" height="220" viewBox="0 0 260 220">
      {/* Prédio central */}
      <Rect x="80"  y="30"  width="70" height="190" fill="#D6CFC4" opacity="0.55" />
      <Rect x="92"  y="45"  width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="45"  width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      <Rect x="92"  y="68"  width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="68"  width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      <Rect x="92"  y="91"  width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="91"  width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      <Rect x="92"  y="114" width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="114" width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      <Rect x="92"  y="137" width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="137" width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      <Rect x="92"  y="160" width="14" height="14"  fill="#B8B0A4" opacity="0.50" />
      <Rect x="112" y="160" width="14" height="14"  fill="#B8B0A4" opacity="0.45" />
      {/* Prédio direito médio */}
      <Rect x="162" y="70"  width="60" height="150" fill="#B8C4D4" opacity="0.45" />
      <Rect x="172" y="84"  width="12" height="12"  fill="#9AAABB" opacity="0.50" />
      <Rect x="190" y="84"  width="12" height="12"  fill="#9AAABB" opacity="0.45" />
      <Rect x="172" y="103" width="12" height="12"  fill="#9AAABB" opacity="0.50" />
      <Rect x="190" y="103" width="12" height="12"  fill="#9AAABB" opacity="0.45" />
      <Rect x="172" y="122" width="12" height="12"  fill="#9AAABB" opacity="0.50" />
      <Rect x="190" y="122" width="12" height="12"  fill="#9AAABB" opacity="0.45" />
      <Rect x="172" y="141" width="12" height="12"  fill="#9AAABB" opacity="0.50" />
      <Rect x="190" y="141" width="12" height="12"  fill="#9AAABB" opacity="0.45" />
      <Rect x="172" y="160" width="12" height="12"  fill="#9AAABB" opacity="0.50" />
      <Rect x="190" y="160" width="12" height="12"  fill="#9AAABB" opacity="0.45" />
      {/* Prédio extremo direito */}
      <Rect x="228" y="105" width="32" height="115" fill="#A8B8C8" opacity="0.38" />
      <Rect x="234" y="116" width="8"  height="9"   fill="#8898AA" opacity="0.45" />
      <Rect x="246" y="116" width="8"  height="9"   fill="#8898AA" opacity="0.40" />
      <Rect x="234" y="131" width="8"  height="9"   fill="#8898AA" opacity="0.45" />
      <Rect x="246" y="131" width="8"  height="9"   fill="#8898AA" opacity="0.40" />
      <Rect x="234" y="146" width="8"  height="9"   fill="#8898AA" opacity="0.45" />
      <Rect x="246" y="146" width="8"  height="9"   fill="#8898AA" opacity="0.40" />
      <Rect x="234" y="161" width="8"  height="9"   fill="#8898AA" opacity="0.45" />
      <Rect x="246" y="161" width="8"  height="9"   fill="#8898AA" opacity="0.40" />
    </Svg>
  );
}

/* ================================================================
   PÁGINA 1 — CAPA
   ================================================================ */
function PageCapa({
  numeroContrato,
  dataHoje,
  nomeCondominio,
  enderecoCondominio,
  numeroUnidades,
  nomeContato,
  pg,
  total,
}: {
  numeroContrato: string;
  dataHoje: string;
  nomeCondominio: string;
  enderecoCondominio: string;
  numeroUnidades: number;
  nomeContato: string;
  pg: number;
  total: number;
}) {
  return (
    <Page
      size="A4"
      style={{
        flexDirection: "row",
        backgroundColor: WHITE,
      }}
    >
      {/* ══════════════════════════════════════
          COLUNA ESQUERDA — BRANCA
          ══════════════════════════════════════ */}
      <View
        style={{
          width: "55%",
          backgroundColor: WHITE,
          paddingTop: 0,
          paddingBottom: 48,
          paddingHorizontal: 44,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* ── LOGO em destaque ── */}
        <Image
          src={logoAlpha}
          style={{
            width: 220,        // ✅ AJUSTE 1: logo maior
            height: 110,
            objectFit: "contain",
            marginBottom: 64,
          }}
        />

        {/* ── LABEL ── */}
        <Text
          style={{
            fontSize: 8,
            color: NAVY,
            letterSpacing: 3.5,
            marginBottom: 6,
          }}
        >
          PROPOSTA COMERCIAL
        </Text>

        {/* ── NÚMERO DA PROPOSTA ── */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: NAVY,
            marginBottom: 6,
            letterSpacing: 0.5,
          }}
        >
          N {numeroContrato}
        </Text>

        {/* ── DATA ── */}
        <Text
          style={{
            fontSize: 9,
            color: GRAY_500,
            marginBottom: 32,
          }}
        >
          {dataHoje}
        </Text>

        {/* ── NOME DO CONDOMÍNIO (se houver) ── */}
        {nomeCondominio ? (
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: NAVY,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {nomeCondominio}
          </Text>
        ) : null}

        {/* ── ENDEREÇO ── */}
        {enderecoCondominio ? (
          <Text
            style={{
              fontSize: 9,
              color: GRAY_500,
              marginBottom: 4,
              lineHeight: 1.4,
            }}
          >
            {enderecoCondominio}
          </Text>
        ) : null}

        {/* ── UNIDADES ── */}
        {numeroUnidades ? (
          <Text
            style={{
              fontSize: 9,
              color: GRAY_500,
              marginBottom: 8,
            }}
          >
            {numeroUnidades} unidades
          </Text>
        ) : null}

        {/* ── SOLICITANTE ── */}
        {nomeContato ? (
          <Text
            style={{
              fontSize: 9,
              color: GRAY_500,
            }}
          >
            Solicitante: {nomeContato}
          </Text>
        ) : null}
      </View>

      {/* ══════════════════════════════════════
          COLUNA DIREITA — DEGRADÊ AZUL SUAVE
          ══════════════════════════════════════ */}
      <View
        style={{
          width: "45%",
          position: "relative",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* ── BASE AZUL ESCURO (fundo total) ── */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "#1B2A4A",
          }}
        />

        {/* ── DEGRADÊ: 8 CAMADAS BRANCAS com opacidade decrescente ──
             Simulam transição suave de branco (topo) → azul (base)  
             ✅ AJUSTE 2: sem quebras de cor                          */}
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", opacity: 0.97, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "88%",  opacity: 0.88, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "76%",  opacity: 0.76, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "64%",  opacity: 0.60, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52%",  opacity: 0.44, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%",  opacity: 0.28, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28%",  opacity: 0.14, backgroundColor: WHITE }} />
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "14%",  opacity: 0.05, backgroundColor: WHITE }} />

        {/* ── SILHUETA DE PRÉDIOS ── */}
        <View
          style={{
            position: "absolute",
            bottom: 160,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <BuildingsSilhouette />
        </View>

        {/* ── BLOCO DE CONTATO ──
             ✅ AJUSTE 3: padding e fontes maiores, borda dourada espessa */}
        <View
          style={{
            width: "88%",
            backgroundColor: WHITE,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor: GOLD,
            paddingVertical: 22,
            paddingHorizontal: 20,
            marginBottom: 36,
            alignItems: "center",
          }}
        >
          {/* ENTRE EM CONTATO */}
          <Text
            style={{
              fontSize: 8,
              color: GOLD,
              letterSpacing: 3,
              marginBottom: 14,
            }}
          >
            ENTRE EM CONTATO
          </Text>

          {/* TELEFONE */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: NAVY,
              marginBottom: 7,
            }}
          >
            (31) 99778-7316
          </Text>

          {/* E-MAIL */}
          <Text
            style={{
              fontSize: 10,
              color: NAVY,
              marginBottom: 5,
            }}
          >
            comercial@alphafacilities.com.br
          </Text>

          {/* SITE */}
          <Text
            style={{
              fontSize: 9.5,
              color: GRAY_500,
            }}
          >
            www.alphafacilities.com.br
          </Text>
        </View>
      </View>
    </Page>
  );
}

/* ================================================================
   PÁGINA 2 — SOBRE NÓS + DIFERENCIAIS
   ================================================================ */
function PageSobreNos({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Sobre Nós" />

      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          QUEM SOMOS
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Quem Somos
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 8, lineHeight: 1.5 }}>
          Conheça a Alpha Condomínios e nossa missão de transformar a gestão condominial.
        </Text>
        <GoldDivider />

        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 8 }}>
          A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a
          administração de condomínios, combinando tecnologia, transparência e atendimento
          humanizado. Atuamos em Belo Horizonte e região metropolitana, atendendo condomínios
          residenciais, comerciais e mistos.
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 8 }}>
          Nossa equipe é formada por especialistas em gestão condominial, contabilidade, direito
          imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle financeiro
          rigoroso, comunicação eficiente e total conformidade legal.
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 14 }}>
          Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se
          adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a mesma
          excelência.
        </Text>

        <View style={{ backgroundColor: NAVY, borderRadius: 6, padding: 16, marginBottom: 22 }}>
          <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 6 }}>
            NOSSA MISSÃO
          </Text>
          <Text style={{ fontSize: 9.5, color: WHITE, lineHeight: 1.6 }}>
            Entregar gestão condominial de excelência, com transparência, tecnologia e compromisso
            com o bem-estar dos moradores.
          </Text>
        </View>

        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          POR QUE NOS ESCOLHER
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: NAVY, marginBottom: 12 }}>
          Nossos Diferenciais
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }}>
          <DiferencialCard icon={<IChart />}   titulo="Transparência Total"     texto="Balancetes digitais mensais e acesso em tempo real às finanças do condomínio." />
          <DiferencialCard icon={<IMonitor />} titulo="Tecnologia de Ponta"     texto="Portal do condomínio, boletos digitais e aplicativo para gestão completa." />
          <DiferencialCard icon={<IPeople />}  titulo="Atendimento Humanizado"  texto="Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail." />
          <DiferencialCard icon={<IShield />}  titulo="Conformidade Legal"      texto="Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais." />
          <DiferencialCard icon={<IMoney />}   titulo="Redução de Custos"       texto="Gestão estratégica e negociação qualificada com fornecedores, gerando economia real e sustentável." />
          <DiferencialCard icon={<IStar />}    titulo="Excelência Comprovada"   texto="Mais de 25 anos de experiência em administração condominial com resultados consistentes." />
        </View>
      </View>

      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 3 — SERVIÇOS
   ================================================================ */
function PageServicos({ pg, total }: { pg: number; total: number }) {
  const servicos = [
    { titulo: "Administração de Condomínios",  descricao: "Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência." },
    { titulo: "Síndico Profissional",          descricao: "Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC) de Síndico, protegendo o profissional e o condomínio." },
    { titulo: "Certificado Digital",           descricao: "Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, garantindo validade jurídica e agilidade." },
    { titulo: "Seguro Condominial",            descricao: "Contratação e gestão de apólices de seguro patrimonial, incêndio, responsabilidade civil e outros, com análise criteriosa de coberturas e custos." },
    { titulo: "AVCB",                          descricao: "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros, garantindo conformidade legal e segurança dos moradores." },
    { titulo: "Assessoria Jurídica",           descricao: "Suporte jurídico especializado em direito condominial, com orientação em assembleias, elaboração de documentos e resolução de conflitos." },
    { titulo: "Garantidora de Crédito",        descricao: "Intermediação com empresas garantidoras para locação de unidades, facilitando a entrada de inquilinos e reduzindo inadimplência." },
    { titulo: "Dentre Outros",                 descricao: "Soluções personalizadas conforme necessidades específicas de cada condomínio: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais." },
  ];

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Serviços" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>
          SOLUÇÕES COMPLETAS
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Nossos Serviços
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 14, lineHeight: 1.5 }}>
          Soluções completas para a administração do seu condomínio.
        </Text>
        <GoldDivider />
        {servicos.map((s) => (
          <ServicoRow key={s.titulo} titulo={s.titulo} descricao={s.descricao} />
        ))}
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA DE PLANO
   ================================================================ */
function PagePlano({
  pg, total, badge, nome, subtitulo, idealPara, features, totalFmt, porUnidadeFmt,
}: {
  pg: number; total: number; badge?: string; nome: string; subtitulo: string;
  idealPara: string; features: string[]; totalFmt: string; porUnidadeFmt: string;
}) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Plano" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        {badge && (
          <View style={{ backgroundColor: GOLD, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 12 }}>
            <Text style={{ fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1.5 }}>
              {badge.toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>PLANO</Text>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>{nome}</Text>
        <Text style={{ fontSize: 10, color: GRAY_700, marginBottom: 20, lineHeight: 1.5 }}>{subtitulo}</Text>
        <GoldDivider />
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>IDEAL PARA</Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 20, lineHeight: 1.5 }}>{idealPara}</Text>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 12 }}>O QUE ESTÁ INCLUÍDO</Text>
        <View style={{ marginBottom: 28 }}>
          {features.map((f) => <FeatureRow key={f} text={f} />)}
        </View>
        <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 20 }} />
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 10 }}>INVESTIMENTO MENSAL</Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>{totalFmt}</Text>
        <Text style={{ fontSize: 10, color: GRAY_700 }}>{porUnidadeFmt} por unidade/mês</Text>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA — COMPARATIVO
   ================================================================ */
function PageComparativo({
  pg, total, essencialFmt, completoFmt, premiumFmt,
}: {
  pg: number; total: number; essencialFmt: string; completoFmt: string; premiumFmt: string;
}) {
  const CHECK = "✓";
  const DASH  = "—";

  const linhas: { categoria?: string; item?: string; e: string; c: string; p: string }[] = [
    { categoria: "FINANCEIRO" },
    { item: "Emissão de boletos",               e: CHECK, c: CHECK, p: CHECK },
    { item: "Cobrança de inadimplentes",        e: CHECK, c: CHECK, p: CHECK },
    { item: "Balancete digital mensal",         e: CHECK, c: CHECK, p: CHECK },
    { item: "Gestão de contas a pagar",         e: DASH,  c: CHECK, p: CHECK },
    { item: "Pagamentos online integrados",     e: DASH,  c: CHECK, p: CHECK },
    { item: "Planejamento orçamentário anual",  e: DASH,  c: CHECK, p: CHECK },
    { categoria: "OPERACIONAL" },
    { item: "Portal do condômino",              e: CHECK, c: CHECK, p: CHECK },
    { item: "Suporte via WhatsApp",             e: CHECK, c: CHECK, p: CHECK },
    { item: "Rateio de água e gás",             e: DASH,  c: CHECK, p: CHECK },
    { item: "Elaboração de atas e convocações", e: DASH,  c: CHECK, p: CHECK },
    { item: "Relatórios gerenciais",            e: DASH,  c: CHECK, p: CHECK },
    { categoria: "PREMIUM" },
    { item: "Assessoria jurídica condominial",  e: DASH,  c: DASH,  p: CHECK },
    { item: "Cumprimento de obrigações fiscais",e: DASH,  c: DASH,  p: CHECK },
    { item: "Gestão de obras e reformas",       e: DASH,  c: DASH,  p: CHECK },
    { item: "Revisão anual da convenção",       e: DASH,  c: DASH,  p: CHECK },
    { item: "Atendimento prioritário SLA 12h",  e: DASH,  c: DASH,  p: CHECK },
    { item: "Relatório trimestral de desempenho", e: DASH, c: DASH, p: CHECK },
  ];

  const ColW = { item: "46%", plano: "18%" };

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Comparativo" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>COMPARATIVO DE PLANOS</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>Comparativo de Planos</Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 18, lineHeight: 1.5 }}>Veja lado a lado o que cada plano oferece.</Text>

        <View style={{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 2 }}>
          <Text style={{ width: ColW.item, fontSize: 8, color: GOLD, fontWeight: "bold" }}>SERVIÇO</Text>
          {["Essencial", "Completo", "Premium"].map((n) => (
            <Text key={n} style={{ width: ColW.plano, fontSize: 8, color: WHITE, fontWeight: "bold", textAlign: "center" }}>{n}</Text>
          ))}
        </View>

        {linhas.map((l, i) => {
          if (l.categoria) {
            return (
              <View key={i} style={{ backgroundColor: GRAY_50, paddingHorizontal: 10, paddingVertical: 5, marginTop: 4 }}>
                <Text style={{ fontSize: 7.5, fontWeight: "bold", color: NAVY, letterSpacing: 1 }}>{l.categoria}</Text>
              </View>
            );
          }
          return (
            <View key={i} style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: GRAY_200, alignItems: "center" }}>
              <Text style={{ width: ColW.item, fontSize: 8.5, color: GRAY_700 }}>{l.item}</Text>
              {[l.e, l.c, l.p].map((v, idx) => (
                <Text key={idx} style={{ width: ColW.plano, fontSize: 9, textAlign: "center", color: v === CHECK ? GREEN_CHECK : "#9CA3AF", fontWeight: v === CHECK ? "bold" : "normal" }}>{v}</Text>
              ))}
            </View>
          );
        })}

        <View style={{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, marginTop: 4 }}>
          <Text style={{ width: ColW.item, fontSize: 8, color: GOLD, fontWeight: "bold" }}>Investimento mensal</Text>
          {[essencialFmt, completoFmt, premiumFmt].map((v) => (
            <Text key={v} style={{ width: ColW.plano, fontSize: 8, color: WHITE, fontWeight: "bold", textAlign: "center" }}>{v}</Text>
          ))}
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA — SÍNDICO
   ================================================================ */
function PageSindico({ pg, total, sindicoTotalFmt, sindicoPorUnidade, numeroUnidades }: {
  pg: number; total: number; sindicoTotalFmt: string; sindicoPorUnidade: string; numeroUnidades: number;
}) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Serviço" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 8 }}>SERVIÇO</Text>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>Síndico Profissional</Text>
        <Text style={{ fontSize: 10, color: GRAY_700, marginBottom: 20, lineHeight: 1.5 }}>Gestão presencial com representação legal do condomínio</Text>
        <GoldDivider />
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 8 }}>IDEAL PARA</Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 20, lineHeight: 1.5 }}>
          Condomínios que desejam um síndico dedicado, com experiência em gestão condominial e representação legal.
        </Text>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 12 }}>O QUE ESTÁ INCLUÍDO</Text>
        <View style={{ marginBottom: 28 }}>
          {[
            "Representação legal do condomínio",
            "Gestão de funcionários e fornecedores",
            "Convocação e condução de assembleias",
            "Cumprimento de obrigações trabalhistas",
            "Fiscalização de contratos e obras",
            "Atendimento aos condôminos",
            "Aplicação do regimento interno",
          ].map((f) => <FeatureRow key={f} text={f} />)}
        </View>
        <View style={{ height: 0.5, backgroundColor: GRAY_200, marginBottom: 20 }} />
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontWeight: "bold", marginBottom: 10 }}>INVESTIMENTO MENSAL — SÍNDICO</Text>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>{sindicoTotalFmt}</Text>
        {sindicoPorUnidade !== "Sob consulta" && (
          <Text style={{ fontSize: 10, color: GRAY_700, marginBottom: 20 }}>{sindicoPorUnidade} por unidade/mês</Text>
        )}
        <View style={{ backgroundColor: NAVY, borderRadius: 6, padding: 16, marginTop: 10 }}>
          <Text style={{ fontSize: 9.5, fontWeight: "bold", color: GOLD, marginBottom: 6 }}>Seguro RC Incluso</Text>
          <Text style={{ fontSize: 9, color: WHITE, lineHeight: 1.6 }}>
            A Alpha Condomínios tem como diferencial no mercado o Seguro de Responsabilidade Civil (RC) do Síndico INCLUSO.
            Protegemos o síndico contra riscos inerentes à função, sem custo adicional.
          </Text>
        </View>
        <Text style={{ fontSize: 8, color: GRAY_700, marginTop: 14, lineHeight: 1.5 }}>
          Valores calculados para {numeroUnidades} unidades. Sujeitos a ajuste conforme avaliação técnica.
        </Text>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA — CONDIÇÕES COMERCIAIS
   ================================================================ */
function PageCondicoes({ pg, total }: { pg: number; total: number }) {
  const blocos = [
    { titulo: "Vigência",     texto: "Contrato de 12 meses, renovável automaticamente por igual período." },
    { titulo: "Pagamento",    texto: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
    { titulo: "Reajuste",     texto: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
    { titulo: "Implantação",  texto: "Prazo de implantação de até 30 dias após assinatura do contrato." },
    { titulo: "Rescisão",     texto: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias." },
    { titulo: "Validade",     texto: "Esta proposta tem validade de 30 dias a partir da data de emissão." },
  ];

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Condições" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>CONDIÇÕES GERAIS</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>Condições Comerciais</Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 16, lineHeight: 1.5 }}>Transparência em todos os termos da nossa proposta.</Text>
        <GoldDivider />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {blocos.map((b) => (
            <View key={b.titulo} style={{ width: "47%", backgroundColor: GRAY_50, borderRadius: 6, padding: 16, borderTopWidth: 3, borderTopColor: GOLD }}>
              <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>{b.titulo}</Text>
              <Text style={{ fontSize: 9, color: GRAY_700, lineHeight: 1.6 }}>{b.texto}</Text>
            </View>
          ))}
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA — PRÓXIMOS PASSOS
   ================================================================ */
function PagePassos({ pg, total, telefone, email }: {
  pg: number; total: number; telefone: string; email: string;
}) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Próximos Passos" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>COMO CONTRATAR</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>Como Contratar</Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, marginBottom: 20, lineHeight: 1.5 }}>Simples, rápido e sem burocracia.</Text>
        <GoldDivider />
        <StepRow n={1} titulo="Aprovação da Proposta"  texto="Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização." />
        <StepRow n={2} titulo="Assinatura do Contrato" texto="Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro." />
        <StepRow n={3} titulo="Implantação"            texto="Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado." />
        <StepRow n={4} titulo="Gestão Ativa"           texto="Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência." />
        <View style={{ backgroundColor: NAVY, borderRadius: 6, padding: 20, marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 10, color: WHITE, fontWeight: "bold", flex: 1, lineHeight: 1.5 }}>
            Pronto para transformar a gestão do seu condomínio?
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 9, color: GOLD, marginBottom: 4 }}>{telefone || "(31) 99778-7316"}</Text>
            <Text style={{ fontSize: 9, color: WHITE }}>{email || "comercial@alphafacilities.com.br"}</Text>
          </View>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA — CONSIDERAÇÕES FINAIS
   ================================================================ */
function PageConsideracoes({ pg, total, texto }: { pg: number; total: number; texto: string }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 40 }}>
      <PageHeader label="Considerações Finais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 28 }}>
        <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2.5, fontWeight: "bold", marginBottom: 6 }}>OBSERVAÇÕES</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>Considerações Finais</Text>
        <GoldDivider />
        <View style={{ backgroundColor: GRAY_50, borderRadius: 8, padding: 22, borderLeftWidth: 3, borderLeftColor: GOLD }}>
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.75 }}>{texto}</Text>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   CONTRACAPA
   ================================================================ */
function PageContracapa() {
  return (
    <Page size="A4" style={{ backgroundColor: NAVY }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 60 }}>
        <Image src={logoAlpha} style={{ width: 160, height: 80, objectFit: "contain", marginBottom: 24 }} />
        <Text style={{ fontSize: 10, color: GOLD, letterSpacing: 4, fontWeight: "bold", marginBottom: 32 }}>
          GESTÃO · TRANSPARÊNCIA · CONFIANÇA
        </Text>
        <View style={{ height: 0.5, width: 80, backgroundColor: GOLD, marginBottom: 32 }} />
        <Text style={{ fontSize: 10, color: WHITE, marginBottom: 8 }}>www.alphafacilities.com.br</Text>
        <Text style={{ fontSize: 9, color: "#94A3B8" }}>(31) 99778-7316 · comercial@alphafacilities.com.br</Text>
      </View>
    </Page>
  );
}

/* ================================================================
   DOCUMENTO PRINCIPAL
   ================================================================ */
export function PropostaDocument(props: PropostaPDFData) {
  const {
    numero, data, cidade,
    condominio, contato,
    incluiAdmin, incluiSindico, consideracoesFinais,
  } = props;

  const nomeCondominio   = condominio?.nome      || "Condomínio";
  const numeroUnidades   = Number(condominio?.unidades) || 0;
  const bairro           = condominio?.endereco  || "";
  const nomeContato      = contato?.nome         || "";
  const telefoneContato  = contato?.telefone     || "(31) 99778-7316";
  const emailContato     = contato?.email        || "comercial@alphafacilities.com.br";
  const numeroContrato   = numero                || "";

  // ✅ CORRIGIDO: usa format do date-fns com locale ptBR
  const dataHoje = format(
    data instanceof Date ? data : new Date(),
    "d 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  const localidade = [bairro, cidade].filter(Boolean).join(" – ");

  /* ── Contagem de páginas ── */
  const temConsideracoes = Boolean(consideracoesFinais?.trim());

  let total = 0;
  total += 1; // capa
  total += 1; // sobre nós
  total += 1; // serviços
  if (incluiAdmin)      total += 4; // essencial + completo + premium + comparativo
  if (incluiSindico)    total += 1; // síndico
  total += 1; // condições
  total += 1; // próximos passos
  if (temConsideracoes) total += 1; // considerações
  total += 1; // contracapa

  /* ── Índices de página ── */
  let pg = 0;
  const P_CAPA     = ++pg;
  const P_SOBRE    = ++pg;
  const P_SERVICOS = ++pg;
  let P_ESSENCIAL = 0, P_COMPLETO = 0, P_PREMIUM = 0, P_COMPARATIVO = 0;
  if (incluiAdmin) {
    P_ESSENCIAL   = ++pg;
    P_COMPLETO    = ++pg;
    P_PREMIUM     = ++pg;
    P_COMPARATIVO = ++pg;
  }
  let P_SINDICO = 0;
  if (incluiSindico) P_SINDICO = ++pg;
  const P_CONDICOES = ++pg;
  const P_PASSOS    = ++pg;
  let P_CONSIDERACOES = 0;
  if (temConsideracoes) P_CONSIDERACOES = ++pg;

  /* ── Planos ── */
  const planos = calcularPlanos(numeroUnidades);

  const fmtPlano = (p: ReturnType<typeof calcularPlanos>["essencial"]) =>
    p.tipo === "valor"
      ? { totalFmt: formatBRL(p.mensal) + "/mês", porUnidadeFmt: formatBRL(p.porUnidade) }
      : { totalFmt: p.texto, porUnidadeFmt: "Sob consulta" };

  const essencial = fmtPlano(planos.essencial);
  const completo  = fmtPlano(planos.completo);
  const premium   = fmtPlano(planos.premium);

  const sindicoPlano      = planos.sindico;
  const sindicoTotalFmt   = formatSindico(sindicoPlano);
  const sindicoPorUnidade =
    sindicoPlano?.tipo === "valor" && numeroUnidades > 0
      ? formatBRL(sindicoPlano.mensal / numeroUnidades)
      : "Sob consulta";

  /* ── Features ── */
  const featEssencial = [
    "Emissão de boletos",
    "Cobrança de inadimplentes",
    "Balancete digital mensal",
    "Portal do condômino",
    "Suporte via WhatsApp",
  ];
  const featCompleto = [
    "Tudo do Plano Essencial",
    "Rateio de água e gás",
    "Planejamento orçamentário anual",
    "Gestão de contas a pagar",
    "Elaboração de atas e convocações",
    "Pagamentos online integrados",
    "Relatórios gerenciais",
  ];
  const featPremium = [
    "Tudo do Plano Completo",
    "Assessoria jurídica condominial",
    "Cumprimento de obrigações fiscais",
    "Gestão de obras e reformas",
    "Revisão anual da convenção",
    "Atendimento prioritário SLA 12h",
    "Relatório trimestral de desempenho",
  ];

  return (
    <Document>
      {/* 1. Capa */}
      <PageCapa
        numeroContrato={numeroContrato}
        dataHoje={dataHoje}
        nomeCondominio={nomeCondominio}
        enderecoCondominio={localidade}
        numeroUnidades={numeroUnidades}
        nomeContato={nomeContato}
        pg={P_CAPA}
        total={total}
      />

      {/* 2. Sobre Nós */}
      <PageSobreNos pg={P_SOBRE} total={total} />

      {/* 3. Serviços */}
      <PageServicos pg={P_SERVICOS} total={total} />

      {/* 4–7. Planos */}
      {incluiAdmin && (
        <>
          <PagePlano
            pg={P_ESSENCIAL} total={total}
            nome="Essencial"
            subtitulo="Gestão financeira objetiva e eficiente"
            idealPara="Condomínios que buscam organização financeira com custo acessível."
            features={featEssencial}
            totalFmt={essencial.totalFmt}
            porUnidadeFmt={essencial.porUnidadeFmt}
          />
          <PagePlano
            pg={P_COMPLETO} total={total}
            badge="Mais Escolhido"
            nome="Completo"
            subtitulo="Administração completa com gestão integrada"
            idealPara="Condomínios que precisam de gestão financeira, operacional e de comunicação integradas."
            features={featCompleto}
            totalFmt={completo.totalFmt}
            porUnidadeFmt={completo.porUnidadeFmt}
          />
          <PagePlano
            pg={P_PREMIUM} total={total}
            nome="Premium"
            subtitulo="Gestão completa com assessoria jurídica e atendimento prioritário"
            idealPara="Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA de atendimento."
            features={featPremium}
            totalFmt={premium.totalFmt}
            porUnidadeFmt={premium.porUnidadeFmt}
          />
          <PageComparativo
            pg={P_COMPARATIVO} total={total}
            essencialFmt={essencial.totalFmt}
            completoFmt={completo.totalFmt}
            premiumFmt={premium.totalFmt}
          />
        </>
      )}

      {/* Síndico */}
      {incluiSindico && (
        <PageSindico
          pg={P_SINDICO} total={total}
          sindicoTotalFmt={sindicoTotalFmt}
          sindicoPorUnidade={sindicoPorUnidade}
          numeroUnidades={numeroUnidades}
        />
      )}

      {/* Condições */}
      <PageCondicoes pg={P_CONDICOES} total={total} />

      {/* Próximos Passos */}
      <PagePassos
        pg={P_PASSOS} total={total}
        telefone={telefoneContato}
        email={emailContato}
      />

      {/* Considerações Finais */}
      {temConsideracoes && (
        <PageConsideracoes
          pg={P_CONSIDERACOES} total={total}
          texto={consideracoesFinais!}
        />
      )}

      {/* Contracapa */}
      <PageContracapa />
    </Document>
  );
}
