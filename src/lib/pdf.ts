// src/lib/pdf.ts

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

      const element = React.createElement(PropostaDocument, data);
      const blob = await pdf(element as any).toBlob();
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

      const file = new File([blob], filename, { type: "application/pdf" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (_) {
          // usuário cancelou — segue pro fallback
        }
      }

      const url = URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");

      if (!newTab) {
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
