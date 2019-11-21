import { Container } from "aurelia-framework";
import { Store } from "aurelia-store";
import { State } from "interfaces/State";

import { updatePointMap } from "./actions";


const store: Store<State> = <Store<State>> Container.instance.get(Store)

registerActions()

function registerActions() {
  store.registerAction('UpdatePointMap', updatePointMap)
}