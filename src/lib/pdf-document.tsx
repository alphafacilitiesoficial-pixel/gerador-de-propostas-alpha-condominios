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
  formatPlano,
  formatSindico,
  aplicarDescontoCombo,
  formatBRL,
  SERVICOS_PLANOS,
} from "./calculations";
import logoAlpha from "../assets/logo-alpha.png";

/* ================================================================
   CORES (Brand)
   ================================================================ */
const NAVY = "#1B2A4A";
const NAVY_DARK = "#0F1B33";
const GOLD = "#C8A961";
const GOLD_LIGHT = "#E5D4A1";
const WHITE = "#FFFFFF";
const GRAY_50 = "#F7F8FA";
const GRAY_100 = "#EFF1F5";
const GRAY_200 = "#E5E7EB";
const GRAY_300 = "#CBD0DA";
const GRAY_500 = "#6B7280";
const GRAY_600 = "#4B5563";
const GRAY_700 = "#374151";
const TEXT_COLOR = "#111827";

/* ================================================================
   ÍCONES SVG
   ================================================================ */
function IconChart({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 14h4v7H3zM10 8h4v13h-4zM17 3h4v18h-4z" fill={color} />
    </Svg>
  );
}

function IconMonitor({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M2 3h20v14H2V3zm2 2v10h16V5H4zm5 14h6v2H9v-2z" fill={color} />
    </Svg>
  );
}

function IconPeople({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM2 20c0-4 3.5-6 7-6s7 2 7 6H2zM17 6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 14c2 1 3 3 3 6h-4c0-2.5-1-4.5-3-5.5a6 6 0 0 1 4-.5z" fill={color} />
    </Svg>
  );
}

function IconShield({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z" fill={color} />
    </Svg>
  );
}

function IconMoney({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-1c-1.5-.2-2.8-1-3.2-2.2l1.5-.6c.3.9 1.1 1.3 2.2 1.3 1.2 0 2-.5 2-1.3 0-.8-.5-1.2-2-1.6-1.8-.5-3.2-1-3.2-2.8 0-1.3 1-2.3 2.7-2.6V7h2v1c1.3.2 2.2.9 2.6 2l-1.5.6c-.3-.7-.9-1.1-1.8-1.1-1 0-1.7.5-1.7 1.2 0 .7.6 1 2 1.4 1.9.5 3.2 1.1 3.2 3 0 1.4-1.1 2.4-2.8 2.7V17z" fill={color} />
    </Svg>
  );
}

function IconCheckCircle({ color = GOLD, size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L9 14.17l7.59-7.59L18 8l-8 9z" fill={color} />
    </Svg>
  );
}

/* ================================================================
   FOOTER — render fixo, recebe número da página como prop
   ================================================================ */
function Footer({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 50,
        right: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 8,
        borderTopWidth: 0.5,
        borderTopColor: GRAY_300,
      }}
      fixed
    >
      <Text style={{ fontSize: 8, color: GRAY_500 }}>
        Proposta Comercial · Alpha Condomínios
      </Text>
      <Text style={{ fontSize: 8, color: NAVY, fontWeight: 700, letterSpacing: 1 }}>
        {pageNumber} / {totalPages}
      </Text>
    </View>
  );
}

/* ================================================================
   ESTILOS
   ================================================================ */
const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: TEXT_COLOR,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: WHITE,
  },
  pageNavy: {
    fontSize: 10,
    color: WHITE,
    backgroundColor: NAVY,
    padding: 0,
    justifyContent: "center",
  },
  badge: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 2,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  badgeNavy: {
    fontSize: 8,
    color: NAVY,
    letterSpacing: 2,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: {
    fontSize: 24,
    fontWeight: 800,
    color: NAVY,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  h1White: {
    fontSize: 28,
    fontWeight: 800,
    color: WHITE,
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 1.15,
  },
  h2: {
    fontSize: 15,
    fontWeight: 700,
    color: NAVY,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10.5,
    color: GRAY_500,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  paragraph: {
    fontSize: 10,
    color: GRAY_700,
    lineHeight: 1.65,
    marginBottom: 8,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: GOLD,
    marginBottom: 16,
  },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  card: { width: "50%", padding: 6 },
  cardInner: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY_100,
    borderRadius: 8,
    padding: 14,
    minHeight: 120,
  },
  cardIconWrap: { marginBottom: 8 },
  cardTitle: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  cardText: { fontSize: 8.5, color: GRAY_700, lineHeight: 1.5 },
  planoCard: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: NAVY,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  planoCardPremium: { borderColor: GOLD, borderWidth: 2 },
  planoHeader: { marginBottom: 12 },
  planoTitulo: { fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 4 },
  planoSubtitulo: { fontSize: 10, color: GRAY_500, marginBottom: 10 },
  planoIdealPara: { fontSize: 10, color: GRAY_700, fontWeight: 600, marginBottom: 4 },
  planoIdealTexto: { fontSize: 9.5, color: GRAY_600, lineHeight: 1.5 },
  planoFeatures: { marginVertical: 12 },
  featureItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  featureCheck: { width: 14, height: 14, backgroundColor: GOLD, borderRadius: 7, marginRight: 8, marginTop: 2 },
  featureText: { fontSize: 9.5, color: GRAY_700, flex: 1, lineHeight: 1.5 },
  planoFooter: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: GRAY_200 },
  planoValorLabel: { fontSize: 9, color: GRAY_500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  planoValor: { fontSize: 22, fontWeight: 800, color: NAVY },
  planoValorPorUnidade: { fontSize: 9.5, color: GRAY_500, marginTop: 4 },
  servicoItem: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: GRAY_100 },
  servicoTitulo: { fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 },
  servicoTexto: { fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: GRAY_300, paddingVertical: 8 },
  tableHeaderRow: { backgroundColor: NAVY, paddingVertical: 10, flexDirection: "row" },
  tableCell: { flex: 1, fontSize: 8.5, color: TEXT_COLOR, paddingHorizontal: 6 },
  tableHeaderCell: { flex: 1, fontSize: 8.5, color: WHITE, fontWeight: 700, paddingHorizontal: 6 },
  tableCellCenter: { textAlign: "center" },
  condicoesGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  condicaoItem: { width: "50%", padding: 6 },
  condicaoCard: { backgroundColor: GRAY_50, padding: 14, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: GOLD },
  condicaoTitulo: { fontSize: 10.5, fontWeight: 700, color: NAVY, marginBottom: 6 },
  condicaoTexto: { fontSize: 9, color: GRAY_700, lineHeight: 1.5 },
  stepItem: { flexDirection: "row", marginBottom: 20 },
  stepNumero: { width: 36, fontSize: 22, fontWeight: 800, color: GOLD, marginRight: 14 },
  stepConteudo: { flex: 1 },
  stepTitulo: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 4 },
  stepTexto: { fontSize: 9.5, color: GRAY_700, lineHeight: 1.55 },
  ctaBox: {
    backgroundColor: NAVY,
    padding: 20,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 13,
    fontWeight: 700,
    color: WHITE,
    marginBottom: 8,
    textAlign: "center",
  },
  ctaContato: {
    fontSize: 10,
    color: GOLD_LIGHT,
    textAlign: "center",
    lineHeight: 1.6,
  },
});

/* ================================================================
   COMPONENTE PRINCIPAL
   ================================================================ */
export function PropostaDocument({
  numero,
  data,
  condominio,
  contato,
  incluiAdmin,
  incluiSindico,
  consideracoesFinais,
}: {
  numero: string;
  data: Date | string;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}) {
  const nomeCondominio = condominio.nome;
  const endereco = condominio.endereco;
  const unidades = condominio.unidades;
  const tipo = condominio.tipo;
  const nomeContato = contato.nome;
  const telefone = contato.telefone;
  const email = contato.email;

  const calc = calcularPlanos(unidades);
  const tipoLabel =
    tipo === "residencial" ? "Residencial" : tipo === "comercial" ? "Comercial" : "Misto";
  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const temConsideracoes = !!consideracoesFinais?.trim();

  // Contagem de páginas fixa
  let totalPages = 4; // Capa + Sobre + Diferenciais + Condições + Próximos Passos = contados abaixo
  // Fixas: Capa(1) + Sobre(2) + Diferenciais(3) + Condições + PróximosPassos
  // Vamos contar certinho:
  totalPages = 3; // Capa + Sobre + Diferenciais
  if (incluiAdmin) totalPages += 5; // Serviços + Essencial + Completo + Premium + Comparativo
  if (incluiSindico) totalPages += 1; // Síndico
  totalPages += 2; // Condições + Próximos Passos
  if (temConsideracoes) totalPages += 1; // Considerações Finais

  let pageNum = 0;

  return (
    <Document>
      {/* ========== CAPA ========== */}
      <Page size="A4" style={s.pageNavy}>
        <View style={{ padding: 50, justifyContent: "space-between", height: "100%" }}>
          <View>
            <Image src={logoAlpha} style={{ width: 120, marginBottom: 40 }} />
            <Text style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontWeight: 700, marginBottom: 16 }}>
              PROPOSTA COMERCIAL
            </Text>
            <Text style={s.h1White}>{nomeCondominio}</Text>
            <Text style={{ fontSize: 13, color: GOLD_LIGHT, marginBottom: 32 }}>
              Nº {numero}
            </Text>
            <Text style={{ fontSize: 11, color: WHITE, opacity: 0.9, marginBottom: 8 }}>
              {dataFormatada}
            </Text>
          </View>
          <View style={{ backgroundColor: NAVY_DARK, padding: 20, borderRadius: 8 }}>
            <Text style={{ fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
              ENTRE EM CONTATO
            </Text>
            <Text style={{ fontSize: 11, color: WHITE, marginBottom: 6 }}>(31) 99778-7316</Text>
            <Text style={{ fontSize: 11, color: WHITE, marginBottom: 6 }}>
              comercial@alphafacilities.com.br
            </Text>
            <Text style={{ fontSize: 11, color: WHITE }}>www.alphafacilities.com.br</Text>
          </View>
        </View>
        <Footer pageNumber={++pageNum} totalPages={totalPages} />
      </Page>

      {/* ========== SOBRE NÓS ========== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>ALPHA CONDOMÍNIOS</Text>
        <Text style={s.h1}>Sobre Nós</Text>
        <View style={s.divider} />
        <Text style={s.h2}>Quem Somos</Text>
        <Text style={s.subtitle}>
          Conheça a Alpha Condomínios e nossa missão de transformar a gestão condominial.
        </Text>
        <Text style={s.paragraph}>
          A Alpha Condomínios nasceu com o propósito de profissionalizar e modernizar a administração
          de condomínios, combinando tecnologia, transparência e atendimento humanizado. Atuamos em
          Belo Horizonte e região metropolitana, atendendo condomínios residenciais, comerciais e
          mistos.
        </Text>
        <Text style={s.paragraph}>
          Nossa equipe é formada por especialistas em gestão condominial, contabilidade, direito
          imobiliário e tecnologia. Utilizamos sistemas de ponta para garantir controle financeiro
          rigoroso, comunicação eficiente e total conformidade legal.
        </Text>
        <Text style={s.paragraph}>
          Acreditamos que cada condomínio é único. Por isso, oferecemos planos flexíveis que se
          adaptam à realidade de cada empreendimento — do essencial ao premium, sempre com a mesma
          excelência.
        </Text>
        <View style={{ marginTop: 20, padding: 18, backgroundColor: NAVY, borderRadius: 8 }}>
          <Text style={{ fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
            NOSSA MISSÃO
          </Text>
          <Text style={{ fontSize: 10.5, color: WHITE, lineHeight: 1.6 }}>
            Entregar gestão condominial de excelência, com transparência, tecnologia e compromisso
            com o bem-estar dos moradores.
          </Text>
        </View>
        <Footer pageNumber={++pageNum} totalPages={totalPages} />
      </Page>

      {/* ========== POR QUE NOS ESCOLHER ========== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>POR QUE NOS ESCOLHER</Text>
        <Text style={s.h1}>Nossos Diferenciais</Text>
        <View style={s.divider} />
        <View style={s.cardGrid}>
          {[
            { Icon: IconChart, title: "Transparência Total", text: "Balancetes digitais mensais e acesso em tempo real às finanças do condomínio." },
            { Icon: IconMonitor, title: "Tecnologia de Ponta", text: "Portal do condomínio, boletos digitais e aplicativo para gestão completa." },
            { Icon: IconPeople, title: "Atendimento Humanizado", text: "Equipe dedicada com suporte ágil via WhatsApp, telefone e e-mail." },
            { Icon: IconShield, title: "Conformidade Legal", text: "Cumprimento rigoroso das obrigações fiscais, trabalhistas e condominiais." },
            { Icon: IconMoney, title: "Redução de Custos", text: "Gestão estratégica e negociação qualificada com fornecedores, gerando economia real." },
            { Icon: IconCheckCircle, title: "Excelência Comprovada", text: "Mais de 25 anos de experiência com histórico consistente de resultados." },
          ].map((item, i) => (
            <View key={i} style={s.card}>
              <View style={s.cardInner}>
                <View style={s.cardIconWrap}>
                  <item.Icon />
                </View>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>
        <Footer pageNumber={++pageNum} totalPages={totalPages} />
      </Page>

      {/* ========== SERVIÇOS (se incluir administração) ========== */}
      {incluiAdmin && (
        <Page size="A4" style={s.page} wrap>
          <Text style={s.badge}>SERVIÇOS</Text>
          <Text style={s.h1}>Nossos Serviços</Text>
          <View style={s.divider} />
          <Text style={s.subtitle}>
            Soluções completas para a administração do seu condomínio.
          </Text>
          {[
            { t: "Administração de Condomínios", d: "Gestão completa de todas as atividades administrativas, financeiras e operacionais do condomínio, com foco em eficiência e transparência." },
            { t: "Síndico Profissional", d: "Profissional qualificado e dedicado exclusivamente à gestão do condomínio, garantindo cumprimento de todas as obrigações legais. Inclui Seguro de Responsabilidade Civil (RC)." },
            { t: "Certificado Digital", d: "Emissão e gestão de certificados digitais para assinatura eletrônica de documentos, atas e contratos, com validade jurídica." },
            { t: "Seguro Condominial", d: "Contratação e gestão de apólices de seguro patrimonial, incêndio e responsabilidade civil, com análise criteriosa de coberturas." },
            { t: "AVCB", d: "Assessoria completa para obtenção e renovação do Auto de Vistoria do Corpo de Bombeiros." },
            { t: "Assessoria Jurídica", d: "Suporte jurídico especializado em direito condominial, com orientação em assembleias e resolução de conflitos." },
            { t: "Garantidora de Crédito", d: "Intermediação com empresas garantidoras para locação de unidades, reduzindo inadimplência." },
            { t: "Dentre Outros", d: "Soluções personalizadas: manutenção predial, comunicação visual, automação, sustentabilidade e muito mais." },
          ].map((srv, i) => (
            <View key={i} style={i < 7 ? s.servicoItem : { marginBottom: 0 }} wrap={false}>
              <Text style={s.servicoTitulo}>{srv.t}</Text>
              <Text style={s.servicoTexto}>{srv.d}</Text>
            </View>
          ))}
          <Footer pageNumber={++pageNum} totalPages={totalPages} />
        </Page>
      )}

      {/* ========== PLANOS (se incluir administração) ========== */}
      {incluiAdmin && (
        <>
          {/* Plano Essencial */}
          <Page size="A4" style={s.page}>
            <Text style={s.badge}>PLANO</Text>
            <View style={s.planoCard}>
              <View style={s.planoHeader}>
                <Text style={s.planoTitulo}>Essencial</Text>
                <Text style={s.planoSubtitulo}>Gestão financeira objetiva e eficiente</Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={s.planoIdealPara}>IDEAL PARA</Text>
                <Text style={s.planoIdealTexto}>
                  Condomínios que buscam organização financeira com custo acessível.
                </Text>
              </View>
              <View style={s.planoFeatures}>
                {[
                  "Emissão de boletos",
                  "Cobrança de inadimplentes",
                  "Balancete digital mensal",
                  "Portal do condômino",
                  "Suporte via WhatsApp",
                ].map((f, i) => (
                  <View key={i} style={s.featureItem}>
                    <View style={s.featureCheck} />
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={s.planoFooter}>
                <Text style={s.planoValorLabel}>INVESTIMENTO MENSAL</Text>
                <Text style={s.planoValor}>R$ {formatBRL(calc.essencial.mensal)}</Text>
                <Text style={s.planoValorPorUnidade}>
                  R$ {formatBRL(calc.essencial.mensal / unidades)} por unidade/mês
                </Text>
              </View>
            </View>
            <Footer pageNumber={++pageNum} totalPages={totalPages} />
          </Page>

          {/* Plano Completo */}
          <Page size="A4" style={s.page}>
            <Text style={s.badgeNavy}>MAIS ESCOLHIDO</Text>
            <Text style={s.badge}>PLANO</Text>
            <View style={s.planoCard}>
              <View style={s.planoHeader}>
                <Text style={s.planoTitulo}>Completo</Text>
                <Text style={s.planoSubtitulo}>Administração completa com gestão integrada</Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={s.planoIdealPara}>IDEAL PARA</Text>
                <Text style={s.planoIdealTexto}>
                  Condomínios que precisam de gestão financeira, operacional e de comunicação
                  integradas.
                </Text>
              </View>
              <View style={s.planoFeatures}>
                {[
                  "Tudo do Plano Essencial",
                  "Rateio de água e gás",
                  "Planejamento orçamentário anual",
                  "Gestão de contas a pagar",
                  "Elaboração de atas e convocações",
                  "Pagamentos online integrados",
                  "Relatórios gerenciais",
                ].map((f, i) => (
                  <View key={i} style={s.featureItem}>
                    <View style={s.featureCheck} />
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={s.planoFooter}>
                <Text style={s.planoValorLabel}>INVESTIMENTO MENSAL</Text>
                <Text style={s.planoValor}>R$ {formatBRL(calc.completo.mensal)}</Text>
                <Text style={s.planoValorPorUnidade}>
                  R$ {formatBRL(calc.completo.mensal / unidades)} por unidade/mês
                </Text>
              </View>
            </View>
            <Footer pageNumber={++pageNum} totalPages={totalPages} />
          </Page>

          {/* Plano Premium */}
          <Page size="A4" style={s.page}>
            <Text style={s.badge}>PLANO</Text>
            <View style={[s.planoCard, s.planoCardPremium]}>
              <View style={s.planoHeader}>
                <Text style={s.planoTitulo}>Premium</Text>
                <Text style={s.planoSubtitulo}>
                  Gestão completa com assessoria jurídica e atendimento prioritário
                </Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={s.planoIdealPara}>IDEAL PARA</Text>
                <Text style={s.planoIdealTexto}>
                  Condomínios que desejam o mais alto nível de gestão, com suporte jurídico e SLA.
                </Text>
              </View>
              <View style={s.planoFeatures}>
                {[
                  "Tudo do Plano Completo",
                  "Assessoria jurídica condominial",
                  "Cumprimento de obrigações fiscais",
                  "Gestão de obras e reformas",
                  "Revisão anual da convenção",
                  "Atendimento prioritário SLA 12h",
                  "Relatório trimestral de desempenho",
                ].map((f, i) => (
                  <View key={i} style={s.featureItem}>
                    <View style={s.featureCheck} />
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={s.planoFooter}>
                <Text style={s.planoValorLabel}>INVESTIMENTO MENSAL</Text>
                <Text style={s.planoValor}>{formatPlano(calc.premium)}</Text>
                {calc.premium.tipo === "valor" && (
                  <Text style={s.planoValorPorUnidade}>
                    R$ {formatBRL(calc.premium.mensal / unidades)} por unidade/mês
                  </Text>
                )}
              </View>
            </View>
            <Footer pageNumber={++pageNum} totalPages={totalPages} />
          </Page>

          {/* Comparativo de Planos */}
          <Page size="A4" style={s.page} wrap>
            <Text style={s.badge}>COMPARATIVO</Text>
            <Text style={s.h1}>Comparativo de Planos</Text>
            <View style={s.divider} />
            <Text style={s.subtitle}>Veja lado a lado o que cada plano oferece.</Text>
            <View style={s.tableHeaderRow}>
              <Text style={[s.tableHeaderCell, { flex: 2 }]}>Serviço</Text>
              <Text style={[s.tableHeaderCell, s.tableCellCenter]}>Essencial</Text>
              <Text style={[s.tableHeaderCell, s.tableCellCenter]}>Completo</Text>
              <Text style={[s.tableHeaderCell, s.tableCellCenter]}>Premium</Text>
            </View>
            {SERVICOS_PLANOS.map((srv, i) => (
              <View key={i} style={s.tableRow} wrap={false}>
                <Text
                  style={[
                    s.tableCell,
                    { flex: 2, fontWeight: srv.categoria ? 700 : 400, color: srv.categoria ? NAVY : TEXT_COLOR },
                  ]}
                >
                  {srv.nome}
                </Text>
                <Text style={[s.tableCell, s.tableCellCenter]}>{srv.essencial ? "✓" : "—"}</Text>
                <Text style={[s.tableCell, s.tableCellCenter]}>{srv.completo ? "✓" : "—"}</Text>
                <Text style={[s.tableCell, s.tableCellCenter]}>{srv.premium ? "✓" : "—"}</Text>
              </View>
            ))}
            <View style={[s.tableRow, { backgroundColor: GRAY_50 }]} wrap={false}>
              <Text style={[s.tableCell, { flex: 2, fontWeight: 700 }]}>Investimento mensal</Text>
              <Text style={[s.tableCell, s.tableCellCenter]}>
                R$ {formatBRL(calc.essencial.mensal)}/mês
              </Text>
              <Text style={[s.tableCell, s.tableCellCenter]}>
                R$ {formatBRL(calc.completo.mensal)}/mês
              </Text>
              <Text style={[s.tableCell, s.tableCellCenter]}>{formatPlano(calc.premium)}</Text>
            </View>
            <Text
              style={{ fontSize: 8, color: GRAY_500, marginTop: 14, fontStyle: "italic" }}
            >
              Valores calculados para {unidades} unidades. Sujeitos a ajuste conforme avaliação
              técnica.
            </Text>
            <Footer pageNumber={++pageNum} totalPages={totalPages} />
          </Page>
        </>
      )}

      {/* ========== SÍNDICO PROFISSIONAL (se incluir) ========== */}
      {incluiSindico && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>SERVIÇO</Text>
          <View style={s.planoCard}>
            <View style={s.planoHeader}>
              <Text style={s.planoTitulo}>Síndico Profissional</Text>
              <Text style={s.planoSubtitulo}>
                Gestão presencial com representação legal do condomínio
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={s.planoIdealPara}>IDEAL PARA</Text>
              <Text style={s.planoIdealTexto}>
                Condomínios que desejam um síndico dedicado, com experiência em gestão condominial e
                representação legal.
              </Text>
            </View>
            <View style={s.planoFeatures}>
              {[
                "Representação legal do condomínio",
                "Gestão de funcionários e fornecedores",
                "Convocação e condução de assembleias",
                "Cumprimento de obrigações trabalhistas",
                "Fiscalização de contratos e obras",
                "Atendimento aos condôminos",
                "Aplicação do regimento interno",
              ].map((f, i) => (
                <View key={i} style={s.featureItem}>
                  <View style={s.featureCheck} />
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={s.planoFooter}>
              <Text style={s.planoValorLabel}>INVESTIMENTO MENSAL — SÍNDICO</Text>
              <Text style={{ fontSize: 11, color: NAVY, fontWeight: 700, marginTop: 8 }}>
                {formatSindico(calc.sindico)}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 16,
              padding: 14,
              backgroundColor: GOLD_LIGHT,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: GOLD,
            }}
          >
            <Text style={{ fontSize: 9.5, color: NAVY, lineHeight: 1.6 }}>
              A Alpha Condomínios tem como diferencial no mercado o{" "}
              <Text style={{ fontWeight: 700 }}>
                Seguro de Responsabilidade Civil (RC) do Síndico INCLUSO
              </Text>
              . Protegemos o síndico contra riscos inerentes à função, sem custo adicional.
            </Text>
          </View>
          <Footer pageNumber={++pageNum} totalPages={totalPages} />
        </Page>
      )}

      {/* ========== CONDIÇÕES COMERCIAIS ========== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>CONDIÇÕES</Text>
        <Text style={s.h1}>Condições Comerciais</Text>
        <View style={s.divider} />
        <Text style={s.subtitle}>
          Transparência em todos os termos da nossa proposta.
        </Text>
        <View style={s.condicoesGrid}>
          {[
            { t: "Vigência", d: "Contrato de 12 meses, renovável automaticamente por igual período." },
            { t: "Pagamento", d: "Faturamento mensal via boleto bancário, com vencimento todo dia 10." },
            { t: "Reajuste", d: "Reajuste anual pelo IGPM/FGV ou índice equivalente." },
            { t: "Implantação", d: "Prazo de implantação de até 30 dias após assinatura do contrato." },
            { t: "Rescisão", d: "Rescisão sem multa após período mínimo de 12 meses, com aviso prévio de 60 dias." },
            { t: "Validade", d: "Esta proposta tem validade de 30 dias a partir da data de emissão." },
          ].map((c, i) => (
            <View key={i} style={s.condicaoItem}>
              <View style={s.condicaoCard}>
                <Text style={s.condicaoTitulo}>{c.t}</Text>
                <Text style={s.condicaoTexto}>{c.d}</Text>
              </View>
            </View>
          ))}
        </View>
        <Footer pageNumber={++pageNum} totalPages={totalPages} />
      </Page>

      {/* ========== PRÓXIMOS PASSOS + CTA ========== */}
      <Page size="A4" style={s.page}>
        <Text style={s.badge}>PRÓXIMOS PASSOS</Text>
        <Text style={s.h1}>Como Contratar</Text>
        <View style={s.divider} />
        <Text style={s.subtitle}>Simples, rápido e sem burocracia.</Text>

        {[
          { n: "1", t: "Aprovação da Proposta", d: "Analise esta proposta e, se aprovada, nos comunique para seguirmos com a formalização." },
          { n: "2", t: "Assinatura do Contrato", d: "Enviaremos o contrato digital para assinatura eletrônica. Rápido e seguro." },
          { n: "3", t: "Implantação", d: "Nossa equipe inicia o processo de implantação em até 30 dias, com acompanhamento dedicado." },
          { n: "4", t: "Gestão Ativa", d: "Seu condomínio passa a contar com toda a estrutura Alpha Condomínios para uma gestão de excelência." },
        ].map((step, i) => (
          <View key={i} style={s.stepItem}>
            <Text style={s.stepNumero}>{step.n}</Text>
            <View style={s.stepConteudo}>
              <Text style={s.stepTitulo}>{step.t}</Text>
              <Text style={s.stepTexto}>{step.d}</Text>
            </View>
          </View>
        ))}

        <View style={s.ctaBox}>
          <Text style={s.ctaText}>Pronto para transformar a gestão do seu condomínio?</Text>
          <Text style={s.ctaContato}>
            Entre em contato pelo telefone (31) 99778-7316{"\n"}ou pelo e-mail
            comercial@alphafacilities.com.br
          </Text>
        </View>

        <Footer pageNumber={++pageNum} totalPages={totalPages} />
      </Page>

      {/* ========== CONSIDERAÇÕES FINAIS (ÚLTIMA PÁGINA) ========== */}
      {temConsideracoes && (
        <Page size="A4" style={s.page}>
          <Text style={s.badge}>CONSIDERAÇÕES FINAIS</Text>
          <Text style={s.h1}>Observações Adicionais</Text>
          <View style={s.divider} />
          {consideracoesFinais!
            .trim()
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, i) => (
              <Text key={i} style={s.paragraph}>
                {line}
              </Text>
            ))}
          <Footer pageNumber={++pageNum} totalPages={totalPages} />
        </Page>
      )}
    </Document>
  );
}
