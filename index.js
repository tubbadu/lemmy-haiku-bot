import makeHaiku from './haikuDetector.js';
import Db from "./db.js"
import LemmyBot from 'lemmy-bot';

const LEMMY_USERNAME = process.env.LEMMY_USERNAME;
const LEMMY_PASSWORD = process.env.LEMMY_PASSWORD;
const LEMMY_INSTANCE = process.env.LEMMY_INSTANCE;
const LEMMY_USERID = 37535;

const appendix = "\n\n-----------\n\n::: spoiler I'm a bot beep boop.\nI detect Haikus and format them in a nice way. If I make any mistake please contact [my creator](https://lemmy.world/u/tubbadu) and tell him he's an idiot. Source code and more info [here](https://github.com/tubbadu/lemmy-haiku-bot). For any suggestion feel free to contact me!\n:::";
//"\n\n--------------\n\n~I'm~ ~a~ ~bot~ ~beep~ ~boop.~ ~I~ ~detect~ ~Haikus~ ~and~ ~format~ ~them~ ~in~ ~a~ ~nice~ ~way.~ ~If~ ~I~ ~make~ ~any~ ~mistake~ ~please~ ~contact~ [~my~ ~creator~](https://lemmy.one/u/tubbadu) ~and~ ~tell~ ~him~ ~he's~ ~an~ ~idiot.~" // ~Answer~ ~`REMOVE`~ ~to~ ~this~ ~comment~ ~and~ ~I~ ~will~ ~delete~ ~it~ ~imediately.~
//"~I'm a bot beep boop. I detect Haikus and format them in a nice way. If I make any mistake please contact [my creator](https://lemmy.one/u/tubbadu) and tell him he's an idiot. Answer `REMOVE` to this comment and I will delete it imediately.~".replaceAll(" ", "~ ~");

const bot = new LemmyBot.LemmyBot({
  // Pass configuration options here
	credentials: {
		username: LEMMY_USERNAME,
		password: LEMMY_PASSWORD
	},
	instance: LEMMY_INSTANCE,
	federation: "all",
	dbFile: 'db.sqlite3',
	handlers: {
		post: (res) => {
			
		},
		comment: (res) => {
			if(res.commentView.creator.id != LEMMY_USERID){
				res.botActions.getParentOfComment(res.commentView.comment).then(parent => onComment(res, parent), console.warn);
			} else {
				console.log("not replying to my own comment because I'm not stupid eheh")
			}
		},
		mention: (res) => onMention(res)
	}
});

function checkForHaikus(res){
	const text = res.commentView.comment.content;
	const haiku = makeHaiku(text);
	if(!haiku){
		return;
	}
	const community_id = res.commentView.community.id
	const community_name = res.commentView.community.name;
	const postId = res.commentView.comment.post_id;
	const parentId = res.commentView.comment.id;
	const author = res.commentView.creator.name
	
	Db.ifSubscribed(community_id, (community_id) => {
		console.log("detected haiku in subscribed", community_id);
		const newcomment = {
			postId: postId,
			parentId: parentId,
			content: quoteFormat(haiku, author) + appendix
		}
		
		res.botActions.createComment(newcomment);
		res.preventReprocess();
	})
}

function parse(res, text, postId, commentId, community_id){
	if(text.includes("unsubscribe")){
		unsubscribe(res, community_id);
	} else if (text.includes("subscribe")){
		subscribe(res, community_id);
	} else {
		answerGeneralDescription(res)
	}
	res.preventReprocess();
}

function answerGeneralDescription(res, text, postId, commentId, community_id){
	console.log("general mention")
	let answer = "Hello fellow Lemmings! I'm the *Haiku-bot*. I detect Haikus and format them in a nice way.\nAdd me in a community by mentioning me (`!Haiku-bot`) and writing `SUBSCRIBE`, or remove me from a community writing `UNSUBSCRIBE`.";
	res.botActions.createComment({
		postId: postId,
		parentId: commentId,
		content: answer + appendix
	});
}

function unsubscribe(res, text, postId, commentId, community_id){
	console.log("unsubscribe")
	Db.unsubscribe(community_id, (community_id) => {
		// success
		let answer = "*Haiku-bot* has been removed from this community. Mention me or respond to any of my comments and write `OPT IN` to add me in this community.";
		res.botActions.createComment({
			postId: postId,
			parentId: commentId,
			content: answer + appendix
		})
		res.preventReprocess();
	}, (community_id) => {
		// fail
		let answer = "*Haiku-bot* is currently not watching this community. Mention me or respond to any of my comments and write `OPT IN` to add me in this community.";
		res.botActions.createComment({
			postId: postId,
			parentId: commentId,
			content: answer + appendix
		})
		res.preventReprocess();
	})
}

function subscribe(res, text, postId, commentId, community_id){
	console.log("subscribe")
	Db.subscribe(community_id, (community_id) => {
		// success
		let answer = "*Haiku-bot* has been successfully added to this community. Mention me or respond to any of my comments and write `OPT OUT` to opt out.";
		res.botActions.createComment({
			postId: postId,
			parentId: commentId,
			content: answer + appendix
		})
		res.preventReprocess();
	}, (community_id) => {
		// fail
		let answer = "*Haiku-bot* is already watching this community. Mention me or respond to any of my comments and write `OPT OUT` to opt out.";
		res.botActions.createComment({
			postId: postId,
			parentId: commentId,
			content: answer + appendix
		})
		res.preventReprocess();
	})
}

function quoteFormat(str, author){
	let ret = ""
	const lines = str.split("\n");
	lines.forEach(line => {
		ret += "> *" + line.trim() + "*\n> \n";
	})
	ret += ">  --- " + author
	return ret.trim();
}

function onComment(res, originalComment){
	const text = res.commentView.comment.content.toLowerCase();
	if(originalComment.type == "comment" && originalComment.data.creator.id == LEMMY_USERID){
		onAnswer(res, originalComment.data);
	} else if(text.includes("!haiku-bot") || text.includes("!haikubot") || text.includes("!haiku bot")){
		onMentionAlias(res)
	} else {
		checkForHaikus(res);
	}
}

function onMention(res){
	console.log("mentioned!")
	const community_id = res.mentionView.community.id;
	const community_name = res.mentionView.community.name;
	const text = res.mentionView.comment.content.toLowerCase();
	const postId = res.mentionView.comment.post_id;
	const commentId = res.mentionView.comment.id;
	
	parse(res, text, postId, commentId, community_id);
	console.log("mentioned by", res.mentionView.post.community_id)
}

function onMentionAlias(res){
	console.log("alias-mentioned!")
	const community_id = res.commentView.community.id;
	const community_name = res.commentView.community.name;
	const text = res.commentView.comment.content.toLowerCase();
	const postId = res.commentView.comment.post_id;
	const commentId = res.commentView.comment.id;
	
	parse(res, text, postId, commentId, community_id);
	console.log("mentioned by", res.commentView.post.community_id)
}

function onAnswer(res, originalComment){
	const community_id = res.commentView.community.id;
	const community_name = res.commentView.community.name;
	const text = res.commentView.comment.content.toLowerCase();
	const postId = res.commentView.comment.post_id;
	const commentId = res.commentView.comment.id;
	const parentId = originalComment.comment.id;
	const userId = res.commentView.creator.id;
	const userName = res.commentView.creator.name;
	
	if(text.includes("remove")){
		const rm = {
			reason: "Requested by user " + userName,
			removed: true,
			comment_id: parentId
		}
		console.log("removing post", parentId, "because of \"" + text + "\"")
		res.botActions.removeComment(rm);
		res.preventReprocess();
	} else {
		parse(res, text, postId, commentId, community_id);
	}
}

bot.start()