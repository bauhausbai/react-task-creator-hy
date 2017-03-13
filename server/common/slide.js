var divs = document.querySelectorAll(".page"),
	width = document.body.clientWidth,
	height = document.body.clientHeight,
	sy,
	ny,
	current = 0;


divs[0].style.display = "block";
for(var i=0; i < divs.length; i++) {
	console.log(i)
	divs[i].style.height = height + 'px';
	slideUp(divs[i]);
	slideDown(divs[i]);
}

function slideUp(dom) {
	//向上滑动翻页
	dom.addEventListener('touchstart', function (e) {
		e.preventDefault(); //必须，否则在手机上touchend不会触发

		var touch = e.targetTouches[0];
	    var y = Number(touch.pageY);
	    sy = y;
	});
	dom.addEventListener('touchmove', function (e) {
		e.preventDefault();
		if (e.targetTouches.length == 1) {
			var touch = e.targetTouches[0];
	        var y = Number(touch.pageY);
	        ny = y;
		}
	});
	dom.addEventListener('touchend', function (e) {
		e.preventDefault();
		if (ny != 0 && sy - ny > 20) {
			divs[current].style.zIndex = 0;
			(function(current) {
				window.setTimeout(function() {
					divs[current].style.display = "none"
					removeClass(divs[current], "slideInDown")
					removeClass(divs[current], "slideInUp")
				},1000)
			})(current);
			
			if (current >= 0 && current < divs.length - 1) {
				current++
			}else{
				current = 0
			}
			console.log(current)
			divs[current].style.display = "block"
			divs[current].style.zIndex = 1
			addClass(divs[current], "slideInUp")
		}
	});
}

function slideDown(dom) {
	dom.addEventListener('touchstart', function (e) {
		e.preventDefault(); //必须，否则在手机上touchend不会触发

		var touch = e.targetTouches[0];
	    var y = Number(touch.pageY);
	    sy = y;
	});
	dom.addEventListener('touchmove', function (e) {
		e.preventDefault();
		if (e.targetTouches.length == 1) {
			var touch = e.targetTouches[0];
	        var y = Number(touch.pageY);
	        ny = y;
		}
	});
	dom.addEventListener('touchend', function (e) {
		e.preventDefault();
		if (ny != 0 && ny - sy > 20) {
			divs[current].style.zIndex = 0;
			(function(current) {
				window.setTimeout(function() {
					divs[current].style.display = "none"
					removeClass(divs[current], "slideInDown")
					removeClass(divs[current], "slideInUp")
				},1000)
			})(current);

			if (current > 0) {
				current--
			}else{
				current = divs.length - 1
			}

			divs[current].style.display = "block"
			divs[current].style.zIndex = 1
			addClass(divs[current], "slideInDown")
		}
	});
}

function addClass(obj, cls){
  var obj_class = obj.className,//获取 class 内容.
  blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
  added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
  obj.className = added;//替换原来的 class.
}
  
function removeClass(obj, cls){
  var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
  obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
  removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
  removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
  obj.className = removed;//替换原来的 class.
}






