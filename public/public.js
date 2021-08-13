import  * as Martian from '/martian.js';

function preLoginAuthLink(aLoginElement, authorizeUrl) {
    aLoginElement.href = authorizeUrl;
    aLoginElement.hidden = false;
}

function welcomeMessage(welcomeMessageElement, nameElement, email) {
    welcomeMessageElement.hidden = false;
    nameElement.innerText = email;
}

function displaySiteTree(elm, pageInfo) {
    const list = document.createElement('ul');
    elm.appendChild(list);
    list.appendChild(pageNode(pageInfo));
}

function addSubpages(pageInfo) {
    const list = document.createElement('ul');
        pageInfo.subpages.forEach(subpage => {
            list.appendChild(pageNode(subpage));
        })
    return list;
}

function pageNode(pageInfo) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerText = pageInfo.title;
    a.href = pageInfo.uri;
    li.appendChild(a);
    if (pageInfo.subpages.length > 0) {
        li.appendChild(addSubpages(pageInfo));
    }
    return li;
}

/**
 * Creates a URL for API access
 * @param {string} basePath
 * @param {string} path
 * @returns {URL}
 */

function apiJsonPathHelper(basePath, path) {
    const apiUrl = new URL(path, basePath);
    apiUrl.searchParams.append('dream.out.format', 'json');
    return apiUrl;
}

function fetchOptionsAuth(options = { headers: {} }) {
    const jwtSession = JSON.parse(sessionStorage.getItem('jwt'));
    if (options && options.headers) {
        options.headers.Authorization = `${jwtSession.token_type} ${jwtSession.access_token}`;
    }
    return options;
}

async function main() {
    const configResponse = await fetch('/config.json');
    const configJson = await configResponse.json();
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
        const tokenResponse = await fetch(`/token.json?code=${params.get('code')}`);
        const tokenJson = await tokenResponse.json();
        sessionStorage.setItem('jwt', JSON.stringify(tokenJson));
        document.location.href = '/';
    } else if (sessionStorage.getItem('jwt') != null) {
        const martianSettings = new Martian.default.Settings({
            token: configJson.browserTokenKey,
            origin: "http://" + configJson.appHostname,
            host: "https://" +  configJson.hostname
        });
        const homePage = new Martian.default.Page('home', martianSettings);
        const homePageInfo = await homePage.getTree();
        displaySiteTree(document.getElementById('pageInfo'), homePageInfo);
    } else {
        preLoginAuthLink(document.getElementById('login'), configJson.authorizeUrl);
    }
}

main();
