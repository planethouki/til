const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const Box = contract.fromArtifact('Box');
const Auth = contract.fromArtifact('Auth');

// Start test block
describe('Box', function () {
    const [ owner, other ] = accounts;

    const value = new BN('42');

    beforeEach(async function () {
        // Deploy a new Box contract for each test
        const auth = await Auth.new({ from: owner });
        this.contract = await Box.new({ from: owner });
        await this.contract.initialize(auth.address);
    });

    // Test case
    it('retrieve returns a value previously stored', async function () {
        // Store a value - recall that only the owner account can do this!
        await this.contract.store(42, { from: owner });

        // Test if the returned value is the same one
        // Note that we need to use strings to compare the 256 bit integers
        expect((await this.contract.retrieve()).toString()).to.equal('42');
    });

    it('retrieve returns a value previously stored', async function () {
        await this.contract.store(value, { from: owner });

        // Use large integer comparisons
        expect(await this.contract.retrieve()).to.be.bignumber.equal(value);
    });

    it('store emits an event', async function () {
        const receipt = await this.contract.store(value, { from: owner });

        // Test that a ValueChanged event was emitted with the new value
        expectEvent(receipt, 'ValueChanged', { newValue: value });
    });

    it('non owner cannot store a value', async function () {
        // Test a transaction reverts
        await expectRevert(
            this.contract.store(value, { from: other }),
            'Unauthorized'
        );
    });
});
