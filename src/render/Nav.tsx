import React from "react";
import {NavData, NavGroupData, NavProperties} from "../domain/NavDomain";
import {Lens} from "../optics/optics";
import {ComponentFromServer} from "../componentFromServer/ComponentFromServer";


function Nav<DomainMap, Main>(props: NavProperties<DomainMap, Main, NavData>) {
    console.log("Nav", props)
    let groups = props.context.json().groups.map((g: NavGroupData, i: number) =>
        (<ComponentFromServer key={i} context={props.context.focusOn('groups').withLens(Lens.nth(i))}/>))
    return (<ul key={'groups'}>{groups}</ul>)
}
