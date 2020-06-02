import './tree.scss'
import tree from './tree'
import node from './tree-node'
import {installPlugin} from "@/util/install";

export default installPlugin([
    tree,
    node,
])