import {Lens} from "../optics/optics";
import {NoughtOrCross} from "./GameDomain";
import {LensContext, LensProps} from "../optics/LensContext";
import {DomainWithCache, MakeComponentFromServer} from "../componentFromServer/ComponentFromServer";
import {LoadAndCompileCache} from "../componentFromServer/LoadAndCompileCache";

export type GameProps< Main, T> = LensProps<SimpleGameDomain<Element, Main>,  Main, T>

export class SimpleGameDomain<ReactElement, Main> implements DomainWithCache<ReactElement> {
    cache: LoadAndCompileCache<MakeComponentFromServer<ReactElement>>
    stateLens: Lens<Main, NoughtOrCross>

    constructor(componentCache: LoadAndCompileCache<MakeComponentFromServer<ReactElement>>, stateLens: Lens<Main, NoughtOrCross>) {
        this.cache = componentCache
        this.stateLens = stateLens;
    }

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<SimpleGameDomain<ReactElement, Main>,  Main, NoughtOrCross>) =>
        Lens.transform2(context.lens, this.stateLens)((sq, state) =>
            sq === '' ? {one: state, two: this.invert(state)} : {one: sq, two: state})(context.main)

}