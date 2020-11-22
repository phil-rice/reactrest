import React from 'react';
import {BoardData, GameProperties} from "../domain/GameDomain";
import {Lens, LensBuilder} from "../optics/optics";
import {ChildFromServer} from "../componentFromServer/ComponentFromServer";

let lensBuilder: LensBuilder<BoardData, BoardData> = Lens.build();

function Board<Main>(props: GameProperties<Main, BoardData>) {
    const sq = (n: number) => (<ChildFromServer render='square' context={props.context} lens={lensBuilder.then('squares').andThen(Lens.nth(n))}/>)
    return (
        <div>
            <div className="board-row">{sq(0)} {sq(1)} {sq(2)}</div>
            <div className="board-row">{sq(3)} {sq(4)} {sq(5)}</div>
            <div className="board-row">{sq(6)} {sq(7)} {sq(8)}</div>
        </div>)
}
