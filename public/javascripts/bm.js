combo = {'comboList': [], 'comboImg': '', 'KD': 0, 'DMG': 0, 'MP': 0, 'MP2': 0};

$(document).ready(function() {

	populateNext(bladeMaster['idle']);
	loadCombo();
	
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboDMG').text(combo['DMG'] + '%');
	$('#comboMP2').text(combo['MP2']);

	$('#commandList table tbody').on('click', 'td img.action', addAction);
	$('#commandList table tbody').on('mouseover', 'td img.action', skillInfo);
	$('#BMLarge').on('click', removeAction);
	$('#save').on('click', saveCombo);

});

function addAction(event) {

	event.preventDefault();
	var id = this.id;
	var thisAction = bladeMaster[id];

	// MP restriction
	if (combo['MP'] + thisAction['MP'] <= -300) {
		alert('Insufficient mana');
		return;
	}

	// Approximate cooldown restriction
	if ('CD' in thisAction) {
		var n = combo['comboList'].lastIndexOf(id);
		if (n != -1) {
			if (combo['comboList'].length - n < 2*thisAction['CD']) {
				alert('This skill is still on cooldown');
				return;
			}
		}
	}

	// Update global combo object
	combo['comboList'].push(id);
	combo['KD'] += thisAction['KD'];
	combo['MP'] += thisAction['MP'];
	combo['MP2'] += thisAction['MP2'];
	combo['DMG'] += thisAction['DMG'];
	combo['comboImg'] += thisAction['img2'];
	$('#comboImg').html(combo['comboImg']);

	// Auto scroll right when combo overflows
	var width = parseInt($('#comboImg').width());
	if (width > 525) {
		$('#comboList p').animate({scrollLeft: width});
	}

	// Populate Info Box
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboMP2').text(combo['MP2']);
	$('#comboDMG').text(combo['DMG'] + '%');

	// KD limit restriction
	if (combo['KD'] >= 100) {
		$('#comboKD').css({'color': 'red'});
	}
	if (combo['KD'] - thisAction['KD'] >= 100 && thisAction['DMG'] != 0) {
		populateNext(bladeMaster['ZZZZ']);
		alert('Exceeded KD limit. This action will knock down');
		return;
	}

	populateNext(thisAction);
};

function removeAction(event) {

	event.preventDefault;
	// Cannot remove when combo list is empty
	if (combo['comboImg'] === '') {
		return
	}

	event.preventDefault();
	var lastID = combo['comboList'].pop();
	var lastAction = bladeMaster[lastID]
 
	// Revert text color to black
	if (combo['KD'] >= 100 && combo['KD'] - lastAction.KD < 100) {
		$('#comboKD').css({'color': 'black'});
	}

	// Update global combo object
	combo['KD'] -= lastAction['KD'];
	combo['MP'] -= lastAction['MP'];
	combo['MP2'] -= lastAction['MP2'];
	combo['DMG'] -= lastAction['DMG'];

	// Populate Info Box
	$('#comboKD').text(combo['KD']);
	$('#comboMP').text(combo['MP']);
	$('#comboMP2').text(combo['MP2']);
	$('#comboDMG').text(combo['DMG'] + '%');

	// Remove last action from image list
	var lastImg = lastAction['img2'];
	var comboImg = combo['comboImg'];
	var n = comboImg.lastIndexOf(lastImg);
	combo['comboImg'] = comboImg.substring(0, n);
	$('#comboImg').html(combo['comboImg']);

	// Special behavior when removing only element
	if (combo['comboImg'] != '') {
		var lastIndex = (combo['comboList'].length)-1;
		var thisAction = bladeMaster[combo['comboList'][lastIndex]];
		populateNext(thisAction);
	} else {
		populateNext(bladeMaster['idle']);
	}
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

function skillInfo(event) {

	event.preventDefault();
	var id = this.id;
	var thisAction = bladeMaster[id];
	$('#skillName').text(id);
	$('#skillDMG').text(thisAction['DMG'] + '%');
	$('#skillMP').text(thisAction['MP']);

}

function createCookie(name,value,days) {

	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/BM";
};

function saveCombo(event) {

	event.preventDefault;
	
	// Erase cookies if clicked Save with empty combo
	if (combo['comboImg'] === '') {
		createCookie('combo', "", -1);
		createCookie('comboImg', "", -1);
		createCookie('KD', "", -1);
		createCookie('DMG', "", -1);
		createCookie('MP', "", -1);
		createCookie('MP2', "", -1);

	// Create cookies using global combo object
	} else {
		createCookie('combo', combo['comboList'], 30);
		createCookie('comboImg', combo['comboImg'], 30);
		createCookie('KD', combo['KD'], 30);
		createCookie('DMG', combo['DMG'], 30);
		createCookie('MP', combo['MP'], 30);
		createCookie('MP2', combo['MP2'], 30);
	}
	alert('Saved!');
};

function loadCombo() {

	if (!document.cookie) {
		return;
	}

	cookies = document.cookie.split('; ');
	while (cookies.length) {
		var cookie = cookies.pop();
		if (cookie.substring(0, 6) === 'combo=') {
			var comboList = cookie.substring(6).split(',');
			combo['comboList'] = comboList;
			populateNext(bladeMaster[combo['comboList'][combo['comboList'].length-1]]);
		} else if (cookie.substring(0, 9) === 'comboImg=') {
			var comboImg = cookie.substring(9);
			combo['comboImg'] = comboImg;
			$('#comboImg').html(combo['comboImg']);
		} else if (cookie.substring(0, 3) === 'KD=') {
			var kd = cookie.substring(3);
			combo['KD'] = kd - 0;
		} else if (cookie.substring(0, 4) === 'DMG=') {
			var dmg = cookie.substring(4);
			combo['DMG'] = dmg - 0;
		} else if (cookie.substring(0, 3) === 'MP=') {
			var mp = cookie.substring(3);
			combo['MP'] = mp - 0;
		} else if (cookie.substring(0, 4) === 'MP2=') {
			var mp2 = cookie.substring(4);
			combo['MP2'] = mp2 - 0;
		}
	}
	if (combo['KD'] >= 100) {
		$('#comboKD').css({'color': 'red'});
		populateNext(bladeMaster['ZZZZ']);
	}
};


// ===== STATIC OBJECTS BELOW ===============================================

imgButton = '<img type=imgButton class=action id=';
img = '<img src=/images/BM/';
allBasic = ['Z', 'X', 'right2', 'up', 'right', 'left0', 'down0', 'left20'];
noBasic = ['Z0', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'];
allActives = ['5L', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'];
allActives2 = ['5L', '5R', '10R', '15L', '25', '40RR', '45L', '45R', '60L-0'];
allActives3 = ['5L', '5R', '10R', '15L', '25', '40RR', '45L', '45R', '60L'];
noActives = ['5L-0', '5R-0', '10R-0', '15L-0', '25-0', '40RR-0', '45L-0', '45R-0', '60L-0'];
allSpecials = ['0', '10L', '15R', '20L', '20R', '15', '30L', '30R', '40L', '40R', '35',
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
	'idle': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'next': {'basic': allBasic, 'active': allActives3,
		'special': allSpecials}
	},
	'up': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'up src=/images/up.png>',
		'img2': ' <img src=/images/up.png>',
		'next': {'basic': ['JZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'up2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'up2 src=/images/up.png>',
		'img2': ' <img src=/images/up.png>',
		'next': {'basic': ['JZ', 'JX', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'down': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'down src=/images/down.png>',
		'img2': ' <img src=/images/down.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},
	'left': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'left src=/images/left.png>',
		'img2': ' <img src=/images/left.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'right': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'right src=/images/right.png>',
		'img2': ' <img src=/images/right.png>',
		'next': {'basic': ['Z', 'X', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'left2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'left2 src=/images/left2.png>',
		'img2': ' <img src=/images/left2.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'right2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'right2 src=/images/right2.png>',
		'img2': ' <img src=/images/right2.png>',
		'next': {'basic': ['DZ', 'DX', 'right20', 'DJ', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'DJ': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'DJ src=/images/up.png>',
		'img2': '<img src=/images/up.png>',
		'next': {'basic': ['DJZ', 'DJX', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'Z': {'KD': 7, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'Z src=/images/Z.png>',
		'img2': ' <img src=/images/Z.png>',
		'next': {'basic': ['ZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZ': {'KD': 7, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'ZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZ', 'ZZX', 'ZZright2', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'ZZright2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'ZZright2 src=/images/right2.png>',
		'img2': '<img src=/images/X0.png> <img src=/images/right2.png>',
		'next': {'basic': ['DZ', 'DX', 'right20', 'DJ', 'right0', 'left', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZZ': {'KD': 15, 'MP': 7, 'DMG': 150, 'MP2': 6,
		'img': imgButton + 'ZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZZ', 'ZZZX', 'right2', 'ZZZUZ', 'right0', 'left0', 'down0', 'left2'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZZZ': {'KD': -30, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'ZZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},
	'ZZZUZ': {'KD': 15, 'MP': 7, 'DMG': 150, 'MP2': 6,
		'img': imgButton + 'ZZZUZ src=/images/up.png>',
		'img2': '<img src=/images/up.png>' + '<img src=/images/Z.png>',
		'next': {'basic': ['Z0', 'JX2', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'ZZZX': {'KD': 0, 'MP': 2, 'DMG': 20, 'MP2': 12,
		'img': imgButton + 'ZZZX src=/images/X.png>',
		'img2': '<img src=/images/X.png>',
		'next': {'basic': ['ZZZXZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZZXZleft': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'ZZZXZleft src=/images/left.png>',
		'img2': ' <img src=/images/left.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up2', 'right', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'ZZZXZ': {'KD': 0, 'MP': 9, 'DMG': 220, 'MP2': 18,
		'img': imgButton + 'ZZZXZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZXZZ', 'X0', 'right20', 'up0', 'right0', 'ZZZXZleft', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZZXZZ': {'KD': 0, 'MP': 9, 'DMG': 220, 'MP2': 18,
		'img': imgButton + 'ZZZXZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZXZZZ', 'X0', 'right20', 'up0', 'right0', 'ZZZXZleft', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZZXZZZ': {'KD': 0, 'MP': 9, 'DMG': 220, 'MP2': 18,
		'img': imgButton + 'ZZZXZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['ZZZXZZZZ', 'X0', 'right20', 'up0', 'right0', 'ZZZXZleft', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZZXZZZZ': {'KD': 0, 'MP': 9, 'DMG': 220, 'MP2': 18,
		'img': imgButton + 'ZZZXZZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'right0', 'ZZZXZleft', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZX': {'KD': 10, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'ZZX src=/images/X.png>',
		'img2': '<img src=/images/X.png>',
		'next': {'basic': ['Z0', 'ZZXX', 'right2', 'up0', 'right0', 'left0', 'down0', 'left2'],
		'active': allActives2, 'special': allSpecials}
	},
	'ZZXX': {'KD': 15, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'ZZXX src=/images/X.png>',
		'img2': '<img src=/images/X.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up2', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'X': {'KD': 15, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'X src=/images/X.png>',
		'img2': ' <img src=/images/X.png>',
		'next': {'basic': ['XZ', 'XX', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'XZ': {'KD': 7, 'MP': 7, 'DMG': 120, 'MP2': 6,
		'img': imgButton + 'XZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['XZZ', 'X0', 'XZright2', 'up0', 'right0', 'left0', 'down0', 'XZleft2'],
		'active': noActives, 'special': noSpecials}
	},
	'XZright2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'XZright2 src=/images/right2.png>',
		'img2': '<img src=/images/Z0.png> <img src=/images/right2.png>',
		'next': {'basic': ['DZ', 'DX', 'right20', 'DJ', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'XZleft2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'XZleft2 src=/images/left2.png>',
		'img2': '<img src=/images/Z0.png> <img src=/images/left2.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'XZZ': {'KD': 0, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'XZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['XZZZ', 'X0', 'right2', 'up0', 'right', 'left0', 'down0', 'XZZleft2'],
		'active': allActives2, 'special': allSpecials}
	},
	'XZZleft2': {'KD': 0, 'MP': 0, 'DMG': 0, 'MP2': 0,
		'img': imgButton + 'XZZleft2 src=/images/left2.png>',
		'img2': ' <img src=/images/left2.png>',
		'next': {'basic': ['Z0', 'X0', 'right20', 'up2', 'right', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'XZZZ': {'KD': 0, 'MP': 7, 'DMG': 280, 'MP2': 6,
		'img': imgButton + 'XZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['Z0', 'JX2', 'right2', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'XX': {'KD': 15, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'XX src=/images/X.png>',
		'img2': '<img src=/images/X.png>',
		'next': {'basic': ['XXZ', 'XXX', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'XXZ': {'KD': 0, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'XXZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['XXZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'XXZZ': {'KD': 0, 'MP': 15, 'DMG': 900, 'MP2': 46,
		'img': imgButton + 'XXZZ src=/images/Z.png>',
		'img2': '~<img src=/images/Z.png>',
		'next': {'basic': noBasic, 'active': allActives2, 'special': allSpecials}
	},
	'XXX': {'KD': -30, 'MP': 7, 'DMG': 400, 'MP2': 6,
		'img': imgButton + 'XXX src=/images/X.png>',
		'img2': '<img src=/images/X.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},
	'DZ': {'KD': 7, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'DZ src=/images/Z.png>',
		'img2': ' <img src=/images/Z.png>',
		'next': {'basic': ['DZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'DZZ': {'KD': 0, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'DZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['DZZZ', 'X0', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': noActives, 'special': noSpecials}
	},
	'DZZZ': {'KD': 7, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'DZZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': ['Z0', 'X0', 'right2', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': allActives2, 'special': allSpecials}
	},
	'DX': {'KD': 25, 'MP': 14, 'DMG': 200, 'MP2': 12,
		'img': imgButton + 'DX src=/images/X.png>',
		'img2': ' <img src=/images/X.png>',
		'next': {'basic': allBasic, 'active': allActives2, 'special': allSpecials}
	},
	'JZ': {'KD': 15, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'JZ src=/images/Z.png>',
		'img2': '<img src=/images/left2.png><img src=/images/right.png> <img src=/images/Z.png>',
		'next': {'basic': allBasic, 'active': allActives, 'special': allSpecials}
	},
	'JX': {'KD': -20, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'JX src=/images/X.png>',
		'img2': '<img src=/images/right.png><img src=/images/down.png> <img src=/images/X.png>',
		'next': {'basic': ['Z', 'X', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'JX2': {'KD': -20, 'MP': 7, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'JX2 src=/images/X.png>',
		'img2': ' <img src=/images/down.png> <img src=/images/X.png>',
		'next': {'basic': ['Z', 'X', 'right20', 'up0', 'right0', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'DJZ': {'KD': 20, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'DJZ src=/images/Z.png>',
		'img2': ' <img src=/images/Z.png>',
		'next': {'basic': ['DJZZ', 'X0', 'right2', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': allActives, 'special': allSpecials}
	},
	'DJZZ': {'KD': -25, 'MP': 7, 'DMG': 100, 'MP2': 6,
		'img': imgButton + 'DJZZ src=/images/Z.png>',
		'img2': '<img src=/images/Z.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},
	'DJX': {'KD': -20, 'MP': 4, 'DMG': 200, 'MP2': 6,
		'img': imgButton + 'DJX src=/images/X.png>',
		'img2': ' <img src=/images/X.png>',
		'next': {'basic': noBasic, 'active': noActives, 'special': noSpecials}
	},

	// ACTIVE SKILLS
	'5L': {'KD': 0, 'MP': -20, 'DMG': 369, 'MP2': 6, 'CD': 4,
		'img': imgButton + '5L src=/images/BM/5L.png>',
		'img2': ' ' + img + '5L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L-0', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'5R': {'KD': 0, 'MP': -7, 'DMG': 402, 'MP2': 6, 'CD': 8,
		'img': imgButton + '5R src=/images/BM/5R.png>',
		'img2': ' ' + img + '5R-2.png>',
		'next': {'basic': ['Z', 'X', 'right2', 'up0', 'right', 'left0', 'down0', 'left20'],
		'active': ['5L', '5R-0', '10R', '15L', '25-0', '40RR', '45L', '45R', '60L'],
		'special': allSpecials}
	},
	'10R': {'KD': 0, 'MP': -20, 'DMG': 369, 'MP2': 6, 'CD': 4,
		'img': imgButton + '10R src=/images/BM/10R.png>',
		'img2': ' ' + img + '10R-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R-0', '15L', '25', '40RR', '45L', '45R', '60L'],
		'special': allSpecials}
	},
	'15L': {'KD': 0, 'MP': -40, 'DMG': 1000, 'MP2': 42, 'CD': 6,
		'img': imgButton + '15L src=/images/BM/15L.png>',
		'img2': ' ' + img + '15L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L-0', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'25': {'KD': 0, 'MP': -45, 'DMG': 400, 'MP2': 6, 'CD': 6,
		'img': imgButton + '25 src=/images/BM/25.png>',
		'img2': ' ' + img + '25-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25-0', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'40RR': {'KD': 0, 'MP': -15, 'DMG': 459, 'MP2': 6, 'CD': 5,
		'img': imgButton + '40RR src=/images/BM/40RR.png>',
		'img2': ' ' + img + '40RR-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},
	'45L': {'KD': 0, 'MP': -28, 'DMG': 475, 'MP2': 36, 'CD': 6,
		'img': imgButton + '45L src=/images/BM/45L.png>',
		'img2': ' ' + img + '45L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR', '45L-0', '45R', '60L'],
		'special': allSpecials}
	},
	'45R': {'KD': 0, 'MP': -35, 'DMG': 413, 'MP2': 52, 'CD': 6,
		'img': imgButton + '45R src=/images/BM/45R.png>',
		'img2': ' ' + img + '45R-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L', '25', '40RR', '45L', '45R-0', '60L'],
		'special': allSpecials}
	},
	'60L': {'KD': 0, 'MP': -25, 'DMG': 527, 'MP2': 6, 'CD': 5,
		'img': imgButton + '60L src=/images/BM/60L.png>',
		'img2': ' ' + img + '60L-2.png>',
		'next': {'basic': allBasic,
		'active': ['5L', '5R', '10R', '15L-0', '25', '40RR-0', '45L', '45R', '60L-0'],
		'special': allSpecials}
	},

	// SPECIAL ACTIVE SKILLS
	'0': {'KD': 0, 'MP': -120, 'DMG': 1444, 'MP2': 30, 'CD': 8,
		'img': imgButton + '0 src=/images/BM/0.png>',
		'img2': ' ' + img + '0-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'10L': {'KD': 0, 'MP': -85, 'DMG': 994, 'MP2': 12, 'CD': 7,
		'img': imgButton + '10L src=/images/BM/10L.png>',
		'img2': ' ' + img + '10L-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': ['0', '10L-0', '15R', '20L', '20R', '15', '30L', '30R', '40L', '40R', '35',
				'50RR', '55L', '55R', '65']}
	},
	'15R': {'KD': 0, 'MP': -65, 'DMG': 677, 'MP2': 24, 'CD': 5,
		'img': imgButton + '15R src=/images/BM/15R.png>',
		'img2': ' ' + img + '15R-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': ['0', '10L', '15R-0', '20L', '20R', '15', '30L', '30R', '40L', '40R', '35',
				'50RR', '55L', '55R', '65']}
	},
	'20L': {'KD': 0, 'MP': -180, 'DMG': 4166, 'MP2': 66,
		'img': imgButton + '20L src=/images/BM/20L.png>',
		'img2': ' ' + img + '20L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'20R': {'KD': 0, 'MP': -260, 'DMG': 3307, 'MP2': 60,
		'img': imgButton + '20R src=/images/BM/20R.png>',
		'img2': ' ' + img + '20R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'15': {'KD': 0, 'MP': -102, 'DMG': 1600, 'MP2': 18,
		'img': imgButton + '15 src=/images/BM/15.png>',
		'img2': ' ' + img + '15-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'30L': {'KD': 0, 'MP': -170, 'DMG': 2412, 'MP2': 72,
		'img': imgButton + '30L src=/images/BM/30L.png>',
		'img2': ' <img src=/images/left2.png><img src=/images/up.png>' +
		'<img src=/images/right.png> ' + img + '30L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'30R': {'KD': 0, 'MP': -170, 'DMG': 2010, 'MP2': 60, 'CD': 10,
		'img': imgButton + '30R src=/images/BM/30R.png>',
		'img2': ' ' + img + '30R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'35': {'KD': 0, 'MP': -90, 'DMG': 1218, 'MP2': 18, 'CD': 10,
		'img': imgButton + '35 src=/images/BM/35.png>',
		'img2': ' ' + img + '35-2.png>',
		'next': {'basic': ['Z0', 'X0', 'right2', 'up', 'right0', 'left0', 'down0', 'left20'],
		'active': ['5L', '5R', '10R-0', '15L-0', '25-0', '40RR', '45L', '45R-0', '60L'],
		'special': ['0', '10L-0', '15R-0', '20L-0', '20R-0', '15-0', '30L-0', '30R', '40L-0',
				'40R-0', '35-0', '50RR-0', '55L-0', '55R-0', '65-0']}
	},
	'40L': {'KD': 0, 'MP': -270, 'DMG': 2330, 'MP2': 6, 'CD': 23,
		'img': imgButton + '40L src=/images/BM/40L.png>',
		'img2': ' ' + img + '40L-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'40R': {'KD': 0, 'MP': -275, 'DMG': 1852, 'MP2': 6, 'CD': 32, 
		'img': imgButton + '40L src=/images/BM/40L.png>',
		'img2': ' ' + img + '40R-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': noSpecials}
	},
	'50RR': {'KD': 0, 'MP': -170, 'DMG': 2714, 'MP2': 84, 'CD': 11,
		'img': imgButton + '50RR src=/images/BM/50RR.png>',
		'img2': ' ' + img + '50RR-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'55L': {'KD': 0, 'MP': -180, 'DMG': 1536, 'MP2': 6, 'CD': 20, 
		'img': imgButton + '55L src=/images/BM/55L.png>',
		'img2': ' ' + img + '55L-2.png>',
		'next': {'basic': allBasic, 'active': allActives,
		'special': ['0', '10L', '15R', '20L', '20R', '15', '30L', '30R', '40L', '40R', '35',
				'50RR', '55L-0', '55R', '65']}
	},
	'55R': {'KD': 0, 'MP': -170, 'DMG': 3420, 'MP2': 48,
		'img': imgButton + '55R src=/images/BM/55R.png>',
		'img2': ' ' + img + '55R-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	},
	'65': {'KD': 0, 'MP': -300, 'DMG': 5283, 'MP2': 120,
		'img': imgButton + '65 src=/images/BM/65.png>',
		'img2': ' ' + img + '65-2.png>',
		'next': {'basic': noBasic, 'active': noActives,
		'special': noSpecials}
	}
}









