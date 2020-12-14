import {Carousel} from './carousel'
import CarouselItem from './carousel-item'
import {createComponentPlugin} from "../../utils/createComponentPlugin";


export default createComponentPlugin(Carousel, {exposeComponents: {CarouselItem}})