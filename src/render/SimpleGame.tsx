import {GameProps} from "../domain/SimpleGameDomain";
import {BoardData, GameData, NoughtOrCross} from "../domain/GameDomain";
import {Lens} from "../optics/optics";
import React from "react";

function SimpleGame<Main>(props: GameProps<Main, GameData>) {
    console.log("in simple game", props)
    return (<div className='game'>
        <Board context={props.context.focusOn("_embedded").focusOn('board')}/>
    </div>)
}

function Board<Main>(props: GameProps<Main, BoardData>) {
    let squares = props.context.focusOn('squares');
    let sq = (n: number) => (<Square context={squares.withLens(Lens.nth(n))}/>)
    return (<div className='board'>
        <div>{sq(0)}{sq(1)}{sq(2)}</div>
        <div>{sq(3)}{sq(4)}{sq(5)}</div>
        <div>{sq(6)}{sq(7)}{sq(8)}</div>
    </div>)
}
function Square<Main>(props: GameProps<Main, NoughtOrCross>) {
    console.log('square', props)
    let onClick = () => props.context.dangerouslySetMain(props.context.domain.setSquareAndToggleState(props.context))
    return (<button className='square' onClick={onClick}>{props.context.json()}</button>)
}