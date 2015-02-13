combo = {'comboList': [], 'comboImg': '', 'KD': 0, 'DMG': 0, 'MP': 0};

$(document).ready(function() {

	populateNext(bladeMaster['right']);
	
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboDMG').text(combo['DMG'] + '%');

	$('#commandList table tbody').on('click', 'td img.action', addAction);
	$('#BMLarge').on('click', removeAction);

});

function addAction(event) {

	event.preventDefault();
	var id = this.id;
	var thisAction = bladeMaster[id];

	combo['comboList'].push(thisAction);
	combo['KD'] += thisAction.KD;
	combo['MP'] += thisAction.MP;
	combo['DMG'] += thisAction.DMG;

	if (combo['KD'] >= 100) {
		$('#comboKD').css({'color': 'red'});
	}
	// Populate Info Box
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboDMG').text(combo['DMG'] + '%');

	populateNext(thisAction);
	populateImg(thisAction);
};

function removeAction(event) {

	// Cannot remove when combo list is empty
	if (combo['comboImg'] === '') {
		return
	}

	event.preventDefault();
	var lastAction = combo['comboList'].pop();

	if (combo['KD'] >= 100 && combo['KD'] - lastAction.KD < 100) {
		$('#comboKD').css({'color': 'black'});
	}
	combo['KD'] -= lastAction.KD;
	combo['MP'] -= lastAction.MP;
	combo['DMG'] -= lastAction.DMG;

	// Populate Info Box
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboDMG').text(combo['DMG'] + '%');

	var lastImg = lastAction['img2'];
	var comboImg = combo['comboImg'];
	var n = comboImg.lastIndexOf(lastImg);

	combo['comboImg'] = comboImg.substring(0, n);
	$('#comboImg').html(combo['comboImg']);

	// Special behavior when removing only element
	if (combo['comboImg'] != '') {
		var lastIndex = (combo['comboList'].length)-1;
		var thisAction = combo['comboList'][lastIndex];
		populateNext(thisAction);
	} else {
		populateNext(bladeMaster['right']);
	}

};

function populateImg(action) {

	combo['comboImg'] += action['img2'];
	$('#comboImg').html(combo['comboImg']);

	// Auto scroll right when combo overflows
	var width = parseInt($('#comboImg').width());
	if (width > 800) {
		$('#comboList p').animate({scrollLeft: width});
	}
	console.log(combo);
};

function populateNext(action) {

	var content = '';
	var commands = action['next'];
	content += '<tr>';

    content += '<td type=basicCell>';
	var basics = commands['basic'];
	$.each(basics, function(){
		content += bladeMaster[this]['img'];
	})
    content += '</td>';

    content += '<td type=activeCell>';
	var actives = commands['active'];
	$.each(actives, function(){
		content += bladeMaster[this]['img'];
	})
    content += '</td>';    

    content += '<td type=specialCell>';
	var specials = commands['special'];
	$.each(specials, function(){
		content += bladeMaster[this]['img'];
	})
    content += '</td>';

    content += '</tr>';

    $('#commandList table tbody').html(content);
};


// ===== STATIC OBJECTS BELOW ===============================================

imgButton = '<img type=imgButton class=action id=';
allBasic = ['Z', 'X', 'right2', 'up', 'right', 'left0', 'down0', 'left20'];
noBasic = ['Z0', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'];
allMovements2 = ['down', 'left', 'right', 'left2', 'right2'];
allActives = ['cT', 'gI'];
noActives = ['cT0', 'gI0'];
allSpecials = ['mC', 'bB'];
noSpecials = ['mC0', 'bB0'];

bladeMaster = {
	'up0': {'img': '<img src=/images/up0.png>'},
	'down0': {'img': '<img src=/images/down0.png>'},
	'left0': {'img': '<img src=/images/left0.png>'},
	'right0': {'img': '<img src=/images/right0.png>'},
	'left20': {'img': '<img src=/images/left20.png>'},
	'right20': {'img': '<img src=/images/right20.png>'},
	'Z0': {'img': '<img src=/images/Z0.png>'},
	'X0': {'img': '<img src=/images/X0.png>'},
	'cT0': {'img': '<img src=/images/cT0.png>'},
	'gI0': {'img': '<img src=/images/gI0.png>'},
	'mC0': {'img': '<img src=/images/mC0.png>'},
	'bB0': {'img': '<img src=/images/bB0.png>'},

	'up': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'up src=/images/up.png>',
		'img2': ' <img src=/images/up.png>',
		'next': {'basic': allBasic, 'active': [],
		'special': []}
	},
	'down': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'down src=/images/down.png>',
		'img2': ' <img src=/images/down.png>',
		'next': {'basic': ['Z', 'X'], 'active': [],
		'special': []}
	},
	'left': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'left src=/images/left.png>',
		'img2': ' <img src=/images/left.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'right': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'right src=/images/right.png>',
		'img2': ' <img src=/images/right.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'left2': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'left2 src=/images/left2.png>',
		'img2': ' <img src=/images/left2.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'left2right', 'left0', 'down0', 'left20'],
		'active': allActives,
		'special': allSpecials}
	},
	'left2right': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'left2right src=/images/right.png>',
		'img2': '<img src=/images/right.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'right2': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'right2 src=/images/right2.png>',
		'img2': ' <img src=/images/right2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'right2C': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'right2C src=/images/right2.png>',
		'img2': '<img src=/images/X0.png>' + ' <img src=/images/right2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'Z': {'KD': 7, 'MP': 7, 'DMG': 100,
		'img': imgButton + 'Z src=/images/Z.png>',
		'img2': ' <img src=/images/Z.png>',
		'next': {'basic': ['ZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZ': {'KD': 7, 'MP': 7, 'DMG': 100,
		'img': imgButton + 'ZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZ', 'X0', 'right2C', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'ZZZ': {'KD': 15, 'MP': 7, 'DMG': 150,
		'img': imgButton + 'ZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZZ', 'X0', 'right2', 'up0', 'right0', 'left0', 'down0', 'left2'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZZZ': {'KD': -10, 'MP': 7, 'DMG': 200,
		'img': imgButton + 'ZZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},
	'X': {'KD': 15, 'MP': 7, 'DMG': 200,
		'img': imgButton + 'X src=/images/X.png>',
		'img2': ' <img src=/images/X.png>',
		'next': {'basic': noBasic, 'active': allActives,
		'special': allSpecials}
	},
	'cT': {'KD': 0, 'MP': -45, 'DMG': 400,
		'img': imgButton + 'cT src=/images/cT.png>',
		'img2': ' <img src=/images/cT2.png>',
		'next': {'basic': allBasic,
		'active': ['cT0', 'gI'], 'special': allSpecials}
	},
	'gI': {'KD': 0, 'MP': -20, 'DMG': 400,
		'img': imgButton + 'gI src=/images/gI.png>',
		'img2': ' <img src=/images/gI2.png>',
		'next': {'basic': allBasic,
		'active': ['cT', 'gI0'], 'special': allSpecials}
	},
	'mC': {'KD': 0, 'MP': -65, 'DMG': 700,
		'img': imgButton + 'mC src=/images/mC.png>',
		'img2': ' <img src=/images/mC2.png>',
		'next': {'basic': allBasic,
		'active': allActives, 'special': ['mC0', 'bB']}
	},
	'bB': {'KD': 0, 'MP': -105, 'DMG': 1600,
		'img': imgButton + 'bB src=/images/bB.png>',
		'img2': ' <img src=/images/bB2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': ['mC', 'bB0']}
	}
}









