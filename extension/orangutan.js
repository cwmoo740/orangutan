const regexes = [
    { regex: /realdonaldtrump/ig, string: 'realOrangutan' },
    { regex: /donaldjtrump/ig },
    { regex: /trump\.com/ig, string: 'orangutan.com' },
    { regex: /the(\W|_|\d)donald/ig, string: 'the$1orangutan' },
    { regex: /\bpresident\strump\b/ig },
    { regex: /\bpresident\sdonald\strump\b/ig },
    { regex: /\bdonald\sjohn\strump\b/ig, string: 'Orangutan John Orangutan' },
    { regex: /\bdonald\sj\.?\strump\b/ig, string: 'Orangutan J. Orangutan' },
    { regex: /\bdonald(\s|_|-)trump\b/ig, string: 'the$1Orangutan' },
    { regex: /\b(mr\.?|mister)\s(donald|trump|donald\btrump)/ig, string: '$1 Orangutan' },
    { regex: /\bthe\s(donald|trump|donald\btrump)/ig },
    { regex: /\btrump\b/ig },
    { regex: /(?:^\s?|([.!?]\s))(?:the (orangutan))/ig, string: '$1The $2' },
    { regex: /\b(a)n?(\s)(?:(?:the\s)?)(orangutan)/ig, string: '$1n$2$3' }
];

function trump(value) {
    return regexes.reduce((res, { regex, string = 'the Orangutan' }) => res.replace(regex, string), value);
}

const editorNodes = ['INPUT', 'TEXTAREA'];
const editorClasses = ['codemirror', 'CodeMirror', 'ace_editor'];
function editor(node) {
    return editorNodes.includes(node.nodeName) ||
        editorClasses.some(cls => node.classList && node.classList.contains(cls));
}

function editorFilter(node) {
    if (editor(node)) {
        return NodeFilter.FILTER_ACCEPT;
    } else {
        return NodeFilter.FILTER_SKIP;
    }
}

const ignore_class = 'orangutan_ignore';
function setIgnore(node) {
    if (!node) {
        return;
    }
    if (node.classList) {
        node.classList.add(ignore_class);
    }
    if (node.childNodes) {
        node.childNodes.forEach(child => setIgnore(child));
    }
}

function ignore(node) {
    return node && node.classList && node.classList.contains(ignore_class);
}

function flattenableFilter(node) {
    if (node.classList && node.classList.contains(ignore_class)) {
        return NodeFilter.FILTER_REJECT;
    } else if (flattenable(node)) {
        return NodeFilter.FILTER_ACCEPT;
    } else {
        return NodeFilter.FILTER_SKIP;
    }
}

const textHolders = ['SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'CITE'];
function flattenable(node) {
    return textHolders.includes(node.nodeName) &&
        node.hasChildNodes() &&
        Array.prototype.every.call(
            node.childNodes,
            child => (child.nodeName === '#text') ||
            (child.nodeName !== 'A' &&
            child.childNodes.length === 1 &&
            child.childNodes.item(0).nodeName === '#text')
        ) &&
        regexes.some(({ regex }) => regex.test(node.textContent));
}

function flatten(node) {
    const text = node.textContent;
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    const newNode = document.createTextNode(text);
    node.appendChild(newNode);
}

function walk(node) {
    const editors = document.createTreeWalker(node, NodeFilter.SHOW_ALL, editorFilter, false);
    while (editors.nextNode()) {
        setIgnore(editors.currentNode);
    }
    const flattener = document.createTreeWalker(node, NodeFilter.SHOW_ALL, flattenableFilter, false);
    while (flattener.nextNode()) {
        flatten(flattener.currentNode);
    }
    const textWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (textWalker.nextNode()) {
        if (!ignore(node.parentNode)) {
            textWalker.currentNode.nodeValue = trump(textWalker.currentNode.nodeValue);
        }
    }
}

function run() {
    walk(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.addedNodes.length || mut.type === 'characterData') {
                walk(mut.target);
            }
        });
    });

    const config = {
        attributes: false, subtree: true, childList: true, characterData: true
    };

    observer.observe(document.body, config);

    return observer;
}

let observer = null;

chrome.storage.local.get({ enabled: true }, obj => {
    if (obj.enabled) {
        observer = run();
    }
});

chrome.storage.onChanged.addListener(change => {
    if (change.hasOwnProperty('enabled') && change.enabled.newValue) {
        observer = run();
    } else if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
        observer = null;
    }
});

