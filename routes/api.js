'use strict';

require("dotenv").config();
require("../data/connections.js")
let Reply = require('../data/models').reply;
let Thread = require('../data/models').thread;


module.exports = function (app) {

	// Post af thread information ----------------------------
	app.post('/api/threads/:board', (request, response) => {
		let newThread = new Thread(request.body)
		if(!newThread.board || newThread.board === ''){
			newThread.board = request.params.board
		}
	
		newThread.createdon_ = new Date().toUTCString()
		newThread.bumpedon_ = new Date().toUTCString()
		newThread.reported = false
		newThread.replies = []
		newThread.save((error, savedThread) => {
			if(!error && savedThread){
				return response.redirect('/b/' + savedThread.board + '/' + savedThread.id)
			}
		})
	})

	// Post af replies for et angivet thread ------------------------------------------------
	app.post('/api/replies/:board', (request, response) => {
		let newReply = new Reply(request.body)
		newReply.createdon_ = new Date().toUTCString()
		newReply.reported = false
		Thread.findByIdAndUpdate(
			request.body.thread_id,
			{$push: {replies: newReply}, bumpedon_: new Date().toUTCString()},
			{new: true},
			(error, updatedThread) => {
				if(!error && updatedThread){
					response.redirect('/b/' + updatedThread.board + '/' + updatedThread.id + '?new_reply_id=' + newReply.id)
				}
			}
		)
	})

	// get metode som giver de nyeste threads for et givet board -------------------------
	app.get('/api/threads/:board', (request, response) => {

		Thread.find({board: request.params.board})
			.sort({bumpedon_: 'desc'})
			.limit(10)
			.select('-delete_password -reported')
			.lean()
			.exec((error, arrayOfThreads) => {
				if(!error && arrayOfThreads){
					
					arrayOfThreads.forEach((thread) => {

						thread['replycount'] = thread.replies.length

						/* Sort Replies by Date */
						thread.replies.sort((thread1, thread2) => {
							return thread2.createdon_ - thread1.createdon_
						})

						/* Limit Replies to 3 */
						thread.replies = thread.replies.slice(0, 3)

						/* Remove Delete Pass from Replies */
						thread.replies.forEach((reply) => {
							reply.delete_password = undefined
							reply.reported = undefined
						})

					})

					return response.json(arrayOfThreads)

				}
			})

	})

	// get method der giver alle replies til in thread
	app.get('/api/replies/:board', (request, response) => {

		Thread.findById(
			request.query.thread_id,
			(error, thread) => {
				if(!error && thread){
					thread.delete_password = undefined
					thread.reported = undefined

					thread['replycount'] = thread.replies.length

					/* Sort Replies by Date */
					thread.replies.sort((thread1, thread2) => {
						return thread2.createdon_ - thread1.createdon_
					})

					/* Remove Delete Pass from Replies */
					thread.replies.forEach((reply) => {
						reply.delete_password = undefined
						reply.reported = undefined
					})

					return response.json(thread)

				}
			}
		)

	})


	// Delete method til at slette en tråd
	app.delete('/api/threads/:board', (request, response) => {

		Thread.findById(
			request.body.thread_id,
			(error, threadToDelete) => {
				if(!error && threadToDelete){

					if(threadToDelete.delete_password === request.body.delete_password){

						Thread.findByIdAndRemove(
							request.body.thread_id,
							(error, deletedThread) => {
								if(!error && deletedThread){
									return response.json('success')
								}
							}
						)

					}else{
						return response.json('incorrect password')
					}

				}else{
					return response.json('Thread not found')
				}

			}
		)

	})


	// method til at slette et reply
	app.delete('/api/replies/:board', (request, response) => {

		Thread.findById(
			request.body.thread_id,
			(error, threadToUpdate) => {
				if(!error && threadToUpdate){

					let i
					for (i = 0; i < threadToUpdate.replies.length; i++){
						if(threadToUpdate.replies[i].id === request.body.reply_id){
							if(threadToUpdate.replies[i].delete_password === request.body.delete_password){
								threadToUpdate.replies[i].text = '[deleted]'
							}else{
								return response.json('incorrect password')
							}
						}
					}

					threadToUpdate.save((error, updatedThread) => {
						if(!error && updatedThread){
							return response.json('success')
						}
					})

				}else{
					return response.json('Thread not found')
				}
			}
		)
	})

	// route til at reporter en thread
	app.put('/api/threads/:board', (request, response) => {

		Thread.findByIdAndUpdate(
			request.body.thread_id,
			{reported: true},
			{new: true},
			(error, updatedThread) => {
				if(!error && updatedThread){
					return response.json('success')
				}
			}
		)
	})

	// route til at reportere et reply
	app.put('/api/replies/:board', (request, response) => {
		Thread.findById(
			request.body.thread_id,
			(error, threadToUpdate) => {
			if(!error && threadToUpdate){

				let i
				for (i = 0; i < threadToUpdate.replies.length; i++) {
					if(threadToUpdate.replies[i].id === request.body.reply_id){
						threadToUpdate.replies[i].reported = true
					}
				}

				threadToUpdate.save((error, updatedThread) => {
					if(!error && updatedThread){
						return response.json('success')
					}
				})

			}
			}
		)
	})
};
