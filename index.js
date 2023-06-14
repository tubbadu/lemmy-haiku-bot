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
	instance: LEMMY_INSTANCE,
	federation: "all",
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
			handle: (x) => {
				console.warn("new post", x)
			}
		}
	}
});

bot.start()

