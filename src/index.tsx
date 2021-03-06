import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {LoadAndCompileCache} from "./componentFromServer/LoadAndCompileCache";
import {defaultStateLens, GameData, GameDomain} from "./domain/GameDomain";
import {CpqDomain} from "./domain/CpqDomain";
import {NavDomain} from "./domain/NavDomain";
import {fromObject, getElement} from "./utils";
import {ComponentFromServer, DomainWithCache, MakeComponentFromServer} from "./componentFromServer/ComponentFromServer";
import {LensContext} from "./optics/LensContext";
import {SimpleGameDomain} from "./domain/SimpleGameDomain";
import {LensReact} from "./optics/LensReact";


// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>(SHA256)

interface DomainMap {
    game: GameDomain<GameData>,
    simpleGame: SimpleGameDomain<React.ReactElement, GameData>,
    cpq: CpqDomain
}

let domainMap: DomainMap = {game: new GameDomain<GameData>(cache, defaultStateLens), simpleGame: new SimpleGameDomain(cache, defaultStateLens), cpq: new CpqDomain(cache)}
function selectDomainLoadAndRenderIntoElement<K extends keyof DomainMap>(domainName: K, url: string, name: string) {
    let domain = fromObject(domainMap, domainName);
    let element = getElement(name)
    LensReact.loadAndRenderIntoElement(domain, element, (c, e) => {
        ReactDOM.render(<ComponentFromServer<React.ReactElement, any, any> context={c}/>, e)
    })(url)
}
let navDomain = new NavDomain(cache, selectDomainLoadAndRenderIntoElement, 'target')

function loadAndRender<Domain extends DomainWithCache<React.ReactElement>>(domain: Domain, name: string): (url: string) => Promise<void> {
    return LensReact.loadAndRenderIntoElement(domain, getElement(name), (c, e) => {
        console.log("loadAndRender", c, e.getAttribute("id"))
        ReactDOM.render(<ComponentFromServer<React.ReactElement, any, any> context={c}/>, e)
    })
}

loadAndRender(navDomain, 'nav')('created/index.json')
selectDomainLoadAndRenderIntoElement('simpleGame', "created/simpleGameJson.json", 'root')
