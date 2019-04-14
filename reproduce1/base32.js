const nem2lib = require('nem2-library')

const a = nem2lib.address.addressToString(
    Buffer.from('90823A13C80C97A525FEF39960273659141D0D33B76918D6E3', 'hex')
    )
console.log(a)  // SCBDUE6IBSL2KJP66OMWAJZWLEKB2DJTW5URRVXD



const b = nem2lib.address.addressToString(
    Buffer.from('90000000000000000000000000000000000000000000000000', 'hex')
    )
console.log(b)

const c = nem2lib.address.addressToString(
    Buffer.from('90FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 'hex')
    )
console.log(c)