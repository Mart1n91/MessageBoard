/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let testThreadId;
let testReplyId;
let testPass = 'testpass';
let testBoardName = 'test-board';


suite('Functional Tests', function() {

	test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
			chai
				.request(server)
				.post('/api/threads/:board')
				.send({
					board: testBoardName,
					text: 'Functional Test Thread',
					delete_password: testPass
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					let createdThreadId = res.redirects[0].split('/')[res.redirects[0].split('/').length - 1]
					testThreadId = createdThreadId
					done()
				})
	})
	

	// Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
	/*
	test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", (done) => {
		chai
			.request(server)
			.delete("/api/threads/test")
			.set("content-type", "application/json")
			.send({ thread_id: testThreadId, delete_password: "incorrect" })
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, "Incorrect Password");
				done();
			});
	});
	*/


	test(' Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', (done) => {
		chai
			.request(server)
			.delete("/api/threads/:board")
			.set("content-type", "application/json")
			.send({ thread_id: testThreadId, delete_password: testPass })
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, "Success");
				done();
		});
	})

	
	
	test('Reporting a thread: PUT request to /api/threads/{board}', (done) => {
		chai
			.request(server)
			.put('/api/threads/:board')
			.send({
				thread_id: testThreadId,
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})


	test('Creating a new reply: POST request to /api/replies/{board}', (done) => {
		chai
		.request(server)
		.post('/api/replies/:board')
		.send({
			thread_id: testThreadId,
			text: 'Test Reply from Functional Test',
			delete_password: testPass
		})
		.end((err, res) => {
			assert.equal(res.status, 200)
			let createdReplyId =  res.redirects[0].split('=')[res.redirects[0].split('=').length - 1]
			testReplyId = createdReplyId
			done()
		})
	})


	test('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done) => {
		chai
		.request(server)
		.get('/api/replies/test')
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




});
