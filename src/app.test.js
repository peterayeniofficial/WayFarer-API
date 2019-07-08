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

describe('user can signup', () => {
    it('user can register', done => {
        const user = {
            first_name: 'Main',
            last_name: 'Joe',
            email: `${newNumber}@e.com`,
            password: 'password',
            is_admin: true,
        };
        server
            .post('/api/v1/users')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(201);
                expect(res.body.message).to.equal('success');
                done();
            });
    });
});
