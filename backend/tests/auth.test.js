const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { initDatabase } = require('../src/config/db');

describe('Authentication API Suite', () => {
  before(async () => {
    process.env.NODE_ENV = 'test';
    await initDatabase();
  });

  const testUser = {
    full_name: 'Test Engineer',
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  let token = '';

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('token');
    expect(res.body.data.user.email).to.equal(testUser.email.toLowerCase());
  });

  it('should reject registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).to.equal(409);
    expect(res.body.success).to.be.false;
  });

  it('should login user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('token');
    token = res.body.data.token;
  });

  it('should fetch profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.user.full_name).to.equal(testUser.full_name);
  });
});
