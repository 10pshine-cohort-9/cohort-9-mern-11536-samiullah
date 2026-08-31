const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { initDatabase } = require('../src/config/db');

describe('Notes CRUD API Suite', () => {
  let token = '';
  let noteId = null;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await initDatabase();

    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'Notes Tester',
        email: `notestest_${Date.now()}@example.com`,
        password: 'Password123!'
      });

    token = userRes.body.data.token;
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration Test Note',
        content: '<p>Testing notes creation</p>',
        category: 'Testing',
        tags: 'test,qa',
        color: '#4f46e5'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.note.title).to.equal('Integration Test Note');
    noteId = res.body.data.note.id;
  });

  it('should fetch all notes for authenticated user', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.notes).to.be.an('array');
    expect(res.body.data.notes.length).to.be.at.least(1);
  });

  it('should update note title and content', async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Note',
        content: '<p>Updated content</p>'
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.note.title).to.equal('Updated Test Note');
  });

  it('should toggle favorite status', async () => {
    const res = await request(app)
      .patch(`/api/notes/favorite/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.note.is_favorite).to.equal(1);
  });

  it('should soft delete note to trash', async () => {
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.note.is_deleted).to.equal(1);
  });
});
