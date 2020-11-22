import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {SHA256} from 'crypto-js'
import {LoadAndCompileCache} from "./componentFromServer/LoadAndCompileCache";
import {defaultStateLens, GameData, GameDomain} from "./domain/GameDomain";
import {getElement} from "./utils";
import {ComponentFromServer, MakeComponentFromServer} from "./componentFromServer/ComponentFromServer";
import {LensContext} from "./optics/LensContext";
import {LensReact} from "./optics/LensReact";

// @ts-ignore // the actual signature is a HasherHelper, but we want to say something simpler, and it works
let cache = LoadAndCompileCache.create<MakeComponentFromServer<React.ReactElement>>(SHA256)

let gameDomain = new GameDomain<GameData>(cache, defaultStateLens)
let element = getElement("root")
function loadAndRender(url: string): Promise<void> {
    return LensReact.loadAndRenderIntoElement<React.ReactElement, GameDomain<GameData>, GameData>(gameDomain, element,
        (c, e) =>
            ReactDOM.render(<ComponentFromServer<React.ReactElement, GameData, GameData> context={c}/>, e))(url)
}

loadAndRender('created/index.json')
