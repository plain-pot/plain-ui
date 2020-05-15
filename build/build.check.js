const $utils = require('./build.utils')

function checkFile(filepath, content) {
    if (!$utils.isExist(filepath)) {
        console.log('filepath', filepath)
        $utils.fs.writeFileSync(filepath, content)
    }
}


const path = 'src/packages'

let files = $utils.fs.readdirSync($utils.resolve(path));

files.forEach((item) => {
    let itemPath = $utils.join(path, item)
    let isDir = $utils.fs.statSync(itemPath).isDirectory();
    if (isDir) {

        if ($utils.isExist($utils.join(itemPath, `index.ts`)) || $utils.isExist($utils.join(itemPath, `index.tsx`))) {
            return
        }

        checkFile($utils.join(itemPath, `${item}.tsx`), `
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-${item}',
    props: {
        
    },
    setup(props, context) {
        return () => (
            <div>
                
            </div>
        )
    },
})
        `.trim())

        checkFile($utils.join(itemPath, `index.ts`), `
import './${item}.scss'
import ${item} from './${item}'
import {installPlugin} from "@/util/install";

export default installPlugin([
    ${item},
])
        `.trim())

        checkFile($utils.join(itemPath, `${item}.scss`), `
@include theme {
  
}
        `.trim())

    }
})
