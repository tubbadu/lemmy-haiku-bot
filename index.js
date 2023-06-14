import makeHaiku from './haikuDetector.js';
import LemmyBot from 'lemmy-bot';

const LEMMY_USERNAME = process.env.LEMMY_USERNAME;
const LEMMY_PASSWORD = process.env.LEMMY_PASSWORD;
const LEMMY_INSTANCE = process.env.LEMMY_INSTANCE;

const bot = new LemmyBot.LemmyBot({
  // Pass configuration options here
	credentials: {
		username: LEMMY_USERNAME,
		password: LEMMY_PASSWORD
	},
	federation: "all",
	instance: LEMMY_INSTANCE,
	dbFile: 'db.sqlite3',
	handler: {
		comment: {
			handle: ({
				commentView: {
					comment: { creator_id, id }
				},
				botActions: { createComment }
			}) => {
				console.warn("new comment:")
			}
		},
		post: {
			handle: ({
				postView: {
					post: {creator_id}
				},
			botActions: {}
			}) => {
				console.warn("new post", creator_id)
			}
		}
	}
});

bot.start()

