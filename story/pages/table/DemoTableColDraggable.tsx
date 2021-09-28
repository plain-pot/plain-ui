import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";

// @ts-ignore
import data from '../data/data-1.json'
import Plc from "../../../src/packages/Plc";
import {PlcGroup} from "../../../src/packages/PlcGroup";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlTable data={data} colDraggable border>
                    <Plc field={'id'} title={'1'} fixed={'left'}/>
                    <PlcGroup title={'2'}>
                        <Plc field={'size'} title={'2-1'}/>
                        <Plc field={'date'} title={'2-2'}/>
                    </PlcGroup>
                    <Plc field={'color'} title={'3'}/>
                    <PlcGroup title={'4'}>
                        <PlcGroup title={'4-1'}>
                            <Plc title={'4-1-1'} field={'name'}/>
                            <Plc title={'4-1-2'} field={'star'}/>
                        </PlcGroup>
                        <Plc field={'id'} title={'4-2'}/>
                    </PlcGroup>
                    <Plc field="size" title="5"/>
                    <Plc field="date" title="6"/>
                    <Plc field="color" title="7"/>
                    <Plc field="name" title="8"/>
                    <Plc field="star" title="9"/>
                </PlTable>
            </DemoRow>
        </div>
    )
})
