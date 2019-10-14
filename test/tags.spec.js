require('mocha');
const expect = require('chai').expect;
const tags = require('../src/index');

describe('mocha-tags', function() {
    describe('tags', function () {
        it('Should chain through tags()', function () {
            expect(tags().it).to.equal(it);
        });

        it('Should chain through tags() with tag', function () {
            expect(tags('foo').it).to.equal(it);
        });
    });

    describe('filter', function () {
        const list = ['foo', 'bar', 'baz'];

        it('Should match with is', function () {
            const filter = new tags.Filter('is:foo');
            expect(filter.match(list)).to.be.true;
        });

        it('Should not match with not', function () {
            expect(new tags.Filter('not:buzz').match(list)).to.be.true;
        });

        it('Should match multiple with is', function () {
            expect(new tags.Filter('is:foo is:bar').match(list)).to.be.true;
            expect(new tags.Filter('is:foo is:baz').match(list)).to.be.true;
        });

        it('Should not match multiple with not', function () {
            expect(new tags.Filter('not:foo not:bar').match(list)).to.be.false;
            expect(new tags.Filter('not:buzz not:bin').match(list)).to.be.true;
        });

        it('Should match multiple with is and not', function () {
            expect(new tags.Filter('is:foo not:buzz').match(list)).to.be.true;
            expect(new tags.Filter('is:buzz not:foo').match(list)).to.be.false;
        });
    });

    describe('proxy', function() {
        it('Should match with it', function () {
            const matches = tags.proxy(new tags.Filter('is:foo'), ['foo', 'bar', 'baz']);
            expect(matches('match', 'no match')).to.equal('match');
        });

        it('Should not match with not', function () {
            const matches = tags.proxy(new tags.Filter('not:foo'), ['foo', 'bar', 'baz']);
            expect(matches('match', 'no match')).to.equal('no match');
        });
    })
});
