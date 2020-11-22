import {SimpleGameDomain} from "../domain/SimpleGameDomain";
import {GameData, GameDomain} from "../domain/GameDomain";
import {LensContext} from "./LensContext";
import {LoadAndCompileCache} from "../componentFromServer/LoadAndCompileCache";
import {MakeComponentFromServer} from "../componentFromServer/ComponentFromServer";
import {Lens} from "./optics";

type ReactElement = string
let cache: any = new LoadAndCompileCache(jest.fn(), jest.fn())
let setMain = jest.fn();
let main = SimpleGameDomain.emptyGame
let domain = new SimpleGameDomain(cache, Lens.build<GameData>().field('state'))
let mainContext = new LensContext<SimpleGameDomain<ReactElement, GameData>, GameData, GameData>(cache, main, setMain, Lens.identity())

describe("LensContext", () => {
    describe("with T = Main", () => {
        it("should have json() = main", () => {
            expect(mainContext.json()).toEqual(main)

        })

    })

})