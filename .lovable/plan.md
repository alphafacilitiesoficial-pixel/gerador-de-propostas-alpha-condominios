## Mudanças em `src/lib/pdf-document.tsx`

### 1. Logo como Base64 (resolve "Cannot read properties of null")
- Remover linha 19: `import logoAlpha from "../assets/logo-alpha.png";`
- Adicionar logo após os imports:
  ```ts
  const logoAlpha = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  ```
  Observação: este é um pixel transparente — placeholder. Para a logo real aparecer no PDF será necessário substituir pela string base64 completa de `src/assets/logo-alpha.png` (o usuário pode gerar em base64.guru e me enviar).

### 2. Centralização e remoção de overflow vertical
- Capa (linha 320–365): trocar o `<View style={{ padding: 50, justifyContent: "space-between", height: "100%" }}>` por `<View style={{ padding: 50 }}>` (remove `height: "100%"` e `space-between` que estavam empurrando o segundo bloco para fora da página).
- Demais `<Page>` já usam `s.page` (que já tem padding 50 e não tem `justifyContent`). Confirmado que nenhum filho direto usa `height: "100%"` fora da capa, então não há outras alterações necessárias aqui.

### 3. Páginas em branco / contagem de páginas
- Linha 310: trocar `let totalPages = 5;` por `let totalPages = 4;` (a página de Considerações Finais separada deixa de existir — ver item 4).
- Linha 313: remover `if (temConsideracoes) totalPages += 1;` (não há mais página dedicada).

### 4. Considerações Finais inline na página "Próximos Passos"
- Em `<Page>` "Próximos Passos" (linha 820–868):
  - Mover o bloco `<View style={s.ctaBox}>...</View>` (linhas 857–865) para **antes** do `.map()` dos steps (linhas 826–855), logo após `<Text style={s.subtitle}>...</Text>` da linha 824.
  - Logo após o fechamento do `.map()` dos steps e antes do `<Footer>`, adicionar:
    ```tsx
    {temConsideracoes && (
      <>
        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <Text style={s.badge}>CONSIDERAÇÕES FINAIS</Text>
        </View>
        {consideracoesFinais!.trim().split("\n").filter(l => l.trim()).map((line, i) => (
          <Text key={i} style={{ ...s.paragraph, marginBottom: 8 }}>{line}</Text>
        ))}
      </>
    )}
    ```
- Remover completamente o bloco `{temConsideracoes && (<Page size="A4" style={s.page}>...</Page>)}` final (linhas 870–887).

### O que NÃO será alterado
- `calcularPlanos()` e demais imports
- Estrutura/conteúdo dos planos Essencial, Completo, Premium e Síndico
- Componente `<Footer>` e estilos do objeto `s`
- Páginas: Sobre Nós, Diferenciais, Serviços, Comparativo, Condições Comerciais

### Observação importante sobre a logo
O base64 fornecido no pedido é apenas um pixel transparente 1x1. Para que a logo Alpha real apareça no PDF, preciso da string base64 completa da imagem `src/assets/logo-alpha.png`. Posso aplicar com o placeholder agora (PDF gera sem erro, mas com logo invisível) e depois trocar pela string real quando você enviar.