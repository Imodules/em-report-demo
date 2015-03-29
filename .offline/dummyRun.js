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
		campaign,
		Clicks,
		Opens,
		campaignId,
		startTime,
		runHours = 48;

var minutes = 0,
		hours = 0;

campaignId = process.argv[2];

if (process.argv.length >= 4) {
	runHours = parseInt(process.argv[3]);
}

var msgkeys = [];
msgkeys['processed'] = 0;
msgkeys['delivered'] = 1;
msgkeys['opened'] = 2;
msgkeys['click'] = 3;
msgkeys['bounced'] = 4;
msgkeys['spam'] = 5;
msgkeys['unsub'] = 6;

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

	console.log(timeStamp);
	console.log(chartPostDate.toDate());

	msg._id = msg.sg_message_id + '_' + tstring;
	msg.campaignId = campaignId;
	msg.email = 'email_' + tstring + '@example.com';
	msg.timestamp = timeStamp;
	msg.chartPostDate = chartPostDate.toDate();

	return msg;
}

var openRates = [0,10,20,30,40.50,60,60,55,50,40,30,30,30,30,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
		clickRates = [0,5,10,15,20,25,30,25,25,20,15,15,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];

function getRandomId(min, max) {
	return Math.floor(Math.random() * max) + min;
}

function insertMessages(type, collection, count) {
	var msgs = [],
			x = 0;

	for(; x<count; x++) {
		msgs.push(getMessage(type, x));
	}

	//console.log(msgs);

	console.log('Inserting ' + count + ' ' + type);
	collection.insert(msgs, function (err) {
		assert.equal(null, err);
	});
}

function doit() {
	console.log(hours + ':' + minutes);

	var isOpen = (getRandomId(0, 100) <= openRates[hours]),
			isClick = (getRandomId(0, 100) <= clickRates[hours]);

	if (isOpen) {
		insertMessages('opened', Opens, 10);
	}

	if (isClick) {
		insertMessages('click', Clicks, 5);
	}


	if (hours >= runHours) {
		db.close();
	} else {
		// Each second is a minute, this is just a demo see?
		if (++minutes >= 20) {
			hours++;
			minutes = 0;
		}

		setTimeout(doit, 1000);
	}
}

MongoClient.connect(url, function(err, _db) {
	assert.equal(null, err);
	console.log('Connected correctly to server');
	db = _db;

	var campaigns = db.collection('Campaigns');
	Clicks = db.collection('Clicks');
	Opens = db.collection('Opens');

	Clicks.remove({campaignId: campaignId}, function () {
		Opens.remove({campaignId: campaignId}, function () {

			console.log('Getting campaign for id: ' + campaignId);
			campaigns.findOne({_id: campaignId}, function (err, doc) {
				if (err || !doc) {
					db.close();
					throw new Error('Failed to find campaign for id: ' + campaignId);
				}

				campaign = doc;
				console.log('Started campaign: ' + campaign.name);

				startTime = moment(campaign.createdAt);
				doit();
			});

		});
	});

});
