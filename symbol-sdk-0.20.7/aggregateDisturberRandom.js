(async () => {
    const increment = 0xFF;
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    while (true) {
        const from = getRandomInt(0xFF, 0xFFFF);
        const to = from + increment;
        console.log(from, to);
        await require('./aggregateDisturber').main(from, to);
    }
})()