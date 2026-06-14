// Geração de PDF profissional via @react-pdf/renderer
// Mantém a API antiga: gerarPDFProposta(data).save(filename)

export interface PropostaPDFData {
  numero: string;
  data: Date;
  cidade?: string;
  condominio: { nome: string; endereco: string; unidades: number; tipo: string };
  contato: { nome: string; telefone: string; email: string };
  incluiAdmin: boolean;
  incluiSindico: boolean;
  consideracoesFinais?: string;
}

export interface PDFHandle {
  save: (filename: string) => Promise<void>;
  toBlob: () => Promise<Blob>;
}

export function gerarPDFProposta(data: PropostaPDFData): PDFHandle {
  const buildBlob = async (): Promise<Blob> => {
    try {
      const [{ pdf }, { PropostaDocument }, React] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./pdf-document"),
        import("react"),
      ]);
      const element = React.createElement(PropostaDocument, data) as any;
      const blob = await pdf(element).toBlob();
      return blob;
    } catch (err) {
      console.error("[PDF] Erro ao gerar PDF:", err);
      throw err;
    }
  };

  return {
    toBlob: buildBlob,

    async save(filename: string) {
      const blob = await buildBlob();

      // 1) Tenta Web Share API (funciona em mobile/PWA)
      const file = new File([blob], filename, { type: "application/pdf" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (_) {
          // Usuário cancelou ou API falhou — segue pro fallback
        }
      }

      // 2) Fallback: abre em nova aba
      const url = URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");

      if (!newTab) {
        // 3) Se popup bloqueado, força download tradicional
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      setTimeout(() => URL.revokeObjectURL(url), 5000);
    },
  };
}
