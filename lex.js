function shuffle(l) {
	return l.sort(function(a, b) {return 0.5 - Math.random()});
};

function range(n) {
	return Array.apply(null, Array(n)).map(function (_, i) {return i;});
};

function start_lex(lex_size, word_len) {
	lex = [];
	for (var i = 0; i < lex_size; i++) {
		new_word = range(word_len);
		lex.push(new_word);
	};
	return lex;
};

function longest_word(lex) {
	var longest_len = 0;
	for (var i = 0; i < lex.length; i++) {
		if (lex[i].length > longest_len) { longest_len = lex[i].length; }
	};
	return longest_len;
}

function count(l) {
	var counter = {};
	for (var i = 0; i < l.length; i++) {
		if (counter[l[i]] === undefined) {counter[l[i]] = 0; };
		counter[l[i]]++;	
	};
	return counter;
};

function sum(l) {
	return l.reduce(function(a,b) { return a+b; } );
};

function random_word(lex) {
	var index = Math.floor(lex.length * Math.random());
    return index;
};

function summary_stats(d) {
	var longest = 0;
	var s = [];
	var s_stats = [];
	for (var i in d) {
		cur_word = d[i];
		if (cur_word.length > longest) { longest = cur_word.length};

		for (var j = 0; j < cur_word.length; j++) {
			if (s[j] === undefined) {s[j] = []; };
			s[j].push(cur_word[j]);
		};
	};

	for (var i = 0; i < longest; i++) {
		var m = sum(s[i]) / s[i].length;
		// sd is too slow with my naive implementation.....
		/*
		var standard_d = 0;
		for (var j in d) {
			standard_d += Math.pow(d[j][i] - m,2);
		}
		standard_d /= d.length;
		*/
		s_stats.push({position : i+1, mean : m});
	}
	return s_stats;
};

function segmental_information(lex) {
	var prefix_counts = {};

	// count the "prefixes"
	for (var i = 0; i < lex.length; i++) {
		var cur_word = lex[i];
		for (var j = 0; j < cur_word.length; j++) {
			var prefix = cur_word.slice(0, j+1)
			if (prefix_counts[prefix] === undefined) {prefix_counts[prefix] = 0; };
			prefix_counts[prefix]++;
		};
	};

	var lexical_info = {};
	//calc the segmental info based on prefix count vs prefix[:-1] count
	for (var i = 0; i < lex.length; i++) {
		var cur_word = lex[i];
		var word_segment_info = [];
		for (var j = 0; j < cur_word.length; j++) {
			var sequence_c = prefix_counts[cur_word.slice(0,j+1)];
			if (j == 0) {
				var context_c = lex.length;
			} else {
				var context_c = prefix_counts[cur_word.slice(0,j)];
			};
			var seg_info = -Math.log(sequence_c/context_c) / Math.log(2);
			word_segment_info.push(seg_info);
		};
		lexical_info[i] = word_segment_info;
	};	
	return lexical_info;
};

function horizontal_shuffle(lex) {
	var word_to_shuffle = random_word(lex);
	var shuffled_word = shuffle(lex[word_to_shuffle]);
	lex[word_to_shuffle] = shuffled_word;
	return lex;
}

function vertical_shuffle(lex) {
	var word1 = random_word(lex);
	var word2 = word1;
	while (word2 == word1) {
		word2 = random_word(lex);
	}
	var max_char = Math.min([word1.length, word2.length])
	var char_to_swap = Math.floor(Math.random() * max_char);

	var char1 = word1[char_to_swap];
	var char2 = word2[char_to_swap];

	lex[word1][char_to_swap] = char2;
	lex[word2][char_to_swap] = char1;
	return lex;
}
