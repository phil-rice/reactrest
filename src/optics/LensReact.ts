/** This is the 'make it so that when I change the json things get rendered properly' configuration
 * The 'setJson' method is typically used to render a react component onto a html element. Whenever the json is changed by the child components, suitable rendering takes place
 */
import {LensContext} from "./LensContext";
import {Lens} from "./optics";
import {DomainWithCache} from "../componentFromServer/ComponentFromServer";

export class LensReact {
    static setJson = <Domain, Main>(domain: Domain, element: HTMLElement, fn: (lc: LensContext<Domain, Main, Main>) => void): (m: Main) => void =>
        (main: Main) => {
            console.log('setJson', main)
            return fn(new LensContext(domain, main, LensReact.setJson(domain, element, fn), Lens.identity()));
        }
    static loadAndRenderIntoElement<ReactElement, Domain extends DomainWithCache<ReactElement>, Main>(domain: Domain, html: HTMLElement, processContext: (c: LensContext<Domain, Main, Main>, html: HTMLElement) => void): (url: string) => Promise<void> {
        return url => {
            console.log("fetching", url)
            return fetch(url).then(r => r.json()).then(json => {
                console.log('setting json', json)
                domain.cache.loadFromBlob(json).then(() => LensReact.setJson<Domain, Main>(domain, html, c => processContext(c, html))(json))
            })
        }
    }

}