import chai from 'chai';
import request from 'supertest';
import rewire from 'rewire';
import nock from 'nock';
import { validAuth } from '../data.shared';
import { nockPoliciesResponse } from './payloads/policies.payload';
import { nockClientsResponse } from './payloads/clients.payload';
const { INSURANCE_API_BASE_URL } = process.env;

const expect = chai.expect;
const API = '/api';
let app = rewire('../../app');

describe('Clients Routes', () => {
  before(() => {
    app = rewire('../../app');
  });
  beforeEach(() => {
    nock(`${INSURANCE_API_BASE_URL}`)
      .post('/login')
      .reply(200, {
        ...validAuth,
      });
    nock(`${INSURANCE_API_BASE_URL}`).get('/policies').reply(200, nockPoliciesResponse);
    nock(`${INSURANCE_API_BASE_URL}`).get('/clients').reply(200, nockClientsResponse);
  });

  describe('GET /clients', () => {
    it('should return  clients limited to 3 for admin user', (done) => {
      request(app)
        .get(`${API}/clients?limit=3`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(3);
        })
        .expect(200, done);
    });
    it('should return one client in array for same user', (done) => {
      request(app)
        .get(`${API}/clients`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
        })
        .expect(200, done);
    });
  });

  describe('GET /clients/:id', () => {
    it('should return requested client for admin user', (done) => {
      request(app)
        .get(`${API}/clients/2`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
        })
        .expect(200, done);
    });
    it('should return requested client when user requesting his data', (done) => {
      request(app)
        .get(`${API}/clients/3`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
        })
        .expect(200, done);
    });
    it('should return unauthorized when role user requests different client', (done) => {
      request(app)
        .get(`${API}/clients/2`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.be.equal(401);
          expect(res.body.message).to.be.equal('Unauthorized');
        })
        .expect(401, done);
    });
    it('should return not found when role admin requests not existed client', (done) => {
      request(app)
        .get(`${API}/clients/123`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');
        })
        .expect(404, done);
    });
  });

  describe('GET /clients/:id/policies', () => {
    it(`should return client's policies array when role admin request any client`, (done) => {
      request(app)
        .get(`${API}/clients/2/policies`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('array');
        })
        .expect(200, done);
    });

    it(`should return not found if admin requested client with no policies`, (done) => {
      request(app)
        .get(`${API}/clients/12/policies`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');
        })
        .expect(404, done);
    });

    it(`should return client's policies array when role user request his own policies`, (done) => {
      request(app)
        .get(`${API}/clients/3/policies`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('array');
        })
        .expect(200, done);
    });

    it(`should return unauthorized when role user requests policy for other client`, (done) => {
      request(app)
        .get(`${API}/clients/2/policies`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
        })
        .expect(401, done);
    });
  });
});
