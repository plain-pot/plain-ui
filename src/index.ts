import 'src/style/index.scss'
import PLC from "@/packages/table/plc-components";

import Button from './packages/button'
import Input from './packages/input'
import Icon from './packages/icon'
import Collapse from './packages/collapse'
import Loading from './packages/loading'
import List from './packages/list'
import Message from './packages/message'
import Notice from './packages/notice'
import Grid from './packages/grid'
import Radio from './packages/radio'
import Checkbox from './packages/checkbox'
import Number from './packages/number'
import Toggle from './packages/toggle'
import Slider from './packages/slider'
import Tag from './packages/tag'
import Rate from './packages/rate'
import Scroll from './packages/scroll'
import Portal from './packages/portal'
import Dialog from './packages/dialog'
import Popper from './packages/popper'
import Popover from './packages/popover'
import ColorPicker from './packages/color-picker'
import Tooltip from './packages/tooltip'
import Dropdown from './packages/dropdown'
import Card from './packages/card'
import Alert from './packages/alert'
import Carousel from './packages/carousel'
import VirtualList from './packages/virtual-list'
import Progress from './packages/progress'
import Pagination from "@/packages/pagination";
import Badge from './packages/badge'
import Step from './packages/step'
import Triangle from './packages/triangle'
import Tab from './packages/tab'
import TabHeader from './packages/tab-header'
import FilletCorner from './packages/fillet-corner'
import Tree from './packages/tree'
import VirtualTree from './packages/virtual-tree'
import Cascade from './packages/cascade'
import Time from './packages/time'
import DateTimeInput from './packages/date-time-input'
import Date from './packages/date'
import Select from './packages/select'
import Form from './packages/form'
import Table from './packages/table'

import {installPlugin, PluginType} from "@/util/install";

const plugins = [
    PLC,
    Icon,
    Button, Input, Loading, Radio, Checkbox, Number, Toggle, Slider, Tag, Rate, ColorPicker, Cascade, Time, DateTimeInput, Date, Select, Form, Table,
    Collapse, List, Grid, Scroll, Portal,
    Message, Notice, Dialog, Popper, Popover, Tooltip, Dropdown, Step,
    Card, Carousel, VirtualList, Progress, Pagination, Tab, Tree, VirtualTree,
    Alert, Badge, Triangle,
    TabHeader, FilletCorner,
]

const install: PluginType['install'] = Vue => {
    plugins.forEach(plugin => Vue.use(plugin))
}

export {
    PLC,
    Icon,
    Button, Input, Loading, Radio, Checkbox, Number, Toggle, Slider, Tag, Rate, ColorPicker, Cascade, Time, DateTimeInput, Date, Select, Form, Table,
    Collapse, List, Grid, Scroll, Portal,
    Message, Notice, Dialog, Popper, Popover, Tooltip, Dropdown, Step,
    Card, Carousel, VirtualList, Progress, Pagination, Tab, Tree, VirtualTree,
    Alert, Badge, Triangle,
    TabHeader, FilletCorner,

    install,
}

export default installPlugin({install})