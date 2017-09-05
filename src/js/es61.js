(() => {

	//es6 测试脚本
	const test = () => console.log("hello world!!!");

	test();
	let x = 1;
	let y = 2;

	[x, y] = [y, x];

	`hello ${x} this is a test!`

	var regexp = new RegExp('xyz', 'i');
	
	function log(x, y) {
		y = y || 'world';
		console.log(y);
	}

	var o = {
		method() {
			return "hello world!";
		}
	}

	var s = new Set();
	var a = [2, 4, 5, 9];
	console.log(...a);
	console.log(4, 6, 7, 8, 9);

})();