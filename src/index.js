import conf from "./conf.js";
import help from "./help.js";
import api from "./api.js";

const { categories } = help;
const {
  mapkey,
  map,
  // aceVimMapKey,
  addVimMapKey,
  vmap,
  unmap,
  Clipboard,
  Front,
  removeSearchAlias,
  addSearchAlias,
} = api;

const registerKey = (domain, mapObj, siteleader) => {
  const {
    alias,
    callback,
    leader = domain === "global" ? "" : siteleader,
    category = categories.misc,
    description = "",
    path = "(/.*)?",
  } = mapObj;
  const opts = {};

  const key = `${leader}${alias}`;

  if (domain !== "global") {
    const d = domain.replace(".", "\\.");
    opts.domain = new RegExp(`^http(s)?://(([a-zA-Z0-9-_]+\\.)*)(${d})${path}`);
  }

  const fullDescription = `#${category} ${description}`;

  if (typeof mapObj.map !== "undefined") {
    map(alias, mapObj.map);
  } else {
    mapkey(key, fullDescription, callback, opts);
  }
};

const registerKeys = (maps, aliases, siteleader) => {
  const hydratedAliases = Object.entries(aliases).flatMap(
    ([baseDomain, aliasDomains]) =>
      aliasDomains.flatMap((a) => ({ [a]: maps[baseDomain] })),
  );

  const mapsAndAliases = Object.assign({}, maps, ...hydratedAliases);

  Object.entries(mapsAndAliases).forEach(([domain, domainMaps]) =>
    domainMaps.forEach((mapObj) => registerKey(domain, mapObj, siteleader))
  );
};

const registerSearchEngines = (searchEngines, searchleader) =>
  Object.values(searchEngines).forEach((s) => {
    const options = {
      favicon_url: s.favicon,
      skipMaps: true,
    };
    addSearchAlias(
      s.alias,
      s.name,
      s.search,
      "",
      s.compl,
      s.callback,
      undefined,
      options,
    );
    mapkey(
      `${searchleader}${s.alias}`,
      `#8搜索 ${s.name}`,
      () => Front.openOmnibar({ type: "SearchEngine", extra: s.alias }),
    );
    mapkey(
      `c${searchleader}${s.alias}`,
      `#8Search ${s.name} with clipboard contents`,
      () => {
        Clipboard.read((c) => {
          Front.openOmnibar({
            type: "SearchEngine",
            pref: c.data,
            extra: s.alias,
          });
        });
      },
    );
  });




const userKeys = () => {
  vmap("i", "k");
  vmap("k", "j");
  vmap("j", "h");
  vmap("J", "0");
  vmap("L", "$");

  addVimMapKey(
    { keys: 'h', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
    { keys: 'i', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, linewise: true }},
    { keys: 'k', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, linewise: true }},
    { keys: 'j', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: false }},
    { keys: 'l', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: true }},
    { keys: 'J', type: 'motion', motion: 'moveToStartOfLine' },
    { keys: 'L', type: 'motion', motion: 'moveToEol', motionArgs: { inclusive: true }},
  );

  api.aceVimMap('<C-u>', '<Esc>d0xh', 'insert');
  // var defaultKeymap = [
  //   // Key to key mapping. This goes first to make it possible to override
  //   // existing mappings.
  //   { keys: '<Left>', type: 'keyToKey', toKeys: 'h' },
  //   { keys: '<Right>', type: 'keyToKey', toKeys: 'l' },
  //   { keys: '<Up>', type: 'keyToKey', toKeys: 'k' },
  //   { keys: '<Down>', type: 'keyToKey', toKeys: 'j' },
  //   { keys: '<Space>', type: 'keyToKey', toKeys: 'l' },
  //   { keys: '<BS>', type: 'keyToKey', toKeys: 'h', context: 'normal'},
  //   { keys: '<Del>', type: 'keyToKey', toKeys: 'x', context: 'normal'},
  //   { keys: '<C-Space>', type: 'keyToKey', toKeys: 'W' },
  //   { keys: '<C-BS>', type: 'keyToKey', toKeys: 'B', context: 'normal' },
  //   { keys: '<S-Space>', type: 'keyToKey', toKeys: 'w' },
  //   { keys: '<S-BS>', type: 'keyToKey', toKeys: 'b', context: 'normal' },
  //   { keys: '<C-n>', type: 'keyToKey', toKeys: 'j' },
  //   { keys: '<C-p>', type: 'keyToKey', toKeys: 'k' },
  //   { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>' },
  //   { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>' },
  //   { keys: '<C-[>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
  //   { keys: '<C-c>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
  //   { keys: '<C-Esc>', type: 'keyToKey', toKeys: '<Esc>' }, // ace_patch ipad keyboard sends C-Esc instead of C-[
  //   { keys: '<C-Esc>', type: 'keyToKey', toKeys: '<Esc>', context: 'insert' },
  //   { keys: 's', type: 'keyToKey', toKeys: 'cl', context: 'normal' },
  //   { keys: 's', type: 'keyToKey', toKeys: 'c', context: 'visual'},
  //   { keys: 'S', type: 'keyToKey', toKeys: 'cc', context: 'normal' },
  //   { keys: 'S', type: 'keyToKey', toKeys: 'VdO', context: 'visual' },
  //   { keys: '<Home>', type: 'keyToKey', toKeys: '0' },
  //   { keys: '<End>', type: 'keyToKey', toKeys: '$' },
  //   { keys: '<PageUp>', type: 'keyToKey', toKeys: '<C-b>' },
  //   { keys: '<PageDown>', type: 'keyToKey', toKeys: '<C-f>' },
  //   { keys: '<CR>', type: 'keyToKey', toKeys: 'j^', context: 'normal' },
  //   { keys: '<Ins>', type: 'keyToKey', toKeys: 'i', context: 'normal'},
  //   { keys: '<Ins>', type: 'action', action: 'toggleOverwrite', context: 'insert' },
  //   // Motions
  //   { keys: 'H', type: 'motion', motion: 'moveToTopLine', motionArgs: { linewise: true, toJumplist: true }},
  //   { keys: 'M', type: 'motion', motion: 'moveToMiddleLine', motionArgs: { linewise: true, toJumplist: true }},
  //   { keys: 'L', type: 'motion', motion: 'moveToBottomLine', motionArgs: { linewise: true, toJumplist: true }},
  //   { keys: 'h', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: false }},
  //   { keys: 'l', type: 'motion', motion: 'moveByCharacters', motionArgs: { forward: true }},
  //   { keys: 'j', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, linewise: true }},
  //   { keys: 'k', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, linewise: true }},
  //   { keys: 'gj', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: true }},
  //   { keys: 'gk', type: 'motion', motion: 'moveByDisplayLines', motionArgs: { forward: false }},
  //   { keys: 'w', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false }},
  //   { keys: 'W', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: false, bigWord: true }},
  //   { keys: 'e', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, inclusive: true }},
  //   { keys: 'E', type: 'motion', motion: 'moveByWords', motionArgs: { forward: true, wordEnd: true, bigWord: true, inclusive: true }},
  //   { keys: 'b', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }},
  //   { keys: 'B', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false, bigWord: true }},
  //   { keys: 'ge', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, inclusive: true }},
  //   { keys: 'gE', type: 'motion', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: true, bigWord: true, inclusive: true }},
  //   { keys: '{', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: false, toJumplist: true }},
  //   { keys: '}', type: 'motion', motion: 'moveByParagraph', motionArgs: { forward: true, toJumplist: true }},
  //   { keys: '(', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: false }},
  //   { keys: ')', type: 'motion', motion: 'moveBySentence', motionArgs: { forward: true }},
  //   { keys: '<C-f>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: true }},
  //   { keys: '<C-b>', type: 'motion', motion: 'moveByPage', motionArgs: { forward: false }},
  //   { keys: '<C-d>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: true, explicitRepeat: true }},
  //   { keys: '<C-u>', type: 'motion', motion: 'moveByScroll', motionArgs: { forward: false, explicitRepeat: true }},
  //   { keys: 'gg', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: false, explicitRepeat: true, linewise: true, toJumplist: true }},
  //   { keys: 'G', type: 'motion', motion: 'moveToLineOrEdgeOfDocument', motionArgs: { forward: true, explicitRepeat: true, linewise: true, toJumplist: true }},
  //   { keys: '0', type: 'motion', motion: 'moveToStartOfLine' },
  //   { keys: '^', type: 'motion', motion: 'moveToFirstNonWhiteSpaceCharacter' },
  //   { keys: '+', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true }},
  //   { keys: '-', type: 'motion', motion: 'moveByLines', motionArgs: { forward: false, toFirstChar:true }},
  //   { keys: '_', type: 'motion', motion: 'moveByLines', motionArgs: { forward: true, toFirstChar:true, repeatOffset:-1 }},
  //   { keys: '$', type: 'motion', motion: 'moveToEol', motionArgs: { inclusive: true }},
  //   { keys: '%', type: 'motion', motion: 'moveToMatchedSymbol', motionArgs: { inclusive: true, toJumplist: true }},
  //   { keys: 'f<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: true , inclusive: true }},
  //   { keys: 'F<character>', type: 'motion', motion: 'moveToCharacter', motionArgs: { forward: false }},
  //   { keys: 't<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: true, inclusive: true }},
  //   { keys: 'T<character>', type: 'motion', motion: 'moveTillCharacter', motionArgs: { forward: false }},
  //   { keys: ';', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: true }},
  //   { keys: ',', type: 'motion', motion: 'repeatLastCharacterSearch', motionArgs: { forward: false }},
  //   { keys: '\'<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true, linewise: true}},
  //   { keys: '`<character>', type: 'motion', motion: 'goToMark', motionArgs: {toJumplist: true}},
  //   { keys: ']`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true } },
  //   { keys: '[`', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false } },
  //   { keys: ']\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: true, linewise: true } },
  //   { keys: '[\'', type: 'motion', motion: 'jumpToMark', motionArgs: { forward: false, linewise: true } },
  //   // the next two aren't motions but must come before more general motion declarations
  //   { keys: ']p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true, matchIndent: true}},
  //   { keys: '[p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true, matchIndent: true}},
  //   { keys: ']<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: true, toJumplist: true}},
  //   { keys: '[<character>', type: 'motion', motion: 'moveToSymbol', motionArgs: { forward: false, toJumplist: true}},
  //   { keys: '|', type: 'motion', motion: 'moveToColumn'},
  //   { keys: 'o', type: 'motion', motion: 'moveToOtherHighlightedEnd', context:'visual'},
  //   { keys: 'O', type: 'motion', motion: 'moveToOtherHighlightedEnd', motionArgs: {sameLine: true}, context:'visual'},
  //   // Operators
  //   { keys: 'd', type: 'operator', operator: 'delete' },
  //   { keys: 'y', type: 'operator', operator: 'yank' },
  //   { keys: 'c', type: 'operator', operator: 'change' },
  //   { keys: '=', type: 'operator', operator: 'indentAuto' },
  //   { keys: '>', type: 'operator', operator: 'indent', operatorArgs: { indentRight: true }},
  //   { keys: '<', type: 'operator', operator: 'indent', operatorArgs: { indentRight: false }},
  //   { keys: 'g~', type: 'operator', operator: 'changeCase' },
  //   { keys: 'gu', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, isEdit: true },
  //   { keys: 'gU', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, isEdit: true },
  //   { keys: 'n', type: 'motion', motion: 'findNext', motionArgs: { forward: true, toJumplist: true }},
  //   { keys: 'N', type: 'motion', motion: 'findNext', motionArgs: { forward: false, toJumplist: true }},
  //   { keys: 'gn', type: 'motion', motion: 'findAndSelectNextInclusive', motionArgs: { forward: true }},
  //   { keys: 'gN', type: 'motion', motion: 'findAndSelectNextInclusive', motionArgs: { forward: false }},
  //   // Operator-Motion dual commands
  //   { keys: 'x', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorMotionArgs: { visualLine: false }},
  //   { keys: 'X', type: 'operatorMotion', operator: 'delete', motion: 'moveByCharacters', motionArgs: { forward: false }, operatorMotionArgs: { visualLine: true }},
  //   { keys: 'D', type: 'operatorMotion', operator: 'delete', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
  //   { keys: 'D', type: 'operator', operator: 'delete', operatorArgs: { linewise: true }, context: 'visual'},
  //   { keys: 'Y', type: 'operatorMotion', operator: 'yank', motion: 'expandToLine', motionArgs: { linewise: true }, context: 'normal'},
  //   { keys: 'Y', type: 'operator', operator: 'yank', operatorArgs: { linewise: true }, context: 'visual'},
  //   { keys: 'C', type: 'operatorMotion', operator: 'change', motion: 'moveToEol', motionArgs: { inclusive: true }, context: 'normal'},
  //   { keys: 'C', type: 'operator', operator: 'change', operatorArgs: { linewise: true }, context: 'visual'},
  //   { keys: '~', type: 'operatorMotion', operator: 'changeCase', motion: 'moveByCharacters', motionArgs: { forward: true }, operatorArgs: { shouldMoveCursor: true }, context: 'normal'},
  //   { keys: '~', type: 'operator', operator: 'changeCase', context: 'visual'},
  //   // { keys: '<C-u>', type: 'operatorMotion', operator: 'delete', motion: 'moveToStartOfLine', context: 'insert' },
  //   { keys: '<C-w>', type: 'operatorMotion', operator: 'delete', motion: 'moveByWords', motionArgs: { forward: false, wordEnd: false }, context: 'insert' },
  //   //ignore C-w in normal mode
  //   { keys: '<C-w>', type: 'idle', context: 'normal' },
  //   // Actions
  //   { keys: '<C-i>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: true }},
  //   { keys: '<C-o>', type: 'action', action: 'jumpListWalk', actionArgs: { forward: false }},
  //   { keys: '<C-e>', type: 'action', action: 'scroll', actionArgs: { forward: true, linewise: true }},
  //   { keys: '<C-y>', type: 'action', action: 'scroll', actionArgs: { forward: false, linewise: true }},
  //   { keys: 'a', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'charAfter' }, context: 'normal' },
  //   { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'eol' }, context: 'normal' },
  //   { keys: 'A', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'endOfSelectedArea' }, context: 'visual' },
  //   { keys: 'i', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'inplace' }, context: 'normal' },
  //   { keys: 'gi', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'lastEdit' }, context: 'normal' },
  //   { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'firstNonBlank'}, context: 'normal' },
  //   { keys: 'gI', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'bol'}, context: 'normal' },
  //   { keys: 'I', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { insertAt: 'startOfSelectedArea' }, context: 'visual' },
  //   { keys: 'o', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: true }, context: 'normal' },
  //   { keys: 'O', type: 'action', action: 'newLineAndEnterInsertMode', isEdit: true, interlaceInsertRepeat: true, actionArgs: { after: false }, context: 'normal' },
  //   { keys: 'v', type: 'action', action: 'toggleVisualMode' },
  //   { keys: 'V', type: 'action', action: 'toggleVisualMode', actionArgs: { linewise: true }},
  //   { keys: '<C-v>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
  //   { keys: '<C-q>', type: 'action', action: 'toggleVisualMode', actionArgs: { blockwise: true }},
  //   { keys: 'gv', type: 'action', action: 'reselectLastSelection' },
  //   { keys: 'J', type: 'action', action: 'joinLines', isEdit: true },
  //   { keys: 'gJ', type: 'action', action: 'joinLines', actionArgs: { keepSpaces: true }, isEdit: true },
  //   { keys: 'p', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: true, isEdit: true }},
  //   { keys: 'P', type: 'action', action: 'paste', isEdit: true, actionArgs: { after: false, isEdit: true }},
  //   { keys: 'r<character>', type: 'action', action: 'replace', isEdit: true },
  //   { keys: '@<character>', type: 'action', action: 'replayMacro' },
  //   { keys: 'q<character>', type: 'action', action: 'enterMacroRecordMode' },
  //   // Handle Replace-mode as a special case of insert mode.
  //   { keys: 'R', type: 'action', action: 'enterInsertMode', isEdit: true, actionArgs: { replace: true }, context: 'normal'},
  //   { keys: 'R', type: 'operator', operator: 'change', operatorArgs: { linewise: true, fullLine: true }, context: 'visual', exitVisualBlock: true},
  //   { keys: 'u', type: 'action', action: 'undo', context: 'normal' },
  //   { keys: 'u', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: true}, context: 'visual', isEdit: true },
  //   { keys: 'U', type: 'operator', operator: 'changeCase', operatorArgs: {toLower: false}, context: 'visual', isEdit: true },
  //   { keys: '<C-r>', type: 'action', action: 'redo' },
  //   { keys: 'm<character>', type: 'action', action: 'setMark' },
  //   { keys: '"<character>', type: 'action', action: 'setRegister' },
  //   { keys: 'zz', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }},
  //   { keys: 'z.', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'center' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
  //   { keys: 'zt', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }},
  //   { keys: 'z<CR>', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'top' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
  //   { keys: 'z-', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }},
  //   { keys: 'zb', type: 'action', action: 'scrollToCursor', actionArgs: { position: 'bottom' }, motion: 'moveToFirstNonWhiteSpaceCharacter' },
  //   { keys: '.', type: 'action', action: 'repeatLastEdit' },
  //   { keys: '<C-a>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: true, backtrack: false}},
  //   { keys: '<C-x>', type: 'action', action: 'incrementNumberToken', isEdit: true, actionArgs: {increase: false, backtrack: false}},
  //   { keys: '<C-t>', type: 'action', action: 'indent', actionArgs: { indentRight: true }, context: 'insert' },
  //   { keys: '<C-d>', type: 'action', action: 'indent', actionArgs: { indentRight: false }, context: 'insert' },
  //   // Text object motions
  //   { keys: 'a<character>', type: 'motion', motion: 'textObjectManipulation' },
  //   { keys: 'i<character>', type: 'motion', motion: 'textObjectManipulation', motionArgs: { textObjectInner: true }},
  //   // Search
  //   { keys: '/', type: 'search', searchArgs: { forward: true, querySrc: 'prompt', toJumplist: true }},
  //   { keys: '?', type: 'search', searchArgs: { forward: false, querySrc: 'prompt', toJumplist: true }},
  //   { keys: '*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
  //   { keys: '#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', wholeWordOnly: true, toJumplist: true }},
  //   { keys: 'g*', type: 'search', searchArgs: { forward: true, querySrc: 'wordUnderCursor', toJumplist: true }},
  //   { keys: 'g#', type: 'search', searchArgs: { forward: false, querySrc: 'wordUnderCursor', toJumplist: true }},
  //   // Ex command
  //   { keys: ':', type: 'ex' }
  // ];

};








const main = async () => {
  window.surfingKeys = api;
  if (conf.settings) {
    Object.assign(
      settings,
      typeof conf.settings === "function" ? conf.settings() : conf.settings,
    );
  }

  if (conf.logLevels) {
    await chrome.storage.local.set({
      logLevels: conf.logLevels,
    });
  }

  if (conf.keys && conf.keys.unmaps) {
    const { unmaps } = conf.keys;
    if (unmaps.mappings) {
      unmaps.mappings.forEach((m) => unmap(m));
    }
    if (unmaps.searchAliases) {
      Object.entries(unmaps.searchAliases).forEach(([leader, items]) => {
        items.forEach((v) => removeSearchAlias(v, leader));
      });
    }
  }

  if (conf.searchEngines) {
    registerSearchEngines(conf.searchEngines, conf.searchleader ?? "o");
  }

  if (conf.keys && conf.keys.maps) {
    const { keys } = conf;
    const { maps, aliases = {} } = keys;
    registerKeys(maps, aliases, conf.siteleader);
  }
  userKeys();
};

if (typeof window !== "undefined") {
  main();
}
