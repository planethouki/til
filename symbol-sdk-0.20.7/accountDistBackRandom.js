(async () => {
    const increment = 0xFF;
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    while (true) {
        const from = getRandomInt(0xFFFF, 0xFFFFFF);
        const to = from + increment;
        console.log(from, to);
        await require('./accountIncrease').dist(from, to);
        await require('./accountIncrease').back(from, to);
    }
})()