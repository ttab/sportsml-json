const defaultFactory = require('./factory')
const defaultOrder   = require('./order')

module.exports = (json, opts) => {

    // parse options and use defaults
    opts = opts || {}
    const order   = opts.order || defaultOrder

    return build(json, order.__root, order, 0)

}

const isArray = (n) => n.endsWith('*')
const nameOf = (n) => (/([^*]+)\*?/.exec(n) || [,n])[1]
const zipWith = (as1, as2, fn) => as1.map((a1,i) => fn(a1, as2[i]))
const keyval = (k, v) => { var r = {}; r[k] = v; return r }
const I = (v) => v

function build(node, name, order, lvl) {

    // helper to indent
    const indent = () => ' '.repeat(lvl * 2)

    // the ordered children to enumerate into JSON.
    const cnames = order[name] || []

    // is this a plain type such as 'string', 'integer'?
    const isplain = typeof cnames === 'string'

    // clone of the node where we can delete keys as we go
    var clone = Object.assign({}, node)

    // build the current level into this
    var ret = [indent(), '<', name]

    const children = isplain ? [String(node)] : cnames.map((cname) => {
        const ncname = nameOf(cname)
        if (!node.hasOwnProperty(ncname)) {
            return null
        }
        var n
        const cnodes = Array.isArray((n = node[ncname])) ? n : [n]
        delete clone[ncname] // dirrrrty xD
        const childs = cnodes.map((cnode) => build(cnode, ncname, order, lvl + 1))
        return childs.join('\n')
    }).filter(I)

    // at this point the only keys left in the clone should be attributes
    if (!isplain) {
        for (var k in clone) {
            ret.push(' ')
            ret.push(k)
            ret.push('=')
            ret.push(JSON.stringify(clone[k]))
        }
    }

    if (children.length) {

        ret.push('>')
        if (!isplain) {
            ret.push('\n')
        }

        // add on the child nodes
        ret.push(children.join('\n'))

        // wrap it up
        if (!isplain) {
            ret.push('\n')
            ret.push(indent())
        }
        ret.push('</')
        ret.push(name)
        ret.push('>')

    } else {
        // self closing
        ret.push('/>')
    }

    // and return
    return ret.join('')

}
