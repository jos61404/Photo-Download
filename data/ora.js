// 終端特效
const ora = require('ora');
let spinner = new ora({
    spinner: 'line',
    color: 'white'
});

module.exports = spinner;