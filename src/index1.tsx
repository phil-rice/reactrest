import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BoardData, defaultStateLens, GameData, NoughtOrCross} from "./domain/GameDomain";
import {getElement} from "./utils";
import {LensContext, LensProps} from "./optics/LensContext";
import {Lens} from "./optics/optics";
import {LensReact} from "./optics/LensReact";

type GameProps<Main, T> = LensProps<Domain, Main, T>

class Domain {
    stateLens: Lens<GameData, NoughtOrCross>

    constructor(stateLens: Lens<GameData, NoughtOrCross>) { this.stateLens = stateLens;}

    invert(s: NoughtOrCross): NoughtOrCross {return (s === 'X' ? 'O' : 'X')}

    setSquareAndToggleState = (context: LensContext<Domain, GameData, NoughtOrCross>) =>
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

function SimpleGame(props: GameProps<GameData, GameData>) {
    console.log("in simple game", props)
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board(props: GameProps<GameData, BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}

function Square(props: GameProps<GameData, NoughtOrCross>) {
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}


let gameElement = getElement("root")
let gameDomain2: Domain = new Domain(defaultStateLens)
LensReact.setJson<Domain, GameData>(gameDomain2, gameElement, c => (ReactDOM.render(<SimpleGame context={c}/>, gameElement)))(Domain.emptyGame)

