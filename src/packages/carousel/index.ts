import Carousel from './carousel'
import Item from './carousel-item'
import {createComponentPlugin} from "../../utils/createComponentPlugin";

const CarouselItem = createComponentPlugin(Item)

export default {
    CarouselItem,
    ...createComponentPlugin(Carousel, [CarouselItem]),
}