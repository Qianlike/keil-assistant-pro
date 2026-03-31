import * as vscode from "vscode";

const c51IsrProvider = {
  provideCompletionItems(doc: vscode.TextDocument) {
    if (!doc.fileName.toLowerCase().endsWith(".c")) return undefined;

    const item = new vscode.CompletionItem(
      "isr",
      vscode.CompletionItemKind.Snippet
    );

    item.insertText = new vscode.SnippetString(
      "void ${1:isr_name}_isr() INTERRUPT(${2:vector}){${3}}"
    );

    item.detail = "Define an interrupt handler";

    return [item];
  },
};
const c51InterruptProvider = {
  provideCompletionItems(doc: vscode.TextDocument) {
    if (
      !doc.fileName.toLowerCase().endsWith(".h") &&
      !doc.fileName.toLowerCase().endsWith(".c")
    )
      return undefined;

    const item = new vscode.CompletionItem(
      "INTERRUPT",
      vscode.CompletionItemKind.Snippet
    );

    item.insertText = new vscode.SnippetString(
      `#ifndef __VSCODE_C51__
#define INTERRUPT(x) interrupt x
#else
#define INTERRUPT(x)
#endif`
    );

    item.detail = "Define an INTERRUPT macro";

    return [item];
  },
};

const providers = [
  { lang: "c", provider: c51IsrProvider, isRegistered: false },
  { lang: "c", provider: c51InterruptProvider, isRegistered: false },
];

const c51Snippets = () => {
  const disposables: vscode.Disposable[] = [];
  providers.forEach((provider) => {
    if (!provider.isRegistered) {
      const disposable = vscode.languages.registerCompletionItemProvider(
        provider.lang,
        provider.provider
      );
      disposables.push(disposable);
      provider.isRegistered = true;
    }
  });
  return disposables;
};

export { c51Snippets };
