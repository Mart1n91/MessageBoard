var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);


let testThreadId;
let testReplyId;

suite('Functional Tests', function() {

	this.timeout(5000);
	
	test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
		
		chai
		  .request(server)
		  .post("/api/threads/test-board")
		  .set("content-type", "application/json")
		  .send({ text: "test text", delete_password: "testPass" })
		  .end(function (err, res) {
			//res.should.have.status(200);
			assert.equal(res.status, 200);
			console.log(res.body);
			//assert.equal(res.body.reported, false);
			
			done();
			
			})
		
	});

	console.log(testThreadId);
	/*
	test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
		chai
		  .request(server)
		  .get("/api/threads/test-board")
		  .end(function (err, res) {
			assert.equal(res.status, 200);
			assert.exists(res.body[0], "There is a thread");
			assert.equal(res.body[0].text, "test text");
			done();
		});
	});



	// Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
	
	test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
		chai
		  .request(server)
		  .delete("/api/threads/test-board")
		  .set("content-type", "application/json")
		  .send({ thread_id: testThreadId, delete_password: "incorrect" })
		  .end(function (err, res) {
			assert.equal(res.status, 200);
			//assert.equal(res.text, "Incorrect Password");
			done();
		  });
	});
	

	
	test(' Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', (done) => {
		chai
			.request(server)
			.delete("/api/threads/test-board")
			.set("content-type", "application/json")
			.send({ thread_id: testThreadId, delete_password: "testPass"})
			.end(function (err, res) {
				assert.equal(res.status, 200);
				//assert.equal(res.text, "Success");
				done();
		});
	})

	
	
	test("Reporting a thread: PUT request to /api/threads/{board}", (done) => {
		chai
			.request(server)
			.put("/api/threads/test-board")
			.send({
				thread_id: "62d1b2aad12f7811139cc98d",
			})
			.end(function (err, res) {
				assert.equal(res.status, 200);
				//assert.equal(res.text, "Success");
				done();
		});
	});
	

	test("Creating a new reply: POST request to /api/replies/{board}", (done) => {
		chai
		.request(server)
		.post("/api/replies/test-board")
		.send({
			thread_id: testThreadId,
			text: "Test Reply from Functional Test",
			delete_password: "testPass"
		})
		.end((err, res) => {
			assert.equal(res.status, 200);
			//let createdReplyId =  res.redirects[0].split('=')[res.redirects[0].split('=').length - 1]
			//testReplyId = createdReplyId
			done()
		})
	})

	test('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done) => {
		chai
		.request(server)
		.get('/api/replies/test-board')
		.query({thread_id: testThreadId})
		.send()
		.end((err, res) => {
			let thread = res.body
			assert.equal(thread._id, testThreadId)
			assert.isUndefined(thread.delete_password)
			assert.isArray(thread.replies)
			done()
		})
	})



	test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', (done) => {
		chai
			.request(server)
			.delete('/api/replies/test')
			.send({
				thread_id: testThreadId,
				reply_id: testReplyId,
				delete_password: testPass
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})



	test('Reporting a reply: PUT request to /api/replies/{board}', (done) => {
		chai
			.request(server)
			.put('/api/replies/:board')
			.send({
				thread_id: testThreadId,
				reply_id: testReplyId
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})



	test('Get Threads from a Board', (done) => {
		chai.request(server)
		.get('/api/threads/test-board')
		.send()
		.end((err, res) => {
			assert.isArray(res.body)
			let firstThread = res.body[0]
			assert.isUndefined(firstThread.delete_password)
			assert.isAtMost(firstThread.replies.length, 3)
			done()
		})
	})

		*/


});
