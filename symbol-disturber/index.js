(async () => {
    while (true) {
        try {
            await require('./disturber')()
        } catch(e) {
            logger.error(e)
        }
    }
})()