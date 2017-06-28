const fs = require('fs')
const path = require('path')

const tojson = require('../lib/tojson')

describe('tojson', () => {

    const filez = fs.readdirSync(__dirname)

    const gameres = filez.filter((n) => n.startsWith('tt_sample_gameres.'))
    const gameres_act = filez.filter((n) => n.startsWith('tt_sample_gameres_actions'))
    const tables = filez.filter((n) => n.startsWith('ttsportsml_'))

    tables.forEach((n) => {
        const xml1 = fs.readFileSync(path.join(__dirname, n), 'utf-8')
        it(`translates file ${n}`, () => {
            console.log(JSON.stringify(tojson(xml1), null, '  '))
        })
    })

})
