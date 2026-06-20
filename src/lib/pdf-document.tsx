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
  Defs,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { calcularPlanos, formatBRL, SERVICOS_PLANOS } from "./calculations";
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
   DEGRADÊ SVG
   ================================================================ */
function GradientVertical({
  width,
  height,
  uid = "gv",
}: {
  width: number;
  height: number;
  uid?: string;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        {/* @ts-ignore */}
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          {/* @ts-ignore */}
          <stop offset="0%"   stopColor="#6A8FC0" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="30%"  stopColor="#4A6FA5" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="65%"  stopColor="#2E4470" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="100%" stopColor="#0F1A30" stopOpacity="1" />
        </linearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={`url(#${uid})`} />
    </Svg>
  );
}

function GradientHorizontal({
  width,
  height,
  uid = "gh",
}: {
  width: number;
  height: number;
  uid?: string;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        {/* @ts-ignore */}
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          {/* @ts-ignore */}
          <stop offset="0%"   stopColor="#6A8FC0" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="35%"  stopColor="#4A6FA5" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="70%"  stopColor="#2E4470" stopOpacity="1" />
          {/* @ts-ignore */}
          <stop offset="100%" stopColor="#0F1A30" stopOpacity="1" />
        </linearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={`url(#${uid})`} />
    </Svg>
  );
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
  const W = 595;
  const H = 90;
  const uid =
    "gh-" +
    label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return (
    <View style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      <GradientHorizontal width={W} height={H} uid={uid} />
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          paddingHorizontal: 50,
          paddingVertical: 18,
          justifyContent: "center",
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
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 7 }}>
      <Text style={{ fontSize: 9, color: GREEN_CHECK, marginRight: 6, marginTop: 1 }}>✓</Text>
      <Text style={{ fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 }}>{text}</Text>
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
          width: 6, height: 6, borderRadius: 3,
          backgroundColor: GOLD,
          marginTop: 3, marginRight: 10,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 2 }}>
          {titulo}
        </Text>
        <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{descricao}</Text>
      </View>
    </View>
  );
}

function DiferencialCard({
  icon,
  titulo,
  texto,
}: {
  icon: React.ReactElement;
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
      <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 4 }}>{titulo}</Text>
      <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{texto}</Text>
    </View>
  );
}

function StepRow({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 18 }}>
      <View
        style={{
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: GOLD,
          alignItems: "center", justifyContent: "center",
          marginRight: 14, marginTop: 2,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "bold", color: NAVY }}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 3 }}>{titulo}</Text>
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
    <Path
      d="M20 3H4a1 1 0 00-1 1v12a1 1 0 001 1h7v2H8v2h8v-2h-3v-2h7a1 1 0 001-1V4a1 1 0 00-1-1zm-1 12H5V5h14v10z"
      fill={GOLD}
    />
  </Svg>
);
const IShield = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"
      fill={GOLD}
    />
  </Svg>
);
const IUsers = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill={GOLD}
    />
  </Svg>
);
const IStar = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill={GOLD}
    />
  </Svg>
);
const IClock = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
      fill={GOLD}
    />
  </Svg>
);

/* ================================================================
   PÁGINA 1 — CAPA
   ================================================================ */
function PageCapa({ data }: { data: PropostaPDFData }) {
  const dataFormatada = format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const W = 595;
  const H = 842;

  return (
    <Page size="A4" style={{ position: "relative", backgroundColor: WHITE }}>
      <GradientVertical width={W / 2} height={H} uid="gv-capa" />

      {/* Coluna esquerda */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: W / 2, height: H,
          paddingHorizontal: 44,
          paddingVertical: 60,
          justifyContent: "space-between",
        }}
      >
        <Image
          src={logoAlpha}
          style={{ width: 120, height: 60, objectFit: "contain" }}
        />
        <View>
          <View style={{ width: 36, height: 3, backgroundColor: GOLD, marginBottom: 20 }} />
          <Text style={{ fontSize: 9, color: GRAY_500, letterSpacing: 2, marginBottom: 6 }}>
            PROPOSTA COMERCIAL
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: NAVY, lineHeight: 1.3, marginBottom: 20 }}>
            Administração{"\n"}de Condomínios
          </Text>
          <Text style={{ fontSize: 9, color: GRAY_700, marginBottom: 4 }}>
            {data.condominio.nome}
          </Text>
          <Text style={{ fontSize: 8.5, color: GRAY_500, marginBottom: 2 }}>
            {data.condominio.endereco}
          </Text>
          <Text style={{ fontSize: 8.5, color: GRAY_500 }}>
            {data.condominio.unidades} unidades · {data.condominio.tipo}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 8, color: GRAY_500, marginBottom: 2 }}>
            Proposta nº {data.numero}
          </Text>
          <Text style={{ fontSize: 8, color: GRAY_500 }}>{dataFormatada}</Text>
        </View>
      </View>

      {/* Coluna direita */}
      <View
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: W / 2, height: H,
          paddingHorizontal: 36,
          paddingVertical: 60,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Text style={{ fontSize: 9, color: GOLD, letterSpacing: 2, marginBottom: 16 }}>
          NOSSOS SERVIÇOS
        </Text>
        {[
          "Administração Condominial",
          "Síndico Profissional",
          "Certificado Digital",
          "Seguro Condominial",
          "AVCB / Corpo de Bombeiros",
          "Assessoria Jurídica",
          "Garantidora de Crédito",
          "Suporte Financeiro",
        ].map((s) => (
          <View
            key={s}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          >
            <View
              style={{
                width: 5, height: 5, borderRadius: 2.5,
                backgroundColor: GOLD, marginRight: 10,
              }}
            />
            <Text style={{ fontSize: 9, color: WHITE }}>{s}</Text>
          </View>
        ))}
        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 8, color: WHITE, opacity: 0.6, marginBottom: 3 }}>
            Contato
          </Text>
          <Text style={{ fontSize: 9, color: WHITE, marginBottom: 2 }}>
            {data.contato.nome}
          </Text>
          <Text style={{ fontSize: 8.5, color: WHITE, opacity: 0.75, marginBottom: 2 }}>
            {data.contato.telefone}
          </Text>
          <Text style={{ fontSize: 8.5, color: WHITE, opacity: 0.75 }}>
            {data.contato.email}
          </Text>
        </View>
      </View>
    </Page>
  );
}

/* ================================================================
   PÁGINA 2 — QUEM SOMOS
   ================================================================ */
function PageQuemSomos({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Quem Somos" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Quem Somos
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 24 }}>
          A Alpha Condomínios é uma empresa especializada na gestão condominial, fundada em 2011
          com o propósito de oferecer administração profissional, transparente e eficiente para
          condomínios residenciais e comerciais. Com mais de uma década de experiência, construímos
          nossa reputação sobre três pilares: confiança, tecnologia e resultado.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 28 }}>
          {[
            { n: "+14", label: "Anos de\nExperiência" },
            { n: "+200", label: "Condomínios\nAdministrados" },
            { n: "98%", label: "Índice de\nSatisfação" },
            { n: "24/7", label: "Suporte\nDisponível" },
          ].map((c) => (
            <View
              key={c.n}
              style={{
                width: "23%",
                backgroundColor: NAVY,
                borderRadius: 8,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", color: GOLD, marginBottom: 4 }}>
                {c.n}
              </Text>
              <Text style={{ fontSize: 7.5, color: WHITE, textAlign: "center", lineHeight: 1.5 }}>
                {c.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 28 }}>
          {[
            {
              titulo: "Missão",
              texto: "Prover gestão condominial de excelência, garantindo transparência, eficiência e valorização patrimonial.",
            },
            {
              titulo: "Visão",
              texto: "Ser referência nacional em administração condominial, reconhecida pela inovação e qualidade dos serviços.",
            },
            {
              titulo: "Valores",
              texto: "Ética, transparência, comprometimento, inovação tecnológica e foco total na satisfação dos condôminos.",
            },
          ].map((v) => (
            <View
              key={v.titulo}
              style={{
                width: "31%",
                backgroundColor: GRAY_50,
                borderRadius: 6,
                padding: 14,
                borderTopWidth: 3,
                borderTopColor: GOLD,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
                {v.titulo}
              </Text>
              <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>{v.texto}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 12, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>
          Por que escolher a Alpha Condomínios?
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            "Equipe multidisciplinar com especialistas em finanças, jurídico e engenharia",
            "Plataforma digital exclusiva para gestão transparente e em tempo real",
            "Relatórios financeiros detalhados entregues mensalmente",
            "Atendimento personalizado para cada condomínio",
            "Histórico comprovado de redução de inadimplência",
            "Suporte jurídico especializado em direito condominial",
          ].map((f) => (
            <View key={f} style={{ width: "48%", marginBottom: 8 }}>
              <FeatureRow text={f} />
            </View>
          ))}
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 3 — DIFERENCIAIS
   ================================================================ */
function PageDiferenciais({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Diferenciais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Nossos Diferenciais
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 24 }}>
          Combinamos tecnologia de ponta com atendimento humanizado para oferecer uma experiência
          única em administração condominial.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <DiferencialCard
            icon={<IChart />}
            titulo="Gestão Financeira Transparente"
            texto="Prestação de contas mensal detalhada com acesso online em tempo real. Relatórios claros e auditáveis por qualquer condômino."
          />
          <DiferencialCard
            icon={<IMonitor />}
            titulo="Tecnologia Exclusiva"
            texto="Plataforma digital própria para acompanhamento de obras, votações online, comunicados e gestão de documentos."
          />
          <DiferencialCard
            icon={<IShield />}
            titulo="Segurança Jurídica"
            texto="Equipe jurídica especializada em direito condominial para assessoria preventiva e resolução de conflitos."
          />
          <DiferencialCard
            icon={<IUsers />}
            titulo="Equipe Especializada"
            texto="Profissionais com formação em administração, contabilidade, direito e engenharia dedicados ao seu condomínio."
          />
          <DiferencialCard
            icon={<IStar />}
            titulo="Excelência no Atendimento"
            texto="Gestor exclusivo para cada condomínio com atendimento personalizado e resposta em até 2 horas úteis."
          />
          <DiferencialCard
            icon={<IClock />}
            titulo="Disponibilidade 24/7"
            texto="Plantão de emergências disponível 24 horas por dia, 7 dias por semana para situações urgentes."
          />
        </View>

        <View
          style={{
            marginTop: 16,
            backgroundColor: NAVY,
            borderRadius: 8,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
              Compromisso com Resultados
            </Text>
            <Text style={{ fontSize: 8.5, color: WHITE, opacity: 0.8, lineHeight: 1.5 }}>
              Nosso modelo de gestão é orientado a resultados mensuráveis: redução de
              inadimplência, controle de custos e valorização do patrimônio condominial.
            </Text>
          </View>
          <View style={{ marginLeft: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: GOLD }}>98%</Text>
            <Text style={{ fontSize: 7, color: WHITE, opacity: 0.7, textAlign: "center" }}>
              satisfação{"\n"}dos clientes
            </Text>
          </View>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 4 — SERVIÇOS
   ================================================================ */
function PageServicos({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Serviços" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Nossos Serviços
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 20 }}>
          Oferecemos um portfólio completo de serviços para atender todas as necessidades do seu condomínio.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {[
            {
              titulo: "Administração Condominial",
              descricao: "Gestão completa do condomínio: financeiro, contábil, manutenção, assembleias e relacionamento com condôminos.",
            },
            {
              titulo: "Síndico Profissional",
              descricao: "Síndico externo qualificado para representar e gerir o condomínio com imparcialidade e expertise.",
            },
            {
              titulo: "Certificado Digital",
              descricao: "Emissão e renovação de certificados digitais para o condomínio e síndico, com todo o suporte necessário.",
            },
            {
              titulo: "Seguro Condominial",
              descricao: "Consultoria e contratação do seguro obrigatório e complementar com as melhores coberturas do mercado.",
            },
            {
              titulo: "AVCB / Corpo de Bombeiros",
              descricao: "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros.",
            },
            {
              titulo: "Assessoria Jurídica",
              descricao: "Suporte jurídico especializado em direito condominial, cobranças, ações e elaboração de regulamentos.",
            },
            {
              titulo: "Garantidora de Crédito",
              descricao: "Solução para redução da inadimplência com garantia de recebimento das taxas condominiais.",
            },
            {
              titulo: "Suporte Financeiro",
              descricao: "Planejamento orçamentário, controle de receitas e despesas, e assessoria para decisões financeiras estratégicas.",
            },
          ].map((s) => (
            <View key={s.titulo} style={{ width: "48%", marginBottom: 4 }}>
              <ServicoRow titulo={s.titulo} descricao={s.descricao} />
            </View>
          ))}
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 5/6/7 — PLANO (reutilizável)
   ================================================================ */
function PagePlano({
  pg,
  total,
  plano,
  unidades,
}: {
  pg: number;
  total: number;
  plano: { nome: string; preco: number; itens: string[] };
  unidades: number;
}) {
  const por_unidade = plano.preco / unidades;

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Plano" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <View
          style={{
            backgroundColor: NAVY,
            borderRadius: 8,
            padding: 20,
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 4 }}>
              PLANO
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: WHITE }}>
              {plano.nome}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 26, fontWeight: "bold", color: GOLD }}>
              {formatBRL(plano.preco)}
            </Text>
            <Text style={{ fontSize: 8, color: WHITE, opacity: 0.7 }}>por mês</Text>
            <Text style={{ fontSize: 8, color: WHITE, opacity: 0.7 }}>
              {formatBRL(por_unidade)}/unidade
            </Text>
          </View>
        </View>

        <GoldDivider />
        <Text style={{ fontSize: 13, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>
          O que está incluído
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {plano.itens.map((item) => (
            <View key={item} style={{ width: "48%", marginBottom: 4 }}>
              <FeatureRow text={item} />
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 24,
            backgroundColor: GRAY_50,
            borderRadius: 6,
            padding: 14,
            borderLeftWidth: 3,
            borderLeftColor: GOLD,
          }}
        >
          <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>
            * Os valores apresentados são baseados em {unidades} unidades e podem ser ajustados
            conforme levantamento detalhado das necessidades específicas do condomínio. Proposta
            válida por 30 dias a partir da data de emissão.
          </Text>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 8 — COMPARATIVO DE PLANOS
   ================================================================ */
function PageComparativo({
  pg,
  total,
  planos,
}: {
  pg: number;
  total: number;
  planos: { nome: string; preco: number; itens: string[] }[];
}) {
  const features = [
    "Gestão financeira completa",
    "Prestação de contas mensal",
    "Atendimento ao síndico",
    "Portal do condômino",
    "Gestão de manutenções",
    "Assessoria jurídica básica",
    "Reuniões de assembleia",
    "Relatórios gerenciais avançados",
    "Síndico profissional dedicado",
    "Auditoria financeira trimestral",
    "Consultoria de obras",
    "Atendimento prioritário 24/7",
  ];

  const planoMap: Record<string, number> = {
    Essencial: 6,
    Completo: 9,
    Premium: 12,
  };

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Comparativo" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Comparativo de Planos
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 20 }}>
          Escolha o plano que melhor se adapta às necessidades do seu condomínio.
        </Text>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: NAVY,
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginBottom: 2,
          }}
        >
          <Text style={{ flex: 2, fontSize: 8, color: WHITE, fontWeight: "bold" }}>
            Recursos
          </Text>
          {planos.map((p) => (
            <Text
              key={p.nome}
              style={{ flex: 1, fontSize: 8, color: GOLD, fontWeight: "bold", textAlign: "center" }}
            >
              {p.nome}
            </Text>
          ))}
        </View>

        {features.map((f, i) => (
          <View
            key={f}
            style={{
              flexDirection: "row",
              paddingVertical: 7,
              paddingHorizontal: 10,
              backgroundColor: i % 2 === 0 ? GRAY_50 : WHITE,
              borderBottomWidth: 0.5,
              borderBottomColor: GRAY_200,
            }}
          >
            <Text style={{ flex: 2, fontSize: 8, color: GRAY_700 }}>{f}</Text>
            {planos.map((p) => {
              const limite = planoMap[p.nome] ?? 6;
              const inclui = i < limite;
              return (
                <Text
                  key={p.nome}
                  style={{
                    flex: 1,
                    fontSize: 9,
                    textAlign: "center",
                    color: inclui ? GREEN_CHECK : GRAY_200,
                  }}
                >
                  {inclui ? "✓" : "–"}
                </Text>
              );
            })}
          </View>
        ))}

        <View
          style={{
            flexDirection: "row",
            backgroundColor: NAVY,
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginTop: 4,
          }}
        >
          <Text style={{ flex: 2, fontSize: 8.5, color: WHITE, fontWeight: "bold" }}>
            Investimento mensal
          </Text>
          {planos.map((p) => (
            <Text
              key={p.nome}
              style={{ flex: 1, fontSize: 8.5, color: GOLD, fontWeight: "bold", textAlign: "center" }}
            >
              {formatBRL(p.preco)}
            </Text>
          ))}
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 9 — SÍNDICO PROFISSIONAL
   ================================================================ */
function PageSindico({
  pg,
  total,
  sindico,
  unidades,
}: {
  pg: number;
  total: number;
  sindico: {
    preco: number;
    itens: string[];
    label: string | null;
    isConsulta: boolean;
  };
  unidades: number;
}) {
  const precoTexto = sindico.isConsulta
    ? sindico.label ?? "Sob consulta"
    : sindico.label ?? formatBRL(sindico.preco) + "/mês";

  const porUnidadeTexto = sindico.isConsulta
    ? "Sob consulta"
    : formatBRL(sindico.preco / unidades) + "/unidade";

  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Serviço" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Síndico Profissional
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 24 }}>
          O serviço de Síndico Profissional é a solução ideal para condomínios que buscam uma
          gestão imparcial, técnica e dedicada, sem depender de um morador para assumir essa
          responsabilidade.
        </Text>

        <View
          style={{
            backgroundColor: NAVY,
            borderRadius: 8,
            padding: 20,
            marginBottom: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 8, color: GOLD, letterSpacing: 2, marginBottom: 4 }}>
              INVESTIMENTO MENSAL
            </Text>
            <Text style={{ fontSize: 14, color: WHITE, lineHeight: 1.4 }}>
              Síndico Profissional Alpha
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: sindico.isConsulta ? 13 : 26, fontWeight: "bold", color: GOLD }}>
              {precoTexto}
            </Text>
            <Text style={{ fontSize: 8, color: WHITE, opacity: 0.7 }}>
              {porUnidadeTexto}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, fontWeight: "bold", color: NAVY, marginBottom: 14 }}>
          O que está incluído
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {sindico.itens.map((item) => (
            <View key={item} style={{ width: "48%", marginBottom: 4 }}>
              <FeatureRow text={item} />
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: GRAY_50,
            borderRadius: 6,
            padding: 14,
            borderLeftWidth: 3,
            borderLeftColor: GOLD,
          }}
        >
          <Text style={{ fontSize: 9.5, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
            Por que contratar um Síndico Profissional?
          </Text>
          <Text style={{ fontSize: 8.5, color: GRAY_700, lineHeight: 1.55 }}>
            A gestão condominial exige conhecimento técnico em finanças, legislação, manutenção
            predial e gestão de pessoas. Um síndico profissional traz imparcialidade nas decisões,
            disponibilidade integral e responsabilidade legal compartilhada, protegendo os
            condôminos e valorizando o patrimônio coletivo.
          </Text>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 10 — CONDIÇÕES COMERCIAIS
   ================================================================ */
function PageCondicoes({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Condições Comerciais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Condições Comerciais
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 24 }}>
          Prezamos pela transparência em todas as nossas relações comerciais. Abaixo estão
          detalhadas as condições desta proposta.
        </Text>

        {[
          {
            titulo: "Vigência da Proposta",
            itens: [
              "Esta proposta é válida por 30 dias a partir da data de emissão",
              "Após esse prazo, os valores podem ser reajustados",
              "A proposta pode ser renovada mediante solicitação",
            ],
          },
          {
            titulo: "Forma de Pagamento",
            itens: [
              "Pagamento mensal via boleto bancário ou débito automático",
              "Vencimento no 5º dia útil de cada mês",
              "Reajuste anual pelo IGPM ou IPCA (menor índice)",
            ],
          },
          {
            titulo: "Contrato",
            itens: [
              "Contrato mínimo de 12 meses",
              "Renovação automática por igual período",
              "Rescisão com aviso prévio de 60 dias",
              "Multa rescisória proporcional ao período restante",
            ],
          },
          {
            titulo: "Implantação",
            itens: [
              "Taxa de implantação: isenta para contratos anuais",
              "Prazo de implantação: até 30 dias após assinatura",
              "Treinamento incluso para síndico e conselheiros",
            ],
          },
          {
            titulo: "Serviços Não Incluídos",
            itens: [
              "Obras e reformas (orçadas separadamente)",
              "Taxas bancárias e emolumentos cartoriais",
              "Despesas com ações judiciais (honorários e custas)",
            ],
          },
        ].map((sec) => (
          <View key={sec.titulo} style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: NAVY, marginBottom: 8 }}>
              {sec.titulo}
            </Text>
            {sec.itens.map((item) => (
              <FeatureRow key={item} text={item} />
            ))}
          </View>
        ))}
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 11 — PRÓXIMOS PASSOS
   ================================================================ */
function PagePassos({ pg, total }: { pg: number; total: number }) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Próximos Passos" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Próximos Passos
        </Text>
        <Text style={{ fontSize: 9.5, color: GRAY_700, lineHeight: 1.65, marginBottom: 28 }}>
          Iniciar uma parceria com a Alpha Condomínios é simples e rápido. Veja como funciona
          nosso processo de onboarding:
        </Text>

        <StepRow
          n={1}
          titulo="Aprovação da Proposta"
          texto="Após a análise e aprovação desta proposta, formalizamos o aceite por e-mail ou assinatura digital do documento."
        />
        <StepRow
          n={2}
          titulo="Assinatura do Contrato"
          texto="Enviamos o contrato de prestação de serviços para leitura e assinatura. Todo o processo pode ser realizado digitalmente."
        />
        <StepRow
          n={3}
          titulo="Reunião de Alinhamento"
          texto="Realizamos uma reunião de kick-off com o síndico e conselheiros para levantamento completo das necessidades e expectativas."
        />
        <StepRow
          n={4}
          titulo="Coleta de Documentação"
          texto="Nossa equipe orienta e auxilia na coleta de todos os documentos necessários para a transferência da gestão."
        />
        <StepRow
          n={5}
          titulo="Implantação do Sistema"
          texto="Configuramos nossa plataforma com os dados do condomínio e realizamos o treinamento do síndico e conselheiros."
        />
        <StepRow
          n={6}
          titulo="Início das Operações"
          texto="Assumimos oficialmente a gestão do condomínio, com acompanhamento intensivo nas primeiras semanas de operação."
        />

        <View
          style={{
            backgroundColor: NAVY,
            borderRadius: 8,
            padding: 18,
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: "bold", color: WHITE, marginBottom: 4 }}>
              Pronto para começar?
            </Text>
            <Text style={{ fontSize: 8.5, color: WHITE, opacity: 0.8, lineHeight: 1.5 }}>
              Entre em contato conosco agora mesmo e dê o primeiro passo para uma gestão
              condominial de excelência.
            </Text>
          </View>
          <View style={{ marginLeft: 16, alignItems: "center" }}>
            <Text style={{ fontSize: 8.5, color: GOLD, fontWeight: "bold" }}>
              alpha@alphacondomínios.com.br
            </Text>
          </View>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   PÁGINA 12 — CONSIDERAÇÕES FINAIS (condicional)
   ================================================================ */
function PageConsideracoes({
  pg,
  total,
  texto,
}: {
  pg: number;
  total: number;
  texto: string;
}) {
  return (
    <Page size="A4" style={{ backgroundColor: WHITE, paddingBottom: 50 }}>
      <PageHeader label="Considerações Finais" />
      <View style={{ paddingHorizontal: 50, paddingTop: 30 }}>
        <GoldDivider />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: NAVY, marginBottom: 6 }}>
          Considerações Finais
        </Text>
        <View
          style={{
            backgroundColor: GRAY_50,
            borderRadius: 6,
            padding: 20,
            borderLeftWidth: 3,
            borderLeftColor: GOLD,
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 10, color: GRAY_700, lineHeight: 1.7 }}>{texto}</Text>
        </View>
      </View>
      <PageFooter current={pg} total={total} />
    </Page>
  );
}

/* ================================================================
   CONTRACAPA
   ================================================================ */
function PageContracapa({ data }: { data: PropostaPDFData }) {
  const W = 595;
  const H = 842;
  return (
    <Page size="A4" style={{ position: "relative", backgroundColor: NAVY }}>
      <GradientVertical width={W} height={H} uid="gv-contra" />

      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 80,
        }}
      >
        <Image
          src={logoAlpha}
          style={{ width: 140, height: 70, objectFit: "contain", marginBottom: 30 }}
        />
        <View style={{ width: 40, height: 2, backgroundColor: GOLD, marginBottom: 30 }} />
        <Text
          style={{
            fontSize: 11,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.7,
            marginBottom: 40,
            opacity: 0.85,
          }}
        >
          Obrigado pela oportunidade de apresentar nossa proposta.{"\n"}
          Estamos à disposição para esclarecer quaisquer dúvidas{"\n"}
          e aguardamos seu retorno.
        </Text>

        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={{ fontSize: 8.5, color: GOLD, letterSpacing: 1.5, marginBottom: 14 }}>
            ENTRE EM CONTATO
          </Text>
          <Text style={{ fontSize: 10, color: WHITE, marginBottom: 6 }}>
            {data.contato.nome}
          </Text>
          <Text style={{ fontSize: 9.5, color: WHITE, opacity: 0.75, marginBottom: 4 }}>
            {data.contato.telefone}
          </Text>
          <Text style={{ fontSize: 9.5, color: WHITE, opacity: 0.75 }}>
            {data.contato.email}
          </Text>
        </View>

        <View style={{ width: 40, height: 2, backgroundColor: GOLD, marginBottom: 20 }} />

        <Text style={{ fontSize: 8, color: WHITE, opacity: 0.45, textAlign: "center" }}>
          Alpha Condomínios · Desde 2011{"\n"}
          {data.cidade ? `${data.cidade} · ` : ""}Proposta nº {data.numero}
        </Text>
      </View>
    </Page>
  );
}

/* ================================================================
   DOCUMENTO PRINCIPAL — CORRIGIDO
   ================================================================ */
export function PropostaPDF({ data }: { data: PropostaPDFData }) {
  const calc = calcularPlanos(data.condominio.unidades);

  // Monta array de planos no formato que PagePlano e PageComparativo esperam
  const planosAdmin = [
    {
      nome: "Essencial",
      preco: calc.essencial.tipo === "valor" ? calc.essencial.mensal : 0,
      itens: SERVICOS_PLANOS.essencial,
    },
    {
      nome: "Completo",
      preco: calc.completo.tipo === "valor" ? calc.completo.mensal : 0,
      itens: SERVICOS_PLANOS.completo,
    },
    {
      nome: "Premium",
      preco: calc.premium.tipo === "valor" ? calc.premium.mensal : 0,
      itens: SERVICOS_PLANOS.premium,
    },
  ];

  // Monta síndico no formato que PageSindico espera
  const sindicoData = {
    preco: calc.sindico.tipo === "valor" ? calc.sindico.mensal : 0,
    itens: SERVICOS_PLANOS.sindico,
    label: calc.sindico.tipo === "valor"
      ? (calc.sindico.label ?? null)
      : calc.sindico.texto,
    isConsulta: calc.sindico.tipo === "consulta",
  };

  const temConsideracoes = !!(data.consideracoesFinais && data.consideracoesFinais.trim());

  let total = 4;
  if (data.incluiAdmin) total += 4;
  if (data.incluiSindico) total += 1;
  total += 2;
  if (temConsideracoes) total += 1;
  total += 1;

  let pg = 1;

  return (
    <Document>
      <PageCapa data={data} />
      <PageQuemSomos pg={++pg} total={total} />
      <PageDiferenciais pg={++pg} total={total} />
      <PageServicos pg={++pg} total={total} />

      {data.incluiAdmin && (
        <>
          <PagePlano pg={++pg} total={total} plano={planosAdmin[0]} unidades={data.condominio.unidades} />
          <PagePlano pg={++pg} total={total} plano={planosAdmin[1]} unidades={data.condominio.unidades} />
          <PagePlano pg={++pg} total={total} plano={planosAdmin[2]} unidades={data.condominio.unidades} />
          <PageComparativo pg={++pg} total={total} planos={planosAdmin} />
        </>
      )}

      {data.incluiSindico && (
        <PageSindico
          pg={++pg}
          total={total}
          sindico={sindicoData}
          unidades={data.condominio.unidades}
        />
      )}

      <PageCondicoes pg={++pg} total={total} />
      <PagePassos pg={++pg} total={total} />

      {temConsideracoes && (
        <PageConsideracoes pg={++pg} total={total} texto={data.consideracoesFinais!} />
      )}

      <PageContracapa data={data} />
    </Document>
  );
}
