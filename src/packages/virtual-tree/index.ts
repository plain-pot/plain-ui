import './virtual-tree.scss'
import tree from './virtual-tree'
import node from './virtual-tree-node'
import {installPlugin} from "@/util/install";

export default installPlugin([
    tree,
    node,
])