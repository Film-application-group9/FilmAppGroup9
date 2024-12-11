import request from 'supertest';
 import app from '../server.js';

 describe('POST /api/data', () => {
    it('should return a greeting message when name is provided', async () => {
      const response = await request(app)
        .post('/api/data')
        .send({ name: 'John' });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Hello, John');
    });
    it('should return an error when name is not provided', async () => {
      const response = await request(app)
        .post('/api/data')
        .send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Name is required');
    });
   });