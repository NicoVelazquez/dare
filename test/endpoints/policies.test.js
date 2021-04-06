import chai from 'chai';
import request from 'supertest';
import rewire from 'rewire';
import nock from 'nock';
import { validAuth } from '../data.shared';
import { nockPoliciesResponse } from './payloads/policies.payload';
const { INSURANCE_API_BASE_URL } = process.env;

const expect = chai.expect;
const API = '/api';
let app = rewire('../../app');

describe('Policies Routes', () => {
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
  });
  describe('GET /policies', () => {
    it('should return all policies limited to 10 for admin user', (done) => {
      request(app)
        .get(`${API}/policies?limit=10`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(10);
        })
        .expect(200, done);
    });
    it('should return not found 404 if user have no policies', (done) => {
      request(app)
        .get(`${API}/policies`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.contain.keys(['code', 'message']);
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');
        })
        .expect(404, done);
    });
  });
  describe('GET /policies/:id', () => {
    it('should return one policy object', (done) => {
      request(app)
        .get(`${API}/policies/1`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal({
            ...nockPoliciesResponse.find((p) => p.id === '1'),
          });
        })
        .expect(200, done);
    });

    it('should throw not found error with code 404', (done) => {
      request(app)
        .get(`${API}/policies/11`)
        .set('Authorization', `Bearer ${global.adminToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');
        })
        .expect(404, done);
    });
    it('should return unauthorized error with code 401 when the policy doesnt belong to user', (done) => {
      request(app)
        .get(`${API}/policies/1`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.code).to.be.equal(401);
          expect(res.body.message).to.be.equal('Unauthorized');
        })
        .expect(401, done);
    });

    it('should return policy that belongs to user with email user@quotezart.com and id 3 ', (done) => {
      request(app)
        .get(`${API}/policies/3`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal({
            ...nockPoliciesResponse.find((p) => p.clientId === '3'),
          });
        })
        .expect(200, done);
    });

    it('should return validation error on malformed id or not valid regex ', (done) => {
      request(app)
        .get(`${API}/policies/3{.-_}`)
        .set('Authorization', `Bearer ${global.userToken}`)
        .expect((res) => {
          expect(res.body).to.be.an('object');
        })
        .expect(400, done);
    });
  });
});
