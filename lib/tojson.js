const zu = require('zu')
const defaultFactory = require('./factory')
const defaultOrder = require('./order')

module.exports = (xml, opts) => {

    // parse options and use defaults
    opts = opts || {}
    const factory = opts.factory || defaultFactory
    const order   = opts.order   || defaultOrder

    // helper method to make new objects for a name
    function mkobject(n) { return (factory[n] || factory.__default)() }

    // starting point
    const root = zu.parseXml(xml)
    const node = zu.next(root, order.__root)

    // recursively build
    return build(node, order.__root, mkobject, order)
}


const isArray = (n) => n.endsWith('*')
const nameOf = (n) => (/([^*]+)\*?/.exec(n) || [,n])[1]
const zipWith = (as1, as2, fn) => as1.map((a1,i) => fn(a1, as2[i]))
const keyval = (k, v) => { var r = {}; r[k] = v; return r }
const I = (v) => v


function build(node, name, mkobject, order) {

    // the ordered children to enumerate into JSON. for nested
    // structure this is something like ["sports-content-codes", "catalogRef*"] where
    // the * indicates a repeated element.
    // this can be a string type specifier for elements like <name>hello</name>
    const cnames = order[name] || []

    // string is a type specifier, shortcut and return the specific type
    if (typeof cnames == 'string') {
        const txt = zu.text(node)
        if (cnames == 'integer') {
            return parseInt(txt, 10)
        } else {
            // string
            return txt
        }
    }

    // all children
    // [{cname1:{...}}, {cname2:{...}}, ...]
    const childMerge = cnames.map((cname) => {
        const ncname = nameOf(cname)
        const cnodes = zu.children(node, ncname)
        if (!cnodes.length) {
            return null
        }
        const childs = cnodes.map((cnode) => build(cnode, ncname, mkobject, order))
        return keyval(ncname, isArray(cname) ? childs : childs[0])
    }).filter(I)

    // fish out all attributes into
    // [{attr1:val1}, {attr2:val2}, ...]
    const attrMerge = zu.attrList(node).map((a) => keyval(a, zu.attr(node, a)))

    // consult the factory to make an object for this name
    var ret = mkobject(name)

    // merge in the attribute values
    Object.assign(ret, ...attrMerge)

    // merge in the children
    Object.assign(ret, ...childMerge)

    return ret

}
