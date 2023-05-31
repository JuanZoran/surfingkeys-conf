export default `
  :root {
      --theme-ace-bg-no-trans:#181825d9;
      --theme-ace-bg:#18182599; /*Note the fourth channel, this adds transparency*/
      --theme-ace-bg-accent:#ffffff99;
      --theme-ace-fg:#74c7ec;
      --theme-ace-fg-accent:#c61ad9;
      --theme-ace-cursor:#599eff99;
      --theme-ace-select:#89b4fa79;
  }
  #sk_editor {
      height: 50% !important; /*Remove this to restore the default editor size*/
      background: var(--theme-ace-bg) !important;
  }
  .ace-chrome .ace_print-margin, .ace_gutter, .ace_gutter-cell, .ace_dialog{
      background: var(--theme-ace-bg-accent) !important;
  }
  .ace_dialog-bottom{
      border-top: 1px solid var(--theme-ace-bg) !important;
  }
  .ace-chrome{
      color: var(--theme-ace-fg) !important;
  }
  .ace_gutter, .ace_dialog {
      color: var(--theme-ace-fg-accent) !important;
  }
  .normal-mode .ace_cursor{
      color: var(--theme-ace-bg) !important;
      background: var(--theme-ace-cursor) !important;
      border: var(--theme-ace-fg-accent) !important;
  }
  .ace_marker-layer .ace_selection {
      background: var(--theme-ace-select) !important;
  }
  body {
    font-family: "JetBrainsMono Nerd Font", "得意黑", sans-serif;
    font-size: 12pt;
  }

  #sk_keystroke kbd {
    font-family: "Sudo Nerd Font Mono", "Sudo Mono", "Sudo",
      "Input Mono Nerd Font", "Input Mono", "DejaVu Sans Mono", "DejaVu", "Arial",
      sans-serif;
    font-size: 10pt;
  }

  #sk_omnibarSearchArea {
    margin: 0 !important;
    padding: 0.5rem 1rem !important;
    border-bottom: none !important;
  }

  #sk_omnibarSearchResult {
    margin: 0 !important;
  }

  #sk_omnibar li {
    background: none !important;
    padding: 0.35rem 0.5rem !important;
  }

  #sk_omnibarSearchResult > ul:nth-child(1) {
    margin-bottom: 0px !important;
    padding: 0 !important;
    padding-bottom: 10px !important;
  }

  #sk_omnibar .separator {
    padding-left: 8px !important;
  }

  body {
    color: #d7b0ff;
  }

  #sk_omnibar {
    background-color: var(--theme-ace-bg-no-trans);
    color: var(--theme-ace-fg);
  }

  #sk_omnibar .prompt {
    color: #eef5fb !important;
  }

  #sk_omnibar .separator {
    color: #8af4ff !important;
    padding-left: 8px !important;
  }

  #sk_omnibar input {
    color: white !important;
  }

  #sk_omnibarSearchResult {
    border-top: 1px solid #545f6f !important;
  }

  #sk_omnibar li.focused {
    background: #181d24 !important;
    color: #eef5fb !important;
  }

  #sk_banner,
  #sk_keystroke {
    border: 1px solid #d7b0ff;
    background: #483270;
  }

  #sk_keystroke .annotation {
    color: #d7b0ff;
  }

  #sk_keystroke kbd {
    color: #fff;
    background: #7a57a4;
    border: 1px solid #2d0080;
    box-shadow: none;
  }

  #sk_keystroke kbd .candidates {
    color: #ff8cf8;
  }
`;

/* Disable RichHints CSS animation */
// .expandRichHints {
//   animation: none;
// }
// .collapseRichHints {
//   animation: none;
// }
