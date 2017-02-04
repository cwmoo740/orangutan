const regexes = [
    {regex: /realDonaldTrump/g, string: 'realOrangutan'},
    {regex: /donaldjtrump/g},
    {regex: /[Tt]he(\s|_)[Dd]onald/g, string: 'the$1orangutan'},
    {regex: /\b[Pp]resident\s[Tt]rump\b/g},
    {regex: /\b[Pp]resident\s[Dd]onald\s[Tt]rump\b/g},
    {regex: /\b[Dd]onald\s[Jj]ohn\s[Tt]rump\b/g, string: 'Orangutan John Orangutan'},
    {regex: /\b[Dd]onald\s[Jj]\.?\s[Tt]rump\b/g, string: 'Orangutan J. Orangutan'},
    {regex: /\b[Dd]onald(\s|_|-)[Tt]rump\b/g, string: 'the$1Orangutan'},
    {regex: /\b([Mm]r\.?|[Mm]ister)\s([Dd]onald|[Tt]rump|[Dd]onald\b[Tt]rump)/g, string: '$1 Orangutan'},
    {regex: /\b[Dd]onald\b/g},
    {regex: /\b[Tt]rump\b/g},
    {regex: /(?:^|([.!?]\s))(?:the ([Oo]rangutan))/g, string: '$1The $2'},
    {regex: /\b([Aa])(\s)([Oo]rangutan)/g, string: '$1n$2$3'}
];

function trump(value) {
    return regexes.reduce((res, {regex, string = 'the Orangutan'}) => res.replace(regex, string), value);
}

function flattenableFilter(node) {
    if (flattenable(node)) {
        return NodeFilter.FILTER_ACCEPT;
    } else {
        return NodeFilter.FILTER_SKIP;
    }
}

const textHolders = ['SPAN', 'P', 'H1', 'H2', 'H3', 'H4'];
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
        regexes.some(({regex}) => regex.test(node.textContent));
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
    const flattener = document.createTreeWalker(node, NodeFilter.SHOW_ALL, flattenableFilter, false);
    while (flattener.nextNode()) {
        flatten(flattener.currentNode);
    }
    const textWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (textWalker.nextNode()) {
        textWalker.currentNode.nodeValue = trump(textWalker.currentNode.nodeValue);
    }
}

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

