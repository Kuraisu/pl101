// this is all you

var convertPitch = function(pitch) {
  var dict = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11
  };

  return 12 + 12 * parseInt(pitch[1]) + dict[pitch[0]];
};

var repeat = function(expr, times) {
  if(times == 0) {
    return [];
  } else {
    return [expr].concat(repeat(expr, times - 1));
  };
};

var flatten = function (expr, time) {
  var res_left, res_right;

  if(expr.tag === 'note') {
    var note = {
      tag: 'note',
      pitch: convertPitch(expr.pitch),
      start: time,
      dur: expr.dur
    };
    return {notes: [note], time: time + expr.dur};
  } else if(expr.tag === 'rest') {
    var rest = {
      tag: 'rest',
      start: time,
      dur: expr.dur
    }
    return {notes: [rest], time: time + expr.dur};
  } else if(expr.tag === 'par') {
    res_left = flatten(expr.left, time);
    res_right = flatten(expr.right, time);
    return {
      notes: res_left.notes.concat(res_right.notes),
      time: Math.max(res_left.time, res_right.time)
    };
  } else if(expr.tag === 'seq') {
    res_left = flatten(expr.left, time);
    res_right = flatten(expr.right, res_left.time);
    return {
      notes: res_left.notes.concat(res_right.notes),
      time: res_right.time
    };
  } else if(expr.tag === 'repeat') {
    return {notes: [repeat(expr.section)], time: time + expr.section[0].dur}
  };
};

var compile = function (musexpr) {
  return flatten(musexpr, 0).notes;
};

var melody_mus = {
  tag: 'seq',
  left: {
    tag: 'seq',
    left: { tag: 'note', pitch: 'a4', dur: 250 },
    right: { tag: 'note', pitch: 'b4', dur: 250 }
  },
  right:{
    tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 }
  }
};

console.log(melody_mus);
console.log(compile(melody_mus));
