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
  consideracoesFinais?: string; // ALTERADO — nova prop opcional
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}
