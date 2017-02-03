var hyperapp = require('../')
var app = hyperapp.app
var html = hyperapp.html

function CounterList () {
    return [Counter()]
}
CounterList.update = {
    addCounter: model => model.concat([Counter()]),
    removeCounter: (model, i) => {
        var newState = [].concat(model)
        newState.splice(i, 1)
        return newState
    },
    counter: function (model, ev) {
        var newState = [].concat(model)
        var c = newState[ev.index]
        newState[ev.index] = Counter.update[ev.type](c)
        return newState
    }
}

CounterList.view = function (model, msg) {
    var counters = model.map(function (counter, i) {
        var counterView = Counter.view(counter, {
            add: () => msg.counter({ type: 'add', index: i }),
            sub: () => msg.counter({ type: 'sub', index: i })
        })

        return html`
            <div>
                ${counterView}
                <button onclick=${msg.removeCounter.bind(null, i)}>
                    remove this counter
                </button>
            </div>
        `
    })

    return html`
        <div>
            <button onclick=${msg.addCounter}>new counter</button>
            ${counters}
        </div>
    `
}

function Counter () {
    return 0
}
Counter.update = {
    add: model => model + 1,
    sub: model => model - 1
}
Counter.view = function (model, msg) {
    return html`
        <div>
            <button onclick=${msg.add}>+</button>
            <h1>${model}</h1>
            <button onclick=${msg.sub} disabled=${model <= 0}>-</button>
        </div>`
}

app({
    model: CounterList(),
    update: CounterList.update,
    view: CounterList.view
})
