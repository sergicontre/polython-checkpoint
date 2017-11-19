const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createUser = functions.auth.user().onCreate(event => {
  admin.database().ref('/roles/' + event.data.uid).set('user');
});

exports.deleteUser = functions.auth.user().onDelete(event => {
  admin.database().ref('/roles/' + event.data.uid).remove();
});

exports.activeChallenge = functions.database
	.ref('/activeChallenge')
	.onWrite(event => {
		const activeChallenge = event.data.val();
		if (activeChallenge) {
			const challengeRef = admin.database().ref('/challenges').child(activeChallenge);
			challengeRef.child('duration').once('value').then(snapshot => {
				// minutes to miliseconds
				const duration = snapshot.val() * 60000;
				const startTime = Date.now();
				const endTime = startTime + duration;
				challengeRef.update({
					startTime: startTime,
					endTime: endTime
				})
			});
		}
	});
