/**
 * Created by paul on 2/5/15.
 */

'use strict';
var MongoClient = require('mongodb').MongoClient,
		assert = require('assert'),
		moment = require('moment');

var url = 'mongodb://localhost:3001/meteor',
		zipcodes = [

		],
		db,
		colCampaigns,
		campaign,
		Clicks,
		Opens,
		UnSubs,
		Spam,
		Bounces,
		campaignId,
		startTime,
		hadOpens = false,
		runHours = 48;

var minutes = 60,
		hours = 0;

campaignId = process.argv[2];

if (process.argv.length >= 4) {
	runHours = parseInt(process.argv[3]);
}

var msgkeys = [];
msgkeys['processed'] = 0;
msgkeys['delivered'] = 1;
msgkeys['open'] = 2;
msgkeys['click'] = 3;
msgkeys['bounce'] = 4;
msgkeys['spamreport'] = 5;
msgkeys['unsubscribe'] = 6;

function getMessage(type, idx) {
	var messages = [{
		sg_event_id: 'sendgrid_internal_event_id',
		sg_message_id: 'sendgrid_internal_message_id',
		email: 'email@example.com',
		timestamp: 1249948800,
		'smtp-id': '<original-smtp-id@domain.com>',
		unique_arg_key: 'unique_arg_value',
		category: ['category1', 'category2'],
		event: 'processed'
	},
		{
			'response': '250 OK',
			'sg_event_id': 'sendgrid_internal_event_id',
			'sg_message_id': 'sendgrid_internal_message_id',
			'event': 'delivered',
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'smtp-id': '<original-smtp-id@domain.com>',
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2']
		},
		{
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'ip': '255.255.255.255',
			'sg_event_id': 'sendgrid_internal_event_id',
			'sg_message_id': 'sendgrid_internal_message_id',
			'useragent': 'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
			'event': 'open',
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2']
		},
		{
			'sg_event_id': 'sendgrid_internal_event_id',
			'sg_message_id': 'sendgrid_internal_message_id',
			'ip': '255.255.255.255',
			'useragent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53',
			'event': 'click',
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'url': 'http://yourdomain.com/blog/news.html',
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2']
		},
		{
			'status': '5.0.0',
			'sg_event_id': 'sendgrid_internal_event_id',
			'sg_message_id': 'sendgrid_internal_message_id',
			'event': 'bounce',
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'smtp-id': '<original-smtp-id@domain.com>',
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2'],
			'reason': '500 No Such User',
			'type': 'bounce'
		},
		{
			'sg_event_id': 'sendgrid_internal_event_id',
			'sg_message_id': 'sendgrid_internal_message_id',
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2'],
			'event': 'spamreport'
		},
		{
			'sg_message_id': 'sendgrid_internal_message_id',
			'email': 'email@example.com',
			'timestamp': 1249948800,
			'unique_arg_key': 'unique_arg_value',
			'category': ['category1', 'category2'],
			'event': 'unsubscribe'
		}];

	var msg = messages[msgkeys[type]],
			tstring = hours + '_' + minutes + '_' + idx;

	var chartPostDate = moment(startTime).add(hours, 'h').minutes(minutes, 'm'),
			timeStamp = chartPostDate.unix();

	chartPostDate.minutes(0).seconds(0);

	msg._id = type + '_' + tstring;
	console.log(msg._id);

	msg.campaignId = campaignId;
	msg.email = 'email_' + tstring + '@example.com';
	msg.timestamp = timeStamp;
	msg.chartPostDate = chartPostDate.toDate();

	return msg;
}

var openRates = [0,10,20,30,60,60,30,30,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
		clickRates = [0,5,10,15,20,25,30,25,25,20,15,15,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];

function getRandomId(min, max) {
	return Math.floor(Math.random() * max) + min;
}

function insertMessages(type, collection, count) {
	var msgs = [],
			msg,// Last one in loop will be used to get the time.
			clicks = 0,
			opens = 0,
			unsub = 0,
			spam = 0,
			bounces = 0,
			x = 0;

	for(; x<count; x++) {
		msg = getMessage(type, x);
		msgs.push(msg);
	}

	if (type === 'click') {
		clicks += count;
	} else if (type === 'open') {
		opens += count;
	} else if (type === 'unsubscribe') {
		unsub += count;
	} else if (type === 'spamreport') {
		spam += count;
	} else if (type === 'bounce') {
		bounces += count;
	}

	//console.log(msgs);

	console.log('Inserting ' + count + ' ' + type);
	collection.insert(msgs, function (err) {
		assert.equal(null, err);

		colCampaigns.findOne({_id: campaignId}, function (err, doc) {
			doc.stats.clicks[doc.stats.clicks.length - 1] += clicks;
			doc.stats.opens[doc.stats.opens.length - 1] += opens;
			doc.stats.unsub[doc.stats.unsub.length - 1] += unsub;
			doc.stats.spam[doc.stats.spam.length - 1] += spam;
			doc.stats.bounces[doc.stats.bounces.length - 1] += bounces;
			colCampaigns.update({_id: campaignId}, {$set: {
				'stats.clicks': doc.stats.clicks,
				'stats.opens': doc.stats.opens,
				'stats.unsub': doc.stats.unsub,
				'stats.spam': doc.stats.spam,
				'stats.bounces': doc.stats.bounces
			}}, function () {});
		});
	});

}

function doit() {
	console.log(hours + ':' + minutes);

	var isOpen = (getRandomId(0, 100) <= openRates[hours]),
			isClick = (getRandomId(0, 100) <= clickRates[hours]);

	if (isOpen) {
		hadOpens = true;
		insertMessages('open', Opens, getRandomId(10, campaign.totalEmails / 500));
	}

	if (hadOpens && isClick) {
		insertMessages('click', Clicks, getRandomId(2, 100));
	}

	if (hadOpens && getRandomId(0, 100) <= 10) {
		insertMessages('unsubscribe', UnSubs, 1);
	}

	if (hadOpens && getRandomId(0, 100) <= 10) {
		insertMessages('bounce', Bounces, 3);
	}

	if (hadOpens && getRandomId(0, 100) <= 5) {
		insertMessages('spamreport', Spam, 1);
	}


	if (hours >= runHours) {
		db.close();
	} else {
		// Each second is a minute, this is just a demo see?
		if (++minutes >= 30) {
			hours++;
			minutes = 0;

			colCampaigns.findOne({_id: campaignId}, function (err, doc) {
				var newDate = moment(startTime);
				newDate.add(hours, 'hours');

				colCampaigns.update({_id: campaignId}, {$addToSet: {'stats.hours': newDate.toDate()},
					$push: {'stats.clicks': 0, 'stats.opens': 0, 'stats.unsub': 0, 'stats.spam': 0, 'stats.bounces': 0}}, function () {});
			});
		}

		setTimeout(doit, 1000);
	}
}

MongoClient.connect(url, function(err, _db) {
	assert.equal(null, err);
	console.log('Connected correctly to server');
	db = _db;

	colCampaigns = db.collection('Campaigns');
	Clicks = db.collection('Clicks');
	Opens = db.collection('Opens');
	UnSubs = db.collection('UnSubs');
	Spam = db.collection('Spam');
	Bounces = db.collection('Bounces');

	Clicks.remove({campaignId: campaignId}, function () {
		Opens.remove({campaignId: campaignId}, function () {

			console.log('Getting campaign for id: ' + campaignId);
			colCampaigns.findOne({_id: campaignId}, function (err, doc) {
				if (err || !doc) {
					db.close();
					throw new Error('Failed to find campaign for id: ' + campaignId);
				}

				campaign = doc;
				console.log('Started campaign: ' + campaign.name);

				startTime = moment(campaign.createdAt);

				colCampaigns.update({_id: campaignId}, {$set: {'stats.hours': [], 'stats.clicks': [], 'stats.opens': [],
				'stats.unsub': [], 'stats.spam': [], 'stats.bounces': []}}, function () {

					var newDate = moment(startTime);
					newDate.minutes(0).seconds(0);

					colCampaigns.update({_id: campaignId}, {$addToSet: {'stats.hours': newDate.toDate()},
						$push: {'stats.clicks': 0, 'stats.opens': 0, 'stats.unsub': 0, 'stats.spam': 0, 'stats.bounces': 0}}, function () {
						doit();
					});

				});

			});

		});
	});

});
