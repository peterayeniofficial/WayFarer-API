import { expect, server, BASE_URL } from './testsetup/setup';

const newNumber = Math.random(2);

describe('Initial test', () => {
    it('get base url', done => {
        server
            .get(`${BASE_URL}`)
            .expect(200)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal('Welcome to Wayfarer API');
                done();
            });
    });
});

