(async () => {
    const start = 400000;
    const increment = 10000;
    const createCounter = () => {
        let i = 0
        return {
            count: () => { i++ },
            get: () => { return i }
        }
    };
    const counter = createCounter();
    while (true) {
        const from = start + increment * (counter.get());
        const to = from + increment;
        await require('./accountIncrease').dist(from, to);
        await require('./accountIncrease').back(from, to);
        counter.count();
    }
})()