combo = {'comboList': [], 'comboImg': '', 'KD': 0, 'DMG': 0, 'MP': 0, 'MP2': 0};

$(document).ready(function() {

	populateNext(bladeMaster['right']);
	
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboDMG').text(combo['DMG'] + '%');
	$('#comboMP2').text(combo['MP2']);

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
	if (width > 523) {
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
img = '<img src=/images/BM/';
allBasic = ['Z', 'X', 'right2', 'up', 'right', 'left0', 'down0', 'left20'];
noBasic = ['Z0', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'];
allActives = ['5L', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'];
allActives2 = ['5L', '5R', '10R', '15L', '25', '40RR', '45L', '45R', '60L'];
noActives = ['5L-0', '5R-0', '10R-0', '15L-0', '25-0', '40RR-0', '45L-0', '45R-0', '60L-0'];
allSpecials = ['0', '10L', '15R', '20L', '20R-0', '15', '30L', '30R', '40L-0', '40R-0', '35',
				'50RR', '55L', '55R', '65-0'];
allSpecials2 = ['0', '10L', '15R', '20L', '20R', '15', '30L', '30R', '40L', '40R', '35',
				'50RR', '55L', '55R', '65'];
noSpecials = ['0-0', '10L-0', '15R-0', '20L-0', '20R-0', '15-0', '30L-0', '30R-0', '40L-0',
				'40R-0', '35-0', '50RR-0', '55L-0', '55R-0', '65-0'];

bladeMaster = {
	// UNAVAILABLE ACTIONS
	'up0': {'img': '<img src=/images/up0.png>'},
	'down0': {'img': '<img src=/images/down0.png>'},
	'left0': {'img': '<img src=/images/left0.png>'},
	'right0': {'img': '<img src=/images/right0.png>'},
	'left20': {'img': '<img src=/images/left20.png>'},
	'right20': {'img': '<img src=/images/right20.png>'},
	'Z0': {'img': '<img src=/images/Z0.png>'},
	'X0': {'img': '<img src=/images/X0.png>'},

	// UNAVAILABLE SKILLS
	'0-0': {'img': img + '0-0.png>'},
	'5L-0': {'img': img + '5L-0.png>'},
	'5R-0': {'img': img + '5R-0.png>'},
	'10L-0': {'img': img + '10L-0.png>'},
	'10R-0': {'img': img + '10R-0.png>'},
	'15L-0': {'img': img + '15L-0.png>'},
	'15R-0': {'img': img + '15R-0.png>'},
	'15-0' : {'img': img + '15-0.png>'},
	'20L-0': {'img': img + '20L-0.png>'},
	'20R-0': {'img': img + '20R-0.png>'},
	'25-0': {'img': img + '25-0.png>'},
	'30L-0': {'img': img + '30L-0.png>'},
	'30R-0': {'img': img + '30R-0.png>'},
	'35-0': {'img': img + '35-0.png>'},
	'40L-0': {'img': img + '40L-0.png>'},
	'40R-0': {'img': img + '40R-0.png>'},
	'40RR-0': {'img': img + '40RR-0.png>'},
	'45L-0': {'img': img + '45L-0.png>'},
	'45R-0': {'img': img + '45R-0.png>'},
	'50RR-0': {'img': img + '50RR-0.png>'},
	'55L-0': {'img': img + '55L-0.png>'},
	'55R-0': {'img': img + '55R-0.png>'},
	'60L-0': {'img': img + '60L-0.png>'},
	'65-0': {'img': img + '65-0.png>'},

	// BASIC ACTIONS
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
		'special': allSpecials2}
	},
	'left2': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'left2 src=/images/left2.png>',
		'img2': ' <img src=/images/left2.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'left2right', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'left2right': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'left2right src=/images/right.png>',
		'img2': '<img src=/images/right.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials2}
	},
	'right2': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'right2 src=/images/right2.png>',
		'img2': ' <img src=/images/right2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials2}
	},
	'right2C': {'KD': 0, 'MP': 0, 'DMG': 0,
		'img': imgButton + 'right2C src=/images/right2.png>',
		'img2': '<img src=/images/X0.png>' + ' <img src=/images/right2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials2}
	},
	'Z': {'KD': 7, 'MP': 7, 'DMG': 100,
		'img': imgButton + 'Z src=/images/Z.png>',
		'img2': ' <img src=/images/Z.png>',
		'next': {'basic': ['ZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials2}
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
		'active': allActives2, 'special': allSpecials2}
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
		'special': allSpecials2}
	},

	// ACTIVE SKILLS
	'5L': {'KD': 0, 'MP': -20, 'DMG': 400,
		'img': imgButton + '5L src=/images/BM/5L.png>',
		'img2': ' ' + img + '5L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L-0', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'5R': {'KD': 0, 'MP': -7, 'DMG': 300,
		'img': imgButton + '5R src=/images/BM/5R.png>',
		'img2': ' ' + img + '5R-2.png>',
		'next': {'basic': ['Z', 'X', 'right2', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': ['5L', '5R-0', '10R', '15L', '25-0', '40RR', '45L', '45R', '60L'],
		'special': allSpecials}
	},
	'10R': {'KD': 0, 'MP': -20, 'DMG': 400,
		'img': imgButton + '10R src=/images/BM/10R.png>',
		'img2': ' ' + img + '10R-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R-0', '15L', '25', '40RR', '45L', '45R', '60L'],
		'special': allSpecials}
	},
	'15L': {'KD': 0, 'MP': -40, 'DMG': 1000,
		'img': imgButton + '15L src=/images/BM/15L.png>',
		'img2': ' ' + img + '15L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L-0', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'25': {'KD': 0, 'MP': -45, 'DMG': 400,
		'img': imgButton + '25 src=/images/BM/25.png>',
		'img2': ' ' + img + '25-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25-0', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'40RR': {'KD': 0, 'MP': -15, 'DMG': 450,
		'img': imgButton + '40RR src=/images/BM/40RR.png>',
		'img2': ' ' + img + '40RR-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'45L': {'KD': 0, 'MP': -28, 'DMG': 600,
		'img': imgButton + '45L src=/images/BM/45L.png>',
		'img2': ' ' + img + '45L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR', '45L-0', '45R', '60L'],
		'special': allSpecials}
	},
	'45R': {'KD': 0, 'MP': -35, 'DMG': 600,
		'img': imgButton + '45R src=/images/BM/45R.png>',
		'img2': ' ' + img + '45R-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR', '45L', '45R-0', '60L'],
		'special': allSpecials}
	},
	'60L': {'KD': 0, 'MP': -25, 'DMG': 550,
		'img': imgButton + '60L src=/images/BM/60L.png>',
		'img2': ' <img src=/images/left2.png><img src=/images/up.png>' + 
		'<img src=/images/down.png><img src=/images/right.png> ' + img + '60L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L-0', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},

	// SPECIAL ACTIVE SKILLS
	'0': {'KD': 0, 'MP': -115, 'DMG': 1500,
		'img': imgButton + '0 src=/images/BM/0.png>',
		'img2': ' ' + img + '0-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'10L': {'KD': 0, 'MP': -85, 'DMG': 900,
		'img': imgButton + '10L src=/images/BM/10L.png>',
		'img2': ' ' + img + '10L-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': ['0', '10L-0', '15R', '20L', '20R-0', '15', '30L', '30R', '40L-0', '40R-0', '35',
				'50RR', '55L', '55R', '65-0']}
	},
	'15R': {'KD': 0, 'MP': -65, 'DMG': 700,
		'img': imgButton + '15R src=/images/BM/15R.png>',
		'img2': ' ' + img + '15R-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': ['0', '10L', '15R-0', '20L', '20R-0', '15', '30L', '30R', '40L-0', '40R-0', '35',
				'50RR', '55L', '55R', '65-0']}
	},
	'20L': {'KD': 0, 'MP': -180, 'DMG': 4000,
		'img': imgButton + '20L src=/images/BM/20L.png>',
		'img2': ' ' + img + '20L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'20R': {'KD': 0, 'MP': -260, 'DMG': 4500,
		'img': imgButton + '20R src=/images/BM/20R.png>',
		'img2': ' ' + img + '20R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'15': {'KD': 0, 'MP': -105, 'DMG': 1600,
		'img': imgButton + '15 src=/images/BM/15.png>',
		'img2': ' ' + img + '15-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'30L': {'KD': 0, 'MP': -170, 'DMG': 2500,
		'img': imgButton + '30L src=/images/BM/30L.png>',
		'img2': ' <img src=/images/left2.png><img src=/images/up.png>' +
		'<img src=/images/right.png> ' + img + '30L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'30R': {'KD': 0, 'MP': -170, 'DMG': 2500,
		'img': imgButton + '30R src=/images/BM/30R.png>',
		'img2': ' ' + img + '30R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'35': {'KD': 0, 'MP': -90, 'DMG': 1300,
		'img': imgButton + '35 src=/images/BM/35.png>',
		'img2': ' ' + img + '35-2.png>',
		'next': {'basic': ['Z0', 'X0', 'right2', 'up', 'right0', 'left0', 'down0', 'left20'],
		'active': ['5L', '5R', '10R-0', '15L-0', '25-0', '40RR', '45L', '45R-0', '60L'],
		'special': ['0', '10L-0', '15R-0', '20L-0', '20R-0', '15-0', '30L-0', '30R', '40L-0',
				'40R-0', '35-0', '50RR-0', '55L-0', '55R-0', '65-0']}
	},
	'40L': {'KD': 0, 'MP': -270, 'DMG': 2500,
		'img': imgButton + '40L src=/images/BM/40L.png>',
		'img2': ' ' + img + '40L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'40R': {'KD': 0, 'MP': -275, 'DMG': 1800,
		'img': imgButton + '40L src=/images/BM/40L.png>',
		'img2': ' ' + img + '40R-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': noSpecials}
	},
	'50RR': {'KD': 0, 'MP': -170, 'DMG': 2500,
		'img': imgButton + '50RR src=/images/BM/50RR.png>',
		'img2': ' ' + img + '50RR-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'55L': {'KD': 0, 'MP': -180, 'DMG': 1300,
		'img': imgButton + '55L src=/images/BM/55L.png>',
		'img2': ' ' + img + '55L-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': allSpecials}
	},
	'55R': {'KD': 0, 'MP': -170, 'DMG': 3700,
		'img': imgButton + '55R src=/images/BM/55R.png>',
		'img2': ' ' + img + '55R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'65': {'KD': 0, 'MP': -300, 'DMG': 6000,
		'img': imgButton + '65 src=/images/BM/65.png>',
		'img2': ' ' + img + '65-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	}
}









