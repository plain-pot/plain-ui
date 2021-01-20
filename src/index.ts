import {App} from "vue"
import {ComponentPlugin} from "./shims";
import {installPlugin} from "./utils/installPlugin";

import Root from './packages/root'
import Button from "./packages/button";
import ButtonGroup from './packages/button-group'
import Input from "./packages/input";
import InputInnerTags from './packages/input-inner-tags'
import Icon from './packages/icon';
import Loading from './packages/loading'
import LoadingMask from './packages/loading-mask'
import Checkbox from './packages/checkbox'
import CheckboxGroup from './packages/checkbox-group'
import CheckboxInner from './packages/checkbox-inner'
import MessageService from './packages/message'
import List from './packages/list'
import Item from './packages/item'
import Grid from './packages/grid'
import Row from './packages/row'
import Col from './packages/col'
import Radio from './packages/radio'
import RadioInner from './packages/radio-inner'
import RadioGroup from './packages/radio-group'
import Dialog from './packages/dialog'
import DialogService from './packages/dialog-service'
import Scroll from './packages/scroll'
import NoticeService from './packages/notice-service'
import LoadingService from './packages/loading-service'
import Number from './packages/number'
import Toggle from './packages/toggle'
import Slider from './packages/slider'
import Tag from './packages/tag'
import TagInput from './packages/tag-input'
import Rate from './packages/rate'
import VirtualList from './packages/virutal-list'
import Progress from './packages/progress'
import ProgressBar from './packages/progress-bar'
import ProgressCircle from './packages/progress-circle'
import ProgressMini from './packages/progress-mini'
import Pagination from './packages/pagination'
import Badge from './packages/badge'
import Step from './packages/step'
import StepGroup from './packages/step-group'
import ArrowStep from './packages/arrow-step'
import ArrowStepGroup from './packages/arrow-step-group'
import Popper from './packages/popper'
import Dropdown from './packages/dropdown'
import DropdownGroup from './packages/dropdown-group'
import DropdownMenu from './packages/dropdown-menu'
import DropdownOption from './packages/dropdown-option'
import Tooltip from './packages/tooltip'
import Alert from './packages/alert'
import Collapse from './packages/collapse'
import CollapseGroup from './packages/collapse-group'
import CollapseTransition from './packages/collapse-transition'
import Card from './packages/card'
import Carousel from './packages/carousel'
import CarouselItem from './packages/carousel-item'
import ColorPicker from './packages/color-picker'
import Cascade from './packages/cascade'
import Tree from './packages/tree'
import Select from './packages/select'
import SelectOption from './packages/select-option'
import SelectGroup from './packages/select-group'
import DateTimeInput from './packages/date-time-input'
import Time from './packages/time'
import Date from './packages/date'
import Form from './packages/form'
import FormItem from './packages/form-item'
import Table from './packages/table'
import Plc from './packages/plc'
import Upload from './packages/upload'
import Nav from './packages/nav'
import FileService from './packages/file-service'

function install(app: App) {
    installPlugin(app, plugins)
}

const plugins: ComponentPlugin[] = [
    Root,

    Button, ButtonGroup, Icon, Loading, LoadingMask,
    List, Item, Grid, Dialog, Scroll, VirtualList, Progress, ProgressBar,
    ProgressCircle, ProgressMini, Pagination, Badge,
    Step, StepGroup, ArrowStep, ArrowStepGroup, Popper, Dropdown, DropdownGroup,
    DropdownMenu, DropdownOption, InputInnerTags,
    Tooltip, Alert, Collapse, CollapseGroup, CollapseTransition, Card,
    Carousel, CarouselItem, Table, Plc, Nav, Row, Col,

    Input, CheckboxInner, Checkbox, CheckboxGroup, Radio, RadioInner, RadioGroup, Number, Toggle, Slider,
    Tag, TagInput, Rate, ColorPicker, Cascade, Tree, Select, SelectOption, SelectGroup, Time,
    DateTimeInput, Date, Form, FormItem, Upload,

    MessageService, DialogService, NoticeService, LoadingService, FileService,
]

export {
    install, Root,

    Button, ButtonGroup, Icon, Loading, LoadingMask,
    List, Item, Grid, Dialog, Scroll, VirtualList, Progress, ProgressBar,
    ProgressCircle, ProgressMini, Pagination, Badge,
    Step, StepGroup, ArrowStep, ArrowStepGroup, Popper, Dropdown, DropdownGroup,
    DropdownMenu, DropdownOption, InputInnerTags,
    Tooltip, Alert, Collapse, CollapseGroup, CollapseTransition, Card,
    Carousel, CarouselItem, Table, Plc, Nav, Row, Col,

    Input, CheckboxInner, Checkbox, CheckboxGroup, Radio, RadioInner, RadioGroup, Number, Toggle, Slider,
    Tag, TagInput, Rate, ColorPicker, Cascade, Tree, Select, SelectOption, SelectGroup, Time,
    DateTimeInput, Date, Form, FormItem, Upload,

    MessageService, DialogService, NoticeService, LoadingService, FileService,
}

export default {
    install,
}