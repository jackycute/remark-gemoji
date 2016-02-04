/**
 * @author jackycute
 * @copyright 2016 jackycute
 * @license MIT
 * @module remark:gemoji
 * @fileoverview
 *   Plug-in to transform emoji syntax into gemoji
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var remark = require('remark');
var remarkGemoji = require('./index.js');

var gemoji = require('gemoji');

var processor = remark().use(remarkGemoji);

var emojiList = [];
Object.keys(gemoji.name).forEach(function (key) {
    emojiList.push(':' + key + ':');
});

var renderedEmojiList = [];
Object.keys(gemoji.name).forEach(function (key) {
    renderedEmojiList.push(gemoji.name[key].emoji);
});

/*
 * Tests.
 */

test('remark-gemoji', function (t) {
    processor.process(':+1:', function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, '👍\n', 'one gemoji');
    });

    processor.process(':+1::-1:', function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, '👍👎\n', 'two gemoji');
    });

    processor.process('a :+1: b :-1: c', function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, 'a 👍 b 👎 c\n', 'two gemoji');
    });

    processor.process('No colons', function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, 'No colons\n', 'no colons');
    });

    processor.process('One: colon', function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, 'One: colon\n', 'one colon');
    });

    processor.process([
        ':none:',
        emojiList,
        ':not_valid:',
        ''
    ].join('\n'), function (err, file, doc) {
        t.ifErr(err);

        t.equal(doc, [
            ':none:',
            renderedEmojiList,
            ':not\\_valid:',
            ''
        ].join('\n'));
    });

    t.end();
});
