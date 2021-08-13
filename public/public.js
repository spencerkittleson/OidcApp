import  * as Martian from '/martian.js';

function preLoginAuthLink(aLoginElement, authorizeUrl) {
    aLoginElement.href = authorizeUrl;
    aLoginElement.hidden = false;
}

function welcomeMessage(welcomeMessageElement, nameElement, email) {
    welcomeMessageElement.hidden = false;
    nameElement.innerText = email;
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
        //const apiUrl = apiJsonPathHelper(configJson.api, 'users/current');

        // Current user info request
        //const currentUser = await (await fetch(apiUrl.toString(), fetchOptionsAuth())).json();
        //welcomeMessage(document.getElementById('welcomeMessage'), document.getElementById('name'), currentUser.email);
        const martianSettings = new Martian.default.Settings({
            token: configJson.browserTokenKey,
            origin: "http://" + configJson.appHostname,
            host: "https://" +  configJson.hostname
        });
        console.log(martianSettings);
        const homePage = new Martian.default.Page('home', martianSettings);
        const homePageInfo = await homePage.getInfo();
        console.log(homePageInfo);
    } else {
        preLoginAuthLink(document.getElementById('login'), configJson.authorizeUrl);
    }
}

main();
