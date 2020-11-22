import {Lens} from "../optics/optics";
import {GameData, NoughtOrCross} from "./GameDomain";
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

    static emptyGame: GameData = {
        //This json has more stuff than it needs: the _links and render aren't used
        "_links": {
            "_self": {"href": "created/gameJson1.json"},
            "game1": {"href": "created/gameJson1.json"},
            "game2": {"href": "created/gameJson2.json"}
        },
        "_render": {"_self": "#Game/render#"},
        "state": "X",
        "_embedded": {
            "board": {
                "_links": {"_self": {"href": "/not/Used/Yet"}},
                "_render": {
                    "_self": "#Board/render#",
                    "square": "#Square/render#"
                },
                "squares": ["", "", "", "", "", "", "", "", ""]
            }
        }
    }

}