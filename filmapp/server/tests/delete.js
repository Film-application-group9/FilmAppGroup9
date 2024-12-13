import request from 'supertest';
import app from '../index.js';
//import { testLogin,testLogout, testNew, testRegister } from './tests/helpers/user_helpers.js';
import { pool } from '../helpers/db.js';

describe('DELETE /user/delete/accounts', () => {
    let server
    let token
    let only_token

    beforeAll(async() => {
      server = app.listen(4000, () => {
      console.log('Test server is running on http://localhost:4000');
        })
    })
    afterAll(async() => {
      await pool.query('TRUNCATE reviews RESTART IDENTITY CASCADE ;')
          await pool.query('TRUNCATE accounts RESTART IDENTITY CASCADE ;')
          await pool.query('TRUNCATE groups RESTART IDENTITY CASCADE ;')
          server.close()
       
    })

    it('should delete all (and only) user-related data from database', async() => {
      
      
      
      
      const register = await request(server)
      .post('/user/register')
      .send({username: "deleteUser@test.com", password: "Test1234"})

      expect(register.statusCode).toBe(201)
      expect(register.body.id).toBe(1)
      expect(register.body.username).toBe("deleteUser@test.com")
      
      const login = await request(server)
        .post('/user/login')
        .send({username: "deleteUser@test.com", password: "Test1234"})
        
        

        
        let token = login.headers.authorization
        expect(token).toMatch('Bearer ')
        let only_token = token.substring(7, token.length)
        
        

        
        await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values ($1, $2, NOW(), $3, $4, $5)", [1,1,'test_movie',3, 'test_comment'])
        

        const checkReviewExists = await request(server)
        .get('/review/user/1')
        .set('Authorization', only_token)
        
        
        token = checkReviewExists.headers.authorization
        only_token = token.substring(7, token.length)

        

        expect(checkReviewExists.body.length).toBe(1)
        
        

        



        const response = await request(server)
        .delete('/user/delete/1')
        .set('Authorization', only_token)


        token=response.headers.authorization
        only_token = token.substring(7, token.length)

        const reviewCheck = await request(server)
        .get('/review/user/1')
        .set('Authorization', only_token)

        console.log("ReviewCheck: ", reviewCheck.body)
        
        expect(reviewCheck.body.length).toBe(0)

        //Testataan toisen käyttäjän avulla onko ryhmät, suosikit ja tili olemassa



        
       
       

      
    })
  })
     
   

