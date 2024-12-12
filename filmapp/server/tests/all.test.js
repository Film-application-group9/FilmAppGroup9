import request from 'supertest';
import app from '../index.js';
//import { testLogin,testLogout, testNew, testRegister } from './tests/helpers/user_helpers.js';
import { pool } from '../helpers/db.js';
import { postLogin } from '../controllers/UserController.js';

   describe ('Filmapp REST', () => {
        let server
        let token

        beforeAll(async() => {
          server = app.listen(4000, () => {
            console.log('Test server is running on http://localhost:4000');
        });  
          //Mieti tyhjentäminen
          await pool.query('TRUNCATE reviews RESTART IDENTITY CASCADE ;')
          await pool.query('TRUNCATE accounts RESTART IDENTITY CASCADE ;')
          await pool.query('TRUNCATE groups RESTART IDENTITY CASCADE ;')
        })
        afterAll(async() => {
          //Mieti tyhjentäminen
          await pool.query('TRUNCATE reviews RESTART IDENTITY CASCADE ;')
          await pool.query('TRUNCATE accounts RESTART IDENTITY  CASCADE ;')
          await pool.query('TRUNCATE groups RESTART IDENTITY CASCADE ;')
          pool.end()
          server.close()
          
        })
        describe('POST /user/register', () => {
            it('should return success with correct username and password', async() => {
                const response = await request(server)
                .post('/user/register')
                .send({username: "testUser@test.com", password: "test1234"})

                expect(response.statusCode).toBe(201)
                expect(response.body.id).toBe(1)
                expect(response.body.username).toBe("testUser@test.com")

            })
            it('should not register with empty username', async() => {
              const response = await request(server)
              .post('/user/register')
              .send({username: "", password: "test1234"})

              expect(response.statusCode).toBe(400)
              expect(response.text).toContain("Error: Invalid username")
              
            })
            it('should not register with too short password', async() => {
              const response = await request(server)
              .post('/user/register')
              .send({username: "test0@test.com", password: "test12"})

              expect(response.statusCode).toBe(400)
              expect(response.text).toContain("Error: Invalid password")
            })
            
        })
        describe('POST /user/login', () => {
          it('should return error with wrong password', async() => {
            const response = await request(server)
            .post('/user/login')
            .send({username: "testUser@test.com", password: "wrong_password"})
            expect(response.statusCode).toBe(401)
            expect(response.text).toContain("Error: Invalid credentials.")
          }),
          it('should return error with wrong user', async() => {
            const response = await request(server)
            .post('/user/login')
            .send({username: "wrong@test.com", password: "test1234"})

            expect(response.statusCode).toBe(500)
            expect(response.text).toContain("Error: Invalid credentials.")


          })
          it('should return success, id,username and Bearer token with right credentials', async() => {
            const response = await request(server)
            .post('/user/login')
            .send({username: "testUser@test.com", password: "test1234"})

            expect(response.statusCode).toBe(200)
            expect(response.body).toHaveProperty("id")
            expect(response.body.username).toBe("testUser@test.com")
            expect(response.headers).toHaveProperty("authorization")
            token = response.headers.authorization
            expect(token).toMatch("Bearer ")
            const only_token = response.headers.authorization.substring(7, response.headers.authorization.length)
            expect(only_token.length).toBeGreaterThan(10)
          })
        })
        describe('GET /review/all/:idMovie', () => {
          it('should return three reviews to same movie', async() => {
            await pool.query("insert into accounts (username,password) values ('testUser2@test.com' ,'test1234') returning *")
            await pool.query("insert into accounts (username,password) values ('testUser3@test.com' ,'test1234') returning *")
            await pool.query("insert into accounts (username,password) values ('testUser4@test.com' , 'test1234') returning *")
            await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values (2, 1, NOW(), 'test_movie', 4, 'test_comment0')")
            await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values (3, 1, NOW(),'test_movie', 3, 'test_comment1')")
            await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values (4, 1, NOW(), 'test_movie', 2, 'test_comment2')")
            
            const response = await request(server)
            .get('/review/all/1')
            //.send({headers: {Authorization: token}})

            
            console.log("Eka token: ", token)
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(3)
            
            expect(response.statusCode).toBe(200)
            expect(response.body[0].id_review).toBe(1)
            expect(response.body[0].id_user).toBe(2)
            expect(response.body[0].id_movie).toBe(1)
            expect(response.body[0].stars).toBe(4)
            expect(response.body[0].comment).toBe('test_comment0')

            expect(response.body[1].id_review).toBe(2)
            expect(response.body[1].id_user).toBe(3)
            expect(response.body[1].id_movie).toBe(1)
            expect(response.body[1].stars).toBe(3)
            expect(response.body[1].comment).toBe('test_comment1')

            expect(response.body[2].id_review).toBe(3)
            expect(response.body[2].id_user).toBe(4)
            expect(response.body[2].id_movie).toBe(1)
            expect(response.body[2].stars).toBe(2)
            expect(response.body[2].comment).toBe('test_comment2')


          })
          it('should not show review without a comment', async() => {
            await pool.query("insert into accounts (username,password) values ('testUser5@test.com' ,'test1234') returning *")
            await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values (5, 1, NOW(), 'test_movie', 4, '')")
            
            const response = await request(server)
            .get('/review/all/1')
  
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(3)
            for(let review of response.body){
              console.log("Review: ", review)
              expect(review.id_user).not.toBe(5)
            }
            
        })
        it('should not show any reviews with statuscode 200', async() => {
          const response = await request(server)
          .get('/review/all/2')
          expect(response.statusCode).toBe(200)
          expect(response.body.length).toBe(0)
        })
        



        })
        //toimii
        describe('LOGOUT (by not right token)', () => {
          it('should not update or insert new review without rigth token', async() => {
            const response = await request(server)
            .post('/review/new')
            .send({idMovie: 1, moviename: "test_movie", stars: 3, comment:"Comment when loggedOut"})
            .set('Authorization', 'wrong_token')
            
            expect(response.statusCode).toBe(403)
            expect(response.body.message).toBe("Invalid credentials")
            

  
          
          })
          
          it('should not get groups of users wihtout rigth token', async() => {
            /*const login = await request(server)
            .post('/user/login')
            .send({username: "testUser@test.com", password: "test1234"})
            expect(login.headers.authorization).toMatch('Bearer ')*/
            //token = login.headers.authorization
            await pool.query('INSERT INTO groups (groupname) VALUES ($1) RETURNING *', ["test_group"])
            await pool.query('INSERT INTO users_in_groups (users_id_user, groups_id_group) VALUES ($1,$2) RETURNING *',[1,1])
            console.log("Kolmas token: ", token)
            const response = await request(server)
            .get('/groups/mygroups/1')
            .set('Authorization', 'wrong_token')
            
             expect(response.statusCode).toBe(403)
             expect(response.body.message).toBe("Invalid credentials")
          
          })

         /* it('should not create group without right token', async() => {
            const response = await request(server)
            .post("/creategroup/")
            .send({groupname: "test_group", userId: 1})
            .set('Authorization',token)

            console.log("Neljäs token", token)

            
            expect(response.body.length).toBe(0)
            //console.log("Body: ", response.boYdy)
            console.log("Code: ", response.statusCode)
        })*/

      })})
        
        
     
   

  