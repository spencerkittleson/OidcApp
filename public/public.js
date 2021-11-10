import * as Martian from '/martian.js';

let martianSettings;

function preLoginAuthLink(aLoginElement, authorizeUrl) {
    aLoginElement.href = authorizeUrl;
    aLoginElement.hidden = false;
}
function displaySiteTree(elm, pageInfo) {
    const list = document.createElement('ul');
    elm.appendChild(list);
    list.appendChild(pageNode(pageInfo));
    var dragged;
    /* events fired on the draggable target */
    document.addEventListener('drag', function (event) {}, false);

    document.addEventListener(
        'dragstart',
        function (event) {
            dragged = event.target;
        },
        false
    );

    document.addEventListener(
        'dragover',
        function (event) {
            // prevent default to allow drop
            event.preventDefault();
        },
        false
    );

    document.addEventListener(
        'dragenter',
        function (event) {
            // highlight potential drop target when the draggable element enters it
            if (event.target.className == 'dropzone') {
                event.target.style.background = 'purple';
            }
        },
        false
    );

    document.addEventListener(
        'dragleave',
        function (event) {
            // reset background of potential drop target when the draggable element leaves it
            if (event.target.className == 'dropzone') {
                event.target.style.background = 'inherit';
            }
        },
        false
    );

    document.addEventListener(
        'drop',
        function (event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            console.log(event);
            // move dragged elem to the selected drop target
            if (event.target.className == 'dropzone') {
                dragged.parentNode.removeChild(dragged);
                event.target.appendChild(dragged);
                event.target.style.background = 'inherit';
                move(dragged.dataset.id, event.target.dataset.parentId);
                event.target.appendChild(dragged);
                event.target.style.background = 'inherit';
            }
        },
        false
    );
}

function addSubpages(pageInfo) {
    const list = document.createElement('ul');
    list.dataset.parentId = pageInfo.id;
    list.classList.add('dropzone');
    pageInfo.subpages.forEach((subpage) => {
        list.appendChild(pageNode(subpage));
    });
    return list;
}

function pageNode(pageInfo) {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.name = pageInfo.title;
    li.dataset.guid = pageInfo.guid;
    li.dataset.id = pageInfo.id;
    const a = document.createElement('a');
    a.innerText = pageInfo.title;
    a.href = pageInfo.uri;
    li.appendChild(a);
    if (pageInfo.subpages.length > 0) {
        li.appendChild(addSubpages(pageInfo));
    }
    return li;
}

async function move(pageid, parentid) {
    console.log({ draggedGuid: pageid, targetId: parentid });
    const pageApi = new Martian.default.Page(parseInt(pageid, 10), martianSettings);
    const moveRequest = await pageApi.move({ parentid });
    console.log(moveRequest);
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
        martianSettings = new Martian.default.Settings({
            origin: 'http://' + configJson.appHostname,
            host: 'https://' + configJson.hostname,
        });
        const homePage = new Martian.default.Page('home', martianSettings);
        const homePageInfo = await homePage.getTree();
        displaySiteTree(document.getElementById('pageInfo'), homePageInfo);
        const user = new Martian.default.User('current', martianSettings);
        const currentUser = await user.getInfo();
        document.getElementById('welcomeMessage').removeAttribute('hidden');
        document.getElementById('name').innerText = currentUser.email;
    } else {
        preLoginAuthLink(document.getElementById('login'), configJson.authorizeUrl);
    }
}

main();
