//const syllable = require('syllable');
import {syllable} from "syllable";
import removeMd from 'remove-markdown';

function containsURL(str) {
  const urlRegex = /(.*:\/\/|www\.)\S+/i;
  return urlRegex.test(str);
}

function makeHaiku(str){
	str = removeMd(str)
	if(containsURL(str)){
		return;
	}
	// TODO first format to remove unvisible text like hyperlinks
	const words = (str).replaceAll("\n", " ").split(" ");
	let formattedHaiku = "";
	let syllableCount = 0;
	let line = 1;
	for (let i=0; i<words.length; i++){
		const word = words[i].trim();
		if(word.length > 0){
			syllableCount += syllable(word);
			formattedHaiku += word + " ";
			if(line == 1){
				if(syllableCount == 5){
					// first line finished
					formattedHaiku += "\n";
					line += 1;
					syllableCount = 0;
				} else if(syllableCount > 5){
					// not an haiku
					return;
				} else {
					// go on
				}
			} else if(line == 2){
				if(syllableCount == 7){
					// second line finished
					formattedHaiku += "\n";
					line += 1;
					syllableCount = 0;
				} else if(syllableCount > 7){
					// not an haiku
					return;
				} else {
					// go on
				}
			} else if(line == 3){
				if(syllableCount == 5){
					// third line finished
					return formattedHaiku.trim();
				} else if(syllableCount > 5){
					// not an haiku
					return;
				} else {
					// go on
				}
			}
		} else {
			// empty word, just jump it
		}
	}
	return;
}

export default makeHaiku